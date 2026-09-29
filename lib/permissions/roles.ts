/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export type HospitalRole = 
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'health_worker';
export type Permission = 
  | 'patients:read'
  | 'patients:write'
  | 'appointments:read'
  | 'appointments:write'
  | 'clinical_notes:read'
  | 'clinical_notes:write'
  | 'billing:read'
  | 'billing:write'
  | 'inventory:read'
  | 'inventory:write'
  | 'staff:read'
  | 'staff:write';
export const ROLE_PERMISSIONS: Record<HospitalRole, Permission[]> = {
  admin: [
    'patients:read', 'patients:write',
    'appointments:read', 'appointments:write',
    'clinical_notes:read', 'billing:read', 'billing:write',
    'inventory:read', 'inventory:write', 'staff:read', 'staff:write'
  ],
  doctor: [
    'patients:read', 'appointments:read', 'appointments:write',
    'clinical_notes:read', 'clinical_notes:write', 'inventory:read'
  ],
  nurse: [
    'patients:read', 'appointments:read', 
    'clinical_notes:read', 'clinical_notes:write', 'inventory:read'
  ],
  receptionist: [
    'patients:read', 'patients:write',
    'appointments:read', 'appointments:write', 'billing:read', 'billing:write'
  ],
  health_worker: [
    'patients:read', 'patients:write', 'appointments:read'
  ]
};
