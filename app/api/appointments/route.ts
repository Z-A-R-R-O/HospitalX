/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { getAppointments } from "@/lib/appointments";
import { requirePermission } from "@/lib/permissions";
import { bookAppointment } from "@/lib/commands/appointment";
import { CommandError, isAuthorizationError } from "@/lib/commands/handler";

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
  try {
    const { response, replayed } = await bookAppointment(request);
    return NextResponse.json(response, { status: replayed ? 200 : 201, headers: { "Idempotency-Replayed": String(replayed) } });
  } catch (error: unknown) {
    console.error("appointment_create_failed", error);
    if (error instanceof CommandError) return NextResponse.json({ error: error.code, message: error.message, ...error.details }, { status: error.status });
    if (isAuthorizationError(error)) return NextResponse.json({ error: (error as Error).message }, { status: 403 });
    if ((error as Error).message?.includes("Authentication required")) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    return NextResponse.json({ error: "Unable to create appointment" }, { status: 500 });
  }
}