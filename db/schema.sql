CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT UNIQUE,
  organization_id TEXT NOT NULL,
  external_identifier TEXT,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  sex TEXT,
  contact_number TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  priority TEXT NOT NULL DEFAULT 'normal',
  age INTEGER,
  blood_group TEXT,
  primary_complaint TEXT,
  email TEXT,
  address TEXT,
  emergency_contact TEXT,
  medical_history TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  role TEXT NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available',
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nurses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  ward TEXT NOT NULL,
  shift_start TIME NOT NULL,
  shift_end TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  patient_load INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id),
  full_name TEXT,
  provider_id TEXT,
  provider_name TEXT NOT NULL,
  appointment_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REQUESTED',
  priority TEXT DEFAULT 'normal',
  starts_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 30,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL DEFAULT 'city-care',
  facility TEXT NOT NULL,
  ward TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  patient_id UUID REFERENCES patients(id),
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL DEFAULT 'city-care',
  patient_id UUID REFERENCES patients(id),
  title TEXT NOT NULL,
  owner TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'attention',
  status TEXT NOT NULL DEFAULT 'open',
  version INTEGER NOT NULL DEFAULT 1,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT,
  user_id TEXT,
  action TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  event_type TEXT,
  actor TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  facility_id TEXT,
  device_id TEXT,
  correlation_id TEXT,
  reason TEXT,
  result TEXT,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only event log used to verify operational history independently of projections.
CREATE TABLE IF NOT EXISTS domain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_type TEXT NOT NULL,
  aggregate_type TEXT NOT NULL, aggregate_id TEXT NOT NULL, organization_id TEXT NOT NULL,
  facility_id TEXT, actor_id TEXT NOT NULL, actor_role TEXT NOT NULL, device_id TEXT,
  idempotency_key TEXT NOT NULL, expected_version INTEGER, resulting_version INTEGER NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL, source TEXT NOT NULL CHECK (source IN ('ONLINE', 'OFFLINE')),
  correlation_id TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  previous_hash TEXT, hash TEXT NOT NULL, chain_sequence BIGINT NOT NULL DEFAULT 0,
  UNIQUE (organization_id, idempotency_key), UNIQUE (hash)
);
CREATE INDEX IF NOT EXISTS domain_events_aggregate_idx ON domain_events (organization_id, aggregate_type, aggregate_id, occurred_at);
CREATE INDEX IF NOT EXISTS domain_events_organization_chain_idx ON domain_events (organization_id, chain_sequence);

-- The migration installs the append trigger, this table is the locked head of
-- the organization-wide proof chain.
CREATE TABLE IF NOT EXISTS domain_event_heads (
  organization_id TEXT PRIMARY KEY,
  last_hash TEXT NOT NULL,
  last_event_id UUID NOT NULL,
  last_sequence BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reliability_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  scenario_count INTEGER NOT NULL,
  passed_count INTEGER NOT NULL,
  event_count INTEGER NOT NULL,
  audit_count INTEGER NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS reliability_runs_tenant_generated_idx ON reliability_runs (tenant_id, generated_at DESC);

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

CREATE TABLE IF NOT EXISTS hospital_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL DEFAULT 'city-care',
  text TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'attention',
  owner TEXT NOT NULL DEFAULT 'Operations',
  version INTEGER NOT NULL DEFAULT 1,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinical_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL DEFAULT 'city-care',
  patient_id UUID NOT NULL REFERENCES patients(id),
  order_type TEXT NOT NULL,
  test_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CREATED',
  result TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS billing_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL DEFAULT 'city-care',
  patient_id UUID NOT NULL REFERENCES patients(id),
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);
