/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { sql } from "@/db/client";
export interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  quantity: number;
  reorder_level: number;
  unit: string;
  updated_at: Date;
  needs_reorder?: boolean;
}
async function ensureInventorySchema() {
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    name TEXT NOT NULL, 
    sku TEXT, 
    category TEXT NOT NULL DEFAULT 'pharmacy', 
    quantity INT NOT NULL DEFAULT 0, 
    reorder_level INT NOT NULL DEFAULT 0, 
    unit TEXT NOT NULL DEFAULT 'unit', 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  return db;
}
export async function getInventory(): Promise<InventoryItem[]> {
  const db = await ensureInventorySchema();
  const items = await db`SELECT *, quantity <= reorder_level AS needs_reorder FROM inventory_items ORDER BY name`;
  return items as InventoryItem[];
}
export async function createInventoryItem(data: any): Promise<InventoryItem> {
  if (!data.name) throw new Error("name is required");
  const db = await ensureInventorySchema();
  
  const rows = await db`INSERT INTO inventory_items (name, sku, category, quantity, reorder_level, unit) 
    VALUES (${data.name}, ${data.sku ?? null}, ${data.category ?? "pharmacy"}, ${data.quantity ?? 0}, ${data.reorderLevel ?? 0}, ${data.unit ?? "unit"}) 
    RETURNING *`;
    
  return (Array.isArray(rows) ? rows[0] : null) as InventoryItem;
}
