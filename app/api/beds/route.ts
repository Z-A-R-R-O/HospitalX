/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions/guard";
export const runtime = "nodejs";
async function ensure(){
  const db=sql();
  await db`CREATE TABLE IF NOT EXISTS beds (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL DEFAULT 'city-care', facility TEXT NOT NULL, ward TEXT NOT NULL, label TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available', patient_id UUID, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  return db;
}
export async function GET(){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'read:inventory' as any); // Or appropriate permission
    const db=sql();
    const beds=await db`SELECT * FROM beds WHERE organization_id = ${ctx.organizationId} ORDER BY facility, ward, label`;
    return NextResponse.json({beds,source:"neon"});
  }catch(e){
    console.error("beds_read_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Database unavailable"},{status:503});
  }
}
export async function POST(request:Request){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'write:inventory' as any);
    const b=await request.json();
    if(!b.facility||!b.ward||!b.label) return NextResponse.json({error:"facility, ward, and label are required"},{status:400});
    const db=sql();
    const rows=await db`INSERT INTO beds (organization_id,facility,ward,label,status) VALUES (${ctx.organizationId},${b.facility},${b.ward},${b.label},${b.status??"available"}) RETURNING *`;
    return NextResponse.json({bed:Array.isArray(rows)?rows[0]:null,source:"neon"},{status:201});
  }catch(e){
    console.error("bed_create_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Unable to create bed"},{status:500});
  }
}
