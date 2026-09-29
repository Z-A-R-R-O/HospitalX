-- Phase 8: preserve the evidence summary from each deterministic Lab run so
-- Judge Mode never has to manufacture a score in the browser.
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
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS reliability_runs_tenant_generated_idx
  ON reliability_runs (tenant_id, generated_at DESC);