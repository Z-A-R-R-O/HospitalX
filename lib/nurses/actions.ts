/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { ensurePatientSchedulingSchema } from "@/db/schema/legacy";
import { CreateNurseInput, Nurse } from "./types";
import { validateCreateNurse } from "./validators";
export async function createNurse(
  organizationId: string,
  input: Partial<CreateNurseInput>
): Promise<Nurse> {
  if (!process.env.DATABASE_URL) {
    return { id: "DEMO-NUR-" + Math.floor(Math.random()*1000) } as Nurse;
  }
  const valid = validateCreateNurse(input);
  const db = await ensurePatientSchedulingSchema();
  const result = await db`
    INSERT INTO nurses (
      organization_id, full_name, role, ward, shift_start, shift_end, patient_load
    ) VALUES (
      ${organizationId}, ${valid.fullName}, ${valid.role}, 
      ${valid.ward}, ${valid.shiftStart}, ${valid.shiftEnd}, ${valid.patientLoad}
    ) 
    RETURNING *
  `;
    
  return (Array.isArray(result) ? result[0] : null) as Nurse;
}
