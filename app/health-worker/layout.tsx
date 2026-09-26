"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusSquare, ClipboardList, Send } from 'lucide-react';
import { StatusBar, OfflineToggle } from './components';
import { ConnectivityProvider, useConnectivity } from '../../lib/offline/connectivity';
import { useSyncEngine } from '../../lib/offline/sync-engine';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOnline, pendingCount, setDemoOffline } = useConnectivity();
  useSyncEngine(); // Keeps the sync queue processing in the background when online

  const handleToggleOffline = () => {
    setDemoOffline(isOnline); // toggle demo offline mode
  };

  const tabs = [
    { name: 'Home', path: '/health-worker', icon: <Home size={20} /> },
    { name: 'Register', path: '/health-worker/register', icon: <PlusSquare size={20} /> },
    { name: 'Screening', path: '/health-worker/screen', icon: <ClipboardList size={20} /> },
    { name: 'Referrals', path: '/health-worker/referral', icon: <Send size={20} /> }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--ink, #101827)',
      color: 'white',
      fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 50px rgba(0,0,0,0.5)',
        background: 'linear-gradient(180deg, #111 0%, #000 100%)',
      }}>
        {/* Top Bar */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(90deg, #277cf4, #0a9c6d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SwasthyaSetu
          </div>
          <OfflineToggle isOffline={!isOnline} onToggle={handleToggleOffline} />
        </div>

        {/* Status Bar */}
        <StatusBar 
          isOnline={isOnline} 
          pendingCount={pendingCount} 
          syncingCount={0} 
          failedCount={0} 
        />

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px' }}>
          {children}
        </div>

        {/* Bottom Navigation */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(15,15,15,0.85)',
          backdropFilter: 'blur(30px) saturate(200%)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          zIndex: 20
        }}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.path || (tab.path !== '/health-worker' && pathname?.startsWith(tab.path));
            return (
              <Link
                key={tab.path}
                href={tab.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  color: isActive ? 'var(--blue)' : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.2s ease',
                  flex: 1
                }}
              >
                {tab.icon}
                <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 500 }}>
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HealthWorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConnectivityProvider>
      <LayoutInner>{children}</LayoutInner>
    </ConnectivityProvider>
  );
}
