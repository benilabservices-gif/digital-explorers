import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

/**
 * Smoke E2E — flux complet sur la base de staging (variante « login-based ») :
 *   parent confirmé provisionné via l'API admin → login (UI)
 *   → création du profil enfant (UI)
 *   → aventure « internet-discover » (6 leçons + quiz 3 questions)
 *   → complétion serveur → overlay récompenses → XP propagé au dashboard.
 *
 * Pourquoi pas de signup UI : la confirmation email est activée sur le projet
 * staging et son SMTP intégré est fortement bridé (rate limit « Too many
 * attempts » après seulement quelques inscriptions). Le flux signup→étape
 * « Compte créé ! » est donc vérifié par la sonde manuelle et la logique
 * applicative, mais pas rejoué à chaque smoke.
 *
 * Provisioning du parent de test — API admin (service_role), JAMAIS d'insert
 * direct dans auth.* : une ligne insérée à la main casse GoTrue (500
 * « Database error querying schema » sur son login ET sur listUsers, même
 * avec hash bcrypt cost 10 et identity_data identiques). L'API admin crée
 * users + identities conformes ; le trigger on_auth_user_created crée le
 * profil public.profiles. L'utilisateur est supprimé puis recréé à chaque
 * run : les cascades FK (profiles → children → complétions/badges)
 * garantissent un état vierge et des assertions déterministes.
 *
 * Prérequis : build de prod présent (le webServer lance `next start`) et
 * SUPABASE_SERVICE_ROLE_KEY dans .env.local (gitignored).
 */

const SMOKE_EMAIL = 'smoke.e2e@digitalexplorers.dev';
const SMOKE_PASSWORD = 'Test1234!';
const ADVENTURE_SLUG = 'internet-discover';
const ADVENTURE_TITLE = "L'aventure d'Internet";
const XP_REWARD = 100; // xp_reward en base pour internet-discover
const QUIZ_COUNT = 3; // questions de quiz en base pour internet-discover

function readLocalEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

/** Supprime puis recrée le parent de test, confirmé, via l'API admin. */
async function ensureSmokeParent(): Promise<void> {
  const env = readLocalEnv();
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local');
  }
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listData, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw new Error('listUsers impossible : ' + listError.message);

  const existing = (listData.users ?? []).find((u) => u.email === SMOKE_EMAIL);
  if (existing) {
    const { error: delError } = await admin.auth.admin.deleteUser(existing.id);
    if (delError) throw new Error('deleteUser impossible : ' + delError.message);
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: SMOKE_EMAIL,
    password: SMOKE_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Parent Smoke' },
  });
  if (createError || !created.user) {
    throw new Error('createUser impossible : ' + (createError?.message ?? 'aucun utilisateur retourné'));
  }
}

test.beforeAll(async () => {
  await ensureSmokeParent();
});

test('login → enfant → aventure → complétion', async ({ page }) => {
  const childName = 'Awa';

  // ----- 1. Connexion (UI) -----
  await page.goto('/auth/login');
  await page.getByPlaceholder('ton@email.com').fill(SMOKE_EMAIL);
  await page.getByPlaceholder('••••••••').fill(SMOKE_PASSWORD);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('Tableau de bord parental')).toBeVisible();

  // ----- 2. Création du profil enfant (dashboard → /auth/signup, étape enfant) -----
  await page.getByRole('button', { name: 'Ajouter un enfant' }).first().click();
  await expect(page.getByText('Ajoute ton premier enfant')).toBeVisible();
  await page.getByPlaceholder('Ex: Awa, Koffi...').fill(childName);
  await page.locator('input[type="number"]').fill('12');
  await page.locator('select').selectOption('6e');
  await page.getByRole('button', { name: 'Ajouter', exact: true }).click();
  await expect(page.getByText('Tout est prêt !')).toBeVisible();
  await page.getByRole('button', { name: /Aller au dashboard/ }).click();

  // ----- 3. Dashboard : l'enfant apparaît -----
  await expect(page.getByText(`Bonjour ${childName} !`)).toBeVisible();

  // ----- 4. Aventure internet-discover : traverser les leçons -----
  await page.goto(`/adventure/${ADVENTURE_SLUG}`);
  await expect(page.getByRole('heading', { name: ADVENTURE_TITLE })).toBeVisible();

  // Leçons et quiz sont chargés par un second effet asynchrone : tant qu'il
  // n'est pas terminé, totalSteps vaut 0 (« 0/0 ») et le bouton « Suivant »
  // reste affiché sans jamais se désactiver — cliquer trop vite fait dépasser
  // l'étape quiz (currentStep > quizStepIndex, quiz jamais rendu). Attendre
  // « 1/7 » (6 leçons + 1 quiz pour internet-discover en base).
  await expect(page.getByText('1/7')).toBeVisible();

  // React démonte ces boutons au moment du clic (transition d'étape) : le
  // locator peut ne plus résoudre une fois que le clic a produit son effet.
  // Timeout court + échec toléré ; la boucle revérifie la page à chaque tour,
  // et le quiz est ensuite attendu par une assertion stricte.
  const next = page.getByRole('button', { name: /^(Suivant|Aller au quiz)$/ }).first();
  const quizLabel = page.getByText('Quiz', { exact: true });
  for (let i = 0; i < 15; i++) {
    if (await quizLabel.isVisible()) break;
    if (!(await next.isVisible())) break;
    await next.click({ timeout: 4_000 }).catch(() => {});
  }
  await expect(quizLabel).toBeVisible();

  // ----- 5. Quiz : répondre à toutes les questions puis valider -----
  const optionGroups = page.locator('div.space-y-2');
  await expect(optionGroups).toHaveCount(QUIZ_COUNT);
  for (let i = 0; i < QUIZ_COUNT; i++) {
    await optionGroups.nth(i).locator('button').first().click();
  }
  // Clic sur un bouton démonté par la validation (quizDone) — même course que ci-dessus.
  await page
    .getByRole('button', { name: 'Valider mes réponses' })
    .click({ timeout: 4_000 })
    .catch(() => {});

  // ----- 6. Overlay de récompenses (réponse serveur) -----
  // Scoper à l'overlay : le header de l'aventure affiche aussi « +100 XP » et
  // la barre Nav contient aussi un bouton « Dashboard » (sinon strict mode).
  const overlay = page.locator('div.fixed.inset-0');
  await expect(overlay.getByText('🎉')).toBeVisible();
  await expect(overlay.getByText(new RegExp(`\\+${XP_REWARD} XP`))).toBeVisible();
  await expect(overlay.getByText(new RegExp(`Quiz : \\d+/${QUIZ_COUNT}`))).toBeVisible();

  // ----- 7. Retour dashboard : XP et progression propagés -----
  // La navigation démonte l'overlay pendant le clic — même garde-fou.
  await overlay
    .getByRole('button', { name: 'Dashboard', exact: true })
    .click({ timeout: 4_000 })
    .catch(() => {});
  await expect(page.getByText(`Bonjour ${childName} !`)).toBeVisible();
  await expect(page.getByText(`${XP_REWARD} XP`).first()).toBeVisible();
  // MVP : total = 60 aventures (5 mondes prêts × 12) — cyber-hero et
  // innovation-entrepreneurship sont grisés jusqu'à l'import de leur contenu.
  await expect(page.getByText('1/60 aventures')).toBeVisible();
});
