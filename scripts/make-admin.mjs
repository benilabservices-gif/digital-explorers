#!/usr/bin/env node
// Promeut un compte au rôle admin (accès back-office /admin).
// Usage : npm run db:make-admin -- email@example.com
// Le compte doit déjà exister (inscription faite) ; le script est idempotent.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

function loadEnvLocal(path = '.env.local') {
  const env = {};
  if (!existsSync(path)) return env;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !line.trim().startsWith('#')) env[m[1]] = m[2];
  }
  return env;
}

const email = process.argv[2];
if (!email || !email.includes('@')) {
  console.error('Usage : npm run db:make-admin -- email@example.com');
  process.exit(1);
}

const env = { ...process.env, ...loadEnvLocal() };
const { SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD } = env;
const port = env.SUPABASE_DB_PORT || '5432';
const db = env.SUPABASE_DB_NAME || 'postgres';

if (!SUPABASE_DB_HOST || !SUPABASE_DB_USER || !SUPABASE_DB_PASSWORD) {
  console.error('Variables SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD manquantes dans .env.local');
  process.exit(1);
}

const url = `postgresql://${SUPABASE_DB_USER}@${SUPABASE_DB_HOST}:${port}/${db}`;
const sql = `update public.profiles set role = 'admin' where id = (select id from auth.users where lower(email) = lower('${email.replace(/'/g, "''")}'));`;
const result = spawnSync(
  'psql',
  [url, '-v', 'ON_ERROR_STOP=1', '-c', sql],
  { env: { ...env, PGPASSWORD: SUPABASE_DB_PASSWORD }, stdio: 'inherit' }
);

if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);
