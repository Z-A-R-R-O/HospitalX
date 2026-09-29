/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export interface Doctor {
  id: string;
  organization_id: string;
  full_name: string;
  specialty: string;
  role: string;
  shift_start: string;
  shift_end: string;
  status: string;
  location: string;
  created_at: Date;
  today_appointments?: number;
  completed_appointments?: number;
}
export interface CreateDoctorInput {
  fullName: string;
  specialty: string;
  role?: string;
  shiftStart?: string;
  shiftEnd?: string;
  location?: string;
}
