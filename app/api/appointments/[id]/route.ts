import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const db = sql(); const { id } = await params; const body = await request.json(); const rows = await db`UPDATE appointments SET provider_name = COALESCE(${body.providerName ?? null}, provider_name), appointment_type = COALESCE(${body.appointmentType ?? null}, appointment_type), status = COALESCE(${body.status ?? null}, status), starts_at = COALESCE(${body.startsAt ?? null}, starts_at) WHERE id = ${id} RETURNING *`; const appointment = Array.isArray(rows) ? rows[0] : null; return appointment ? NextResponse.json({ appointment, source: "neon" }) : NextResponse.json({ error: "Appointment not found" }, { status: 404 }); }
  catch (error) { console.error("appointment_update_failed", error); return NextResponse.json({ error: "Unable to update appointment" }, { status: 500 }); }
}
