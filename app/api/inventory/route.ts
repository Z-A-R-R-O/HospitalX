/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { getInventory, createInventoryItem } from "@/lib/inventory";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
export const runtime = "nodejs";
export async function GET() {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, 'inventory:read');
    
    const items = await getInventory(context.organizationId);
    return NextResponse.json({ items, source: "neon" });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, 'inventory:write');
    
    const body = await request.json();
    const item = await createInventoryItem(context.organizationId, body);
    return NextResponse.json({ item, source: "neon" }, { status: 201 });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") return NextResponse.json({ error: error.message }, { status: 403 });
    if (error.message === "name is required") return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ error: "Unable to create item" }, { status: 500 });
  }
}

