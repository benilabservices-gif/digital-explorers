#!/usr/bin/env node
// Vérifie l'intégrité du contenu EN BASE Supabase — sans navigateur ni serveur
// (alternative légère au smoke Playwright pour toute la partie contenu).
//
// Une seule requête psql renvoie un JSON agrégé, toutes les vérifications sont
// faites côté Node :
//   - cohérence base ↔ application : chaque monde a ses 12 aventures (slugs,
//     titres, XP, publication conformes au contrat de content-schema.mjs) ;
//   - complétude du contenu : 6 leçons par aventure, sections dans l'ordre
//     exact du contrat, leçons non tronquées, quiz complet (3-5 questions,
//     3-5 options, correct_index dans les limites).
//
// Usage :
//   node scripts/smoke-content.mjs               → rapport des 7 mondes ; les
//     mondes actifs (MVP_READY) doivent être complets, les autres sont
//     simplement signalés (info), échec si un monde actif régresse.
//   node scripts/smoke-content.mjs <monde> [ …]  → ces mondes DOIVENT être
//     complets. Porte de sortie après un import :
//     node scripts/smoke-content.mjs cyber-hero innovation-entrepreneurship
//
// Connexion : SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD
// (+ SUPABASE_DB_PORT / SUPABASE_DB_NAME optionnels) depuis l'environnement ou .env.local.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { WORLDS, LESSON_SEQUENCE } from './content-schema.mjs';

// ---------- Réglages ----------

// Mondes actifs côté application — À MAINTENIR EN SYNC avec READY_WORLDS
// dans src/data/content.ts (source de vérité de l'application).
const MVP_READY = new Set([
  'web-digital',
  'artificial-intelligence',
  'coding',
  'blockchain',
  'digital-creator',
]);

// Seuils de complétude. Observé en base : contenu réel ≥ 632 caractères par
// leçon, stubs ≤ 157 — 300 sépare proprement les deux régimes.
const MIN_LESSON_CHARS = 300;
const QUIZ_MIN = 3;
const QUIZ_MAX = 5;
const OPTIONS_MIN = 3;
const OPTIONS_MAX = 5;
const MAX_ISSUES_SHOWN = 15;

function loadEnvLocal(path = '.env.local') {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !line.trim().startsWith('#')) env[m[1]] = m[2];
  }
  return env;
}

// Une requête, un JSON : tout l'état du contenu en une seule passe.
const SQL = `
select jsonb_build_object(
  'worlds', (
    select coalesce(jsonb_agg(jsonb_build_object('slug', w.slug, 'is_active', w.is_active) order by w.slug), '[]'::jsonb)
    from public.worlds w
  ),
  'adventures', (
    select coalesce(jsonb_agg(to_jsonb(t) order by t.world_slug, t.sort_order), '[]'::jsonb)
    from (
      select
        w.slug as world_slug,
        a.slug as slug,
        a.title as title,
        a.xp_reward as xp_reward,
        a.is_published as is_published,
        a.sort_order as sort_order,
        (select count(*) from public.lessons l where l.adventure_id = a.id) as lessons,
        (select coalesce(min(length(l.content)), 0) from public.lessons l where l.adventure_id = a.id) as min_lesson_chars,
        (select coalesce(jsonb_agg(l.section_type order by l.sort_order), '[]'::jsonb) from public.lessons l where l.adventure_id = a.id) as lesson_sequence,
        (select count(*) from public.quiz_questions q where q.adventure_id = a.id) as questions,
        (select coalesce(min(jsonb_array_length(q.options)), 0) from public.quiz_questions q where q.adventure_id = a.id) as min_options,
        (select coalesce(max(jsonb_array_length(q.options)), 0) from public.quiz_questions q where q.adventure_id = a.id) as max_options,
        (select bool_and(q.correct_index >= 0 and q.correct_index < jsonb_array_length(q.options)) from public.quiz_questions q where q.adventure_id = a.id) as correct_indexes_ok
      from public.adventures a
      join public.worlds w on w.id = a.world_id
    ) t
  )
)::text as result;
`;

// ---------- 1. Arguments ----------

const args = process.argv.slice(2);
const explicit = args.length > 0;

if (explicit) {
  const unknown = args.filter((s) => !WORLDS[s]);
  if (unknown.length > 0) {
    console.error(`✗ Monde inconnu : ${unknown.join(', ')}.`);
    console.error(`  Mondes valides : ${Object.keys(WORLDS).join(', ')}.`);
    process.exit(1);
  }
}

// ---------- 2. Requête ----------

const env = { ...process.env, ...loadEnvLocal() };
const { SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD } = env;

if (!SUPABASE_DB_HOST || !SUPABASE_DB_USER || !SUPABASE_DB_PASSWORD) {
  console.error('Variables SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD manquantes (.env.local ou environnement).');
  process.exit(1);
}

const port = env.SUPABASE_DB_PORT || '5432';
const db = env.SUPABASE_DB_NAME || 'postgres';
const url = `postgresql://${SUPABASE_DB_USER}@${SUPABASE_DB_HOST}:${port}/${db}`;

const res = spawnSync('psql', [url, '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', SQL], {
  encoding: 'utf8',
  env: { ...env, PGPASSWORD: SUPABASE_DB_PASSWORD },
});

if (res.error) {
  console.error(`✗ Impossible d'exécuter psql — ${res.error.message}`);
  process.exit(1);
}
if (res.status !== 0) {
  console.error(`✗ Requête échouée (psql exit ${res.status}) :`);
  console.error((res.stderr || res.stdout || '').trim());
  process.exit(res.status ?? 1);
}

let data;
try {
  data = JSON.parse(res.stdout.trim());
} catch (err) {
  console.error(`✗ Sortie psql illisible — ${err.message}`);
  process.exit(1);
}

const dbWorlds = new Map(data.worlds.map((w) => [w.slug, w]));
const byWorld = new Map();
for (const adv of data.adventures) {
  if (!byWorld.has(adv.world_slug)) byWorld.set(adv.world_slug, []);
  byWorld.get(adv.world_slug).push(adv);
}

// ---------- 3. Vérifications ----------

// Problèmes « structural » : la base diverge de l'application/contrat
// (toujours des erreurs). Problèmes « content » : le contenu n'est pas
// complet (stubs, quiz vide…) — bloquants seulement pour les mondes qui
// doivent être prêts.
function checkWorld(slug) {
  const contract = WORLDS[slug];
  const world = dbWorlds.get(slug);
  if (!world) {
    return {
      ready: false,
      structural: ['monde absent de la table worlds.'],
      content: [],
      stats: null,
    };
  }

  const structural = [];
  const content = [];

  if (world.is_active !== true) {
    structural.push('monde désactivé (is_active = false) — invisible côté application.');
  }

  const adventures = byWorld.get(slug) ?? [];

  if (adventures.length !== contract.adventures.length) {
    structural.push(`${adventures.length} aventures en base — attendu ${contract.adventures.length}.`);
  }

  const dbSlugs = adventures.map((a) => a.slug);
  const expectedSlugs = contract.adventures.map((a) => a.slug);
  if (JSON.stringify(dbSlugs) !== JSON.stringify(expectedSlugs)) {
    const missing = expectedSlugs.filter((s) => !dbSlugs.includes(s));
    const extra = dbSlugs.filter((s) => !expectedSlugs.includes(s));
    const parts = [];
    if (missing.length > 0) parts.push(`manquantes : ${missing.join(', ')}`);
    if (extra.length > 0) parts.push(`inattendues : ${extra.join(', ')}`);
    if (parts.length === 0) parts.push('ordre différent du contrat');
    structural.push(`aventures divergentes du contrat (${parts.join(' ; ')}).`);
  }

  const bySlug = new Map(adventures.map((a) => [a.slug, a]));
  let lessons = 0;
  let questions = 0;
  let minChars = Infinity;

  for (const expected of contract.adventures) {
    const adv = bySlug.get(expected.slug);
    if (!adv) continue; // déjà signalé via la divergence des slugs
    const label = `aventure « ${expected.slug} »`;

    if (adv.is_published !== true) structural.push(`${label} : non publiée (is_published = false).`);
    if (adv.title !== expected.title) structural.push(`${label} : titre « ${adv.title} » ≠ contrat « ${expected.title} ».`);
    if (Number(adv.xp_reward) !== expected.xp) structural.push(`${label} : xp_reward = ${adv.xp_reward} — attendu ${expected.xp}.`);

    const nLessons = Number(adv.lessons) || 0;
    lessons += nLessons;
    if (nLessons !== LESSON_SEQUENCE.length) {
      content.push(`${label} : ${nLessons} leçons — attendu ${LESSON_SEQUENCE.length}.`);
    }

    const chars = Number(adv.min_lesson_chars) || 0;
    if (chars < minChars) minChars = chars;
    if (chars < MIN_LESSON_CHARS) {
      content.push(`${label} : leçon la plus courte = ${chars} caractères — attendu ≥ ${MIN_LESSON_CHARS} (contenu probablement en stub).`);
    }

    if (JSON.stringify(adv.lesson_sequence ?? []) !== JSON.stringify(LESSON_SEQUENCE)) {
      content.push(`${label} : sections ${JSON.stringify(adv.lesson_sequence ?? [])} — attendu ${JSON.stringify(LESSON_SEQUENCE)}.`);
    }

    const nQuestions = Number(adv.questions) || 0;
    questions += nQuestions;
    if (nQuestions < QUIZ_MIN || nQuestions > QUIZ_MAX) {
      content.push(`${label} : ${nQuestions} questions — attendu entre ${QUIZ_MIN} et ${QUIZ_MAX}.`);
    }
    if (nQuestions > 0) {
      const minOptions = Number(adv.min_options) || 0;
      const maxOptions = Number(adv.max_options) || 0;
      if (minOptions < OPTIONS_MIN || maxOptions > OPTIONS_MAX) {
        content.push(`${label} : ${minOptions} à ${maxOptions} options par question — attendu ${OPTIONS_MIN} à ${OPTIONS_MAX}.`);
      }
      if (adv.correct_indexes_ok !== true) {
        content.push(`${label} : au moins une question avec correct_index hors des options.`);
      }
    }
  }

  return {
    ready: structural.length === 0 && content.length === 0,
    structural,
    content,
    stats: {
      adventures: adventures.length,
      lessons,
      questions,
      minChars: Number.isFinite(minChars) ? minChars : 0,
    },
  };
}

function printIssues(issues) {
  for (const issue of issues.slice(0, MAX_ISSUES_SHOWN)) console.log(`    - ${issue}`);
  if (issues.length > MAX_ISSUES_SHOWN) {
    console.log(`    … et ${issues.length - MAX_ISSUES_SHOWN} autre(s) problème(s).`);
  }
}

function statsLine(stats) {
  if (!stats) return 'monde absent de la base';
  return `${stats.adventures} aventures · ${stats.lessons} leçons (min ${stats.minChars} car.) · ${stats.questions} questions`;
}

// ---------- 4. Rapport ----------

console.log(`Contenu Digital Explorers — vérification base (${SUPABASE_DB_HOST})`);
console.log('');

let failed = false;

if (explicit) {
  // Porte post-import : chaque monde demandé doit être complet.
  for (const slug of args) {
    const res2 = checkWorld(slug);
    const name = WORLDS[slug].name;
    if (res2.ready) {
      console.log(`✓ ${slug} (${name}) — PRÊT : ${statsLine(res2.stats)}`);
    } else {
      failed = true;
      console.log(`✗ ${slug} (${name}) — NON PRÊT, ${res2.structural.length + res2.content.length} problème(s) :`);
      printIssues([...res2.structural, ...res2.content]);
    }
  }
} else {
  // Rapport global : les mondes actifs doivent être complets, les autres
  // sont signalés (stubs attendus tant que le contenu n'est pas généré).
  let readyCount = 0;
  let mvpAdventures = 0;
  let mvpLessons = 0;
  let mvpQuestions = 0;

  for (const slug of Object.keys(WORLDS)) {
    const res2 = checkWorld(slug);
    const name = WORLDS[slug].name;
    const expected = MVP_READY.has(slug);

    // Toute divergence base ↔ application est une erreur, même sur un monde
    // dont le contenu n'est pas encore prêt.
    if (res2.structural.length > 0) failed = true;

    if (res2.ready) {
      readyCount++;
      if (expected) {
        mvpAdventures += res2.stats.adventures;
        mvpLessons += res2.stats.lessons;
        mvpQuestions += res2.stats.questions;
        console.log(`✓ ${slug} (${name}) — ${statsLine(res2.stats)}`);
      } else {
        console.log(`⚠ ${slug} (${name}) — complet en base (${res2.stats.questions} questions) mais absent de MVP_READY/READY_WORLDS → l'activer dans src/data/content.ts pour le rendre jouable.`);
      }
    } else if (expected) {
      failed = true;
      console.log(`✗ ${slug} (${name}) — monde ACTIF mais incomplet, ${res2.structural.length + res2.content.length} problème(s) :`);
      printIssues([...res2.structural, ...res2.content]);
    } else {
      console.log(`ℹ ${slug} (${name}) — ${statsLine(res2.stats)} — non prêt (hors MVP, attendu)`);
      if (res2.structural.length > 0) printIssues(res2.structural);
    }
  }

  const orphans = [...dbWorlds.keys()].filter((s) => !WORLDS[s]);
  if (orphans.length > 0) {
    console.log(`ℹ Mondes hors contrat présents en base : ${orphans.join(', ')}.`);
  }

  console.log('');
  console.log(`Résumé : ${readyCount}/${Object.keys(WORLDS).length} mondes complets — MVP : ${mvpAdventures} aventures · ${mvpLessons} leçons · ${mvpQuestions} questions.`);
}

console.log('');
if (failed) {
  console.log('✗ Smoke contenu : ÉCHEC — voir les problèmes ci-dessus.');
  process.exit(1);
}
console.log('✓ Smoke contenu : OK.');
