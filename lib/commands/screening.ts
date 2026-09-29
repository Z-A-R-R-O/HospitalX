import { CommandContext, handleCommand } from "./handler";
import { recordSecurityEvent } from "@/lib/security/tenant";
import { UnauthorizedError } from "@/lib/permissions/guard";

type ScreeningInput = { patientId: string; status?: string; totalScore?: number; maxScore?: number; riskLevel?: string; responses?: any; observations?: any; durationSeconds?: number; completedAt?: string; idempotencyKey?: string };
type ScreeningResponse = { screening: Record<string, unknown> };

async function persistScreening(context: CommandContext, input: ScreeningInput): Promise<ScreeningResponse | null> {
  const { db, organization, idempotencyKey, correlationId } = context;
  const eventId = crypto.randomUUID();
  const eventHash = "PENDING";
  
  const patients = await db`SELECT id FROM patients WHERE id = ${input.patientId} AND organization_id = ${organization.organizationId}`;
  if (!Array.isArray(patients) || !patients[0]) {
    await recordSecurityEvent(organization, "TENANT_ACCESS_DENIED", { resource: "patient", requestedId: input.patientId });
    throw new UnauthorizedError("Organization boundary violated.");
  }
  
  const rows = await db`
    WITH inserted AS (
      INSERT INTO screenings (idempotency_key, patient_id, worker_id, organization_id, status, total_score, max_score, risk_level, responses, observations, duration_seconds, completed_at)
      VALUES (${idempotencyKey}, ${input.patientId}, ${organization.userId}, ${organization.organizationId}, ${input.status || "in_progress"}, ${input.totalScore || null}, ${input.maxScore || null}, ${input.riskLevel || null}, ${input.responses ? JSON.stringify(input.responses) : "[]"}::jsonb, ${input.observations ? JSON.stringify(input.observations) : "[]"}::jsonb, ${input.durationSeconds || null}, ${input.completedAt || null})
      ON CONFLICT (idempotency_key) DO UPDATE SET status = EXCLUDED.status, total_score = EXCLUDED.total_score, risk_level = EXCLUDED.risk_level
      RETURNING *
    ), event_written AS (
      INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
      SELECT ${eventId}, 'SCREENING_CREATED', 'screening', inserted.id::text, ${organization.organizationId}, ${organization.userId}, ${organization.role ?? 'unknown'}, ${idempotencyKey}, 1, now(), 'ONLINE', ${correlationId},
        jsonb_build_object('command', 'screening.create', 'response', jsonb_build_object('screening', to_jsonb(inserted))), ${eventHash}
      FROM inserted
      ON CONFLICT (organization_id, idempotency_key) DO NOTHING
      RETURNING id
    ), audit_written AS (
      INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, event_type, actor, payload)
      SELECT ${organization.organizationId}, ${organization.userId}, 'screening_created', 'screening', inserted.id, 'SCREENING_CREATED', ${organization.userId}, jsonb_build_object('idempotencyKey', ${idempotencyKey})
      FROM inserted JOIN event_written ON true
      RETURNING id
    )
    SELECT to_jsonb(inserted) AS screening FROM inserted JOIN event_written ON true JOIN audit_written ON true
  `;
  
  const first = (Array.isArray(rows) ? rows[0] : undefined) as { screening?: unknown } | undefined;
  const screening = first?.screening;
  return screening ? { screening: typeof screening === "string" ? JSON.parse(screening) : screening as Record<string, unknown> } : null;
}

export function createScreening(request: Request) {
  return handleCommand<ScreeningInput, ScreeningResponse>(request, {
    permission: "patients:write",
    validate: (body: any) => {
      if (!body?.patient_id && !body?.patientId) throw new Error("patient_id is required");
      return {
        patientId: body.patient_id || body.patientId,
        status: body.status,
        totalScore: body.total_score || body.totalScore,
        maxScore: body.max_score || body.maxScore,
        riskLevel: body.risk_level || body.riskLevel,
        responses: body.responses,
        observations: body.observations,
        durationSeconds: body.duration_seconds || body.durationSeconds,
        completedAt: body.completed_at || body.completedAt,
        idempotencyKey: body.idempotency_key || body.idempotencyKey,
      };
    },
    persist: persistScreening,
  });
}
