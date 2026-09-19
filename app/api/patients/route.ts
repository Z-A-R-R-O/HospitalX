import { NextResponse } from "next/server";
import { getOrganizationContext } from "@/lib/request-context";
import { cleanText, ensurePatientSchedulingSchema, normalizeIdentifier, validDate, writeAudit } from "@/lib/patient-scheduling";

export const runtime = "nodejs";

export async function GET() {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!context.organizationId) return NextResponse.json({ error: "Select a hospital organization before viewing patients" }, { status: 403 });
  try {
    const db = await ensurePatientSchedulingSchema();
    const patients = await db`SELECT p.id, p.external_identifier, p.full_name, p.sex, EXTRACT(YEAR FROM age(current_date, p.date_of_birth))::int AS age, a.appointment_type, a.provider_name, a.status, a.starts_at FROM patients p LEFT JOIN LATERAL (SELECT * FROM appointments WHERE patient_id = p.id ORDER BY starts_at DESC LIMIT 1) a ON true WHERE p.organization_id = ${context.organizationId} ORDER BY COALESCE(a.starts_at, p.created_at) DESC LIMIT 100`;
    return NextResponse.json({ patients, source: "neon" });
  } catch (error) {
    console.error("patients_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!context.organizationId) return NextResponse.json({ error: "Select a hospital organization before registering patients" }, { status: 403 });
  try {
    const body = await request.json();
    const fullName = cleanText(body.fullName, 160);
    const externalIdentifier = normalizeIdentifier(body.externalIdentifier);
    const dateOfBirth = cleanText(body.dateOfBirth, 10);
    const sex = cleanText(body.sex, 20);
    const phone = cleanText(body.phone, 30);
    if (!fullName) return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    if (dateOfBirth && !validDate(dateOfBirth)) return NextResponse.json({ error: "dateOfBirth must use YYYY-MM-DD" }, { status: 400 });
    const db = await ensurePatientSchedulingSchema();
    const duplicates = externalIdentifier
      ? await db`SELECT id, full_name, external_identifier, date_of_birth FROM patients WHERE organization_id = ${context.organizationId} AND external_identifier = ${externalIdentifier} LIMIT 5`
      : dateOfBirth ? await db`SELECT id, full_name, external_identifier, date_of_birth FROM patients WHERE organization_id = ${context.organizationId} AND lower(trim(full_name)) = lower(trim(${fullName})) AND date_of_birth = ${dateOfBirth}::date LIMIT 5` : [];
    if (Array.isArray(duplicates) && duplicates.length) {
      const duplicate = duplicates[0] as { id?: string };
      await writeAudit({ eventType: "patient.registration.rejected.v1", actor: context.userId, subjectType: "patient", subjectId: String(duplicate.id), organizationId: context.organizationId, outcome: "rejected", reason: "possible_duplicate" });
      return NextResponse.json({ error: "Possible duplicate patient record", duplicates }, { status: 409 });
    }
    const result = await db`INSERT INTO patients (organization_id, external_identifier, full_name, date_of_birth, sex, phone) VALUES (${context.organizationId}, ${externalIdentifier || null}, ${fullName}, ${dateOfBirth || null}, ${sex || null}, ${phone || null}) RETURNING id, external_identifier, full_name, date_of_birth, sex, phone, created_at`;
    const patient = (Array.isArray(result) ? result[0] : null) as { id?: string } | null;
    if (patient) await writeAudit({ eventType: "patient.registered.v1", actor: context.userId, subjectType: "patient", subjectId: String(patient.id), organizationId: context.organizationId, outcome: "accepted" });
    return NextResponse.json({ patient, source: "neon" }, { status: 201 });
  } catch (error) {
    console.error("patient_create_failed", error);
    return NextResponse.json({ error: "Unable to create patient" }, { status: 500 });
  }
}
