/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { sql } from "@/db/client";
import { Appointment } from "./types";
import { mockAppointments } from "@/lib/demo-backend";
export async function getAppointments(organizationId: string, dateStr?: string | null): Promise<Appointment[]> {
  if (!process.env.DATABASE_URL) {
    return mockAppointments as unknown as Appointment[];
  }
  const db = sql();
  
  if (dateStr) {
    const appointments = await db`
      SELECT * FROM appointments 
      WHERE organization_id = ${organizationId} 
      AND starts_at::date = ${dateStr}::date
      ORDER BY starts_at ASC LIMIT 200
    `;
    return appointments as Appointment[];
  } else {
    const appointments = await db`
      SELECT * FROM appointments 
      WHERE organization_id = ${organizationId} 
      AND starts_at >= CURRENT_DATE - INTERVAL '1 day'
      ORDER BY starts_at ASC LIMIT 100
    `;
    return appointments as Appointment[];
  }
}
