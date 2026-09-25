#!/usr/bin/env node
// Importe un ou plusieurs fichiers de contenu (content/<monde>.json) dans la
// base Supabase via psql. Idempotent : relançable tel quel.
//   - description + story des aventures : mises à jour par slug
//   - leçons et quiz : remplacées (delete + insert) — les slugs de la base
//     font foi, le validateur garantit la cohérence avant l'import
//   - transaction par fichier + vérification post-import (72 leçons / 36 questions min.)
//
// Usage : node scripts/import-content.mjs [--dry-run] content/web-digital.json [content/autre.json …]
// Connexion : SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD
// (+ SUPABASE_DB_PORT / SUPABASE_DB_NAME optionnels) depuis l'environnement ou .env.local.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { validateContent, LESSON_SEQUENCE } from './content-schema.mjs';

function loadEnvLocal(path = '.env.local') {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !line.trim().startsWith('#')) env[m[1]] = m[2];
  }
  return env;
}

const rawArgs = process.argv.slice(2);
const dryRun = rawArgs.includes('--dry-run');
const files = rawArgs.filter((a) => !a.startsWith('--'));

if (files.length === 0) {
  console.error('Usage : node scripts/import-content.mjs [--dry-run] <content/monde.json> [<content/monde.json> …]');
  process.exit(1);
}

// ---------- 1. Lecture + validation (tout ou rien) ----------
const worlds = [];
for (const file of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`✗ ${file} : JSON illisible — ${err.message}`);
    process.exit(1);
  }
  const stem = basename(file).replace(/\.json$/, '');
  const result = validateContent(data, stem);
  if (!result.ok) {
    console.error(`✗ ${file} — validation échouée, ${result.errors.length} erreur(s) (rien n'a été importé) :`);
    for (const e of result.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.error(`✓ ${file} — ${result.stats.worldName} : ${result.stats.adventures} aventures, ${result.stats.questions} questions`);
  worlds.push(data);
}

// ---------- 2. Génération SQL ----------
const esc = (value) => `'${String(value).replace(/'/g, "''")}'`;

function buildWorldSql(data) {
  const stmts = [];
  for (const adv of data.adventures) {
    stmts.push(`-- ${data.world} / ${adv.slug}`);
    stmts.push(
      `update public.adventures set description = ${esc(adv.description)}, story = ${esc(adv.story)} where slug = ${esc(adv.slug)};`
    );
    stmts.push(`delete from public.lessons where adventure_id = (select id from public.adventures where slug = ${esc(adv.slug)});`);
    adv.lessons.forEach((les, i) => {
      stmts.push(
        `insert into public.lessons (adventure_id, section_type, sort_order, title, content) ` +
          `select a.id, ${esc(les.section_type)}, ${i + 1}, ${esc(les.title)}, ${esc(les.content)} ` +
          `from public.adventures a where a.slug = ${esc(adv.slug)};`
      );
    });
    stmts.push(`delete from public.quiz_questions where adventure_id = (select id from public.adventures where slug = ${esc(adv.slug)});`);
    adv.quiz.forEach((q, i) => {
      stmts.push(
        `insert into public.quiz_questions (adventure_id, question, options, correct_index, explanation, sort_order) ` +
          `select a.id, ${esc(q.question)}, ${esc(JSON.stringify(q.options))}::jsonb, ${q.correct_index}, ${esc(q.explanation)}, ${i + 1} ` +
          `from public.adventures a where a.slug = ${esc(adv.slug)};`
      );
    });
  }

  // Vérification post-import : si un slug est absent de la base, ses insertions
  // silencieuses font chuter les compteurs -> exception -> rollback complet.
  const slugList = data.adventures.map((a) => esc(a.slug)).join(', ');
  const lessonsExpected = data.adventures.length * LESSON_SEQUENCE.length;
  const quizExpected = data.adventures.reduce((n, a) => n + a.quiz.length, 0);
  stmts.push(`do $$
begin
  if (select count(*) from public.lessons l join public.adventures a on a.id = l.adventure_id where a.slug in (${slugList})) <> ${lessonsExpected} then
    raise exception 'import ${data.world} : leçons attendues = ${lessonsExpected}, trouvé autre chose — slugs absents de la base ?';
  end if;
  if (select count(*) from public.quiz_questions q join public.adventures a on a.id = q.adventure_id where a.slug in (${slugList})) <> ${quizExpected} then
    raise exception 'import ${data.world} : questions attendues = ${quizExpected}, trouvé autre chose';
  end if;
end $$;`);

  return stmts.join('\n');
}

// ---------- 3. Exécution ----------
const env = { ...process.env, ...loadEnvLocal() };
const { SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD } = env;
const port = env.SUPABASE_DB_PORT || '5432';
const db = env.SUPABASE_DB_NAME || 'postgres';

for (const data of worlds) {
  const sql = `begin;\n${buildWorldSql(data)}\ncommit;\n`;

  if (dryRun) {
    // SQL pur sur stdout (redirigeable vers un fichier .sql tel quel),
    // messages d'information sur stderr.
    process.stderr.write(`SQL de « ${data.world} » envoyé sur stdout\n`);
    process.stdout.write(sql);
    continue;
  }

  if (!SUPABASE_DB_HOST || !SUPABASE_DB_USER || !SUPABASE_DB_PASSWORD) {
    console.error('Variables SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD manquantes (.env.local ou environnement).');
    process.exit(1);
  }

  const url = `postgresql://${SUPABASE_DB_USER}@${SUPABASE_DB_HOST}:${port}/${db}`;
  const result = spawnSync('psql', [url, '-v', 'ON_ERROR_STOP=1', '-o', '/dev/null'], {
    input: sql,
    encoding: 'utf8',
    env: { ...env, PGPASSWORD: SUPABASE_DB_PASSWORD },
    stdio: ['pipe', 'inherit', 'inherit'],
  });

  if (result.status !== 0) {
    console.error(`✗ Import du monde « ${data.world} » échoué — la transaction a été annulée.`);
    process.exit(result.status ?? 1);
  }
  console.error(`✓ Monde « ${data.world} » importé (12 aventures mises à jour).`);
}

if (!dryRun) console.error('Import terminé.');
