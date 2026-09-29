import { sql } from "@/db/client";

export const DEMO_ORGANIZATION = "DEMO-2026-09-30";
const ACTOR = "demo-seed";

type Row = Record<string, unknown>;
const rows = (value: unknown): Row[] => Array.isArray(value) ? value as Row[] : [];

async function audit(eventType: string, resourceType: string, resourceId: string, payload: Record<string, unknown>) {
  await sql()`INSERT INTO audit_events (organization_id, user_id, action, resource_type, resource_id, event_type, actor, payload, result, source)
    VALUES (${DEMO_ORGANIZATION}, ${ACTOR}, ${eventType.toLowerCase()}, ${resourceType}, ${resourceId}::uuid, ${eventType}, ${ACTOR}, ${JSON.stringify(payload)}::jsonb, 'RECORDED', 'DEMO_SEED')`;
}

async function append(eventType: string, aggregateType: string, aggregateId: string, key: string, version: number, occurredAt: string, payload: Record<string, unknown>) {
  await sql()`INSERT INTO domain_events (id, event_type, aggregate_type, aggregate_id, organization_id, actor_id, actor_role, idempotency_key, resulting_version, occurred_at, source, correlation_id, payload, hash)
    VALUES (${crypto.randomUUID()}, ${eventType}, ${aggregateType}, ${aggregateId}, ${DEMO_ORGANIZATION}, ${ACTOR}, 'admin', ${key}, ${version}, ${occurredAt}::timestamptz, 'ONLINE', 'DEMO-2026-09-30-HERO', ${JSON.stringify(payload)}::jsonb, 'PENDING')`;
}

/** Reset and create the complete, fixed hero journey used in the 90-second demo. */
export async function seedDemoTenant() {
  const db = sql();
  // This tenant is reserved for demo evidence. No caller-controlled tenant is
  // ever deleted or seeded by this routine.
  await db`DELETE FROM clinical_orders WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM billing_transactions WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM tasks WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM appointments WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM domain_event_heads WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM domain_events WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM patients WHERE organization_id = ${DEMO_ORGANIZATION}`;
  await db`DELETE FROM audit_events WHERE organization_id = ${DEMO_ORGANIZATION}`;

  const patient = rows(await db`INSERT INTO patients (organization_id, idempotency_key, full_name, date_of_birth, sex, phone, status, priority, age, blood_group, primary_complaint, version)
    VALUES (${DEMO_ORGANIZATION}, 'hero-patient-register', 'Ananya Rao', '1992-05-14', 'female', '9876543210', 'active', 'high', 34, 'O+', 'Chest pain and shortness of breath', 1) RETURNING *`)[0]!;
  await append("PATIENT_REGISTERED", "patient", String(patient.id), "hero-patient-register", 1, "2026-09-30T08:00:00.000Z", { command: "patient.register", response: { patient } });
  await audit("PATIENT_REGISTERED", "patient", String(patient.id), { step: "registration" });

  let appointment = rows(await db`INSERT INTO appointments (organization_id, idempotency_key, patient_id, full_name, provider_name, appointment_type, status, priority, starts_at, duration_minutes, version)
    VALUES (${DEMO_ORGANIZATION}, 'hero-appointment-confirm', ${String(patient.id)}, 'Ananya Rao', 'Dr. Priya Iyer', 'Cardiology consultation', 'CONFIRMED', 'high', '2026-09-30T08:30:00.000Z', 30, 1) RETURNING *`)[0]!;
  await append("APPOINTMENT_CONFIRMED", "appointment", String(appointment.id), "hero-appointment-confirm", 1, "2026-09-30T08:05:00.000Z", { command: "appointment.confirm", response: { appointment } });
  await audit("APPOINTMENT_CONFIRMED", "appointment", String(appointment.id), { step: "confirmation" });

  appointment = rows(await db`UPDATE appointments SET status = 'ARRIVED', version = 2 WHERE id = ${String(appointment.id)} RETURNING *`)[0]!;
  await append("APPOINTMENT_UPDATED", "appointment", String(appointment.id), "hero-appointment-arrived", 2, "2026-09-30T08:28:00.000Z", { command: "appointment.update", response: { appointment } });
  await audit("APPOINTMENT_UPDATED", "appointment", String(appointment.id), { step: "arrival", version: 2 });

  appointment = rows(await db`UPDATE appointments SET status = 'IN_PROGRESS', version = 3 WHERE id = ${String(appointment.id)} RETURNING *`)[0]!;
  await append("APPOINTMENT_UPDATED", "appointment", String(appointment.id), "hero-appointment-start", 3, "2026-09-30T08:35:00.000Z", { command: "appointment.update", response: { appointment } });
  await audit("APPOINTMENT_UPDATED", "appointment", String(appointment.id), { step: "consultation_started", version: 3 });

  const order = rows(await db`INSERT INTO clinical_orders (organization_id, patient_id, order_type, test_name, status, version, ordered_at, completed_at, result)
    VALUES (${DEMO_ORGANIZATION}, ${String(patient.id)}, 'laboratory', 'ECG and cardiac markers', 'COMPLETED', 2, '2026-09-30T08:45:00.000Z', '2026-09-30T09:05:00.000Z', 'Result recorded for clinician review') RETURNING *`)[0]!;
  await append("ORDER_COMPLETED", "order", String(order.id), "hero-order-complete", 2, "2026-09-30T09:05:00.000Z", { command: "order.complete", response: { order } });
  await audit("ORDER_COMPLETED", "order", String(order.id), { step: "result_recorded" });

  const task = rows(await db`INSERT INTO tasks (organization_id, patient_id, title, owner, severity, status, version, due_at)
    VALUES (${DEMO_ORGANIZATION}, ${String(patient.id)}, 'Review cardiac-marker result', 'Dr. Priya Iyer', 'attention', 'open', 1, '2026-09-30T09:15:00.000Z') RETURNING *`)[0]!;
  await append("TASK_CREATED", "task", String(task.id), "hero-task-created", 1, "2026-09-30T09:06:00.000Z", { command: "task.create", response: { task } });
  await audit("TASK_CREATED", "task", String(task.id), { step: "follow_up" });

  appointment = rows(await db`UPDATE appointments SET status = 'COMPLETED', version = 4 WHERE id = ${String(appointment.id)} RETURNING *`)[0]!;
  await append("APPOINTMENT_UPDATED", "appointment", String(appointment.id), "hero-appointment-complete", 4, "2026-09-30T09:10:00.000Z", { command: "appointment.update", response: { appointment } });
  await audit("APPOINTMENT_UPDATED", "appointment", String(appointment.id), { step: "consultation_complete", version: 4 });

  return { tenant: DEMO_ORGANIZATION, heroPatient: { id: patient.id, name: patient.full_name }, events: 7, audits: 7, timeline: "registration → confirmation → arrival → consultation → order/result → follow-up task → completion" };
}
