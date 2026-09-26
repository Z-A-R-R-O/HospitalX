import { NextResponse } from "next/server";
import { getOrganizationContext } from "@/lib/request-context";
import { cleanText, ensurePatientSchedulingSchema } from "@/lib/patient-scheduling";
import { mockAppointments } from "@/lib/demo-backend";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ appointments: mockAppointments });
  }

  try {
    const db = await ensurePatientSchedulingSchema();
    const url = new URL(request.url);
    const dateStr = url.searchParams.get("date");
    
    let appointments;
    if (dateStr) {
      appointments = await db`SELECT * FROM appointments 
        WHERE organization_id = ${context.organizationId} 
        AND starts_at::date = ${dateStr}::date
        ORDER BY starts_at ASC LIMIT 200`;
    } else {
      appointments = await db`SELECT * FROM appointments 
        WHERE organization_id = ${context.organizationId} 
        AND starts_at >= CURRENT_DATE - INTERVAL '1 day'
        ORDER BY starts_at ASC LIMIT 100`;
    }
    
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("appointments_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ appointment: { id: "DEMO-APT-" + Math.floor(Math.random()*1000) } }, { status: 201 });
  }
  
  try {
    const body = await request.json();
    const patientId = cleanText(body.patientId, 50);
    const fullName = cleanText(body.fullName, 160);
    const providerId = cleanText(body.providerId, 50);
    const providerName = cleanText(body.providerName, 160);
    const type = cleanText(body.type, 50);
    const startsAt = cleanText(body.startsAt, 50);
    const duration = parseInt(body.durationMinutes) || 30;
    
    if (!patientId || !startsAt || !providerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const db = await ensurePatientSchedulingSchema();
    
    const result = await db`INSERT INTO appointments (organization_id, patient_id, full_name, provider_id, provider_name, appointment_type, starts_at, duration_minutes, status, priority) 
      VALUES (${context.organizationId}, ${patientId}, ${fullName}, ${providerId}, ${providerName}, ${type}, ${startsAt}, ${duration}, 'scheduled', 'normal') 
      RETURNING *`;
      
    const appointment = (Array.isArray(result) ? result[0] : null) as { id?: string } | null;
    
    await db`INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, details)
      VALUES (${context.organizationId}, ${context.userId}, 'appointment_booked', 'appointment', ${appointment?.id}, ${JSON.stringify({ type })})`;
      
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("appointment_create_failed", error);
    return NextResponse.json({ error: "Unable to create appointment" }, { status: 500 });
  }
}
