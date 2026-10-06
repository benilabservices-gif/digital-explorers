# Digital Explorers 🌍

Plateforme éducative gamifiée qui fait découvrir le numérique aux jeunes d'Afrique francophone : 7 univers thématiques, des aventures racontées scène par scène, des mini-jeux et playgrounds, des quiz notés **côté serveur**, des XP / badges / niveaux, et un Coach IA.

- **5 mondes prêts** sur 7 (60 aventures importées en base) : Web & Digital, IA, Coding, Blockchain, Digital Creator
- Cyber Hero en cours d'import, Innovation & Entrepreneuriat à venir — les mondes non prêts restent visibles mais verrouillés (« Bientôt disponible »)
- Contenu pédagogique stocké dans Supabase (leçons, histoire, quiz) ; aucune donnée de progression côté client

## Stack

- **Next.js 16** (App Router, React 19, build Turbopack) + **Tailwind CSS 4**
- **Supabase** : Postgres, Auth, RLS (`parent_id = auth.uid()`), types générés (`npm run db:types`)
- **Coach IA** : NVIDIA NIM (GLM-5.3), route `/api/chat`
- Animations : CSS/Tailwind + canvas natif ; `canvas-confetti` est la seule dépendance dédiée

## Démarrage

Prérequis : Node ≥ 20 (24 en dev), un projet Supabase (schéma : `supabase/migrations/`).

```bash
cp .env.example .env.local   # puis renseigner les valeurs Supabase + Coach IA
npm install
npm run db:push              # applique les migrations (CLI Supabase liée)
npm run db:seed              # comptes de démo / données de base
npm run import:content       # importe mondes, aventures, leçons, quiz
npm run validate:content     # vérifie le contenu importé en base
npm run dev
```

Guides de configuration détaillés : `docs/`.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build de production / serveur de prod |
| `npm test` | Vitest (53 tests : `lesson-parser`, `game`, `interactives`) |
| `npm run test:watch` | Vitest en mode watch |
| `npm run lint` | ESLint — **⚠ non lancé par `next build`, à lancer séparément** |
| `npm run db:push` / `db:types` / `db:seed` | Migrations, types TypeScript, seed |
| `npm run import:content` | Import du contenu pédagogique en base |
| `npm run validate:content` / `smoke:content` | Validation du contenu (fichiers / en base) |
| `npm run flow:check` | Flux de bout en bout contre l'app **déployée** (voir Déploiement) |

## Tests & non-régression

Trois niveaux complémentaires :

1. **Unitaires (vitest)** — `npm test`. Parseur de leçons, moteur de jeu (XP/niveaux/badges), invariants du registre d'interactifs. Environnement Node (pas de jsdom).
2. **E2E Playwright** — `e2e/smoke.spec.ts` (`npx playwright test`). Flux complet : login → création d'un enfant → aventure `internet-discover` → leçons → quiz → complétion serveur (+XP, badges) → overlay de récompenses → retour dashboard. Prérequis : `npm run build` fraîche + `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local` (le `webServer` lance `next start` sur :3000).
3. **flow-check** — `node scripts/flow-check.mjs [slug] [APP_URL]`. La même validation **sans navigateur**, contre l'app déployée (défaut : le staging), avec nettoyage du compte de test. **À rejouer après chaque déploiement.**

### Contrats e2e — à ne pas casser

Le smoke repose sur des sélecteurs stricts. Toute modification de la page aventure doit respecter :

- Un seul bouton `/^(Suivant|Aller au quiz)$/` ;
- Le texte exact `Quiz` n'apparaît que dans `QuizStep` ;
- `div.space-y-2` uniquement pour les groupes d'options du quiz (jamais ailleurs sur la page aventure) ;
- `div.fixed.inset-0` unique = `RewardOverlay` — `LevelUpOverlay` et `StoryIntro` utilisent volontairement d'autres classes ;
- Pas de duplication de « +N XP » / « Quiz : x/y » hors de l'overlay de fin ;
- Le smoke clique « Passer l'introduction » pour fermer l'intro cinématique avant les leçons.

## L'expérience de jeu (refonte « design & immersion »)

| Brique | Où |
|---|---|
| **Identité par monde** | `src/data/world-themes.ts` (palette, guide personnage), `src/components/world/` : `WorldThemeProvider` (variables CSS `--world-*`), `WorldBackdrop` (canvas animé par monde, respecte `prefers-reduced-motion`) |
| **Lecteur immersif** | `src/lib/lesson-parser.ts` (+ tests) découpe le texte en blocs typés ; `src/components/adventure/` : `LessonScene`, `DialogueBubble`, `KeyPointCard`, `MissionCard`, `StoryOpening`, `StoryIntro` (ouverture cinématique, bouton « Passer ») |
| **Interactifs** | Registre `src/data/interactives.ts` (clé `slug:section_type` → config, zéro migration) ; moteurs `src/components/games/` (QuizTap, DragMatch, Reorder, MemoryPairs, FillBlank, HotspotScene) ; playgrounds `src/components/playgrounds/` (CodeSandbox, PromptLab, ChainSim, ColorMixer, PasswordMeter) |
| **Récompenses vivantes** | `src/lib/sfx.ts` (sons Web Audio, mute persistant), `src/lib/celebrate.ts` (confettis + son + vibration) ; `src/components/rewards/` : XpCounter, LevelUpOverlay, BadgeToast, QuestSummary, SfxToggle |
| **Carte d'exploration** | `src/components/world/WorldMap.tsx` (nœuds terminé / courant / à explorer / verrouillé sur un sentier SVG), `/worlds/[slug]` = carte du monde, `/worlds` = constellation avec anneaux de progression par enfant actif |

Ajouter un interactif = une entrée dans le registre (2-3 configs par monde prêt) ; sans entrée, la section reste en lecteur immersif.

## Conventions

- **L'XP est distribué uniquement par le quiz serveur** (`POST /api/adventures/complete`, idempotent) — aucun XP côté client, pas de triche possible.
- Les métadonnées des mondes (noms, gradients, disponibilité) vivent dans `src/data/content.ts` ; le contenu joué vient de Supabase.
- `prefers-reduced-motion` respecté partout (backdrop, confettis, compteurs animés).
- Apostrophes typographiques `’` dans le contenu ; `'` dans les nœuds texte JSX.
- Pas de framework d'animation lourd : CSS/Tailwind + canvas natif.
- Règles contributeurs : voir `AGENTS.md` (lire les guides Next 16 dans `node_modules/next/dist/docs/` avant tout code Next).

## Déploiement

- Projet **Vercel** lié au dépôt (`.vercel/project.json`, CLI authentifiée). Le staging de référence : [digital-explorers-sand.vercel.app](https://digital-explorers-sand.vercel.app).
- **Pas d'intégration Git** : le déploiement se lance depuis le poste local :

```bash
vercel deploy --prod
```

- **Après chaque déploiement** : `npm run flow:check` (cible le staging par défaut ; `APP_URL=https://… npm run flow:check` pour un autre environnement).
- L'inscription publique est sensible au rate-limit du SMTP intégré Supabase (confirmation d'email activée) — `flow-check` bascule automatiquement en repli via l'API admin. Pour une app publique, configurer un SMTP custom (Resend, SendGrid…) ou désactiver la confirmation (Supabase → Authentication → Settings).
