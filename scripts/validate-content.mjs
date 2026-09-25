#!/usr/bin/env node
// Valide un ou plusieurs fichiers de contenu Digital Explorers.
// Usage : node scripts/validate-content.mjs content/web-digital.json [content/autre.json …]
// Sortie : ✓ par fichier valide, liste d'erreurs sinon. Code 1 si un fichier échoue.

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { WORLDS, validateContent } from './content-schema.mjs';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage : node scripts/validate-content.mjs <fichier.json> [<fichier.json> …]');
  console.error('Fichiers attendus (un par monde) :');
  for (const slug of Object.keys(WORLDS)) {
    console.error(`  content/${slug}.json — ${WORLDS[slug].name} (${WORLDS[slug].adventures.length} aventures)`);
  }
  process.exit(1);
}

let failed = false;

for (const file of args) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`✗ ${file} : JSON illisible — ${err.message}`);
    failed = true;
    continue;
  }

  const stem = basename(file).replace(/\.json$/, '');
  const result = validateContent(data, stem);

  if (result.ok) {
    const s = result.stats;
    console.log(`✓ ${file} — ${s.worldName} : ${s.adventures} aventures, ${s.lessons} leçons, ${s.questions} questions, ${s.chars} caractères de contenu`);
  } else {
    console.error(`✗ ${file} — ${result.errors.length} erreur(s) :`);
    for (const e of result.errors) console.error(`  - ${e}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
