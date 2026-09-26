import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const db = sql();
    
    const referrals = await db`
      SELECT r.*, p.full_name as patient_name, s.status as screening_status
      FROM referrals r
      JOIN patients p ON r.patient_id = p.id
      LEFT JOIN screenings s ON r.screening_id = s.id
      ORDER BY r.created_at DESC
    `;
    
    return NextResponse.json({ referrals, source: "neon" });
  } catch (error: any) {
    console.error("GET referrals error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = sql();
    const body = await req.json();

    const {
      screening_id,
      patient_id,
      worker_id,
      organization_id,
      specialty,
      urgency,
      reason,
      worker_notes,
      status
    } = body;

    if (!patient_id || !worker_id || !organization_id || !specialty || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const idempotencyKey = crypto.randomUUID();

    let appointmentId = null;
    if (urgency === 'urgent') {
      const appt = (await db`
        INSERT INTO appointments (patient_id, provider_name, appointment_type, status, starts_at)
        VALUES (${patient_id}, 'Assigned Specialist', ${specialty}, 'scheduled', now() + interval '1 day')
        RETURNING id
      `) as any[];
      appointmentId = appt[0].id;
    }

    const res = (await db`
      INSERT INTO referrals (
        idempotency_key, screening_id, patient_id, worker_id, organization_id,
        specialty, urgency, reason, worker_notes, status, appointment_id
      )
      VALUES (
        ${idempotencyKey}, ${screening_id || null}, ${patient_id}, ${worker_id}, ${organization_id},
        ${specialty}, ${urgency || 'routine'}, ${reason}, ${worker_notes || null}, ${status || 'pending'}, ${appointmentId}
      )
      RETURNING *
    `) as any[];

    return NextResponse.json({ referral: res[0], source: "neon" }, { status: 201 });
  } catch (error: any) {
    console.error("POST referrals error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
