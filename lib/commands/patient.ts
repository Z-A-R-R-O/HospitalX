import { CommandContext, handleCommand } from "./handler";
import { validateCreatePatient } from "@/lib/patients/validators";

type PatientInput = ReturnType<typeof validateCreatePatient>;
type PatientResponse = { patient: Record<string, unknown> };

async function persistPatient(context: CommandContext, input: PatientInput): Promise<PatientResponse | null> {
  const { db, organization, idempotencyKey, correlationId } = context;
  const eventId = crypto.randomUUID();
  // The database append trigger replaces this sentinel with the locked,
  // organization-chain hash in the same transaction as the projection update.
  const eventHash = "PENDING";
  const rows = await db`
    WITH inserted AS (
      INSERT INTO patients (idempotency_key, organization_id, full_name, date_of_birth, sex, phone, status, priority, age, blood_group, primary_complaint, email, address, emergency_contact, medical_history, version)
      VALUES (${idempotencyKey}::text, ${organization.organizationId}::text, ${input.fullName}::text, ${input.dob || null}::date, ${input.sex || null}::text, ${input.phone || null}::text, 'active', ${input.priority || 'normal'}::text, ${input.age || null}::integer, ${input.bloodGroup || null}::text, ${input.primaryComplaint || null}::text, ${input.email || null}::text, ${input.address || null}::text, ${input.emergencyContact || null}::text, ${input.medicalHistory || null}::text, 1)
      ON CONFLICT (idempotency_key) DO NOTHING
      RETURNING *
    ), event_written AS (
      INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
      SELECT ${eventId}::uuid, 'PATIENT_REGISTERED', 'patient', inserted.id::text, ${organization.organizationId}::text, ${organization.userId}::text, ${organization.role ?? 'unknown'}::text, ${idempotencyKey}::text, 1, now(), 'ONLINE', ${correlationId}::text,
        jsonb_build_object('command', 'patient.register', 'response', jsonb_build_object('patient', to_jsonb(inserted))), ${eventHash}::text
      FROM inserted
      ON CONFLICT (organization_id, idempotency_key) DO NOTHING
      RETURNING id
    ), audit_written AS (
      INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, details, event_type, actor, payload)
      SELECT ${organization.organizationId}::text, ${organization.userId}::text, 'patient_registered', 'patient', inserted.id, jsonb_build_object('priority', ${input.priority || null}::text), 'PATIENT_REGISTERED', ${organization.userId}::text, jsonb_build_object('idempotencyKey', ${idempotencyKey}::text)
      FROM inserted JOIN event_written ON true
      RETURNING id
    )
    SELECT to_jsonb(inserted) AS patient FROM inserted JOIN event_written ON true JOIN audit_written ON true
  `;
  const first = (Array.isArray(rows) ? rows[0] : undefined) as { patient?: unknown } | undefined;
  const patient = first?.patient;
  return patient ? { patient: typeof patient === "string" ? JSON.parse(patient) : patient as Record<string, unknown> } : null;
}

export function registerPatient(request: Request) {
  return handleCommand<PatientInput, PatientResponse>(request, {
    permission: "patients:write",
    validate: (body) => validateCreatePatient((body ?? {}) as Parameters<typeof validateCreatePatient>[0]),
    persist: persistPatient,
  });
}

type UpdatePatientInput = { id: string; fullName?: string; externalIdentifier?: string; dateOfBirth?: string; sex?: string; phone?: string; expectedVersion: number; idempotencyKey?: string };

async function persistUpdatePatient(context: CommandContext, input: UpdatePatientInput, current?: { version: number }): Promise<PatientResponse | null> {
  const { db, organization, idempotencyKey, correlationId } = context;
  const eventId = crypto.randomUUID();
  const eventHash = "PENDING";
  
  const rows = await db`
    WITH updated AS (
      UPDATE patients 
      SET full_name = COALESCE(${input.fullName ?? null}::text, full_name), 
          external_identifier = COALESCE(${input.externalIdentifier ?? null}::text, external_identifier), 
          date_of_birth = COALESCE(${input.dateOfBirth ?? null}::date, date_of_birth), 
          sex = COALESCE(${input.sex ?? null}::text, sex), 
          phone = COALESCE(${input.phone ?? null}::text, phone), 
          version = version + 1 
      WHERE id = ${input.id}::uuid AND organization_id = ${organization.organizationId}::text AND version = ${input.expectedVersion}
      RETURNING *
    ), event_written AS (
      INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
      SELECT ${eventId}, 'PATIENT_UPDATED', 'patient', updated.id::text, ${organization.organizationId}, ${organization.userId}, ${organization.role ?? 'unknown'}, ${idempotencyKey}, updated.version, now(), 'ONLINE', ${correlationId},
        jsonb_build_object('command', 'patient.update', 'response', jsonb_build_object('patient', to_jsonb(updated))), ${eventHash}
      FROM updated
      ON CONFLICT (organization_id, idempotency_key) DO NOTHING
      RETURNING id
    ), audit_written AS (
      INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, event_type, actor, payload)
      SELECT ${organization.organizationId}, ${organization.userId}, 'patient_updated', 'patient', updated.id, 'PATIENT_UPDATED', ${organization.userId}, jsonb_build_object('idempotencyKey', ${idempotencyKey})
      FROM updated JOIN event_written ON true
      RETURNING id
    )
    SELECT to_jsonb(updated) AS patient FROM updated JOIN event_written ON true JOIN audit_written ON true
  `;
  
  const first = (Array.isArray(rows) ? rows[0] : undefined) as { patient?: unknown } | undefined;
  const patient = first?.patient;
  return patient ? { patient: typeof patient === "string" ? JSON.parse(patient) : patient as Record<string, unknown> } : null;
}

export function updatePatient(request: Request, id: string) {
  return handleCommand<UpdatePatientInput, PatientResponse>(request, {
    permission: "patients:write",
    validate: (body: any) => {
      const expected = body?.expectedVersion !== undefined ? Number(body.expectedVersion) : NaN;
      if (isNaN(expected)) throw new Error("Expected version is required");
      return {
        id,
        fullName: body?.fullName,
        externalIdentifier: body?.externalIdentifier,
        dateOfBirth: body?.dateOfBirth,
        sex: body?.sex,
        phone: body?.phone,
        expectedVersion: expected,
        idempotencyKey: body?.idempotencyKey || body?.idempotency_key,
      };
    },
    loadCurrent: async (context, input) => {
      const rows = await context.db`SELECT version FROM patients WHERE id = ${input.id} AND organization_id = ${context.organization.organizationId} LIMIT 1`;
      const first = Array.isArray(rows) ? rows[0] : undefined;
      return first ? { version: Number((first as any).version) } : null;
    },
    expectedVersion: (input) => input.expectedVersion,
    persist: persistUpdatePatient,
  });
}
