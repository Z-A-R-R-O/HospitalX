"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ConnectivityState } from './types';
import { getPendingCount } from './db';

const HEALTH_ENDPOINT = '/api/health';
const ONLINE_POLL_MS = 30_000;
const OFFLINE_POLL_MS = 10_000;

interface ConnectivityContextType extends ConnectivityState {
  setDemoOffline: (offline: boolean) => void;
  forceSyncCountUpdate: () => Promise<void>;
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

export function ConnectivityProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);
  const [demoOffline, setDemoOffline] = useState(false);
  const [lastChecked, setLastChecked] = useState(Date.now());
  const [pendingCount, setPendingCount] = useState(0);
  const [syncingCount, setSyncingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  const effectiveIsOnline = demoOffline ? false : isOnline;

  const checkConnectivity = useCallback(async () => {
    if (demoOffline) return;
    try {
      const res = await fetch(HEALTH_ENDPOINT, { method: 'GET', cache: 'no-store' });
      setIsOnline(res.ok);
    } catch {
      setIsOnline(false);
    }
    setLastChecked(Date.now());
  }, [demoOffline]);

  const updatePendingCount = useCallback(async () => {
    try {
      const count = await getPendingCount();
      setPendingCount(count);
    } catch {
      // IndexedDB not available (SSR)
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => checkConnectivity();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    checkConnectivity();
    updatePendingCount();

    const interval = setInterval(() => {
      checkConnectivity();
      updatePendingCount();
    }, effectiveIsOnline ? ONLINE_POLL_MS : OFFLINE_POLL_MS);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnectivity, effectiveIsOnline, updatePendingCount]);

  return (
    <ConnectivityContext.Provider value={{
      isOnline: effectiveIsOnline,
      lastChecked,
      pendingCount,
      syncingCount,
      failedCount,
      setDemoOffline,
      forceSyncCountUpdate: updatePendingCount
    }}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    // Return safe defaults when outside provider (e.g. during SSR or in pages that don't use the provider)
    return {
      isOnline: true,
      lastChecked: Date.now(),
      pendingCount: 0,
      syncingCount: 0,
      failedCount: 0,
      setDemoOffline: () => {},
      forceSyncCountUpdate: async () => {},
    };
  }
  return context;
}
