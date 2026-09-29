/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { ensurePatientSchedulingSchema } from "@/db/schema/legacy";
import { Patient } from "./types";
import { mockPatients } from "@/lib/demo-backend";
export async function getPatients(organizationId: string): Promise<Patient[]> {
  if (!process.env.DATABASE_URL) {
    return mockPatients as unknown as Patient[];
  }
  
  const db = await ensurePatientSchedulingSchema();
  const patients = await db`
    SELECT * FROM patients 
    WHERE organization_id = ${organizationId}
    ORDER BY created_at DESC LIMIT 100
  `;
  
  return patients as Patient[];
}
