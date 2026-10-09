import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { TESTIDS } from '../src/lib/testids';

/**
 * Smoke E2E — flux complet sur la base de staging (variante « login-based ») :
 *   parent confirmé provisionné via l'API admin → login (UI)
 *   → création du profil enfant (UI)
 *   → aventure « internet-discover » (6 leçons + quiz 3 questions)
 *   → complétion serveur → overlay récompenses → XP propagé au dashboard.
 *
 * Sélecteurs : testids STABLES (src/lib/testids.ts) + rôles ARIA uniquement.
 * Plus AUCUN sélecteur CSS structurel (div.space-y-2, div.fixed.inset-0…) :
 * le markup peut évoluer sans casser la spec, tant que les testids et les
 * libellés métier (« Tableau de bord parental », « Tout est prêt ! »…) sont
 * préservés.
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
  await page.getByTestId(TESTIDS.auth.loginEmail).fill(SMOKE_EMAIL);
  await page.getByTestId(TESTIDS.auth.loginPassword).fill(SMOKE_PASSWORD);
  await page.getByTestId(TESTIDS.auth.loginSubmit).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('Tableau de bord parental')).toBeVisible();

  // ----- 2. Création du profil enfant (dashboard → /auth/signup, étape enfant) -----
  // Deux boutons portent le testid quand la liste est vide (header + état vide).
  await page.getByTestId(TESTIDS.child.add).first().click();
  await expect(page.getByText('Ajoute ton premier enfant')).toBeVisible();
  await page.getByTestId(TESTIDS.auth.childName).fill(childName);
  await page.getByTestId(TESTIDS.auth.childAge).fill('12');
  await page.getByTestId(TESTIDS.auth.childGrade).selectOption('6e');
  await page.getByTestId(TESTIDS.auth.childSubmit).click();
  await expect(page.getByText('Tout est prêt !')).toBeVisible();
  await page.getByRole('button', { name: /Aller au dashboard/ }).click();

  // ----- 3. Dashboard : l'enfant apparaît -----
  await expect(page.getByTestId(TESTIDS.dashboard.greeting)).toContainText(`Bonjour ${childName}`);

  // ----- 4. Aventure internet-discover : traverser les leçons -----
  await page.goto(`/adventure/${ADVENTURE_SLUG}`);
  await expect(page.getByRole('heading', { name: ADVENTURE_TITLE })).toBeVisible();

  // Ouverture cinématique (Phase 5) : l'intro plein écran intercepte les
  // clics tant qu'elle n'est pas fermée — « Passer l'introduction » la démonte.
  await page.getByTestId(TESTIDS.adventure.skipIntro).click();

  // Leçons et quiz sont chargés par un second effet asynchrone : tant qu'il
  // n'est pas terminé, totalSteps vaut 0 (« 0/0 ») et le bouton « Suivant »
  // reste affiché sans jamais se désactiver — cliquer trop vite fait dépasser
  // l'étape quiz (currentStep > quizStepIndex, quiz jamais rendu). Attendre
  // « 1/7 » (6 leçons + 1 quiz pour internet-discover en base).
  await expect(page.getByTestId(TESTIDS.adventure.progress)).toHaveText('1/7');

  // React démonte ces boutons au moment du clic (transition d'étape) : le
  // locator peut ne plus résoudre une fois que le clic a produit son effet.
  // Timeout court + échec toléré ; la boucle revérifie la page à chaque tour,
  // et le quiz est ensuite attendu par une assertion stricte.
  const next = page.getByTestId(TESTIDS.adventure.next);
  const quizHeading = page.getByTestId(TESTIDS.adventure.quiz);
  for (let i = 0; i < 15; i++) {
    if (await quizHeading.isVisible()) break;
    if (!(await next.isVisible())) break;
    await next.click({ timeout: 4_000 }).catch(() => {});
  }
  await expect(quizHeading).toBeVisible();

  // ----- 5. Quiz : répondre à toutes les questions puis valider -----
  const optionGroups = page.getByTestId(TESTIDS.adventure.quizOption);
  await expect(optionGroups).toHaveCount(QUIZ_COUNT);
  for (let i = 0; i < QUIZ_COUNT; i++) {
    await optionGroups.nth(i).getByRole('button').first().click();
  }
  // Clic sur un bouton démonté par la validation (quizDone) — même course que ci-dessus.
  await page
    .getByTestId(TESTIDS.adventure.validate)
    .click({ timeout: 4_000 })
    .catch(() => {});

  // ----- 6. Overlay de récompenses (réponse serveur) -----
  const overlay = page.getByTestId(TESTIDS.adventure.rewardsOverlay);
  await expect(overlay.getByText('🎉')).toBeVisible();
  await expect(overlay.getByText(new RegExp(`\\+${XP_REWARD} XP`))).toBeVisible();
  await expect(overlay.getByText(new RegExp(`Quiz : \\d+/${QUIZ_COUNT}`))).toBeVisible();

  // ----- 7. Retour dashboard : XP et progression propagés -----
  // La navigation démonte l'overlay pendant le clic — même garde-fou.
  await overlay
    .getByTestId(TESTIDS.adventure.overlayDashboard)
    .click({ timeout: 4_000 })
    .catch(() => {});
  await expect(page.getByTestId(TESTIDS.dashboard.greeting)).toContainText(`Bonjour ${childName}`);
  await expect(page.getByTestId(TESTIDS.dashboard.xp)).toContainText(`${XP_REWARD} XP`);
  // MVP : total = 60 aventures (5 mondes prêts × 12) — cyber-hero et
  // innovation-entrepreneurship sont grisés jusqu'à l'import de leur contenu.
  await expect(page.getByTestId(TESTIDS.dashboard.progress)).toHaveText('1/60 aventures');
});
