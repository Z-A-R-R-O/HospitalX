declare global {
  interface Window {
    __SWASTHYASETU_DEMO?: boolean;
    __SWASTHYASETU_DEMO_OFFLINE?: boolean;
  }
}

export function isDemoMode(): boolean { 
  return typeof window !== 'undefined' && window.__SWASTHYASETU_DEMO === true; 
}

export function setDemoMode(on: boolean): void { 
  if (typeof window !== 'undefined') window.__SWASTHYASETU_DEMO = on; 
}

export function isDemoOffline(): boolean { 
  return typeof window !== 'undefined' && window.__SWASTHYASETU_DEMO_OFFLINE === true; 
}

export function setDemoOffline(offline: boolean): void { 
  if (typeof window !== 'undefined') window.__SWASTHYASETU_DEMO_OFFLINE = offline; 
}

export async function clearAllLocalData(): Promise<void> {
  if (typeof window !== 'undefined' && window.indexedDB) {
    return new Promise((resolve, reject) => {
      const req = window.indexedDB.deleteDatabase('swasthyasetu-offline');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}
