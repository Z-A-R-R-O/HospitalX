import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { cleanText, ensurePatientSchedulingSchema } from "@/lib/patient-scheduling";
import { mockNurses } from "@/lib/demo-backend";

export const runtime = "nodejs";

export async function GET() {
  const context = await requireOrganizationContext();
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ nurses: mockNurses });
  }
  
  try {
    const db = await ensurePatientSchedulingSchema();
    const nurses = await db`SELECT * FROM nurses 
      WHERE organization_id = ${context.organizationId}
      ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ nurses });
  } catch (error) {
    console.error("nurses_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ nurse: { id: "DEMO-NUR-" + Math.floor(Math.random()*1000) } }, { status: 201 });
  }
  
  try {
    const body = await request.json();
    const fullName = cleanText(body.fullName, 160);
    const role = cleanText(body.role, 100);
    const ward = cleanText(body.ward, 100);
    const shiftStart = cleanText(body.shiftStart, 10);
    const shiftEnd = cleanText(body.shiftEnd, 10);
    const patientLoad = parseInt(body.patientLoad) || 0;
    
    if (!fullName || !role) return NextResponse.json({ error: "Name and Role required" }, { status: 400 });
    
    const db = await ensurePatientSchedulingSchema();
    
    const result = await db`INSERT INTO nurses (organization_id, full_name, role, ward, shift_start, shift_end, patient_load) 
      VALUES (${context.organizationId}, ${fullName}, ${role}, ${ward || 'General'}, ${shiftStart || '07:00:00'}, ${shiftEnd || '15:00:00'}, ${patientLoad}) 
      RETURNING *`;
      
    const nurse = (Array.isArray(result) ? result[0] : null) as { id?: string } | null;
    return NextResponse.json({ nurse }, { status: 201 });
  } catch (error) {
    console.error("nurse_create_failed", error);
    return NextResponse.json({ error: "Unable to create nurse" }, { status: 500 });
  }
}
