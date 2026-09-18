import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

async function ensureTables() {
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS patients (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), organization_id TEXT NOT NULL, full_name TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await db`CREATE TABLE IF NOT EXISTS appointments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), patient_id UUID NOT NULL REFERENCES patients(id), provider_name TEXT NOT NULL, appointment_type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'scheduled', starts_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  return db;
}

export async function GET() {
  try {
    const db = await ensureTables();
    const appointments = await db`SELECT a.id, a.patient_id, p.full_name, a.provider_name, a.appointment_type, a.status, a.starts_at FROM appointments a JOIN patients p ON p.id = a.patient_id ORDER BY a.starts_at DESC LIMIT 100`;
    return NextResponse.json({ appointments, source: "neon" });
  } catch (error) {
    console.error("appointments_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.patientId || !body.providerName || !body.appointmentType || !body.startsAt) return NextResponse.json({ error: "patientId, providerName, appointmentType, and startsAt are required" }, { status: 400 });
    const db = await ensureTables();
    const result = await db`INSERT INTO appointments (patient_id, provider_name, appointment_type, starts_at) VALUES (${body.patientId}, ${body.providerName}, ${body.appointmentType}, ${body.startsAt}) RETURNING *`;
    return NextResponse.json({ appointment: Array.isArray(result) ? result[0] : null, source: "neon" }, { status: 201 });
  } catch (error) {
    console.error("appointment_create_failed", error);
    return NextResponse.json({ error: "Unable to create appointment" }, { status: 500 });
  }
}
