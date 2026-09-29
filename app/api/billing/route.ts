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
import { requirePermission } from "@/lib/permissions";
export const runtime = "nodejs";
export async function GET() {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, 'billing:read');
    const db = sql();
    const bills = await db`
      SELECT b.*, p.full_name 
      FROM billing_transactions b 
      JOIN patients p ON p.id = b.patient_id 
      WHERE p.organization_id = ${context.organizationId}
      ORDER BY b.created_at DESC LIMIT 100
    `;
    return NextResponse.json({ bills, source: "neon" });
  } catch (error: any) {
    console.error("billing_read_failed", error);
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, 'billing:write');
    const b = await request.json();
    if (!b.patientId || !b.description || b.amount === undefined) {
      return NextResponse.json({ error: "patientId, description, and amount are required" }, { status: 400 });
    }
    const db = sql();
    
    // Validate patient belongs to organization
    const patientCheck = await db`SELECT id FROM patients WHERE id = ${b.patientId} AND organization_id = ${context.organizationId}`;
    if (!Array.isArray(patientCheck) || patientCheck.length === 0) {
      return NextResponse.json({ error: "Patient not found or unauthorized" }, { status: 403 });
    }
    const rows = await db`
      INSERT INTO billing_transactions (patient_id, description, amount) 
      VALUES (${b.patientId}, ${b.description}, ${b.amount}) 
      RETURNING *
    `;
    return NextResponse.json({ bill: Array.isArray(rows) ? rows[0] : null, source: "neon" }, { status: 201 });
  } catch (error: any) {
    console.error("billing_create_failed", error);
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Unable to create bill" }, { status: 500 });
  }
}

