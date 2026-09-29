-- HospitalX Phase 1: deployable proof-engine foundation.
-- Safe to run once through Drizzle's migration journal. Test on a Neon branch
-- with DATABASE_URL_UNPOOLED before production.

ALTER TABLE patients ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
ALTER TABLE beds ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'city-care';
--> statement-breakpoint
ALTER TABLE beds ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'city-care';
--> statement-breakpoint
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint

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
--> statement-breakpoint

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
--> statement-breakpoint

ALTER TABLE clinical_orders ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'city-care';
--> statement-breakpoint
ALTER TABLE clinical_orders ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint

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
--> statement-breakpoint

ALTER TABLE billing_transactions ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'city-care';
--> statement-breakpoint
ALTER TABLE billing_transactions ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;
--> statement-breakpoint

UPDATE appointments
SET status = CASE lower(status)
  WHEN 'scheduled' THEN 'REQUESTED'
  WHEN 'waiting' THEN 'ARRIVED'
  WHEN 'in_progress' THEN 'IN_PROGRESS'
  WHEN 'completed' THEN 'COMPLETED'
  WHEN 'cancelled' THEN 'CANCELLED'
  ELSE upper(status)
END
WHERE status <> upper(status) OR status IN ('scheduled', 'waiting');
--> statement-breakpoint

ALTER TABLE appointments ALTER COLUMN status SET DEFAULT 'REQUESTED';
--> statement-breakpoint

DO $$
DECLARE constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'patients'::regclass AND contype = 'u'
      AND conkey = ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'patients'::regclass AND attname = 'idempotency_key')]
  LOOP EXECUTE format('ALTER TABLE patients DROP CONSTRAINT %I', constraint_name);
  END LOOP;

  FOR constraint_name IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'appointments'::regclass AND contype = 'u'
      AND conkey = ARRAY[(SELECT attnum FROM pg_attribute WHERE attrelid = 'appointments'::regclass AND attname = 'idempotency_key')]
  LOOP EXECUTE format('ALTER TABLE appointments DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS patients_organization_idempotency_key_unique ON patients (organization_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS appointments_organization_idempotency_key_unique ON appointments (organization_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
--> statement-breakpoint

ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS facility_id TEXT;
--> statement-breakpoint
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS device_id TEXT;
--> statement-breakpoint
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS correlation_id TEXT;
--> statement-breakpoint
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS reason TEXT;
--> statement-breakpoint
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS result TEXT;
--> statement-breakpoint
ALTER TABLE audit_events ADD COLUMN IF NOT EXISTS source TEXT;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS domain_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, aggregate_type TEXT NOT NULL, aggregate_id TEXT NOT NULL,
  organization_id TEXT NOT NULL, facility_id TEXT, actor_id TEXT NOT NULL, actor_role TEXT NOT NULL,
  device_id TEXT, idempotency_key TEXT NOT NULL, expected_version INTEGER,
  resulting_version INTEGER NOT NULL, occurred_at TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('ONLINE', 'OFFLINE')), correlation_id TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb, previous_hash TEXT, hash TEXT NOT NULL,
  UNIQUE (organization_id, idempotency_key), UNIQUE (hash)
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS domain_events_aggregate_idx ON domain_events (organization_id, aggregate_type, aggregate_id, occurred_at);