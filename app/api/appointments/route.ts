/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { getAppointments, createAppointment } from "@/lib/appointments";
import { requirePermission } from "@/lib/permissions";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'appointments:read');
    
    const url = new URL(request.url);
    const dateStr = url.searchParams.get("date");
    
    const appointments = await getAppointments(context.organizationId, dateStr);
    return NextResponse.json({ appointments });
  } catch (error: any) {
    console.error("appointments_read_failed", error);
    
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'appointments:write');
    
    const body = await request.json();
    const appointment = await createAppointment(context.organizationId, context.userId, body);
    
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error: any) {
    console.error("appointment_create_failed", error);
    
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message.includes("Missing required fields")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Unable to create appointment" }, { status: 500 });
  }
}
