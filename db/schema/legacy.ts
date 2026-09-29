/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { sql } from "@/db/client";
export async function ensurePatientSchedulingSchema() {
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    external_identifier TEXT,
    idempotency_key TEXT UNIQUE,
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    sex TEXT,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    priority TEXT,
    age INT,
    blood_group TEXT,
    primary_complaint TEXT,
    email TEXT,
    address TEXT,
    emergency_contact TEXT,
    medical_history TEXT,
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
    await db`CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    role TEXT NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'Available',
    location TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
    await db`CREATE TABLE IF NOT EXISTS nurses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    ward TEXT NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    patient_load INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id TEXT NOT NULL DEFAULT 'city-care',
    event_type TEXT NOT NULL,
    actor TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS beds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    organization_id TEXT NOT NULL DEFAULT 'city-care', 
    facility TEXT NOT NULL, 
    ward TEXT NOT NULL, 
    label TEXT NOT NULL, 
    status TEXT NOT NULL DEFAULT 'available', 
    patient_id UUID, 
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS hospital_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    organization_id TEXT NOT NULL DEFAULT 'city-care', 
    text TEXT NOT NULL, 
    severity TEXT NOT NULL DEFAULT 'attention', 
    owner TEXT NOT NULL DEFAULT 'Operations', 
    resolved_at TIMESTAMPTZ, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await db`CREATE TABLE IF NOT EXISTS clinical_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    patient_id UUID NOT NULL REFERENCES patients(id), 
    order_type TEXT NOT NULL, 
    test_name TEXT NOT NULL, 
    status TEXT NOT NULL DEFAULT 'ordered', 
    result TEXT, 
    ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
    completed_at TIMESTAMPTZ
  )`;
  await db`CREATE TABLE IF NOT EXISTS billing_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    patient_id UUID NOT NULL REFERENCES patients(id), 
    description TEXT NOT NULL, 
    amount NUMERIC(12,2) NOT NULL, 
    status TEXT NOT NULL DEFAULT 'pending', 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
    paid_at TIMESTAMPTZ
  )`;
  return db;
}
