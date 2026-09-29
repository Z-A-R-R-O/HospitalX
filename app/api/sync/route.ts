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
import { requirePermission, UnauthorizedError } from "@/lib/permissions";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, "patients:write");
    const db = sql();

    const body = await req.json();
    const { mutations } = body;
    if (!Array.isArray(mutations)) {
      return NextResponse.json({ error: "mutations must be an array" }, { status: 400 });
    }
    const results = [];
    for (const mutation of mutations) {
      const { idempotencyKey, entity, payload } = mutation;
      if (!idempotencyKey || !entity || !payload) {
        results.push({ idempotencyKey: idempotencyKey || "unknown", status: "error", error: "Missing required fields" });
        continue;
      }
      try {
        if (entity === "create_patient") {
          const res = (await db`
            INSERT INTO patients (idempotency_key, organization_id, full_name, date_of_birth, sex, phone)
            VALUES (${idempotencyKey}, ${context.organizationId}, ${payload.full_name}, ${payload.date_of_birth || null}, ${payload.sex || null}, ${payload.phone || null})
            ON CONFLICT (idempotency_key) DO NOTHING
            RETURNING id
          `) as any[];
          
          if (res.length > 0) {
            results.push({ idempotencyKey, status: "created", serverId: res[0].id });
          } else {
            const existing = (await db`SELECT id FROM patients WHERE idempotency_key = ${idempotencyKey} AND organization_id = ${context.organizationId} LIMIT 1`) as any[];
            results.push({ idempotencyKey, status: "exists", serverId: existing[0]?.id });
          }
        } else if (entity === "create_screening") {
          let patientId = payload.patientServerId;
          if (!patientId && payload.patientIdempotencyKey) {
            const p = (await db`SELECT id FROM patients WHERE idempotency_key = ${payload.patientIdempotencyKey} AND organization_id = ${context.organizationId} LIMIT 1`) as any[];
            patientId = p[0]?.id;
          }
          if (!patientId) {
            results.push({ idempotencyKey, status: "error", error: "Patient not found" });
            continue;
          }
          const res = (await db`
            INSERT INTO screenings (
              idempotency_key, patient_id, worker_id, organization_id, status,
              total_score, max_score, risk_level, responses, observations,
              duration_seconds, completed_at, synced_at
            )
            VALUES (
              ${idempotencyKey}, ${patientId}, ${context.userId},
              ${context.organizationId}, ${payload.status || "in_progress"},
              ${payload.total_score || null}, ${payload.max_score || null}, ${payload.risk_level || null},
              ${JSON.stringify(payload.responses || [])}::jsonb,
              ${JSON.stringify(payload.observations || [])}::jsonb,
              ${payload.duration_seconds || null}, ${payload.completed_at || null}, now()
            )
            ON CONFLICT (idempotency_key) DO NOTHING
            RETURNING id
          `) as any[];
          if (res.length > 0) {
            results.push({ idempotencyKey, status: "created", serverId: res[0].id });
          } else {
            const existing = (await db`SELECT id FROM screenings WHERE idempotency_key = ${idempotencyKey} AND organization_id = ${context.organizationId} LIMIT 1`) as any[];
            results.push({ idempotencyKey, status: "exists", serverId: existing[0]?.id });
          }
        } else if (entity === "create_referral") {
          let patientId = payload.patientServerId;
          if (!patientId && payload.patientIdempotencyKey) {
            const p = (await db`SELECT id FROM patients WHERE idempotency_key = ${payload.patientIdempotencyKey} AND organization_id = ${context.organizationId} LIMIT 1`) as any[];
            patientId = p[0]?.id;
          }
          
          let screeningId = payload.screeningServerId || null;
          if (!screeningId && payload.screeningIdempotencyKey) {
            const s = (await db`SELECT id FROM screenings WHERE idempotency_key = ${payload.screeningIdempotencyKey} AND organization_id = ${context.organizationId} LIMIT 1`) as any[];
            screeningId = s[0]?.id;
          }
          if (!patientId) {
            results.push({ idempotencyKey, status: "error", error: "Patient not found" });
            continue;
          }
          let appointmentId = null;
          if (payload.urgency === 'urgent') {
            const appt = (await db`
              INSERT INTO appointments (organization_id, patient_id, provider_name, appointment_type, status, starts_at)
              VALUES (${context.organizationId}, ${patientId}, 'Assigned Specialist', ${payload.specialty}, 'scheduled', now() + interval '1 day')
              RETURNING id
            `) as any[];
            appointmentId = appt[0].id;
          }
          const res = (await db`
            INSERT INTO referrals (
              idempotency_key, screening_id, patient_id, worker_id, organization_id,
              specialty, urgency, reason, worker_notes, status, appointment_id, synced_at
            )
            VALUES (
              ${idempotencyKey}, ${screeningId}, ${patientId}, ${context.userId},
              ${context.organizationId}, ${payload.specialty}, ${payload.urgency || "routine"},
              ${payload.reason}, ${payload.worker_notes || null}, ${payload.status || "pending"},
              ${appointmentId}, now()
            )
            ON CONFLICT (idempotency_key) DO NOTHING
            RETURNING id
          `) as any[];
          if (res.length > 0) {
            results.push({ idempotencyKey, status: "created", serverId: res[0].id });
          } else {
            const existing = (await db`SELECT id FROM referrals WHERE idempotency_key = ${idempotencyKey} AND organization_id = ${context.organizationId} LIMIT 1`) as any[];
            results.push({ idempotencyKey, status: "exists", serverId: existing[0]?.id });
          }
        } else {
          results.push({ idempotencyKey, status: "error", error: "Unknown entity type" });
        }
      } catch (err: any) {
        console.error("Mutation error", err);
        results.push({ idempotencyKey, status: "error", error: err.message });
      }
    }
    return NextResponse.json({ results, source: "neon" });
  } catch (error: any) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 403 });
    if (error?.name === "AuthenticationError") return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

