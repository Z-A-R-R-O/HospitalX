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
export async function POST(request: Request) {
  try { 
    const context = await requireOrganizationContext();
    requirePermission(context, 'patients:write'); // Admissions require patient write access
    const body = await request.json(); 
    if (!body.patientId || !body.bedId) return NextResponse.json({ error: "patientId and bedId are required" }, { status: 400 }); 
    
    const db = sql(); 
    const beds = await db`SELECT id, status FROM beds WHERE id = ${body.bedId} FOR UPDATE`; 
    const bed = Array.isArray(beds) ? beds[0] as { status?: string } : null; 
    
    if (!bed) return NextResponse.json({ error: "Bed not found" }, { status: 404 }); 
    if (bed.status === "occupied") return NextResponse.json({ error: "Bed is already occupied" }, { status: 409 }); 
    
    const rows = await db`UPDATE beds SET status = 'occupied', patient_id = ${body.patientId}, updated_at = now() WHERE id = ${body.bedId} RETURNING *`; 
    
    return NextResponse.json({ admission: Array.isArray(rows) ? rows[0] : null, source: "neon" }, { status: 201 }); 
  } catch (error: any) { 
    if (error.name === "UnauthorizedError") return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("admission_create_failed", error); 
    return NextResponse.json({ error: "Unable to admit patient" }, { status: 500 }); 
  }
}
