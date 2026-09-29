/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { ensurePatientSchedulingSchema } from "@/db/schema/legacy";
import { Nurse } from "./types";
import { mockNurses } from "@/lib/demo-backend";
export async function getNurses(organizationId: string): Promise<Nurse[]> {
  if (!process.env.DATABASE_URL) {
    return mockNurses as unknown as Nurse[];
  }
  const db = await ensurePatientSchedulingSchema();
  const nurses = await db`
    SELECT * FROM nurses 
    WHERE organization_id = ${organizationId}
    ORDER BY created_at DESC LIMIT 100
  `;
  
  return nurses as Nurse[];
}
