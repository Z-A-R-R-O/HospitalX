/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { auth } from "@clerk/nextjs/server";
export type OrganizationContext = {
  userId: string;
  organizationId: string;
  role: string | null;
};
/**
 * Validates the request context and extracts standard tenant routing parameters.
 * Throws an error or returns a clean object for unified data access.
 */
export async function requireOrganizationContext(): Promise<OrganizationContext> {
  let clerkAuth;
  try {
    clerkAuth = await auth();
  } catch(e) {}
  
  if (clerkAuth && clerkAuth.userId) {
    return { 
      userId: clerkAuth.userId, 
      organizationId: clerkAuth.orgId ?? "city-care", 
      role: clerkAuth.orgRole ?? null 
    };
  }
  
  throw new Error("Authentication required. No user context available.");
}
export async function getOrganizationContext(): Promise<Partial<OrganizationContext>> {
  try {
    return await requireOrganizationContext();
  } catch (e) {
    return {};
  }
}
