import { NextResponse } from "next/server";
import { seedDemoTenant } from "@/lib/demo/seed";
import { requireOrganizationContext, AuthenticationError, OrganizationContextError } from "@/lib/request-context";
import { requirePermission, UnauthorizedError } from "@/lib/permissions";

export const runtime = "nodejs";

/** Explicitly resets only the fixed demo tenant; it never accepts a tenant id. */
export async function POST() {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, "staff:write");
    return NextResponse.json(await seedDemoTenant());
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof OrganizationContextError || error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("demo_seed_failed", error);
    return NextResponse.json({ error: "Demo seed unavailable." }, { status: 503 });
  }
}
