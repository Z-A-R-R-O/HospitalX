import { NextResponse } from "next/server";
import { sql } from "@/db/client";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
import { expectedVersion, VersionInputError, versionConflict } from "@/lib/concurrency/versioning";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireOrganizationContext();
    requirePermission(context, "staff:write");
    const { id } = await params;
    const body = await request.json();
    const version = expectedVersion(body);
    const db = sql();
    const rows = await db`UPDATE hospital_tasks SET text = COALESCE(${body.text ?? null}, text), severity = COALESCE(${body.severity ?? null}, severity), owner = COALESCE(${body.owner ?? null}, owner), resolved_at = CASE WHEN ${body.resolved === true} THEN now() WHEN ${body.resolved === false} THEN NULL ELSE resolved_at END, version = version + 1 WHERE id = ${id} AND organization_id = ${context.organizationId} AND version = ${version} RETURNING *`;
    if (Array.isArray(rows) && rows[0]) return NextResponse.json({ task: rows[0], source: "neon" });
    const current = await db`SELECT version FROM hospital_tasks WHERE id = ${id} AND organization_id = ${context.organizationId} LIMIT 1`;
    if (Array.isArray(current) && current[0]) return versionConflict(version, Number((current[0] as any).version));
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof VersionInputError) return NextResponse.json({ error: "INVALID_EXPECTED_VERSION", message: error.message }, { status: 400 });
    console.error("task_update_failed", error);
    return NextResponse.json({ error: "Unable to update task" }, { status: 500 });
  }
}
