import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

async function ensureOverviewTables() {
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS patients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL, external_identifier TEXT, full_name TEXT NOT NULL, date_of_birth DATE, sex TEXT, phone TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await db`CREATE TABLE IF NOT EXISTS appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID NOT NULL REFERENCES patients(id), provider_name TEXT NOT NULL, appointment_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', starts_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await db`CREATE TABLE IF NOT EXISTS beds (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), facility TEXT NOT NULL, ward TEXT NOT NULL, label TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'available', patient_id UUID REFERENCES patients(id), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await db`CREATE TABLE IF NOT EXISTS tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID REFERENCES patients(id), title TEXT NOT NULL, owner TEXT NOT NULL DEFAULT 'Operations', severity TEXT NOT NULL DEFAULT 'attention', status TEXT NOT NULL DEFAULT 'open', due_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await db`CREATE TABLE IF NOT EXISTS audit_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_type TEXT NOT NULL, actor TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  return db;
}

type CountRow = { count?: number };

export async function GET() {
  try {
    const db = await ensureOverviewTables();
    const [tasks, patientRows, appointmentRows, admissionRows, bedRows, availableBedRows] = await Promise.all([
      db`SELECT id, title AS text, owner, severity, due_at, created_at FROM tasks WHERE status = 'open' ORDER BY COALESCE(due_at, created_at), created_at DESC LIMIT 20`,
      db`SELECT count(*)::int AS count FROM patients`,
      db`SELECT count(*)::int AS count FROM appointments WHERE starts_at >= date_trunc('day', now()) AND starts_at < date_trunc('day', now()) + interval '1 day'`,
      db`SELECT count(*)::int AS count FROM beds WHERE status = 'occupied'`,
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
