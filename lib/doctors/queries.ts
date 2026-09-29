/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { ensurePatientSchedulingSchema } from "@/db/schema/legacy";
import { Doctor } from "./types";
import { mockDoctors } from "@/lib/demo-backend";
export async function getDoctors(organizationId: string): Promise<Doctor[]> {
  if (!process.env.DATABASE_URL) {
    return mockDoctors as unknown as Doctor[];
  }
  const db = await ensurePatientSchedulingSchema();
  const doctors = await db`
    SELECT d.*, 
      (SELECT COUNT(*) FROM appointments a WHERE a.provider_name = d.full_name AND a.starts_at::date = CURRENT_DATE) as today_appointments,
      (SELECT COUNT(*) FROM appointments a WHERE a.provider_name = d.full_name AND a.status = 'completed' AND a.starts_at::date = CURRENT_DATE) as completed_appointments
    FROM doctors d 
    WHERE d.organization_id = ${organizationId}
    ORDER BY d.created_at DESC LIMIT 100
  `;
  
  return doctors as Doctor[];
}
