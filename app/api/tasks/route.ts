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
export async function GET(){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'tasks:read');
    const db=sql();
    const tasks=await db`SELECT id,text,severity,owner,created_at FROM hospital_tasks WHERE organization_id = ${ctx.organizationId} AND resolved_at IS NULL ORDER BY created_at DESC`;
    return NextResponse.json({tasks,source:"neon"});
  }catch(e){
    console.error("tasks_read_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Database unavailable"},{status:503});
  }
}
export async function POST(request:Request){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'tasks:write');
    const b=await request.json();
    if(!b.text)return NextResponse.json({error:"text is required"},{status:400});
    const db=sql();
    const rows=await db`INSERT INTO hospital_tasks (organization_id,text,severity,owner) VALUES (${ctx.organizationId},${b.text},${b.severity??"attention"},${b.owner??"Operations"}) RETURNING *`;
    return NextResponse.json({task:Array.isArray(rows)?rows[0]:null,source:"neon"},{status:201});
  }catch(e){
    console.error("task_create_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Unable to create task"},{status:500});
  }
}

