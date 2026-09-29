/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { ensurePatientSchedulingSchema } from "@/db/schema/legacy";
import { CreateDoctorInput, Doctor } from "./types";
import { validateCreateDoctor } from "./validators";
export async function createDoctor(
  organizationId: string,
  input: Partial<CreateDoctorInput>
): Promise<Doctor> {
  if (!process.env.DATABASE_URL) {
    return { id: "DEMO-DOC-" + Math.floor(Math.random()*1000) } as Doctor;
  }
  const valid = validateCreateDoctor(input);
  const db = await ensurePatientSchedulingSchema();
  const result = await db`
    INSERT INTO doctors (
      organization_id, full_name, specialty, role, shift_start, shift_end, location
    ) VALUES (
      ${organizationId}, ${valid.fullName}, ${valid.specialty}, 
      ${valid.role}, ${valid.shiftStart}, ${valid.shiftEnd}, ${valid.location}
    ) 
    RETURNING *
  `;
    
  return (Array.isArray(result) ? result[0] : null) as Doctor;
}
