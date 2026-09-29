/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { HospitalRole, Permission, ROLE_PERMISSIONS } from "./roles";
export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  
  // Normalize clerk roles (e.g. org:admin -> admin) if necessary
  const normalizedRole = role.replace('org:', '').toLowerCase() as HospitalRole;
  
  const permissions = ROLE_PERMISSIONS[normalizedRole];
  if (!permissions) return false;
  
  return permissions.includes(permission);
}
export function canReadClinicalData(role: string | null): boolean {
  return hasPermission(role, 'clinical_notes:read');
}
export function canModifyBilling(role: string | null): boolean {
  return hasPermission(role, 'billing:write');
}
