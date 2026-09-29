import { sql } from "@/db/client";

export interface InventoryItem {
  id: string;
  organization_id: string;
  name: string;
  sku: string | null;
  category: string;
  quantity: number;
  reorder_level: number;
  unit: string;
  updated_at: Date;
  needs_reorder?: boolean;
}

export async function getInventory(organizationId: string): Promise<InventoryItem[]> {
  const db = sql();
  const items = await db`SELECT *, quantity <= reorder_level AS needs_reorder FROM inventory_items WHERE organization_id = ${organizationId} ORDER BY name`;
  return items as InventoryItem[];
}

export async function createInventoryItem(organizationId: string, data: Record<string, unknown>): Promise<InventoryItem> {
  if (typeof data.name !== "string" || !data.name.trim()) throw new Error("name is required");
  const db = sql();
  const rows = await db`INSERT INTO inventory_items (organization_id, name, sku, category, quantity, reorder_level, unit)
    VALUES (${organizationId}, ${data.name.trim()}, ${typeof data.sku === "string" ? data.sku : null}, ${typeof data.category === "string" ? data.category : "pharmacy"}, ${typeof data.quantity === "number" ? data.quantity : 0}, ${typeof data.reorderLevel === "number" ? data.reorderLevel : 0}, ${typeof data.unit === "string" ? data.unit : "unit"})
    RETURNING *`;
  return (Array.isArray(rows) ? rows[0] : null) as InventoryItem;
}
