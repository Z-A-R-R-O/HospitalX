import { auth } from "@clerk/nextjs/server";
import { AsyncLocalStorage } from "node:async_hooks";

import { HospitalRole } from "./permissions/roles";

export type OrganizationContext = { userId: string; organizationId: string; role: HospitalRole | null; facilityId?: string };

export class AuthenticationError extends Error { constructor(message = "Authentication required.") { super(message); this.name = "AuthenticationError"; } }
export class OrganizationContextError extends Error { constructor(message = "An active organization is required.") { super(message); this.name = "OrganizationContextError"; } }
export class FacilityContextError extends Error { constructor(message = "An active facility is required.") { super(message); this.name = "FacilityContextError"; } }

/**
 * Server-only test identity adapter. Allows the deterministic Lab
 * runner to execute scenarios under precise ORG_A/ORG_B boundaries
 * without ever reading test headers in production.
 */
export const labIdentity = new AsyncLocalStorage<OrganizationContext>();

/**
 * Resolves authority exclusively from the signed identity/session. Request
 * bodies must never select an organization or facility.
 */
export async function requireOrganizationContext(): Promise<OrganizationContext> {
  const testIdentity = labIdentity.getStore();
  if (testIdentity) return testIdentity;

  // Allow Playwright E2E testing to simulate a signed-in staff member without a real Clerk session.
  if (process.env.E2E_TEST === "true") {
    return { userId: "e2e-judge", organizationId: "e2e-org", role: "admin" };
  }

  let clerkAuth: Awaited<ReturnType<typeof auth>>;
  try { clerkAuth = await auth(); } catch { throw new AuthenticationError(); }
  if (!clerkAuth.userId) throw new AuthenticationError();
  if (!clerkAuth.orgId) throw new OrganizationContextError();
  const claims = clerkAuth.sessionClaims as Record<string, unknown> | null;
  const facilityId = typeof claims?.facility_id === "string" ? claims.facility_id : undefined;
  const rawRole = clerkAuth.orgRole;
  const role = rawRole ? (rawRole.replace("org:", "").toLowerCase() as HospitalRole) : null;
  return { userId: clerkAuth.userId, organizationId: clerkAuth.orgId, role, facilityId };
}

export async function requireFacilityContext(): Promise<OrganizationContext & { facilityId: string }> {
  const context = await requireOrganizationContext();
  if (!context.facilityId) throw new FacilityContextError();
  return { ...context, facilityId: context.facilityId };
}

export async function getOrganizationContext(): Promise<Partial<OrganizationContext>> {
  try { return await requireOrganizationContext(); } catch { return {}; }
}
