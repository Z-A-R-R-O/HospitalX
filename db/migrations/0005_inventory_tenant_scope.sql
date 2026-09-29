-- Inventory is operationally sensitive and must be isolated by organization.
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL DEFAULT 'city-care',
  name TEXT NOT NULL,
  sku TEXT,
  category TEXT NOT NULL DEFAULT 'pharmacy',
  quantity INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unit',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS organization_id TEXT NOT NULL DEFAULT 'city-care';
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS inventory_items_organization_name_idx ON inventory_items (organization_id, name);
