import { sql } from "@/lib/db";

export type AuditEntry = {
  eventType: string;
  actor: string;
  subjectType: "patient" | "appointment";
  subjectId: string;
  organizationId: string;
  outcome: "accepted" | "rejected";
  reason?: string;
};

export async function ensurePatientSchedulingSchema() {
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    external_identifier TEXT,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    sex TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    provider_name TEXT NOT NULL,
    appointment_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    starts_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    actor TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  return db;
}

export async function writeAudit(entry: AuditEntry) {
  const db = sql();
  await db`INSERT INTO audit_events (event_type, actor, payload)
    VALUES (
      ${entry.eventType},
      ${entry.actor},
      ${JSON.stringify({
        subject: { type: entry.subjectType, id: entry.subjectId },
        organizationId: entry.organizationId,
        outcome: entry.outcome,
        reason: entry.reason ?? null,
      })}::jsonb
    )`;
}

export function cleanText(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export function normalizeIdentifier(value: unknown) {
  return cleanText(value, 64).replace(/\s+/g, "").toUpperCase();
}

export function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export function validDateTime(value: string) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}
