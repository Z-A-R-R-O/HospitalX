/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { cleanText } from "@/lib/validations";
import { CreateNurseInput } from "./types";
export function validateCreateNurse(body: Partial<CreateNurseInput>) {
  const fullName = cleanText(body.fullName, 160);
  const role = cleanText(body.role, 100);
  
  if (!fullName || !role) {
    throw new Error("Name and Role required");
  }
  return {
    fullName,
    role,
    ward: cleanText(body.ward, 100) || 'General',
    shiftStart: cleanText(body.shiftStart, 10) || '07:00:00',
    shiftEnd: cleanText(body.shiftEnd, 10) || '15:00:00',
    patientLoad: parseInt(String(body.patientLoad)) || 0,
  };
}
