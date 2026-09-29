import { CommandContext, handleCommand } from "./handler";
import { recordSecurityEvent } from "@/lib/security/tenant";
import { UnauthorizedError } from "@/lib/permissions/guard";

type ReferralInput = { screeningId?: string; patientId: string; specialty: string; urgency?: string; reason: string; workerNotes?: string; status?: string; idempotencyKey?: string };
type ReferralResponse = { referral: Record<string, unknown> };

async function persistReferral(context: CommandContext, input: ReferralInput): Promise<ReferralResponse | null> {
  const { db, organization, idempotencyKey, correlationId } = context;
  const eventId = crypto.randomUUID();
  const eventHash = "PENDING";
  
  const patients = await db`SELECT id FROM patients WHERE id = ${input.patientId} AND organization_id = ${organization.organizationId}`;
  if (!Array.isArray(patients) || !patients[0]) {
    await recordSecurityEvent(organization, "TENANT_ACCESS_DENIED", { resource: "patient", requestedId: input.patientId });
    throw new UnauthorizedError("Organization boundary violated.");
  }

  if (input.screeningId) {
    const screenings = await db`SELECT id FROM screenings WHERE id = ${input.screeningId} AND organization_id = ${organization.organizationId}`;
    if (!Array.isArray(screenings) || !screenings[0]) {
      await recordSecurityEvent(organization, "TENANT_ACCESS_DENIED", { resource: "screening", requestedId: input.screeningId });
      throw new UnauthorizedError("Organization boundary violated.");
    }
  }

  let appointmentId: string | null = null;
  if (input.urgency === "urgent") {
    const appointmentKey = `${idempotencyKey}:appointment`;
    const appointments = await db`INSERT INTO appointments (idempotency_key, organization_id, patient_id, provider_name, appointment_type, status, starts_at) VALUES (${appointmentKey}, ${organization.organizationId}, ${input.patientId}, 'Assigned Specialist', ${input.specialty}, 'REQUESTED', now() + interval '1 day') RETURNING id`;
    appointmentId = Array.isArray(appointments) ? (appointments[0] as { id: string } | undefined)?.id ?? null : null;
  }
  
  const rows = await db`
    WITH inserted AS (
      INSERT INTO referrals (idempotency_key, screening_id, patient_id, worker_id, organization_id, specialty, urgency, reason, worker_notes, status, appointment_id)
      VALUES (${idempotencyKey}, ${input.screeningId || null}, ${input.patientId}, ${organization.userId}, ${organization.organizationId}, ${input.specialty}, ${input.urgency || "routine"}, ${input.reason}, ${input.workerNotes || null}, ${input.status || "pending"}, ${appointmentId})
      ON CONFLICT DO NOTHING
      RETURNING *
    ), event_written AS (
      INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
      SELECT ${eventId}, 'REFERRAL_CREATED', 'referral', inserted.id::text, ${organization.organizationId}, ${organization.userId}, ${organization.role ?? 'unknown'}, ${idempotencyKey}, 1, now(), 'ONLINE', ${correlationId},
        jsonb_build_object('command', 'referral.create', 'response', jsonb_build_object('referral', to_jsonb(inserted))), ${eventHash}
      FROM inserted
      ON CONFLICT (organization_id, idempotency_key) DO NOTHING
      RETURNING id
    ), audit_written AS (
      INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, event_type, actor, payload)
      SELECT ${organization.organizationId}, ${organization.userId}, 'referral_created', 'referral', inserted.id, 'REFERRAL_CREATED', ${organization.userId}, jsonb_build_object('idempotencyKey', ${idempotencyKey})
      FROM inserted JOIN event_written ON true
      RETURNING id
    )
    SELECT to_jsonb(inserted) AS referral FROM inserted JOIN event_written ON true JOIN audit_written ON true
  `;
  
  const first = (Array.isArray(rows) ? rows[0] : undefined) as { referral?: unknown } | undefined;
  const referral = first?.referral;
  return referral ? { referral: typeof referral === "string" ? JSON.parse(referral) : referral as Record<string, unknown> } : null;
}

export function createReferral(request: Request) {
  return handleCommand<ReferralInput, ReferralResponse>(request, {
    permission: "patients:write",
    validate: (body: any) => {
      if (!body?.patient_id && !body?.patientId) throw new Error("patient_id, specialty, and reason are required");
      if (!body?.specialty) throw new Error("patient_id, specialty, and reason are required");
      if (!body?.reason) throw new Error("patient_id, specialty, and reason are required");
      
      return {
        patientId: body.patient_id || body.patientId,
        screeningId: body.screening_id || body.screeningId,
        specialty: body.specialty,
        urgency: body.urgency,
        reason: body.reason,
        workerNotes: body.worker_notes || body.workerNotes,
        status: body.status,
        idempotencyKey: body.idempotency_key || body.idempotencyKey,
      };
    },
    persist: persistReferral,
  });
}
