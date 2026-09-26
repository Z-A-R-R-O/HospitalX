"use client";

import { useEffect, useCallback } from 'react';
import type { SyncMutation, SyncAction } from './types';
import { getSyncQueue, updateSyncMutation, removeSyncMutation, getPatient, savePatient, getScreening, saveScreening, getReferral, saveReferral } from './db';
import { useConnectivity } from './connectivity';

const SYNC_ENDPOINT = '/api/sync';
const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000;

/**
 * Sync Engine
 * 
 * Processes queued mutations in FIFO order when connectivity is available.
 * Sends mutations as a batch array to /api/sync.
 * Handles retries with exponential backoff.
 */

class SyncEngine {
  private isSyncing = false;
  private shouldStop = false;

  async start(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;
    this.shouldStop = false;

    try {
      await this.processQueue();
    } finally {
      this.isSyncing = false;
    }
  }

  stop(): void {
    this.shouldStop = true;
  }

  private async processQueue(): Promise<void> {
    const queue = await getSyncQueue();
    if (queue.length === 0) return;

    // Process mutations one at a time (wrapped in array for API compatibility)
    for (const mutation of queue) {
      if (this.shouldStop) break;

      try {
        await updateSyncMutation(mutation.id, { status: 'syncing' });

        // Send as array (API expects { mutations: [...] })
        const response = await fetch(SYNC_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mutations: [mutation] }),
        });

        if (response.ok) {
          const data = await response.json();
          const result = data.results?.[0];

          if (result && (result.status === 'created' || result.status === 'exists')) {
            await removeSyncMutation(mutation.id);
            if (result.serverId) {
              await this.updateEntityAfterSync(
                mutation.entity,
                mutation.payload as Record<string, unknown>,
                result.serverId
              );
            }
          } else {
            throw new Error(result?.error || 'Sync returned unexpected status');
          }
        } else {
          throw new Error(`Sync failed with HTTP ${response.status}`);
        }
      } catch (error) {
        const attempts = (mutation.attempts || 0) + 1;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const status = attempts >= MAX_RETRIES ? 'failed' as const : 'pending' as const;

        await updateSyncMutation(mutation.id, { attempts, errorMessage, status });

        if (attempts < MAX_RETRIES) {
          const backoff = Math.pow(2, attempts - 1) * BASE_BACKOFF_MS;
          await new Promise(resolve => setTimeout(resolve, backoff));
        }
      }
    }
  }

  private async updateEntityAfterSync(
    action: SyncAction,
    payload: Record<string, unknown>,
    serverId: string
  ): Promise<void> {
    const now = Date.now();
    const localId = payload._localId as string;
    if (!localId) return;

    if (action === 'create_patient') {
      const patient = await getPatient(localId);
      if (patient) {
        patient.serverId = serverId;
        patient.syncedAt = now;
        await savePatient(patient);
      }
    } else if (action === 'create_screening') {
      const screening = await getScreening(localId);
      if (screening) {
        screening.syncedAt = now;
        await saveScreening(screening);
      }
    } else if (action === 'create_referral') {
      const referral = await getReferral(localId);
      if (referral) {
        referral.syncedAt = now;
        await saveReferral(referral);
      }
    }
  }
}

const syncEngineInstance = new SyncEngine();

export function triggerSync(): void {
  syncEngineInstance.start();
}

export function useSyncEngine() {
  const { isOnline, forceSyncCountUpdate } = useConnectivity();

  const runSync = useCallback(async () => {
    if (isOnline) {
      await syncEngineInstance.start();
      await forceSyncCountUpdate();
    } else {
      syncEngineInstance.stop();
    }
  }, [isOnline, forceSyncCountUpdate]);

  useEffect(() => {
    runSync();
  }, [runSync]);

  return { triggerSync };
}
