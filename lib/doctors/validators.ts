/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { cleanText } from "@/lib/validations";
import { CreateDoctorInput } from "./types";
export function validateCreateDoctor(body: Partial<CreateDoctorInput>) {
  const fullName = cleanText(body.fullName, 160);
  const specialty = cleanText(body.specialty, 100);
  
  if (!fullName || !specialty) {
    throw new Error("Name and Specialty required");
  }
  return {
    fullName,
    specialty,
    role: cleanText(body.role, 100) || 'Consultant',
    shiftStart: cleanText(body.shiftStart, 10) || '09:00:00',
    shiftEnd: cleanText(body.shiftEnd, 10) || '17:00:00',
    location: cleanText(body.location, 100) || 'OPD',
  };
}
