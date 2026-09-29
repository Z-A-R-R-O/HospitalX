import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { DEMO_ORGANIZATION } from "@/lib/demo/seed";
import { requireOrganizationContext, AuthenticationError, OrganizationContextError } from "@/lib/request-context";
import { requirePermission, UnauthorizedError } from "@/lib/permissions";

export const runtime = "nodejs";

export async function GET() {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, "staff:read");
    const db = sql();
    const [runs, events, audits, patients] = await Promise.all([
      db`SELECT scenario_count, passed_count, event_count, audit_count, generated_at FROM reliability_runs WHERE tenant_id = ${DEMO_ORGANIZATION} ORDER BY generated_at DESC LIMIT 1`,
      db`SELECT count(*)::int AS count FROM domain_events WHERE organization_id = ${DEMO_ORGANIZATION}`,
      db`SELECT count(*)::int AS count FROM audit_events WHERE organization_id = ${DEMO_ORGANIZATION}`,
      db`SELECT id, full_name FROM patients WHERE organization_id = ${DEMO_ORGANIZATION} ORDER BY created_at LIMIT 1`,
    ]);
    const latest = Array.isArray(runs) ? runs[0] as Record<string, unknown> | undefined : undefined;
    const count = (value: unknown) => Number((Array.isArray(value) ? value[0] as { count?: number } | undefined : undefined)?.count ?? 0);
    const hero = Array.isArray(patients) ? patients[0] as Record<string, unknown> | undefined : undefined;
    return NextResponse.json({ tenant: DEMO_ORGANIZATION, heroPatient: hero ? { id: hero.id, name: hero.full_name } : null, persistedEvents: count(events), persistedAudits: count(audits), latestRun: latest ? { scenarios: Number(latest.scenario_count), passed: Number(latest.passed_count), events: Number(latest.event_count), audits: Number(latest.audit_count), generatedAt: latest.generated_at } : null });
  } catch (error) {
    if (error instanceof AuthenticationError) return NextResponse.json({ error: error.message }, { status: 401 });
    if (error instanceof OrganizationContextError || error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 403 });
    console.error("judge_metrics_failed", error);
    return NextResponse.json({ error: "Judge metrics unavailable." }, { status: 503 });
  }
}
