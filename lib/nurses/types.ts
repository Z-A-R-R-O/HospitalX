/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export interface Nurse {
  id: string;
  organization_id: string;
  full_name: string;
  role: string;
  ward: string;
  shift_start: string;
  shift_end: string;
  status: string;
  patient_load: number;
  created_at: Date;
}
export interface CreateNurseInput {
  fullName: string;
  role: string;
  ward?: string;
  shiftStart?: string;
  shiftEnd?: string;
  patientLoad?: string | number;
}
