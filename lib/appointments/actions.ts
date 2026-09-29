/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { sql } from "@/db/client";
import { Appointment, CreateAppointmentInput } from "./types";
import { validateCreateAppointment } from "./validators";

export async function createAppointment(
  organizationId: string,
  userId: string | undefined,
  input: Partial<CreateAppointmentInput>
): Promise<Appointment> {
  if (!process.env.DATABASE_URL) {
    return { id: "DEMO-APT-" + Math.floor(Math.random()*1000) } as Appointment;
  }
  const valid = validateCreateAppointment(input);
  const db = sql();
  const idempotencyKey = valid.idempotencyKey || crypto.randomUUID();
  // Canonical appointment workflow starts with REQUESTED.
  const status = (input as any).status || 'REQUESTED';
  const result = await db`
    INSERT INTO appointments (
      idempotency_key, organization_id, patient_id, full_name, provider_id, 
      provider_name, appointment_type, starts_at, duration_minutes, status, priority
    ) VALUES (
      ${idempotencyKey}, ${organizationId}, ${valid.patientId}, ${valid.fullName}, 
      ${valid.providerId}, ${valid.providerName}, ${valid.type}, ${valid.startsAt}, 
      ${valid.durationMinutes}, ${status}, 'normal'
    ) 
    ON CONFLICT (idempotency_key) DO UPDATE SET status = EXCLUDED.status
    RETURNING *
  `;
    
  const appointment = (Array.isArray(result) ? result[0] : null) as Appointment;
  
  if (appointment && userId) {
    await db`
      INSERT INTO audit_events (
        organization_id, user_id, action, resource_type, resource_id, details
      ) VALUES (
        ${organizationId}, ${userId}, 'appointment_booked', 'appointment', 
        ${appointment.id}, ${JSON.stringify({ type: valid.type, status })}
      )
    `;
  }
    
  return appointment;
}
export async function updateAppointmentStatus(
  organizationId: string,
  userId: string,
  appointmentId: string,
  status: string
): Promise<Appointment> {
  const db = sql();
  const result = await db`
    UPDATE appointments 
    SET status = ${status} 
    WHERE id = ${appointmentId} AND organization_id = ${organizationId} 
    RETURNING *
  `;
  const appointment = (Array.isArray(result) ? result[0] : null) as Appointment;
  
  if (appointment) {
    await db`
      INSERT INTO audit_events (
        organization_id, user_id, action, resource_type, resource_id, details
      ) VALUES (
        ${organizationId}, ${userId}, 'appointment_status_changed', 'appointment', 
        ${appointment.id}, ${JSON.stringify({ status })}
      )
    `;
  }
  return appointment;
}

