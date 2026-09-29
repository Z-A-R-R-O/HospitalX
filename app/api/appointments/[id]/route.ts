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
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { 
    const context = await requireOrganizationContext();
    requirePermission(context, 'write:clinical' as any); // Assuming appointments can be modified by clinical or admin roles
    
    const db = sql(); 
    const { id } = await params; 
    const body = await request.json(); 
    
    const rows = await db`UPDATE appointments SET provider_name = COALESCE(${body.providerName ?? null}, provider_name), appointment_type = COALESCE(${body.appointmentType ?? null}, appointment_type), status = COALESCE(${body.status ?? null}, status), starts_at = COALESCE(${body.startsAt ?? null}, starts_at) WHERE id = ${id} AND organization_id = ${context.organizationId} RETURNING *`; 
    const appointment = Array.isArray(rows) ? rows[0] : null; 
    
    if (appointment && context.userId) {
      await db`
        INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, details)
        VALUES (${context.organizationId}, ${context.userId}, 'appointment_updated', 'appointment', ${(appointment as any).id}, ${JSON.stringify(body)})
      `;
    }
    
    return appointment ? NextResponse.json({ appointment, source: "neon" }) : NextResponse.json({ error: "Appointment not found or unauthorized" }, { status: 404 }); 
  }
  catch (error: any) { 
    console.error("appointment_update_failed", error); 
    if (error.name === "UnauthorizedError") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "Unable to update appointment" }, { status: 500 }); 
  }
}
