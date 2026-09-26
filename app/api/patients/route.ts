import { NextResponse } from "next/server";
import { getOrganizationContext } from "@/lib/request-context";
import { cleanText, ensurePatientSchedulingSchema } from "@/lib/patient-scheduling";
import { mockPatients } from "@/lib/demo-backend";

export const runtime = "nodejs";

export async function GET() {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ patients: mockPatients });
  }
  
  try {
    const db = await ensurePatientSchedulingSchema();
    const patients = await db`SELECT * FROM patients 
      WHERE organization_id = ${context.organizationId}
      ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json({ patients });
  } catch (error) {
    console.error("patients_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ patient: { id: "DEMO-" + Math.floor(Math.random()*1000) } }, { status: 201 });
  }
  
  try {
    const body = await request.json();
    const fullName = cleanText(body.fullName, 160);
    const dob = cleanText(body.dateOfBirth, 10);
    const gender = cleanText(body.gender, 20);
    const contact = cleanText(body.contactNumber, 20);
    const priority = cleanText(body.priority, 20) || 'normal';
    const age = parseInt(body.age) || null;
    const bloodGroup = cleanText(body.bloodGroup, 5);
    const primaryComplaint = cleanText(body.primaryComplaint, 500);
    const email = cleanText(body.email, 100);
    const address = cleanText(body.address, 500);
    const emergencyContact = cleanText(body.emergencyContact, 100);
    const medicalHistory = cleanText(body.medicalHistory, 1000);
    
    if (!fullName || !dob) return NextResponse.json({ error: "Name and DOB required" }, { status: 400 });
    
    const db = await ensurePatientSchedulingSchema();
    
    const result = await db`INSERT INTO patients (organization_id, full_name, date_of_birth, gender, contact_number, status, priority, age, blood_group, primary_complaint, email, address, emergency_contact, medical_history) 
      VALUES (${context.organizationId}, ${fullName}, ${dob}, ${gender}, ${contact}, 'active', ${priority}, ${age}, ${bloodGroup}, ${primaryComplaint}, ${email}, ${address}, ${emergencyContact}, ${medicalHistory}) 
      RETURNING *`;
      
    const patient = (Array.isArray(result) ? result[0] : null) as { id?: string } | null;
    
    await db`INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, details)
      VALUES (${context.organizationId}, ${context.userId}, 'patient_registered', 'patient', ${patient?.id}, ${JSON.stringify({ priority })})`;
      
    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error("patient_create_failed", error);
    return NextResponse.json({ error: "Unable to create patient" }, { status: 500 });
  }
}
