import { CommandContext, CommandError, handleCommand } from "./handler";
import { validateCreateAppointment } from "@/lib/appointments/validators";
import { cleanText } from "@/lib/validations";
import { canTransitionAppointment } from "@/lib/proof/workflows";

type AppointmentUpdate = { id: string; expectedVersion?: number; status?: string; providerName?: string; appointmentType?: string; startsAt?: string };
type AppointmentResponse = { appointment: Record<string, unknown> };

function validateUpdate(body: unknown): AppointmentUpdate {
  const value = (body ?? {}) as Record<string, unknown>;
  const expectedVersion = value.expectedVersion === undefined ? undefined : Number(value.expectedVersion);
  if (expectedVersion !== undefined && (!Number.isInteger(expectedVersion) || expectedVersion < 1)) throw new CommandError(400, "INVALID_EXPECTED_VERSION", "expectedVersion must be a positive integer.");
  const status = cleanText(value.status, 40)?.toUpperCase();
  return { id: cleanText(value.id, 80) ?? "", expectedVersion, status, providerName: cleanText(value.providerName, 160), appointmentType: cleanText(value.appointmentType, 80), startsAt: cleanText(value.startsAt, 80) };
}

export function updateAppointment(request: Request, id: string) {
  return handleCommand<AppointmentUpdate, AppointmentResponse>(request, {
    permission: "appointments:write",
    validate: (body) => ({ ...validateUpdate(body), id }),
    expectedVersion: (input) => input.expectedVersion,
    loadCurrent: async ({ db, organization }, input) => {
      const rows = await db`SELECT id, status, version FROM appointments WHERE id = ${input.id} AND organization_id = ${organization.organizationId} LIMIT 1`;
      const current = Array.isArray(rows) ? rows[0] as { status: string; version: number } | undefined : undefined;
      if (current && input.status && !canTransitionAppointment(current.status, input.status)) throw new CommandError(422, "INVALID_WORKFLOW_TRANSITION", `Cannot transition appointment from ${current.status} to ${input.status}.`, { from: current.status, to: input.status });
      return current ?? null;
    },
    persist: async (context, input, current) => {
      const { db, organization, idempotencyKey, correlationId } = context;
      const eventId = crypto.randomUUID();
      // Computed by the append-only domain_events trigger under the
      // organization chain lock; the supplied value is never persisted.
      const eventHash = "PENDING";
      const rows = await db`
        WITH updated AS (
          UPDATE appointments SET
            provider_name = COALESCE(${input.providerName ?? null}::text, provider_name),
            appointment_type = COALESCE(${input.appointmentType ?? null}::text, appointment_type),
            status = COALESCE(${input.status ?? null}::text, status),
            starts_at = COALESCE(${input.startsAt ?? null}::timestamptz, starts_at),
            version = version + 1
          WHERE id = ${input.id}::uuid AND organization_id = ${organization.organizationId}::text AND version = ${current!.version}
          RETURNING *
        ), event_written AS (
          INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, expected_version, resulting_version, occurred_at, source, correlation_id, payload, hash)
          SELECT ${eventId}, 'APPOINTMENT_UPDATED', 'appointment', updated.id::text, ${organization.organizationId}, ${organization.userId}, ${organization.role ?? 'unknown'}, ${idempotencyKey}, ${current!.version}, updated.version, now(), 'ONLINE', ${correlationId},
            jsonb_build_object('command', 'appointment.update', 'response', jsonb_build_object('appointment', to_jsonb(updated))), ${eventHash}
          FROM updated ON CONFLICT (organization_id, idempotency_key) DO NOTHING RETURNING id
        ), audit_written AS (
          INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, details, event_type, actor, payload)
          SELECT ${organization.organizationId}, ${organization.userId}, 'appointment_updated', 'appointment', updated.id, jsonb_build_object('expectedVersion', ${current!.version}), 'APPOINTMENT_UPDATED', ${organization.userId}, jsonb_build_object('idempotencyKey', ${idempotencyKey})
          FROM updated JOIN event_written ON true RETURNING id
        ) SELECT to_jsonb(updated) AS appointment FROM updated JOIN event_written ON true JOIN audit_written ON true
      `;
      const first = (Array.isArray(rows) ? rows[0] : undefined) as { appointment?: unknown } | undefined;
      const appointment = first?.appointment;
      return appointment ? { appointment: typeof appointment === "string" ? JSON.parse(appointment) : appointment as Record<string, unknown> } : null;
    },
  });
}

type BookAppointmentInput = ReturnType<typeof validateCreateAppointment> & { status?: string };

export function bookAppointment(request: Request) {
  return handleCommand<BookAppointmentInput, AppointmentResponse>(request, {
    permission: "appointments:write",
    validate: (body) => {
      try {
        const parsed = validateCreateAppointment((body ?? {}) as any);
        return { ...parsed, status: (body as any)?.status || 'REQUESTED' };
      } catch (e: any) {
        throw new CommandError(400, "VALIDATION_FAILED", e.message);
      }
    },
    persist: async (context, input) => {
      const { db, organization, idempotencyKey, correlationId } = context;
      const eventId = crypto.randomUUID();
      const eventHash = "PENDING";
      const rows = await db`
        WITH inserted AS (
          INSERT INTO appointments (
            idempotency_key, organization_id, patient_id, full_name, provider_id, 
            provider_name, appointment_type, starts_at, duration_minutes, status, priority, version
          ) VALUES (
            ${idempotencyKey}::text, ${organization.organizationId}::text, ${input.patientId}::text, ${input.fullName}::text, 
            ${input.providerId}::text, ${input.providerName}::text, ${input.type}::text, ${input.startsAt}::timestamptz, 
            ${input.durationMinutes}::integer, ${input.status}::text, 'normal', 1
          ) 
          ON CONFLICT (idempotency_key) DO NOTHING
          RETURNING *
        ), event_written AS (
          INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
          SELECT ${eventId}::uuid, 'APPOINTMENT_BOOKED', 'appointment', inserted.id::text, ${organization.organizationId}::text, ${organization.userId}::text, ${organization.role ?? 'unknown'}::text, ${idempotencyKey}::text, 1, now(), 'ONLINE', ${correlationId}::text,
            jsonb_build_object('command', 'appointment.book', 'response', jsonb_build_object('appointment', to_jsonb(inserted))), ${eventHash}::text
          FROM inserted
          ON CONFLICT (organization_id, idempotency_key) DO NOTHING
          RETURNING id
        ), audit_written AS (
          INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, details, event_type, actor, payload)
          SELECT ${organization.organizationId}::text, ${organization.userId}::text, 'appointment_booked', 'appointment', inserted.id, jsonb_build_object('type', ${input.type}::text, 'status', ${input.status}::text), 'APPOINTMENT_BOOKED', ${organization.userId}::text, jsonb_build_object('idempotencyKey', ${idempotencyKey}::text)
          FROM inserted JOIN event_written ON true
          RETURNING id
        )
        SELECT to_jsonb(inserted) AS appointment FROM inserted JOIN event_written ON true JOIN audit_written ON true
      `;
      const first = (Array.isArray(rows) ? rows[0] : undefined) as { appointment?: unknown } | undefined;
      const appointment = first?.appointment;
      return appointment ? { appointment: typeof appointment === "string" ? JSON.parse(appointment) : appointment as Record<string, unknown> } : null;
    }
  });
}