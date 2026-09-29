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
  await db`CREATE TABLE IF NOT EXISTS patients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL, full_name TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await db`CREATE TABLE IF NOT EXISTS clinical_orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID NOT NULL REFERENCES patients(id), order_type TEXT NOT NULL, test_name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ordered', result TEXT, ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(), completed_at TIMESTAMPTZ)`;
  return db;
}
export async function GET(request:Request){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'read:clinical' as any);
    const db=sql();
    const type=new URL(request.url).searchParams.get("type");
    const rows=type
      ? await db`SELECT o.*,p.full_name FROM clinical_orders o JOIN patients p ON p.id=o.patient_id WHERE o.order_type=${type} AND p.organization_id=${ctx.organizationId} ORDER BY o.ordered_at DESC`
      : await db`SELECT o.*,p.full_name FROM clinical_orders o JOIN patients p ON p.id=o.patient_id WHERE p.organization_id=${ctx.organizationId} ORDER BY o.ordered_at DESC`;
    return NextResponse.json({orders:rows,source:"neon"});
  }catch(e){
    console.error("orders_read_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Database unavailable"},{status:503});
  }
}
export async function POST(request:Request){
  try{
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'write:clinical' as any);
    const b=await request.json();
    if(!b.patientId||!b.orderType||!b.testName)return NextResponse.json({error:"patientId, orderType, and testName are required"},{status:400});
    const db=sql();
    
    const pCheck = await db`SELECT id FROM patients WHERE id = ${b.patientId} AND organization_id = ${ctx.organizationId}`;
    if (!Array.isArray(pCheck) || pCheck.length === 0) return NextResponse.json({error:"Patient not found or unauthorized"},{status:403});
    
    const rows=await db`INSERT INTO clinical_orders (patient_id,order_type,test_name) VALUES (${b.patientId},${b.orderType},${b.testName}) RETURNING *`;
    return NextResponse.json({order:Array.isArray(rows)?rows[0]:null,source:"neon"},{status:201});
  }catch(e){
    console.error("order_create_failed",e);
    return NextResponse.json({error: e instanceof Error ? e.message : "Unable to create order"},{status:500});
  }
}
