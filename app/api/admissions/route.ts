import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try { const body = await request.json(); if (!body.patientId || !body.bedId) return NextResponse.json({ error: "patientId and bedId are required" }, { status: 400 }); const db = sql(); const beds = await db`SELECT id, status FROM beds WHERE id = ${body.bedId} FOR UPDATE`; const bed = Array.isArray(beds) ? beds[0] : null; if (!bed) return NextResponse.json({ error: "Bed not found" }, { status: 404 }); if (bed.status === "occupied") return NextResponse.json({ error: "Bed is already occupied" }, { status: 409 }); const rows = await db`UPDATE beds SET status = 'occupied', patient_id = ${body.patientId}, updated_at = now() WHERE id = ${body.bedId} RETURNING *`; return NextResponse.json({ admission: Array.isArray(rows) ? rows[0] : null, source: "neon" }, { status: 201 }); }
  catch (error) { console.error("admission_create_failed", error); return NextResponse.json({ error: "Unable to admit patient" }, { status: 500 }); }
}
