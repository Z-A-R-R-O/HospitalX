import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const db = sql();
    const url = new URL(req.url);
    const limit = url.searchParams.get("limit") ? parseInt(url.searchParams.get("limit") as string, 10) : 100;
    
    const screenings = await db`
      SELECT s.*, p.full_name as patient_name
      FROM screenings s
      JOIN patients p ON s.patient_id = p.id
      ORDER BY s.created_at DESC
      LIMIT ${limit}
    `;
    
    return NextResponse.json({ screenings, source: "neon" });
  } catch (error: any) {
    console.error("GET screenings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = sql();
    const body = await req.json();

    const {
      patient_id,
      worker_id,
      organization_id,
      status,
      total_score,
      max_score,
      risk_level,
      responses,
      observations,
      duration_seconds,
      completed_at
    } = body;

    if (!patient_id || !worker_id || !organization_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const idempotencyKey = crypto.randomUUID();

    const res = (await db`
      INSERT INTO screenings (
        idempotency_key, patient_id, worker_id, organization_id, status,
        total_score, max_score, risk_level, responses, observations,
        duration_seconds, completed_at
      )
      VALUES (
        ${idempotencyKey}, ${patient_id}, ${worker_id}, ${organization_id}, ${status || 'in_progress'},
        ${total_score || null}, ${max_score || null}, ${risk_level || null},
        ${responses ? JSON.stringify(responses) : '[]'}::jsonb,
        ${observations ? JSON.stringify(observations) : '[]'}::jsonb,
        ${duration_seconds || null}, ${completed_at || null}
      )
      RETURNING *
    `) as any[];

    await db`
      INSERT INTO audit_events (event_type, actor, payload)
      VALUES ('screening_created', ${worker_id}, ${JSON.stringify({ screening_id: res[0].id })}::jsonb)
    `;

    return NextResponse.json({ screening: res[0], source: "neon" }, { status: 201 });
  } catch (error: any) {
    console.error("POST screenings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
