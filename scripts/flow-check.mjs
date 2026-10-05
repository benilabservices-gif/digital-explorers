#!/usr/bin/env node
// Vérification du flux utilisateur de bout en bout, SANS navigateur.
// Cible la prod par défaut : signup parent → profil (trigger) → enfant →
// aventure → quiz → complétion (XP + badges serveur) → idempotence →
// garde mondes non prêts → pages + /api/content.
//
// Usage :
//   node scripts/flow-check.mjs                       → prod, aventure internet-discover
//   node scripts/flow-check.mjs <slug> [APP_URL]      → aventure/app personnalisées
//   APP_URL=http://localhost:3000 node scripts/flow-check.mjs   → dev local

import { readFileSync } from 'node:fs';
import { createServerClient } from '@supabase/ssr';

const [, , adventureArg, appArg] = process.argv;
const APP_URL = (appArg ?? process.env.APP_URL ?? 'https://digital-explorers-sand.vercel.app').replace(/\/$/, '');
const ADVENTURE_SLUG = adventureArg ?? 'internet-discover';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const envValue = (name) =>
  envText.match(new RegExp(`^${name}=(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '') ?? null;

const SUPABASE_URL = envValue('NEXT_PUBLIC_SUPABASE_URL');
const ANON_KEY = envValue('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const SERVICE_ROLE_KEY = envText.match(/^SUPABASE_SERVICE_ROLE_KEY=/m) ? envValue('SUPABASE_SERVICE_ROLE_KEY') : null;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY introuvables dans .env.local');
  process.exit(1);
}

console.log(`Vérification du flux utilisateur sur ${APP_URL}\n`);

// Client Supabase avec « navigateur » factice : le magasin de cookies local
// reproduit exactement ce que @supabase/ssr écrirait côté navigateur, ce qui
// permet d'envoyer les cookies de session aux routes API déployées.
const cookieStore = new Map();
const browserLikeClient = createServerClient(SUPABASE_URL, ANON_KEY, {
  cookies: {
    getAll: () => [...cookieStore.entries()].map(([name, value]) => ({ name, value })),
    setAll: (list) => {
      for (const { name, value } of list) {
        if (value == null) cookieStore.delete(name);
        else cookieStore.set(name, value);
      }
    },
  },
});
const cookieHeader = () => [...cookieStore.entries()].map(([k, v]) => `${k}=${v}`).join('; ');

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

let testUserEmail = null;
let testUserId = null;

try {
  // 1. Inscription parent (comme la page /auth/signup)
  testUserEmail = `flux-test-${Date.now()}@example.com`;
  const password = crypto.randomUUID();
  const { data: signUpData, error: signUpError } = await browserLikeClient.auth.signUp({
    email: testUserEmail,
    password,
    options: { data: { full_name: 'Test Flux' } },
  });

  if (signUpError) {
    // L'auth publique est limitée (envoi d'emails du SMTP intégré ≈ 2/h, ou
    // confirmation activée). On vérifie le reste du flux avec un utilisateur
    // confirmé créé via l'API admin, puis un login public.
    console.log(`⚠ Inscription publique refusée : « ${signUpError.message} »`);
    console.log('  → Limite d’envoi d’emails du SMTP intégré Supabase ou confirmation d’email activée.');
    console.log('  → À vérifier : Supabase → Authentication → Settings (Site URL, confirmation, SMTP custom).');
    console.log('  → Repli : utilisateur confirmé créé via l’API admin, login public pour la suite du flux.\n');
    if (!SERVICE_ROLE_KEY) {
      console.error('✗ SUPABASE_SERVICE_ROLE_KEY absente : impossible de continuer en mode repli.');
      process.exit(1);
    }
    const { createClient } = await import('@supabase/supabase-js');
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: testUserEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Test Flux' },
    });
    if (createErr || !created.user) {
      console.error(`✗ Création admin impossible — ${createErr?.message ?? 'aucun utilisateur'}`);
      process.exit(1);
    }
    testUserId = created.user.id;
    const { error: loginErr } = await browserLikeClient.auth.signInWithPassword({ email: testUserEmail, password });
    if (loginErr) {
      console.error(`✗ Login public impossible — ${loginErr.message}`);
      process.exit(1);
    }
    check('Login parent (auth public /token, utilisateur confirmé)', true, testUserEmail);
  } else {
    check('Inscription parent (Supabase Auth)', true, testUserEmail);
    if (!signUpData.session) {
      console.error("✗ Pas de session : confirmation d'email ACTIVÉE — le flux s'arrête à l'étape signup (Supabase Auth → Settings).");
      process.exit(2);
    }
    check("Session immédiate (confirmation d'email désactivée)", true);
    testUserId = signUpData.user.id;
  }

  // 2. Profil parent créé par le trigger handle_new_user
  let profile = null;
  for (let i = 0; i < 6 && !profile; i++) {
    await new Promise((r) => setTimeout(r, 500));
    ({ data: profile } = await browserLikeClient.from('profiles').select('id,full_name,role').eq('id', testUserId).maybeSingle());
  }
  check('Profil parent créé (trigger handle_new_user)', !!profile, profile ? String(profile.full_name) : 'introuvable');

  // 3. Création du profil enfant (RLS parent_id = auth.uid())
  const { data: child, error: childError } = await browserLikeClient
    .from('children')
    .insert({ parent_id: testUserId, name: 'TestFlux', age: 14, grade_level: '3e', avatar: '🚀', interests: [], xp: 0, level: 1, phase: 'creator' })
    .select('id,name')
    .single();
  check("Création du profil enfant (RLS parent_id = auth.uid())", !childError && !!child, childError?.message ?? child?.name);
  if (!child) process.exit(1);

  // 4. Aventure publiée + questions du quiz
  const { data: adventure } = await browserLikeClient
    .from('adventures')
    .select('id,slug,title,xp_reward,worlds(slug,name)')
    .eq('slug', ADVENTURE_SLUG)
    .eq('is_published', true)
    .maybeSingle();
  check(`Aventure « ${ADVENTURE_SLUG} » publiée en base`, !!adventure, adventure ? `${adventure.title} · ${adventure.xp_reward} XP · ${adventure.worlds?.name}` : 'introuvable');
  if (!adventure) process.exit(1);

  const { data: questions } = await browserLikeClient
    .from('quiz_questions')
    .select('id,correct_index')
    .eq('adventure_id', adventure.id)
    .order('sort_order');
  const quiz = questions ?? [];
  check('Quiz chargé (quiz_questions, accès authentifié)', quiz.length >= 3, `${quiz.length} questions`);
  if (quiz.length === 0) process.exit(1);

  // 5. Complétion via l'API déployée (cookies de session transmis)
  const completeUrl = `${APP_URL}/api/adventures/complete`;
  async function postComplete(slug = ADVENTURE_SLUG, answers = quiz.map((q) => q.correct_index)) {
    const res = await fetch(completeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader() },
      body: JSON.stringify({ childId: child.id, adventureSlug: slug, answers }),
    });
    return { status: res.status, body: await res.json().catch(() => null) };
  }

  const first = await postComplete();
  check('POST /api/adventures/complete → 200', first.status === 200, `HTTP ${first.status}`);
  check(`XP attribué (+${adventure.xp_reward})`, first.body?.xpAwarded === adventure.xp_reward, JSON.stringify(first.body ?? {}));
  check(`Score quiz serveur ${quiz.length}/${quiz.length}`, first.body?.quizScore === quiz.length);
  if (Array.isArray(first.body?.newBadges) && first.body.newBadges.length > 0) {
    check('Badges automatiques attribués', true, first.body.newBadges.map((b) => `${b.icon} ${b.name}`).join(', '));
  }

  // 6. Idempotence : 2e complétion → aucun XP
  const second = await postComplete();
  check('Idempotence (2e POST → alreadyCompleted, 0 XP)', second.status === 200 && second.body?.alreadyCompleted === true && second.body?.xpAwarded === 0);

  // 7. Garde : aventure d'un monde non prêt (stub cyber-hero)
  const stub = await postComplete('cyber-securite-basics', [0]);
  check('Garde monde non prêt (cyber-securite-basics → refus serveur)', stub.status === 404 || stub.status === 403, `HTTP ${stub.status} · ${stub.body?.error}`);

  // 8. Persistance : XP enfant bien en base
  const { data: childAfter } = await browserLikeClient.from('children').select('xp,level').eq('id', child.id).single();
  check('XP persisté sur l’enfant en base', childAfter?.xp === adventure.xp_reward, `${childAfter?.xp} XP · Nv ${childAfter?.level}`);

  // 9. Pages (squelettes 'use client' + spinner) & API publique
  const pages = ['/', '/worlds', '/worlds/web-digital', `/adventure/${ADVENTURE_SLUG}`, '/auth/signup', '/auth/login', '/auth/onboarding', '/pricing'];
  for (const path of pages) {
    const res = await fetch(APP_URL + path);
    check(`GET ${path} → 200`, res.status === 200, `HTTP ${res.status}`);
  }
  const dash = await fetch(`${APP_URL}/dashboard`, { redirect: 'manual' });
  check('GET /dashboard sans session → 307 vers /auth/login', dash.status === 307, `HTTP ${dash.status} → ${dash.headers.get('location')}`);

  const content = await fetch(`${APP_URL}/api/content`);
  check('GET /api/content → 200 (Supabase joint depuis Vercel)', content.status === 200, `${content.headers.get('content-length') ?? '?'} octets`);
} finally {
  // 10. Nettoyage : suppression de l'utilisateur de test (service role, cascade enfant/complétions)
  if (testUserId && SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
      const { error } = await admin.auth.admin.deleteUser(testUserId);
      check('Nettoyage : utilisateur de test supprimé', !error, error?.message ?? testUserEmail);
    } catch (e) {
      console.log(`ℹ Nettoyage impossible : ${e.message} — compte de test laissé en base : ${testUserEmail}`);
    }
  } else if (testUserEmail) {
    console.log(`ℹ Nettoyage ignoré (SUPABASE_SERVICE_ROLE_KEY absente) — compte de test en base : ${testUserEmail}`);
  }
}

console.log(failures === 0 ? '\nFlux utilisateur : OK de bout en bout ✓' : `\n${failures} vérification(s) en échec ✗`);
process.exit(failures === 0 ? 0 : 1);
