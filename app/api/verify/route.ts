import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { DomainEvent, verifyEventChain } from "@/lib/proof/engine";
import { requireOrganizationContext } from "@/lib/request-context";

export const runtime = "nodejs";

type EventRow = Record<string, unknown>;
type Projection = Record<string, unknown>;

function json(value: unknown): unknown { return typeof value === "string" ? JSON.parse(value) : value; }

function eventFromRow(row: EventRow): DomainEvent {
  return { id: String(row.id), eventType: String(row.event_type), aggregateType: String(row.aggregate_type), aggregateId: String(row.aggregate_id), organizationId: String(row.organization_id), facilityId: row.facility_id == null ? undefined : String(row.facility_id), actorId: String(row.actor_id), actorRole: String(row.actor_role), deviceId: row.device_id == null ? undefined : String(row.device_id), idempotencyKey: String(row.idempotency_key), expectedVersion: row.expected_version == null ? undefined : Number(row.expected_version), resultingVersion: Number(row.resulting_version), occurredAt: new Date(String(row.occurred_at)).toISOString(), source: row.source === "OFFLINE" ? "OFFLINE" : "ONLINE", correlationId: String(row.correlation_id), payload: json(row.payload), previousHash: row.previous_hash == null ? undefined : String(row.previous_hash), hash: String(row.hash) };
}

function stable(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stable(record[key])}`).join(",")}}`;
}

function responseRecord(event: DomainEvent, key: "patient" | "appointment"): Projection | undefined {
  const payload = event.payload as { response?: Record<string, unknown> } | null;
  const record = payload?.response?.[key];
  return record && typeof record === "object" ? record as Projection : undefined;
}

/** Verifies the actual organization-scoped append-only stream and its projections. */
export async function GET() {
  try {
    const organization = await requireOrganizationContext();
    const db = sql();
    const rows = await db`SELECT id, event_type, aggregate_type, aggregate_id, organization_id, facility_id, actor_id, actor_role, device_id, idempotency_key, expected_version, resulting_version, occurred_at, source, correlation_id, payload, previous_hash, hash, chain_sequence FROM domain_events WHERE organization_id = ${organization.organizationId} ORDER BY chain_sequence ASC`;
    const events = (Array.isArray(rows) ? rows : []).map((row) => eventFromRow(row as EventRow));
    const chain = verifyEventChain(events);
    const expectedPatients = new Map<string, Projection>();
    const expectedAppointments = new Map<string, Projection>();
    for (const event of events) {
      if (event.eventType === "PATIENT_REGISTERED") { const patient = responseRecord(event, "patient"); if (patient) expectedPatients.set(event.aggregateId, patient); }
      if (event.eventType === "APPOINTMENT_UPDATED") { const appointment = responseRecord(event, "appointment"); if (appointment) expectedAppointments.set(event.aggregateId, appointment); }
    }

    const [patientRows, appointmentRows] = await Promise.all([
      db`SELECT to_jsonb(p) AS record FROM patients p WHERE p.organization_id = ${organization.organizationId} AND EXISTS (SELECT 1 FROM domain_events e WHERE e.organization_id = p.organization_id AND e.aggregate_type = 'patient' AND e.aggregate_id = p.id::text)`,
      db`SELECT to_jsonb(a) AS record FROM appointments a WHERE a.organization_id = ${organization.organizationId} AND EXISTS (SELECT 1 FROM domain_events e WHERE e.organization_id = a.organization_id AND e.aggregate_type = 'appointment' AND e.aggregate_id = a.id::text)`,
    ]);
    const actualPatients = new Map((Array.isArray(patientRows) ? patientRows : []).map((row) => { const record = json((row as EventRow).record) as Projection; return [String(record.id), record] as const; }));
    const actualAppointments = new Map((Array.isArray(appointmentRows) ? appointmentRows : []).map((row) => { const record = json((row as EventRow).record) as Projection; return [String(record.id), record] as const; }));
    const mismatches: Array<Record<string, unknown>> = [];
    if (!chain.valid) mismatches.push({ kind: "event_chain", index: chain.index, reason: chain.reason });
    for (const [id, expected] of expectedPatients) { const actual = actualPatients.get(id); if (!actual || stable(expected) !== stable(actual)) mismatches.push({ kind: "projection", aggregate: `patient:${id}`, expected, actual: actual ?? null }); }
    for (const [id, expected] of expectedAppointments) { const actual = actualAppointments.get(id); if (!actual || stable(expected) !== stable(actual)) mismatches.push({ kind: "projection", aggregate: `appointment:${id}`, expected, actual: actual ?? null }); }
    return NextResponse.json({ mode: "persisted", chainScope: "organization", events: events.length, replayed: events.length, chain, stateMatch: mismatches.length === 0, mismatches, projections: { patients: expectedPatients.size, appointments: expectedAppointments.size } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify persisted event history.";
    return NextResponse.json({ error: "VERIFY_UNAVAILABLE", message }, { status: message.includes("Authentication required") ? 401 : 503 });
  }
}
