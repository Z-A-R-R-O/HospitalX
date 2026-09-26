"use client";

import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export function StatusBar({ isOnline, pendingCount, syncingCount, failedCount }: { isOnline: boolean, pendingCount: number, syncingCount: number, failedCount: number }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      fontSize: '12px',
      fontWeight: 500
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isOnline ? 'var(--green)' : 'var(--red)' }}>
        {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
        {isOnline ? 'Online' : 'Offline'}
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        {pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--orange)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--orange)' }} />
            {pendingCount} Pending
          </div>
        )}
        {syncingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--blue)' }}>
            <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
            {syncingCount} Syncing
          </div>
        )}
        {failedCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--red)' }}>
            <AlertCircle size={12} />
            {failedCount} Failed
          </div>
        )}
        {isOnline && pendingCount === 0 && syncingCount === 0 && failedCount === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--green)' }}>
            <CheckCircle2 size={12} />
            Synced
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkerCard({ icon, title, subtitle, count, color, onClick }: { icon: React.ReactNode, title: string, subtitle: string, count?: number, color: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '20px',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(30px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.3s var(--ease)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        background: `color-mix(in srgb, ${color} 20%, transparent)`,
        color: color,
        marginBottom: '16px'
      }}>
        {icon}
      </div>
      
      <div style={{ fontSize: '16px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
        {subtitle}
      </div>
      
      {count !== undefined && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: color,
          color: 'white',
          fontSize: '12px',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '10px'
        }}>
          {count}
        </div>
      )}
    </button>
  );
}

export function SyncStatusBadge({ status }: { status: 'pending' | 'syncing' | 'synced' | 'failed' }) {
  const colors = {
    pending: 'var(--orange)',
    syncing: 'var(--blue)',
    synced: 'var(--green)',
    failed: 'var(--red)'
  };
  
  const labels = {
    pending: 'Pending Sync',
    syncing: 'Syncing...',
    synced: 'Synced',
    failed: 'Sync Failed'
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 600,
      background: `color-mix(in srgb, ${colors[status]} 15%, transparent)`,
      color: colors[status],
      border: `1px solid color-mix(in srgb, ${colors[status]} 30%, transparent)`
    }}>
      {status === 'syncing' && <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />}
      {labels[status]}
    </span>
  );
}

export function PatientCard({ patient, onClick }: { patient: { localId: string, fullName: string, age?: number, sex?: string, location?: string, syncStatus?: 'pending' | 'syncing' | 'synced' | 'failed' }, onClick?: () => void }) {
  const isSynced = patient.syncStatus === 'synced';
  
  return (
    <div
      onClick={onClick}
      style={{
        padding: '16px',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(30px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s var(--ease)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>
            {patient.fullName}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
            {[patient.age ? `${patient.age}y` : null, patient.sex, patient.location].filter(Boolean).join(' • ')}
          </div>
        </div>
        <SyncStatusBadge status={patient.syncStatus || 'pending'} />
      </div>
    </div>
  );
}

export function OfflineToggle({ isOffline, onToggle }: { isOffline: boolean, onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '20px',
        background: isOffline ? 'color-mix(in srgb, var(--red) 15%, transparent)' : 'color-mix(in srgb, var(--green) 15%, transparent)',
        border: `1px solid ${isOffline ? 'color-mix(in srgb, var(--red) 30%, transparent)' : 'color-mix(in srgb, var(--green) 30%, transparent)'}`,
        color: isOffline ? 'var(--red)' : 'var(--green)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s var(--ease)'
      }}
    >
      {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
      {isOffline ? 'Demo: Offline' : 'Demo: Online'}
    </button>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action?: { label: string, onClick: () => void } }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '20px',
      border: '1px dashed rgba(255,255,255,0.1)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '32px',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '16px'
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', maxWidth: '240px', marginBottom: action ? '24px' : '0' }}>
        {description}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '10px 20px',
            background: 'var(--blue)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
