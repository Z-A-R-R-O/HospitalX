/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export interface Patient {
  id: string;
  organization_id: string;
  idempotency_key?: string | null;
  full_name: string;
  date_of_birth: string;
  sex?: string | null;
  phone?: string | null;
  status: string;
  priority: string;
  age?: number | null;
  blood_group?: string | null;
  primary_complaint?: string | null;
  email?: string | null;
  address?: string | null;
  emergency_contact?: string | null;
  medical_history?: string | null;
  created_at: Date;
}
export interface CreatePatientInput {
  fullName: string;
  dateOfBirth: string;
  sex?: string;
  phone?: string;
  priority?: string;
  age?: string | number;
  bloodGroup?: string;
  primaryComplaint?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  idempotencyKey?: string;
}
