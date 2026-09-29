import { NextResponse } from "next/server";
import { requireOrganizationContext, AuthenticationError, OrganizationContextError } from "@/lib/request-context";
import { requirePermission, UnauthorizedError } from "@/lib/permissions";
import { runReliabilityLab } from "@/lib/reliability/runner";

export const runtime = "nodejs";

/** Runs only against the dedicated deterministic demo tenant, never the caller's organization. */
export async function POST() {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, "staff:write");
    return NextResponse.json(await runReliabilityLab());
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof OrganizationContextError || error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("reliability_lab_failed", error);
    return NextResponse.json({ error: "Reliability run unavailable." }, { status: 503 });
  }
}
