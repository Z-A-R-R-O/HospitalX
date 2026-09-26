import { auth } from "@clerk/nextjs/server";

export type OrganizationContext = {
  userId: string | null;
  organizationId: string | null;
  role: string | null;
};

export async function getOrganizationContext(): Promise<OrganizationContext> {
  try {
    const { userId, orgId, orgRole } = await auth();
    if (userId) {
      return { userId, organizationId: orgId ?? "city-care", role: orgRole ?? null };
    }
  } catch(e) {}
  
  // Fallback for local demo mode without Clerk setup
  return { userId: "demo-user", organizationId: "city-care", role: "admin" };
}
