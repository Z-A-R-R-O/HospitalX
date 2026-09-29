/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { v4 as uuidv4 } from 'uuid';
import type { SyncMutation, SyncAction, OfflinePatient, OfflineScreening, OfflineReferral } from './types';
import { savePatient, saveScreening, saveReferral, addToSyncQueue, getPatient, getScreening } from './db';
/**
 * Sync Queue Manager
 * 
 * Queues offline mutations for server sync. The payload is flattened to match
 * what /api/sync expects (snake_case, flat structure).
 */
export async function queuePatientSync(patient: OfflinePatient): Promise<void> {
  const mutation: SyncMutation = {
    id: uuidv4(),
    idempotencyKey: patient.idempotencyKey,
    entity: 'create_patient',
    payload: {
      // Flat snake_case to match /api/sync expectations
      full_name: patient.fullName,
      date_of_birth: patient.dateOfBirth || null,
      sex: patient.sex || null,
      phone: patient.phone || null,
      location: patient.location || null,
      organization_id: 'demo-org',
      // Keep local references for post-sync entity update
      _localId: patient.localId,
    },
    status: 'pending',
    attempts: 0,
    createdAt: Date.now(),
  };
  await addToSyncQueue(mutation);
}
export async function queueScreeningSync(screening: OfflineScreening): Promise<void> {
  const patient = await getPatient(screening.patientLocalId);
  
  const mutation: SyncMutation = {
    id: uuidv4(),
    idempotencyKey: screening.idempotencyKey,
    entity: 'create_screening',
    payload: {
      worker_id: screening.workerId || 'demo-worker',
      organization_id: 'demo-org',
      status: screening.status,
      total_score: screening.totalScore ?? null,
      max_score: screening.maxScore ?? null,
      risk_level: screening.riskLevel ?? null,
      responses: screening.responses || [],
      observations: screening.observations || [],
      duration_seconds: screening.durationSeconds ?? null,
      completed_at: screening.completedAt ? new Date(screening.completedAt).toISOString() : null,
      // Patient linkage — the sync API resolves this via idempotency key
      patientIdempotencyKey: patient?.idempotencyKey,
      patientServerId: screening.patientServerId,
      _localId: screening.localId,
    },
    status: 'pending',
    attempts: 0,
    createdAt: Date.now(),
  };
  await addToSyncQueue(mutation);
}
export async function queueReferralSync(referral: OfflineReferral): Promise<void> {
  const patient = await getPatient(referral.patientLocalId);
  const screening = await getScreening(referral.screeningLocalId);
  const mutation: SyncMutation = {
    id: uuidv4(),
    idempotencyKey: referral.idempotencyKey,
    entity: 'create_referral',
    payload: {
      worker_id: referral.workerId || 'demo-worker',
      organization_id: 'demo-org',
      specialty: referral.specialty,
      urgency: referral.urgency,
      reason: referral.reason,
      worker_notes: referral.workerNotes || null,
      status: 'pending',
      // Linkage keys for server resolution
      screeningIdempotencyKey: screening?.idempotencyKey,
      patientIdempotencyKey: patient?.idempotencyKey,
      patientServerId: referral.patientServerId,
      _localId: referral.localId,
    },
    status: 'pending',
    attempts: 0,
    createdAt: Date.now(),
  };
  await addToSyncQueue(mutation);
}
