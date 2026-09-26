import { NextResponse } from "next/server";
import { getOrganizationContext } from "@/lib/request-context";
import { ensurePatientSchedulingSchema } from "@/lib/patient-scheduling";

export const runtime = "nodejs";

type SeedPatient = { id: string; full_name: string };

export async function POST(request: Request) {
  const context = await getOrganizationContext();
  if (!context.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const db = await ensurePatientSchedulingSchema();
    const orgId = context.organizationId || "city-care";

    // 1. Seed Doctors
    await db`INSERT INTO doctors (organization_id, full_name, specialty, role, shift_start, shift_end, location, status) VALUES 
      (${orgId}, 'Dr. Rajesh Sharma', 'Cardiology', 'Chief Medical Officer', '08:00', '16:00', 'OT 2', 'In Surgery'),
      (${orgId}, 'Dr. Priya Iyer', 'Neurology', 'Senior Consultant', '09:00', '17:00', 'OPD Room 4', 'Consulting'),
      (${orgId}, 'Dr. Amit Mehta', 'Orthopedics', 'Consultant', '10:00', '18:00', 'Staff Room A', 'Available'),
      (${orgId}, 'Dr. Kavita Nair', 'Pediatrics', 'Attending', '07:00', '15:00', 'General Ward A', 'Rounding')
      ON CONFLICT DO NOTHING;`;

    // 2. Seed Nurses
    await db`INSERT INTO nurses (organization_id, full_name, role, ward, shift_start, shift_end, patient_load, status) VALUES 
      (${orgId}, 'Sister Mary', 'Charge Nurse', 'Intensive Care (ICU)', '07:00', '15:00', 4, 'Active'),
      (${orgId}, 'Jacob Thomas', 'Staff Nurse', 'General Ward A', '07:00', '15:00', 12, 'Active'),
      (${orgId}, 'Anita Patel', 'Staff Nurse', 'Emergency (ER)', '07:00', '15:00', 8, 'Busy'),
      (${orgId}, 'Sarah Khan', 'Trainee Nurse', 'Pediatrics', '07:00', '15:00', 6, 'Active')
      ON CONFLICT DO NOTHING;`;

    // 3. Seed Patients
    const patients = await db`INSERT INTO patients (organization_id, full_name, date_of_birth, gender, contact_number, status, priority, age, blood_group, primary_complaint) VALUES 
      (${orgId}, 'Ananya Rao', '1992-05-14', 'female', '9876543210', 'active', 'normal', 32, 'O+', 'Chest pain and shortness of breath'),
      (${orgId}, 'Vikram Malhotra', '1968-11-22', 'male', '9876543211', 'active', 'high', 56, 'A-', 'Severe migraine and blurred vision'),
      (${orgId}, 'Priya Singh', '1990-03-10', 'female', '9876543212', 'active', 'normal', 34, 'B+', 'Joint pain and swelling in knees'),
      (${orgId}, 'Ramesh Das', '1962-08-05', 'male', '9876543213', 'active', 'high', 62, 'AB+', 'Uncontrolled diabetes and fatigue'),
      (${orgId}, 'Sunita Verma', '1979-12-01', 'female', '9876543214', 'active', 'normal', 45, 'O-', 'Routine cardiac follow-up')
      RETURNING id, full_name;` as SeedPatient[];

    // 4. Seed Appointments
    if (patients && patients.length >= 5) {
      await db`INSERT INTO appointments (organization_id, patient_id, full_name, provider_id, provider_name, appointment_type, starts_at, duration_minutes, status, priority) VALUES 
        (${orgId}, ${patients[0].id}, ${patients[0].full_name}, 'provider-1', 'Dr. Rajesh Sharma', 'In-Person', NOW() - INTERVAL '1 hour', 30, 'completed', 'normal'),
        (${orgId}, ${patients[1].id}, ${patients[1].full_name}, 'provider-2', 'Dr. Priya Iyer', 'Telehealth', NOW() + INTERVAL '30 minutes', 15, 'scheduled', 'high'),
        (${orgId}, ${patients[2].id}, ${patients[2].full_name}, 'provider-3', 'Dr. Amit Mehta', 'In-Person', NOW() + INTERVAL '1 hour', 45, 'scheduled', 'normal'),
        (${orgId}, ${patients[3].id}, ${patients[3].full_name}, 'provider-1', 'Dr. Rajesh Sharma', 'In-Person', NOW() - INTERVAL '10 minutes', 30, 'in_consultation', 'high'),
        (${orgId}, ${patients[4].id}, ${patients[4].full_name}, 'provider-1', 'Dr. Rajesh Sharma', 'In-Person', NOW() + INTERVAL '2 hours', 30, 'scheduled', 'normal')
        ON CONFLICT DO NOTHING;`;
    }

    return NextResponse.json({ success: true, message: "Demo data injected successfully across all unified tables." });
  } catch (error) {
    console.error("seed_failed", error);
    return NextResponse.json({ error: "Unable to seed demo data" }, { status: 500 });
  }
}
