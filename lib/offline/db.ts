import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { OfflinePatient, OfflineScreening, OfflineReferral, SyncMutation } from './types';

interface OfflineDB extends DBSchema {
  patients: {
    key: string;
    value: OfflinePatient;
  };
  screenings: {
    key: string;
    value: OfflineScreening;
  };
  referrals: {
    key: string;
    value: OfflineReferral;
  };
  syncQueue: {
    key: string;
    value: SyncMutation;
  };
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export function getOfflineDB() {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return null;
  }

  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>('swasthyasetu-offline', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('patients')) {
          db.createObjectStore('patients', { keyPath: 'localId' });
        }
        if (!db.objectStoreNames.contains('screenings')) {
          db.createObjectStore('screenings', { keyPath: 'localId' });
        }
        if (!db.objectStoreNames.contains('referrals')) {
          db.createObjectStore('referrals', { keyPath: 'localId' });
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function savePatient(patient: OfflinePatient) {
  const db = await getOfflineDB();
  if (db) await db.put('patients', patient);
}

export async function getPatient(localId: string) {
  const db = await getOfflineDB();
  return db ? db.get('patients', localId) : undefined;
}

export async function getAllPatients() {
  const db = await getOfflineDB();
  return db ? db.getAll('patients') : [];
}

export async function saveScreening(screening: OfflineScreening) {
  const db = await getOfflineDB();
  if (db) await db.put('screenings', screening);
}

export async function getScreening(localId: string) {
  const db = await getOfflineDB();
  return db ? db.get('screenings', localId) : undefined;
}

export async function getAllScreenings() {
  const db = await getOfflineDB();
  return db ? db.getAll('screenings') : [];
}

export async function getScreeningsForPatient(patientLocalId: string) {
  const all = await getAllScreenings();
  return all.filter(s => s.patientLocalId === patientLocalId);
}

export async function saveReferral(referral: OfflineReferral) {
  const db = await getOfflineDB();
  if (db) await db.put('referrals', referral);
}

export async function getReferral(localId: string) {
  const db = await getOfflineDB();
  return db ? db.get('referrals', localId) : undefined;
}

export async function getAllReferrals() {
  const db = await getOfflineDB();
  return db ? db.getAll('referrals') : [];
}

export async function addToSyncQueue(mutation: SyncMutation) {
  const db = await getOfflineDB();
  if (db) await db.put('syncQueue', mutation);
}

export async function getSyncQueue() {
  const db = await getOfflineDB();
  if (!db) return [];
  const all = await db.getAll('syncQueue');
  return all
    .filter(m => m.status === 'pending' || m.status === 'failed')
    .sort((a, b) => a.createdAt - b.createdAt);
}

export async function updateSyncMutation(id: string, updates: Partial<SyncMutation>) {
  const db = await getOfflineDB();
  if (!db) return;
  
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  const mutation = await store.get(id);
  
  if (mutation) {
    await store.put({ ...mutation, ...updates });
  }
  await tx.done;
}

export async function removeSyncMutation(id: string) {
  const db = await getOfflineDB();
  if (db) await db.delete('syncQueue', id);
}

export async function getPendingCount() {
  const queue = await getSyncQueue();
  return queue.length;
}

export async function clearAllData() {
  const db = await getOfflineDB();
  if (!db) return;
  const tx = db.transaction(['patients', 'screenings', 'referrals', 'syncQueue'], 'readwrite');
  await tx.objectStore('patients').clear();
  await tx.objectStore('screenings').clear();
  await tx.objectStore('referrals').clear();
  await tx.objectStore('syncQueue').clear();
  await tx.done;
}
