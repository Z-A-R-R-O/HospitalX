-- Reliability runs use this row as a cross-instance lease. It is provisioned
-- through the migration path so application code never executes runtime DDL.
CREATE TABLE IF NOT EXISTS _lab_run_lease (
  id INTEGER PRIMARY KEY,
  locked_at TIMESTAMPTZ,
  locked_by TEXT
);
