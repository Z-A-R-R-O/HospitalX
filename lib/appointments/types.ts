/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export interface Appointment {
  id: string;
  organization_id: string;
  patient_id: string;
  full_name: string;
  provider_id: string;
  provider_name: string;
  appointment_type: string;
  status: string;
  priority: string;
  starts_at: string;
  duration_minutes: number;
  created_at: Date;
}
export interface CreateAppointmentInput {
  patientId: string;
  fullName: string;
  providerId: string;
  providerName: string;
  type: string;
  startsAt: string;
  durationMinutes?: string | number;
  idempotencyKey?: string;
}
