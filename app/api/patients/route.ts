/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { getPatients, createPatient } from "@/lib/patients";
import { requirePermission } from "@/lib/permissions";
export const runtime = "nodejs";
export async function GET() {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'patients:read');
    
    const patients = await getPatients(context.organizationId);
    return NextResponse.json({ patients });
  } catch (error: any) {
    console.error("patients_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'patients:write');
    
    const body = await request.json();
    const patient = await createPatient(context.organizationId, context.userId, body);
    
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error: any) {
    console.error("patient_create_failed", error);
    
    if (error.message === "Name and DOB required") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Unable to create patient" }, { status: 500 });
  }
}
