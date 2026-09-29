/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { cleanText } from "@/lib/validations";
import { CreateAppointmentInput } from "./types";
export function validateCreateAppointment(body: Partial<CreateAppointmentInput>) {
  const patientId = cleanText(body.patientId, 50);
  const startsAt = cleanText(body.startsAt, 50);
  const providerId = cleanText(body.providerId, 50);
  
  if (!patientId || !startsAt || !providerId) {
    throw new Error("Missing required fields: patientId, startsAt, providerId");
  }
  return {
    patientId,
    fullName: cleanText(body.fullName, 160),
    providerId,
    providerName: cleanText(body.providerName, 160),
    type: cleanText(body.type, 50),
    startsAt,
    durationMinutes: parseInt(String(body.durationMinutes)) || 30,
    idempotencyKey: body.idempotencyKey || null,
  };
}
