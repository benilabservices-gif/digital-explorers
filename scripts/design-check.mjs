#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Règle tokens-only du design system « Carnet de l'Explorateur ».
//
//   npm run design:check
//
// 1. AUCUNE couleur hexadécimale brute (#rgb, #rrggbb, #rrggbbaa) dans les
//    fichiers src/**/*.{ts,tsx} — les couleurs passent par les tokens @theme
//    (globals.css → classes bg-night-*, text-ink-*, etc.) ou par les données
//    de thème (accents pédagogiques par monde).
// 2. AUCUNE réintroduction des classes CSS purgées (btn-magic, card-glass…).
//
// Mécanisme de cliquet : LEGACY_HEX_ALLOWED liste les fichiers/dossiers pas
// encore migrés vers la nouvelle DA — ils conservent provisoirement leurs hex
// bruts. À CHAQUE phase de migration, on retire des entrées de cette liste ;
// un fichier qui sort de la liste doit être passé aux tokens. Objectif :
// liste vide à la Phase 6 (nettoyage final).
// ─────────────────────────────────────────────────────────────────────────────

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = new URL('../src', import.meta.url).pathname;

// Fichiers/dossiers autorisés à contenir des hex (fichiers de DONNÉES de thème).
const DATA_HEX_ALLOWED = ['src/data/'];

// Pas encore migrés (ratchet — retirez les entrées au fil des phases 2→6).
// Phase 2 : chemins post-route-groups. Granularité FICHIER pour les pages
// déplacées, afin de ne pas exempter les nouveaux fichiers propres
// (layout.tsx, loading.tsx, error.tsx, coquille serveur aventure/page.tsx).
const LEGACY_HEX_ALLOWED = [
  // (marketing) home + pricing : migrées aux tokens en Phase 3.
  // (app) dashboard/worlds/adventure/challenges/portfolio : migrées en Phase 4.
  'src/app/(auth)/auth/', // Phase 5
  'src/app/(parent)/parent/page.tsx', // Phase 5
  'src/app/(parent)/admin/page.tsx', // Phase 5
  'src/components/AICoach.tsx',
  'src/components/Nav.tsx', // plus aucune page ne l'utilise (Phase 2) — suppression Phase 6
  'src/components/ScrollToTop.tsx',
  'src/components/adventure/',
  'src/components/games/',
  'src/components/playgrounds/',
  'src/components/rewards/',
  'src/components/world/',
];

// Classes supprimées de globals.css — toute réintroduction est une erreur
// (elles ne produiraient AUCUN style, silencieusement).
const FORBIDDEN_CLASSES = [
  'btn-magic',
  'btn-warm',
  'btn-outline-warm',
  'card-glass',
  'card-glass-hover',
  'text-gradient-gold',
  'glow-coral',
  'glow-violet',
  'glow-teal',
  'progress-bar',
  'animate-float-r',
  'animate-slide-up',
  'animate-fade-in',
  'animate-shimmer',
  'animate-spin-slow',
  'animate-bob',
  'badge-common',
  'badge-rare',
  'badge-epic',
  'badge-legendary',
];

const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

function isAllowed(relPath, list) {
  return list.some((p) => (p.endsWith('/') ? relPath.startsWith(p) : relPath === p));
}

let failures = 0;
const legacyHits = [];

for (const file of walk(SRC)) {
  const relPath = relative(join(SRC, '..'), file); // « src/app/... »
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  // 1. Hex bruts
  if (isAllowed(relPath, DATA_HEX_ALLOWED)) continue;
  if (isAllowed(relPath, LEGACY_HEX_ALLOWED)) {
    const n = (text.match(HEX_RE) ?? []).length;
    if (n > 0) legacyHits.push(`${relPath} (${n} hex — à migrer)`);
    continue;
  }

  lines.forEach((line, i) => {
    const hexes = line.match(HEX_RE);
    if (hexes) {
      console.error(`✗ hex brut hors tokens — ${relPath}:${i + 1} → ${hexes.join(', ')}`);
      failures++;
    }
    for (const cls of FORBIDDEN_CLASSES) {
      if (line.includes(cls)) {
        console.error(`✗ classe purgée « ${cls} » — ${relPath}:${i + 1}`);
        failures++;
      }
    }
  });
}

console.log('');
if (legacyHits.length > 0) {
  console.log(`ℹ Ratchet : ${legacyHits.length} fichier(s) legacy contiennent encore des hex bruts :`);
  for (const h of legacyHits) console.log(`   • ${h}`);
  console.log('  (autorisés provisoirement — retirez-les de LEGACY_HEX_ALLOWED lors de leur migration)');
} else {
  console.log('ℹ Ratchet : aucun fichier legacy restant. ✓');
}

if (failures > 0) {
  console.error(`\n✗ design:check — ${failures} violation(s). Couleurs → tokens @theme uniquement.`);
  process.exit(1);
}
console.log('\n✓ design:check — règle tokens-only respectée.');
