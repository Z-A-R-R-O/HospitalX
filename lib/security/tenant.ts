import { sql } from "@/db/client";
import { OrganizationContext } from "@/lib/request-context";
import { UnauthorizedError } from "@/lib/permissions/guard";

/** Rejects a body attempting to select any tenant other than the signed-in tenant. */
export function assertPayloadOrganization(context: OrganizationContext, suppliedOrganizationId: unknown): void {
  if (typeof suppliedOrganizationId === "string" && suppliedOrganizationId && suppliedOrganizationId !== context.organizationId) {
    throw new UnauthorizedError("Organization boundary violated.");
  }
}

/** Best-effort audit: a denied request must never fail open if audit storage is unavailable. */
export async function recordSecurityEvent(context: OrganizationContext | undefined, eventType: string, details: Record<string, unknown>): Promise<void> {
  if (!context) return;
  try {
    const db = sql();
    await db`INSERT INTO audit_events (organization_id, user_id, event_type, actor, payload, result, source)
      VALUES (${context.organizationId}, ${context.userId}, ${eventType}, ${context.userId}, ${JSON.stringify(details)}::jsonb, 'DENIED', 'SECURITY_GUARD')`;
  } catch (error) {
    console.error("security_audit_write_failed", { eventType, error });
  }
}
