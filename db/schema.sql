CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS patients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL, external_identifier TEXT, full_name TEXT NOT NULL, date_of_birth DATE, sex TEXT, phone TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID NOT NULL REFERENCES patients(id), provider_name TEXT NOT NULL, appointment_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', starts_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS beds (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), facility TEXT NOT NULL, ward TEXT NOT NULL, label TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available', patient_id UUID REFERENCES patients(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID REFERENCES patients(id), title TEXT NOT NULL, owner TEXT NOT NULL, severity TEXT NOT NULL DEFAULT 'attention', status TEXT NOT NULL DEFAULT 'open', due_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_type TEXT NOT NULL, actor TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now());

ALTER TABLE patients ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

CREATE TABLE IF NOT EXISTS screenings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  patient_id      UUID NOT NULL REFERENCES patients(id),
  worker_id       TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'in_progress',
  total_score     INTEGER,
  max_score       INTEGER,
  risk_level      TEXT,
  responses       JSONB NOT NULL DEFAULT '[]'::jsonb,
  observations    JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_seconds INTEGER,
  completed_at    TIMESTAMPTZ,
  synced_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE NOT NULL,
  screening_id    UUID REFERENCES screenings(id),
  patient_id      UUID NOT NULL REFERENCES patients(id),
  worker_id       TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  specialty       TEXT NOT NULL,
  urgency         TEXT NOT NULL DEFAULT 'routine',
  reason          TEXT NOT NULL,
  worker_notes    TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  appointment_id  UUID REFERENCES appointments(id),
  synced_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
