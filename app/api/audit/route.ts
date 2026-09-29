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
export const runtime="nodejs";
async function ensure(){
  const db=sql();
  await db`CREATE TABLE IF NOT EXISTS audit_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL DEFAULT 'city-care', event_type TEXT NOT NULL, actor TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  return db;
}
export async function GET(){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'read:audit' as any);
    const db=sql();
    const events=await db`SELECT id,event_type,actor,payload,created_at FROM audit_events WHERE organization_id = ${ctx.organizationId} ORDER BY created_at DESC LIMIT 200`;
    return NextResponse.json({events,source:"neon"});
  }catch(e){
    console.error("audit_read_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Database unavailable"},{status:503});
  }
}
export async function POST(request:Request){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'write:audit' as any);
    const b=await request.json();
    if(!b.eventType||!b.actor)return NextResponse.json({error:"eventType and actor are required"},{status:400});
    const db=sql();
    const rows=await db`INSERT INTO audit_events (organization_id,event_type,actor,payload) VALUES (${ctx.organizationId},${b.eventType},${b.actor},${b.payload??{}}) RETURNING *`;
    return NextResponse.json({event:Array.isArray(rows)?rows[0]:null,source:"neon"},{status:201});
  }catch(e){
    console.error("audit_create_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Unable to create audit event"},{status:500});
  }
}
