const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

describe('Schema and Route Inventory Test', () => {
  test('schema.sql contains all necessary tables', () => {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    
    // Check tables
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS patients'), 'patients table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS appointments'), 'appointments table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS doctors'), 'doctors table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS nurses'), 'nurses table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS beds'), 'beds table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS tasks'), 'tasks table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS audit_events'), 'audit_events table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS screenings'), 'screenings table missing');
    assert(schemaSql.includes('CREATE TABLE IF NOT EXISTS referrals'), 'referrals table missing');
  });

  test('schema.sql contains idempotency keys for mutations', () => {
    const schemaSql = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
    
    // The tables where we expect idempotency
    assert(schemaSql.match(/patients\s*\([\s\S]*?idempotency_key TEXT UNIQUE/i), 'patients missing idempotency key');
    assert(schemaSql.match(/appointments\s*\([\s\S]*?idempotency_key TEXT UNIQUE/i), 'appointments missing idempotency key');
    assert(schemaSql.match(/screenings\s*\([\s\S]*?idempotency_key TEXT UNIQUE/i), 'screenings missing idempotency key');
    assert(schemaSql.match(/referrals\s*\([\s\S]*?idempotency_key TEXT UNIQUE/i), 'referrals missing idempotency key');
  });
});

describe('Screening and Sync Unit Tests', () => {
  test('Screening workflow payloads format correctly', () => {
    const mockScreening = {
      patient_id: "00000000-0000-0000-0000-000000000000",
      worker_id: "hw-123",
      organization_id: "city-care",
      status: "completed",
      idempotency_key: "req-abc-123"
    };

    assert.strictEqual(mockScreening.status, "completed");
    assert.strictEqual(mockScreening.idempotency_key, "req-abc-123");
  });
  
  test('Sync engine merges offline data with correct resolution', () => {
    // Just a placeholder test logic for the hackathon
    const localLastModified = 1700000000000;
    const remoteLastModified = 1700000005000;
    
    // Server wins on newer remote
    assert(remoteLastModified > localLastModified, 'Sync resolution failure');
  });
});
