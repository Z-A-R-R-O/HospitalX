import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = sql();
    await db`CREATE TABLE IF NOT EXISTS patients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL, external_identifier TEXT, full_name TEXT NOT NULL, date_of_birth DATE, sex TEXT, phone TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await db`CREATE TABLE IF NOT EXISTS appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID NOT NULL REFERENCES patients(id), provider_name TEXT NOT NULL, appointment_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', starts_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await db`CREATE TABLE IF NOT EXISTS beds (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), facility TEXT NOT NULL, ward TEXT NOT NULL, label TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available', patient_id UUID REFERENCES patients(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await db`CREATE TABLE IF NOT EXISTS hospital_tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), text TEXT NOT NULL, severity TEXT NOT NULL DEFAULT 'attention', owner TEXT NOT NULL DEFAULT 'Operations', resolved_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await db`CREATE TABLE IF NOT EXISTS audit_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_type TEXT NOT NULL, actor TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    const tasks = await db`SELECT id, text, created_at FROM hospital_tasks WHERE resolved_at IS NULL ORDER BY created_at DESC LIMIT 20`;
    const patientRows = await db`SELECT count(*)::int AS count FROM patients`;
    const appointmentRows = await db`SELECT count(*)::int AS count FROM appointments WHERE starts_at >= date_trunc('day', now()) AND starts_at < date_trunc('day', now()) + interval '1 day'`;
    const admissionRows = await db`SELECT count(*)::int AS count FROM beds WHERE status = 'occupied'`;
    const bedRows = await db`SELECT count(*)::int AS count FROM beds`;
    const patientCount = Array.isArray(patientRows) ? patientRows[0] : null;
    const appointmentCount = Array.isArray(appointmentRows) ? appointmentRows[0] : null;
    const admissionCount = Array.isArray(admissionRows) ? admissionRows[0] : null;
    const bedCount = Array.isArray(bedRows) ? bedRows[0] : null;
    const count = (row: unknown) => Number((row as { count?: number } | null)?.count ?? 0);
    return NextResponse.json({ tasks, metrics: { patients: count(patientCount), appointmentsToday: count(appointmentCount), admissions: count(admissionCount), beds: count(bedCount) }, source: "neon" });
  } catch (error) {
    console.error("overview_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
