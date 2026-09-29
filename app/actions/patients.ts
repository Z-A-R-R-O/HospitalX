"use server";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
import { getPatients, createPatient, Patient } from "@/lib/patients";
import { revalidatePath } from "next/cache";
// These actions run securely on the server and return strongly-typed data directly to React components.
export async function fetchPatientsAction(): Promise<Patient[]> {
  const context = await requireOrganizationContext();
  requirePermission(context, 'patients:read');
  
  return getPatients(context.organizationId);
}
export async function createPatientAction(formData: FormData): Promise<Patient> {
  const context = await requireOrganizationContext();
  requirePermission(context, 'patients:write');
  const input = {
    fullName: formData.get("fullName") as string,
    externalIdentifier: formData.get("externalIdentifier") as string,
    dateOfBirth: formData.get("dateOfBirth") as string,
    sex: formData.get("sex") as string,
    phone: formData.get("phone") as string,
  };
  const patient = await createPatient(context.organizationId, context.userId, input);
  
  // Instantly invalidate the frontend cache so the UI updates
  revalidatePath('/health-worker/screen');
  revalidatePath('/command');
  
  return patient;
}
