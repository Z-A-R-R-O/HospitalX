import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const db = sql(); const { id } = await params; const body = await request.json(); const rows = await db`UPDATE beds SET status = COALESCE(${body.status ?? null}, status), patient_id = ${body.patientId === undefined ? null : body.patientId}, updated_at = now() WHERE id = ${id} RETURNING *`; const bed = Array.isArray(rows) ? rows[0] : null; return bed ? NextResponse.json({ bed, source: "neon" }) : NextResponse.json({ error: "Bed not found" }, { status: 404 }); }
  catch (error) { console.error("bed_update_failed", error); return NextResponse.json({ error: "Unable to update bed" }, { status: 500 }); }
}
