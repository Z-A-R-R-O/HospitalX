import { CommandContext, handleCommand, CommandError } from "./handler";
import { recordSecurityEvent } from "@/lib/security/tenant";
import { UnauthorizedError } from "@/lib/permissions/guard";
import { registerPatient, updatePatient } from "./patient";
import { createScreening } from "./screening";
import { createReferral } from "./referral";

type Mutation = { idempotencyKey?: string; entity?: string; baseVersion?: number; payload?: Record<string, unknown> };
type SyncInput = { mutations: Mutation[] };
type SyncResponse = { results: Record<string, unknown>[], source: string };

function invalidBase(baseVersion: unknown) { return !Number.isInteger(baseVersion) || Number(baseVersion) < 0; }

async function persistSync(context: CommandContext, input: SyncInput): Promise<SyncResponse | null> {
  const { db, organization } = context;
  const results: Record<string, unknown>[] = [];
  const organizationId = organization.organizationId;
  
  for (const mutation of input.mutations) {
    const key = mutation.idempotencyKey;
    const payload = mutation.payload;
    if (!key || !mutation.entity || !payload || invalidBase(mutation.baseVersion)) {
      results.push({ idempotencyKey: key ?? "unknown", status: "error", error: "idempotencyKey, payload, and baseVersion are required" });
      continue;
    }
    
    if (payload.organization_id && payload.organization_id !== organizationId) {
      await recordSecurityEvent(organization, "TENANT_ACCESS_DENIED", { resource: "sync", requestedId: payload.organization_id });
      throw new UnauthorizedError("Organization boundary violated.");
    }

    try {
      if (mutation.entity === "create_patient") {
        const req = new Request("http://localhost", {
          method: "POST",
          headers: { "Idempotency-Key": key },
          body: JSON.stringify({
            fullName: payload.full_name,
            dateOfBirth: payload.date_of_birth,
            sex: payload.sex,
            phone: payload.phone
          })
        });
        const { response } = await registerPatient(req);
        const p = response.patient as any;
        results.push({ idempotencyKey: key, status: "acknowledged", serverId: p.id, version: p.version });
        continue;
      }
      
      if (mutation.entity === "update_patient") {
        const id = payload.serverId as string;
        const req = new Request("http://localhost", {
          method: "PATCH",
          headers: { "Idempotency-Key": key },
          body: JSON.stringify({
            fullName: payload.full_name,
            dateOfBirth: payload.date_of_birth,
            sex: payload.sex,
            phone: payload.phone,
            expectedVersion: Number(mutation.baseVersion)
          })
        });
        try {
          const { response } = await updatePatient(req, id);
          const p = response.patient as any;
          results.push({ idempotencyKey: key, status: "acknowledged", serverId: p.id, version: p.version });
        } catch (e) {
          if (e instanceof CommandError && e.code === "CONFLICT") {
             results.push({ idempotencyKey: key, status: "conflict", message: "No silent overwrite: the patient changed while offline.", baseVersion: Number(mutation.baseVersion), serverVersion: e.details.serverVersion });
          } else if (e instanceof CommandError && e.code === "NOT_FOUND") {
             results.push({ idempotencyKey: key, status: "error", error: "Patient not found" });
          } else {
             throw e;
          }
        }
        continue;
      }
      
      if (mutation.entity === "create_screening") {
        let resolvedPatientId = payload.patientServerId as string | undefined;
        if (!resolvedPatientId && payload.patientIdempotencyKey) {
            const patients = await db`SELECT id FROM patients WHERE idempotency_key = ${payload.patientIdempotencyKey as string} AND organization_id = ${organizationId} LIMIT 1`;
            resolvedPatientId = Array.isArray(patients) && patients[0] ? (patients[0] as any).id : undefined;
        }
        if (!resolvedPatientId) {
            results.push({ idempotencyKey: key, status: "error", error: "Patient not found" }); 
            continue;
        }
        
        const req = new Request("http://localhost", {
          method: "POST",
          headers: { "Idempotency-Key": key },
          body: JSON.stringify({
            patientId: resolvedPatientId,
            status: payload.status,
            totalScore: payload.total_score,
            maxScore: payload.max_score,
            riskLevel: payload.risk_level,
            responses: payload.responses,
            observations: payload.observations,
            durationSeconds: payload.duration_seconds,
            completedAt: payload.completed_at
          })
        });

        const { response } = await createScreening(req);
        const s = response.screening as any;
        results.push({ idempotencyKey: key, status: "acknowledged", serverId: s.id });
        continue;
      }
      
      if (mutation.entity === "create_referral") {
        let resolvedPatientId = payload.patientServerId as string | undefined;
        if (!resolvedPatientId && payload.patientIdempotencyKey) {
            const patients = await db`SELECT id FROM patients WHERE idempotency_key = ${payload.patientIdempotencyKey as string} AND organization_id = ${organizationId} LIMIT 1`;
            resolvedPatientId = Array.isArray(patients) && patients[0] ? (patients[0] as any).id : undefined;
        }
        if (!resolvedPatientId) {
            results.push({ idempotencyKey: key, status: "error", error: "Patient not found" }); 
            continue;
        }
        
        let resolvedScreeningId = undefined;
        if (payload.screeningIdempotencyKey) {
            const screenings = await db`SELECT id FROM screenings WHERE idempotency_key = ${payload.screeningIdempotencyKey as string} AND organization_id = ${organizationId} LIMIT 1`;
            resolvedScreeningId = Array.isArray(screenings) && screenings[0] ? (screenings[0] as any).id : undefined;
        }

        const req = new Request("http://localhost", {
          method: "POST",
          headers: { "Idempotency-Key": key },
          body: JSON.stringify({
            patientId: resolvedPatientId,
            screeningId: resolvedScreeningId,
            specialty: payload.specialty,
            urgency: payload.urgency,
            reason: payload.reason,
            workerNotes: payload.worker_notes,
            status: payload.status
          })
        });
        const { response } = await createReferral(req);
        const r = response.referral as any;
        results.push({ idempotencyKey: key, status: "acknowledged", serverId: r.id });
        continue;
      }
      
      results.push({ idempotencyKey: key, status: "error", error: "Unknown entity type" });
    } catch (error) {
      results.push({ idempotencyKey: key, status: "error", error: error instanceof Error ? error.message : "Sync failed" });
    }
  }

  const eventId = crypto.randomUUID();
  await db`
    INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
    VALUES (${eventId}, 'SYNC_COMPLETED', 'sync', 'sync', ${organizationId}, ${organization.userId}, ${organization.role ?? 'unknown'}, ${context.idempotencyKey}, 1, now(), 'ONLINE', ${context.correlationId},
      ${JSON.stringify({ command: 'sync.process', response: { results, source: "neon" } })}::jsonb, 'PENDING')
    ON CONFLICT (organization_id, idempotency_key) DO NOTHING
  `;

  return { results, source: "neon" };
}

export function processSync(request: Request) {
  return handleCommand<SyncInput, SyncResponse>(request, {
    permission: "patients:write",
    validate: (body) => {
      const mutations = (body as Record<string, unknown>)?.mutations;
      if (!Array.isArray(mutations)) throw new Error("mutations must be an array");
      return { mutations: mutations as Mutation[] };
    },
    persist: persistSync,
  });
}
