/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { ensurePatientSchedulingSchema } from "@/db/schema/legacy";
import { CreatePatientInput, Patient } from "./types";
import { validateCreatePatient } from "./validators";
export async function createPatient(
  organizationId: string, 
  userId: string | undefined, 
  input: Partial<CreatePatientInput>
): Promise<Patient> {
  if (!process.env.DATABASE_URL) {
    return { id: "DEMO-" + Math.floor(Math.random() * 1000) } as Patient;
  }
  const valid = validateCreatePatient(input);
  const db = await ensurePatientSchedulingSchema();
  
  let result;
  if (valid.idempotencyKey) {
     result = await db`INSERT INTO patients (
       idempotency_key, organization_id, full_name, date_of_birth, sex, 
       phone, status, priority, age, blood_group, primary_complaint, 
       email, address, emergency_contact, medical_history
     ) VALUES (
       ${valid.idempotencyKey}, ${organizationId}, ${valid.fullName}, ${valid.dob}, 
       ${valid.sex}, ${valid.phone}, 'active', ${valid.priority}, ${valid.age}, 
       ${valid.bloodGroup}, ${valid.primaryComplaint}, ${valid.email}, ${valid.address}, 
       ${valid.emergencyContact}, ${valid.medicalHistory}
     ) 
     ON CONFLICT (idempotency_key) DO UPDATE SET full_name = EXCLUDED.full_name
     RETURNING *`;
  } else {
     // Check for duplicate by phone or external ID
     if (valid.phone || (valid as any).externalIdentifier) {
       const duplicateCheck = await db`
         SELECT * FROM patients 
         WHERE organization_id = ${organizationId} 
         AND (
           (phone IS NOT NULL AND phone = ${valid.phone}) 
           OR 
           (external_identifier IS NOT NULL AND external_identifier = ${(valid as any).externalIdentifier || null})
         )
         LIMIT 1
       `;
       if (Array.isArray(duplicateCheck) && duplicateCheck.length > 0) {
         throw new Error("A patient with this phone number or external identifier already exists.");
       }
     }
  
     result = await db`INSERT INTO patients (
       organization_id, full_name, date_of_birth, sex, phone, 
       status, priority, age, blood_group, primary_complaint, email, 
       address, emergency_contact, medical_history
     ) VALUES (
       ${organizationId}, ${valid.fullName}, ${valid.dob}, ${valid.sex}, 
       ${valid.phone}, 'active', ${valid.priority}, ${valid.age}, 
       ${valid.bloodGroup}, ${valid.primaryComplaint}, ${valid.email}, 
       ${valid.address}, ${valid.emergencyContact}, ${valid.medicalHistory}
     ) 
     RETURNING *`;
  }
    
  const patient = (Array.isArray(result) ? result[0] : null) as Patient;
  
  if (patient && userId) {
    await db`INSERT INTO audit_events (
      organization_id, user_id, action, resource_type, resource_id, details
    ) VALUES (
      ${organizationId}, ${userId}, 'patient_registered', 'patient', 
      ${patient.id}, ${JSON.stringify({ priority: valid.priority })}
    )`;
  }
    
  return patient;
}
