import { NextResponse } from "next/server";
import { getOrganizationContext } from "@/lib/request-context";
import { cleanText, ensurePatientSchedulingSchema, validDateTime, writeAudit } from "@/lib/patient-scheduling";

export const runtime = "nodejs";

export async function GET() {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!context.organizationId) return NextResponse.json({ error: "Select a hospital organization before viewing appointments" }, { status: 403 });
  try {
    const db = await ensurePatientSchedulingSchema();
    const appointments = await db`SELECT a.id, a.patient_id, p.full_name, a.provider_name, a.appointment_type, a.status, a.starts_at FROM appointments a JOIN patients p ON p.id = a.patient_id WHERE p.organization_id = ${context.organizationId} ORDER BY a.starts_at DESC LIMIT 100`;
    return NextResponse.json({ appointments, source: "neon" });
  } catch (error) {
    console.error("appointments_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!context.organizationId) return NextResponse.json({ error: "Select a hospital organization before booking appointments" }, { status: 403 });
  try {
    const body = await request.json();
    const patientId = cleanText(body.patientId, 64);
    const providerName = cleanText(body.providerName, 120);
    const appointmentType = cleanText(body.appointmentType, 60);
    const startsAt = cleanText(body.startsAt, 40);
    if (!patientId || !providerName || !appointmentType || !startsAt) return NextResponse.json({ error: "patientId, providerName, appointmentType, and startsAt are required" }, { status: 400 });
    if (!validDateTime(startsAt)) return NextResponse.json({ error: "startsAt must be a valid date and time" }, { status: 400 });
    const db = await ensurePatientSchedulingSchema();
    const patients = await db`SELECT id FROM patients WHERE id = ${patientId} AND organization_id = ${context.organizationId} LIMIT 1`;
    if (!Array.isArray(patients) || !patients.length) return NextResponse.json({ error: "Patient not found in the selected hospital" }, { status: 404 });
    const conflicts = await db`SELECT id FROM appointments WHERE provider_name = ${providerName} AND starts_at = ${startsAt}::timestamptz AND status IN ('scheduled', 'arrived', 'queued', 'in_consultation') LIMIT 1`;
    if (Array.isArray(conflicts) && conflicts.length) return NextResponse.json({ error: "Provider already has an active appointment at this time" }, { status: 409 });
    const result = await db`INSERT INTO appointments (patient_id, provider_name, appointment_type, starts_at) VALUES (${patientId}, ${providerName}, ${appointmentType}, ${startsAt}) RETURNING *`;
    const appointment = (Array.isArray(result) ? result[0] : null) as { id?: string } | null;
    if (appointment) await writeAudit({ eventType: "appointment.scheduled.v1", actor: context.userId, subjectType: "appointment", subjectId: String(appointment.id), organizationId: context.organizationId, outcome: "accepted" });
    return NextResponse.json({ appointment, source: "neon" }, { status: 201 });
  } catch (error) {
    console.error("appointment_create_failed", error);
    return NextResponse.json({ error: "Unable to create appointment" }, { status: 500 });
  }
}
