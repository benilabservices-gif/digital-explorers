#!/usr/bin/env node
// Applique supabase/seed.sql au projet lié via psql (pooler IPv4).
// Idempotent : peut être relançé tel quel. Nécessite psql sur la machine.

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

const env = { ...process.env, ...loadEnvLocal() };
const { SUPABASE_DB_HOST, SUPABASE_DB_USER, SUPABASE_DB_PASSWORD } = env;
const port = env.SUPABASE_DB_PORT || '5432';
const db = env.SUPABASE_DB_NAME || 'postgres';

if (!SUPABASE_DB_HOST || !SUPABASE_DB_USER || !SUPABASE_DB_PASSWORD) {
  console.error('Variables SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD manquantes dans .env.local');
  process.exit(1);
}

if (spawnSync('psql', ['--version'], { stdio: 'ignore' }).status !== 0) {
  console.error('psql est requis (paquet postgresql-client).');
  process.exit(1);
}

const url = `postgresql://${SUPABASE_DB_USER}@${SUPABASE_DB_HOST}:${port}/${db}`;
const result = spawnSync(
  'psql',
  [url, '-v', 'ON_ERROR_STOP=1', '-f', 'supabase/seed.sql'],
  { env: { ...env, PGPASSWORD: SUPABASE_DB_PASSWORD }, stdio: 'inherit' }
);

process.exit(result.status ?? 1);
