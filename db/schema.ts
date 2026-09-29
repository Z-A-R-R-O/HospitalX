/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import {
  pgTable,
  uuid,
  text,
  date,
  integer,

  bigint,
  timestamp,
  jsonb,
  time,
  numeric,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  idempotencyKey: text('idempotency_key'),
  organizationId: text('organization_id').notNull(),
  externalIdentifier: text('external_identifier'),
  fullName: text('full_name').notNull(),
  dateOfBirth: date('date_of_birth'),
  gender: text('gender'),
  sex: text('sex'),
  contactNumber: text('contact_number'),
  phone: text('phone'),
  status: text('status').notNull().default('active'),
  priority: text('priority').notNull().default('normal'),
  age: integer('age'),
  bloodGroup: text('blood_group'),
  primaryComplaint: text('primary_complaint'),
  email: text('email'),
  address: text('address'),
  emergencyContact: text('emergency_contact'),
  medicalHistory: text('medical_history'),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex('patients_organization_idempotency_key_unique').on(table.organizationId, table.idempotencyKey)]);
export const doctors = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  fullName: text('full_name').notNull(),
  specialty: text('specialty').notNull(),
  role: text('role').notNull(),
  shiftStart: time('shift_start').notNull(),
  shiftEnd: time('shift_end').notNull(),
  status: text('status').notNull().default('Available'),
  location: text('location').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const nurses = pgTable('nurses', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull(),
  ward: text('ward').notNull(),
  shiftStart: time('shift_start').notNull(),
  shiftEnd: time('shift_end').notNull(),
  status: text('status').notNull().default('Active'),
  patientLoad: integer('patient_load').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  idempotencyKey: text('idempotency_key'),
  organizationId: text('organization_id').notNull(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  fullName: text('full_name'),
  providerId: text('provider_id'),
  providerName: text('provider_name').notNull(),
  appointmentType: text('appointment_type').notNull(),
  status: text('status').notNull().default('REQUESTED'),
  priority: text('priority').default('normal'),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').default(30),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex('appointments_organization_idempotency_key_unique').on(table.organizationId, table.idempotencyKey)]);
export const beds = pgTable('beds', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().default('city-care'),
  facility: text('facility').notNull(),
  ward: text('ward').notNull(),
  label: text('label').notNull(),
  status: text('status').notNull().default('available'),
  patientId: uuid('patient_id').references(() => patients.id),
  version: integer('version').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().default('city-care'),
  patientId: uuid('patient_id').references(() => patients.id),
  title: text('title').notNull(),
  owner: text('owner').notNull(),
  severity: text('severity').notNull().default('attention'),
  status: text('status').notNull().default('open'),
  version: integer('version').notNull().default(1),
  dueAt: timestamp('due_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const hospitalTasks = pgTable('hospital_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().default('city-care'),
  text: text('text').notNull(),
  severity: text('severity').notNull().default('attention'),
  owner: text('owner').notNull().default('Operations'),
  version: integer('version').notNull().default(1),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const auditEvents = pgTable('audit_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id'),
  userId: text('user_id'),
  action: text('action'),
  resourceType: text('resource_type'),
  resourceId: uuid('resource_id'),
  details: jsonb('details'),
  eventType: text('event_type'),
  actor: text('actor'),
  payload: jsonb('payload').notNull().default(sql`'{}'::jsonb`),
  facilityId: text('facility_id'),
  deviceId: text('device_id'),
  correlationId: text('correlation_id'),
  reason: text('reason'),
  result: text('result'),
  source: text('source'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const screenings = pgTable('screenings', {
  id: uuid('id').defaultRandom().primaryKey(),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  workerId: text('worker_id').notNull(),
  organizationId: text('organization_id').notNull(),
  status: text('status').notNull().default('in_progress'),
  totalScore: integer('total_score'),
  maxScore: integer('maxScore'),
  riskLevel: text('risk_level'),
  responses: jsonb('responses').notNull().default(sql`'[]'::jsonb`),
  observations: jsonb('observations').notNull().default(sql`'[]'::jsonb`),
  durationSeconds: integer('duration_seconds'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  idempotencyKey: text('idempotency_key').notNull().unique(),
  screeningId: uuid('screening_id').references(() => screenings.id),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  workerId: text('worker_id').notNull(),
  organizationId: text('organization_id').notNull(),
  specialty: text('specialty').notNull(),
  urgency: text('urgency').notNull().default('routine'),
  reason: text('reason').notNull(),
  workerNotes: text('worker_notes'),
  status: text('status').notNull().default('pending'),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const clinicalOrders = pgTable('clinical_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().default('city-care'),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  orderType: text('order_type').notNull(),
  testName: text('test_name').notNull(),
  status: text('status').notNull().default('ordered'),
  result: text('result'),
  version: integer('version').notNull().default(1),
  orderedAt: timestamp('ordered_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});
export const billingTransactions = pgTable('billing_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: text('organization_id').notNull().default('city-care'),
  patientId: uuid('patient_id').notNull().references(() => patients.id),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  status: text('status').notNull().default('pending'),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
});

export const domainEvents = pgTable('domain_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: text('event_type').notNull(),
  aggregateType: text('aggregate_type').notNull(),
  aggregateId: text('aggregate_id').notNull(),
  organizationId: text('organization_id').notNull(),
  facilityId: text('facility_id'),
  actorId: text('actor_id').notNull(),
  actorRole: text('actor_role').notNull(),
  deviceId: text('device_id'),
  idempotencyKey: text('idempotency_key').notNull(),
  expectedVersion: integer('expected_version'),
  resultingVersion: integer('resulting_version').notNull(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
  source: text('source').notNull(),
  correlationId: text('correlation_id').notNull(),
  payload: jsonb('payload').notNull().default(sql`'{}'::jsonb`),
  previousHash: text('previous_hash'),
  hash: text('hash').notNull(),
  chainSequence: bigint('chain_sequence', { mode: 'number' }).notNull().default(0),
}, (table) => [
  uniqueIndex('domain_events_organization_idempotency_key_unique').on(table.organizationId, table.idempotencyKey),
  uniqueIndex('domain_events_hash_unique').on(table.hash),
  index('domain_events_aggregate_idx').on(table.organizationId, table.aggregateType, table.aggregateId, table.occurredAt),
  index('domain_events_organization_chain_idx').on(table.organizationId, table.chainSequence),
]);

