-- HospitalX Phase 3: a single, tamper-evident chain per organization.
-- The head row is locked by the trigger, so concurrent commands cannot fork a
-- tenant's chain. Projection, event, audit, and the head advance together in
-- the command's existing statement transaction.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
--> statement-breakpoint

ALTER TABLE domain_events ADD COLUMN IF NOT EXISTS chain_sequence BIGINT NOT NULL DEFAULT 0;
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS domain_event_heads (
  organization_id TEXT PRIMARY KEY,
  last_hash TEXT NOT NULL,
  -- A BEFORE INSERT trigger advances this head before its event row exists,
  -- so this intentionally is not an immediate foreign key.
  last_event_id UUID NOT NULL,
  last_sequence BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--> statement-breakpoint

CREATE OR REPLACE FUNCTION hospitalx_hash_field(value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN value IS NULL THEN '-' ELSE encode(convert_to(value, 'UTF8'), 'hex') END;
$$;
--> statement-breakpoint

CREATE OR REPLACE FUNCTION hospitalx_chain_domain_event()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  previous TEXT;
  previous_sequence BIGINT;
  material TEXT;
BEGIN
  -- An organization-wide chain is intentional: it makes every tenant's
  -- operational timeline independently verifiable with one ordered stream.
  PERFORM pg_advisory_xact_lock(hashtext(NEW.organization_id));

  -- A CTE may have already updated a projection by the time an INSERT's
  -- conflict target is evaluated. Raise before advancing the head so the
  -- entire competing command rolls back; the handler then replays its saved
  -- response instead of allowing a second projection mutation.
  IF EXISTS (
    SELECT 1 FROM domain_events
    WHERE organization_id = NEW.organization_id
      AND idempotency_key = NEW.idempotency_key
  ) THEN
    RAISE EXCEPTION 'duplicate domain event idempotency key'
      USING ERRCODE = '23505';
  END IF;

  SELECT last_hash, last_sequence INTO previous, previous_sequence
  FROM domain_event_heads
  WHERE organization_id = NEW.organization_id
  FOR UPDATE;

  NEW.previous_hash := previous;
  NEW.chain_sequence := COALESCE(previous_sequence, 0) + 1;
  material := concat_ws('|',
    hospitalx_hash_field(NEW.previous_hash),
    hospitalx_hash_field(NEW.id::text),
    hospitalx_hash_field(NEW.event_type),
    hospitalx_hash_field(NEW.aggregate_type),
    hospitalx_hash_field(NEW.aggregate_id),
    hospitalx_hash_field(NEW.organization_id),
    hospitalx_hash_field(NEW.facility_id),
    hospitalx_hash_field(NEW.actor_id),
    hospitalx_hash_field(NEW.actor_role),
    hospitalx_hash_field(NEW.device_id),
    hospitalx_hash_field(NEW.idempotency_key),
    hospitalx_hash_field(NEW.expected_version::text),
    hospitalx_hash_field(NEW.resulting_version::text),
    hospitalx_hash_field(to_char(NEW.occurred_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')),
    hospitalx_hash_field(NEW.source),
    hospitalx_hash_field(NEW.correlation_id),
    hospitalx_hash_field(NEW.payload::text)
  );
  NEW.hash := encode(digest(material, 'sha256'), 'hex');

  INSERT INTO domain_event_heads (organization_id, last_hash, last_event_id, last_sequence, updated_at)
  VALUES (NEW.organization_id, NEW.hash, NEW.id, NEW.chain_sequence, now())
  ON CONFLICT (organization_id) DO UPDATE
    SET last_hash = EXCLUDED.last_hash,
        last_event_id = EXCLUDED.last_event_id,
        last_sequence = EXCLUDED.last_sequence,
        updated_at = EXCLUDED.updated_at;

  RETURN NEW;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS domain_events_chain_before_insert ON domain_events;
--> statement-breakpoint
CREATE TRIGGER domain_events_chain_before_insert
BEFORE INSERT ON domain_events
FOR EACH ROW EXECUTE FUNCTION hospitalx_chain_domain_event();
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS domain_events_organization_chain_idx
  ON domain_events (organization_id, chain_sequence);