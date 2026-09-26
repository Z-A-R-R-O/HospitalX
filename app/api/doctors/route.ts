import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { cleanText, ensurePatientSchedulingSchema } from "@/lib/patient-scheduling";
import { mockDoctors } from "@/lib/demo-backend";

export const runtime = "nodejs";

export async function GET() {
  const context = await requireOrganizationContext();
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ doctors: mockDoctors });
  }
  
  try {
    const db = await ensurePatientSchedulingSchema();
    const doctors = await db`SELECT d.*, 
      (SELECT COUNT(*) FROM appointments a WHERE a.provider_name = d.full_name AND a.starts_at::date = CURRENT_DATE) as today_appointments,
      (SELECT COUNT(*) FROM appointments a WHERE a.provider_name = d.full_name AND a.status = 'completed' AND a.starts_at::date = CURRENT_DATE) as completed_appointments
      FROM doctors d 
      WHERE d.organization_id = ${context.organizationId}
      ORDER BY d.created_at DESC LIMIT 100`;
    return NextResponse.json({ doctors });
  } catch (error) {
    console.error("doctors_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ doctor: { id: "DEMO-DOC-" + Math.floor(Math.random()*1000) } }, { status: 201 });
  }
  
  try {
    const body = await request.json();
    const fullName = cleanText(body.fullName, 160);
    const specialty = cleanText(body.specialty, 100);
    const role = cleanText(body.role, 100);
    const shiftStart = cleanText(body.shiftStart, 10);
    const shiftEnd = cleanText(body.shiftEnd, 10);
    const location = cleanText(body.location, 100);
    
    if (!fullName || !specialty) return NextResponse.json({ error: "Name and Specialty required" }, { status: 400 });
    
    const db = await ensurePatientSchedulingSchema();
    
    const result = await db`INSERT INTO doctors (organization_id, full_name, specialty, role, shift_start, shift_end, location) 
      VALUES (${context.organizationId}, ${fullName}, ${specialty}, ${role || 'Consultant'}, ${shiftStart || '09:00:00'}, ${shiftEnd || '17:00:00'}, ${location || 'OPD'}) 
      RETURNING *`;
      
    const doctor = (Array.isArray(result) ? result[0] : null) as { id?: string } | null;
    return NextResponse.json({ doctor }, { status: 201 });
  } catch (error) {
    console.error("doctor_create_failed", error);
    return NextResponse.json({ error: "Unable to create doctor" }, { status: 500 });
  }
}
