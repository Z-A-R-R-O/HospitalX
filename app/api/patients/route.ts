import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = sql();
    const patients = await db`
      SELECT p.id, p.external_identifier, p.full_name, p.sex,
             EXTRACT(YEAR FROM age(current_date, p.date_of_birth))::int AS age,
             a.appointment_type, a.provider_name, a.status, a.starts_at
      FROM patients p
      LEFT JOIN LATERAL (
        SELECT * FROM appointments WHERE patient_id = p.id ORDER BY starts_at DESC LIMIT 1
      ) a ON true
      ORDER BY COALESCE(a.starts_at, p.created_at) DESC
      LIMIT 100
    `;
    return NextResponse.json({ patients, source: "neon" });
  } catch (error) {
    console.error("patients_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.fullName || !body.organizationId) return NextResponse.json({ error: "fullName and organizationId are required" }, { status: 400 });
    const db = sql();
    const [patient] = await db`
      INSERT INTO patients (organization_id, external_identifier, full_name, date_of_birth, sex, phone)
      VALUES (${body.organizationId}, ${body.externalIdentifier ?? null}, ${body.fullName}, ${body.dateOfBirth ?? null}, ${body.sex ?? null}, ${body.phone ?? null})
      RETURNING id, external_identifier, full_name, date_of_birth, sex, phone, created_at
    `;
    return NextResponse.json({ patient, source: "neon" }, { status: 201 });
  } catch (error) {
    console.error("patient_create_failed", error);
    return NextResponse.json({ error: "Unable to create patient" }, { status: 500 });
  }
}
