/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

// Sync queue mutation types
export type SyncStatus = 'live' | 'demo' | 'offline' | 'pending' | 'syncing' | 'synced' | 'failed' | 'conflict' | 'stale';
export type SyncAction = 'create_patient' | 'update_patient' | 'create_screening' | 'create_referral';
export interface SyncMutation {
  id: string;              // Local UUID
  idempotencyKey: string;  // Sent to server for dedup

  /** The record version observed by this device.  Required for updates; 0 means a new record. */
  baseVersion: number;
  entity: SyncAction;
  payload: Record<string, unknown>;
  status: SyncStatus;
  attempts: number;
  errorMessage?: string;

  serverVersion?: number;
  createdAt: number;       // Date.now()
  syncedAt?: number;
}
// Offline patient (stored in IndexedDB before sync)
export interface OfflinePatient {
  localId: string;         // Client-generated UUID
  serverId?: string;       // Set after sync
  idempotencyKey: string;
  fullName: string;
  dateOfBirth?: string;    // YYYY-MM-DD
  sex?: string;
  phone?: string;
  location?: string;       // Village/area name
  age?: number;
  createdAt: number;
  syncedAt?: number;
  syncStatus?: SyncStatus;
}
// Offline screening session
export interface ScreeningResponse {
  questionId: string;
  category: string;
  score: number;           // 0, 1, or 2
  maxScore: number;
  observation?: string;
}
export type RiskLevel = 'low_concern' | 'review_recommended' | 'specialist_referral_recommended';
export interface OfflineScreening {
  localId: string;
  idempotencyKey: string;
  patientLocalId: string;
  patientServerId?: string;
  workerId: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  responses: ScreeningResponse[];
  totalScore?: number;
  maxScore?: number;
  riskLevel?: RiskLevel;
  observations?: string[];
  durationSeconds?: number;
  startedAt: number;
  completedAt?: number;
  syncedAt?: number;
}
// Offline referral
export type Specialty = 'neurology' | 'geriatrics' | 'general_medicine';
export type Urgency = 'routine' | 'soon' | 'urgent';
export interface OfflineReferral {
  localId: string;
  idempotencyKey: string;
  screeningLocalId: string;
  patientLocalId: string;
  patientServerId?: string;
  workerId: string;
  specialty: Specialty;
  urgency: Urgency;
  reason: string;
  workerNotes?: string;
  status: 'pending' | 'synced' | 'appointment_booked' | 'completed' | 'cancelled';
  appointmentId?: string;
  createdAt: number;
  syncedAt?: number;
}
// Connectivity state
export interface ConnectivityState {
  isOnline: boolean;
  lastChecked: number;
  pendingCount: number;
  syncingCount: number;
  failedCount: number;
}

