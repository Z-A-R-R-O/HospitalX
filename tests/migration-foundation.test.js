const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const migration = fs.readFileSync(path.join(__dirname, '..', 'db', 'migrations', '0001_proof_foundation.sql'), 'utf8');
const journal = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'db', 'migrations', 'meta', '_journal.json'), 'utf8'));

test('proof foundation migration is journaled and additive', () => {
  assert(journal.entries.some((entry) => entry.tag === '0001_proof_foundation'));
  assert.match(migration, /ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS domain_events/);
  assert.match(migration, /organization_idempotency_key_unique/);
  assert.match(migration, /UPDATE appointments/);
});

test('migration runner prefers a direct Neon connection for schema changes', () => {
  const runner = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'migrate-drizzle.js'), 'utf8');
  assert.match(runner, /DATABASE_URL_UNPOOLED \|\| process\.env\.DATABASE_URL/);
  assert.match(runner, /Refusing to migrate through a pooled URL/);
});
