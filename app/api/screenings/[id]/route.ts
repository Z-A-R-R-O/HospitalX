import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = sql();
    
    // Check if params is resolved correctly (in Next 15 it might be a promise but we assume standard structure here)
    const { id } = await params;
    
    const screenings = (await db`
      SELECT s.*, p.full_name as patient_name
      FROM screenings s
      JOIN patients p ON s.patient_id = p.id
      WHERE s.id = ${id}
    `) as any[];

    if (screenings.length === 0) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 });
    }
    
    return NextResponse.json({ screening: screenings[0], source: "neon" });
  } catch (error: any) {
    console.error("GET screening error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = sql();
    const { id } = await params;
    const body = await req.json();

    const current = (await db`SELECT * FROM screenings WHERE id = ${id}`) as any[];
    if (current.length === 0) {
      return NextResponse.json({ error: "Screening not found" }, { status: 404 });
    }

    const { status, total_score, max_score, risk_level, responses, observations, completed_at } = body;

    const res = (await db`
      UPDATE screenings
      SET 
        status = COALESCE(${status}, status),
        total_score = COALESCE(${total_score}, total_score),
        max_score = COALESCE(${max_score}, max_score),
        risk_level = COALESCE(${risk_level}, risk_level),
        responses = COALESCE(${responses ? JSON.stringify(responses) : null}::jsonb, responses),
        observations = COALESCE(${observations ? JSON.stringify(observations) : null}::jsonb, observations),
        completed_at = COALESCE(${completed_at}, completed_at)
      WHERE id = ${id}
      RETURNING *
    `) as any[];

    return NextResponse.json({ screening: res[0], source: "neon" });
  } catch (error: any) {
    console.error("PATCH screening error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
