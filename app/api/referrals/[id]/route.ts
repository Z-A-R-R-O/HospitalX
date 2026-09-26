import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = sql();
    const { id } = await params;
    
    const referrals = (await db`
      SELECT r.*, p.full_name as patient_name, s.status as screening_status
      FROM referrals r
      JOIN patients p ON r.patient_id = p.id
      LEFT JOIN screenings s ON r.screening_id = s.id
      WHERE r.id = ${id}
    `) as any[];

    if (referrals.length === 0) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }
    
    return NextResponse.json({ referral: referrals[0], source: "neon" });
  } catch (error: any) {
    console.error("GET referral error:", error);
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

    const current = (await db`SELECT * FROM referrals WHERE id = ${id}`) as any[];
    if (current.length === 0) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    const { status, appointment_id } = body;

    const res = (await db`
      UPDATE referrals
      SET 
        status = COALESCE(${status}, status),
        appointment_id = COALESCE(${appointment_id}, appointment_id)
      WHERE id = ${id}
      RETURNING *
    `) as any[];

    return NextResponse.json({ referral: res[0], source: "neon" });
  } catch (error: any) {
    console.error("PATCH referral error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
