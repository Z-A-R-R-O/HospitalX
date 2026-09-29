/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
import { getDoctors, createDoctor } from "@/lib/doctors";
export const runtime = "nodejs";
export async function GET() {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'staff:read');
    
    const doctors = await getDoctors(context.organizationId);
    return NextResponse.json({ doctors });
  } catch (error: any) {
    console.error("doctors_read_failed", error);
    
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'staff:write');
    
    const body = await request.json();
    const doctor = await createDoctor(context.organizationId, body);
    
    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error: any) {
    console.error("doctor_create_failed", error);
    
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message === "Name and Specialty required") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Unable to create doctor" }, { status: 500 });
  }
}
