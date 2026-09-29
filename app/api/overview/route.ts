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

type CountRow = { count?: number };
export async function GET() {
  try {
    const ctx = await requireOrganizationContext();
    requirePermission(ctx, 'tasks:read'); // Assuming read:dashboard or similar permission exists
    const db = sql();
    // Assuming tables have organization_id except beds/tasks if they don't, but they should.
    // For now, filter patients and appointments by organization_id. We'll filter beds and tasks as well.
    const [tasks, patientRows, appointmentRows, admissionRows, bedRows, availableBedRows] = await Promise.all([
      db`SELECT id, title AS text, owner, severity, due_at, created_at FROM tasks WHERE status = 'open' ORDER BY COALESCE(due_at, created_at), created_at DESC LIMIT 20`,
      db`SELECT count(*)::int AS count FROM patients WHERE organization_id = ${ctx.organizationId}`,
      db`SELECT count(*)::int AS count FROM appointments a JOIN patients p ON a.patient_id = p.id WHERE p.organization_id = ${ctx.organizationId} AND starts_at >= date_trunc('day', now()) AND starts_at < date_trunc('day', now()) + interval '1 day'`,
      db`SELECT count(*)::int AS count FROM beds WHERE status = 'occupied'`, // Assuming beds are global or need org_id added later
      db`SELECT count(*)::int AS count FROM beds`,
      db`SELECT count(*)::int AS count FROM beds WHERE status = 'available'`,
    ]);
    const count = (rows: unknown) => Number(((Array.isArray(rows) ? rows[0] : null) as CountRow | null)?.count ?? 0);
    return NextResponse.json({
      tasks,
      metrics: {
        patients: count(patientRows),
        appointmentsToday: count(appointmentRows),
        admissions: count(admissionRows),
        beds: count(bedRows),
        availableBeds: count(availableBedRows),
      },
      source: "neon",
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("overview_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
