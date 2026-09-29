/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { OrganizationContext } from "@/lib/request-context";
import { Permission } from "./roles";
import { hasPermission } from "./policies";
export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
/**
 * Enforces a clinical safety or data boundary.
 * Throws an UnauthorizedError if the context role lacks the required permission.
 */
export function requirePermission(context: OrganizationContext, permission: Permission) {
  if (!hasPermission(context.role, permission)) {
    console.error(`[SECURITY GUARD] Blocked attempt: Role '${context.role}' lacks permission '${permission}' for user '${context.userId}' in org '${context.organizationId}'`);
    throw new UnauthorizedError(`Your role (${context.role || 'none'}) is not authorized to perform this action.`);
  }
}

export function requireRole(context: OrganizationContext, roles: string[]) {
  if (!context.role || !roles.map((role) => role.toLowerCase()).includes(context.role)) {
    throw new UnauthorizedError(`Your role (${context.role || "none"}) is not authorized to perform this action.`);
  }
}

