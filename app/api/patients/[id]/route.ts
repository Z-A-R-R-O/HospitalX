import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const db = sql(); const { id } = await params; const rows = await db`SELECT * FROM patients WHERE id = ${id}`; const patient = Array.isArray(rows) ? rows[0] : null; return patient ? NextResponse.json({ patient, source: "neon" }) : NextResponse.json({ error: "Patient not found" }, { status: 404 }); }
  catch (error) { console.error("patient_read_failed", error); return NextResponse.json({ error: "Database unavailable" }, { status: 503 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const db = sql(); const { id } = await params; const body = await request.json(); const rows = await db`UPDATE patients SET full_name = COALESCE(${body.fullName ?? null}, full_name), external_identifier = COALESCE(${body.externalIdentifier ?? null}, external_identifier), date_of_birth = COALESCE(${body.dateOfBirth ?? null}, date_of_birth), sex = COALESCE(${body.sex ?? null}, sex), phone = COALESCE(${body.phone ?? null}, phone) WHERE id = ${id} RETURNING *`; const patient = Array.isArray(rows) ? rows[0] : null; return patient ? NextResponse.json({ patient, source: "neon" }) : NextResponse.json({ error: "Patient not found" }, { status: 404 }); }
  catch (error) { console.error("patient_update_failed", error); return NextResponse.json({ error: "Unable to update patient" }, { status: 500 }); }
}
