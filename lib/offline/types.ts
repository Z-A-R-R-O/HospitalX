// Sync queue mutation types
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type SyncAction = 'create_patient' | 'create_screening' | 'create_referral';

export interface SyncMutation {
  id: string;              // Local UUID
  idempotencyKey: string;  // Sent to server for dedup
  entity: SyncAction;
  payload: Record<string, unknown>;
  status: SyncStatus;
  attempts: number;
  errorMessage?: string;
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
