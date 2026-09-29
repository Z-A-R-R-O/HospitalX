/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { cleanText } from "@/lib/validations";
import { CreatePatientInput } from "./types";
export function validateCreatePatient(body: Partial<CreatePatientInput>) {
  const fullName = cleanText(body.fullName, 160);
  const dob = cleanText(body.dateOfBirth, 10);
  
  if (!fullName || !dob) {
    throw new Error("Name and DOB required");
  }
  return {
    fullName,
    dob,
    sex: cleanText(body.sex, 20),
    phone: cleanText(body.phone, 20),
    priority: cleanText(body.priority, 20) || 'normal',
    age: parseInt(String(body.age)) || null,
    bloodGroup: cleanText(body.bloodGroup, 5),
    primaryComplaint: cleanText(body.primaryComplaint, 500),
    email: cleanText(body.email, 100),
    address: cleanText(body.address, 500),
    emergencyContact: cleanText(body.emergencyContact, 100),
    medicalHistory: cleanText(body.medicalHistory, 1000),
    idempotencyKey: body.idempotencyKey || null,
  };
}
