import { auth } from "@clerk/nextjs/server";

export type OrganizationContext = {
  userId: string | null;
  organizationId: string | null;
  role: string | null;
};

export async function getOrganizationContext(): Promise<OrganizationContext> {
  const { userId, orgId, orgRole } = await auth();
  return { userId: userId ?? null, organizationId: orgId ?? null, role: orgRole ?? null };
}
