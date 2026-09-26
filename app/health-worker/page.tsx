"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, ClipboardList, Send, RefreshCw, Users } from 'lucide-react';
import { WorkerCard, PatientCard, EmptyState } from './components';
import { getAllPatients, getAllScreenings, getAllReferrals } from '../../lib/offline/db';
import { triggerSync } from '../../lib/offline/sync-engine';
import { clearAllLocalData } from '../../lib/demo/controls';
import type { OfflinePatient } from '../../lib/offline/types';

export default function HealthWorkerHome() {
  const router = useRouter();
  const [patients, setPatients] = useState<OfflinePatient[]>([]);
  const [stats, setStats] = useState({ patients: 0, screenings: 0, referrals: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [pts, scrs, refs] = await Promise.all([
          getAllPatients(),
          getAllScreenings(),
          getAllReferrals()
        ]);
        
        setPatients(pts.slice(0, 5)); // Show recent 5
        setStats({
          patients: pts.length,
          screenings: scrs.length,
          referrals: refs.length
        });
      } catch (err) {
        console.error('Error loading offline data', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: 'white' }}>Welcome</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>Community Health Screening</p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'flex',
        gap: '12px',
        background: 'rgba(255,255,255,0.03)',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{stats.patients}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patients</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{stats.screenings}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Screenings</div>
        </div>
        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{stats.referrals}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Referrals</div>
        </div>
      </div>

      {/* Action Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <WorkerCard 
          icon={<UserPlus size={20} />}
          title="Register"
          subtitle="New Patient"
          color="var(--blue)"
          onClick={() => router.push('/health-worker/register')}
        />
        <WorkerCard 
          icon={<ClipboardList size={20} />}
          title="Screen"
          subtitle="Start Checkup"
          color="var(--green)"
          onClick={() => router.push('/health-worker/screen')}
        />
        <WorkerCard 
          icon={<Send size={20} />}
          title="Referrals"
          subtitle="View Sent"
          color="var(--purple)"
          onClick={() => router.push('/health-worker/referral')}
        />
        <WorkerCard 
          icon={<RefreshCw size={20} />}
          title="Sync"
          subtitle="Trigger"
          color="var(--orange)"
          onClick={() => triggerSync()}
        />
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '16px', marginTop: '8px' }}>Recent Patients</h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.5)' }}>Loading...</div>
        ) : patients.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {patients.map(patient => (
              <PatientCard 
                key={patient.localId} 
                patient={{
                  localId: patient.localId,
                  fullName: patient.fullName,
                  age: patient.age,
                  sex: patient.sex,
                  location: patient.location,
                  syncStatus: patient.syncStatus
                }} 
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<Users size={24} />}
            title="No Patients Yet"
            description="Start by registering a new patient in the system."
            action={{
              label: "Register Patient",
              onClick: () => router.push('/health-worker/register')
            }}
          />
        )}
      </div>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          onClick={async () => {
            if (confirm('Wipe all local data? This is for demo reset purposes.')) {
              await clearAllLocalData();
              window.location.reload();
            }
          }}
          style={{
            background: 'none',
            border: '1px solid rgba(239, 65, 72, 0.3)',
            color: 'var(--red, #ef4148)',
            padding: '8px 16px',
            borderRadius: '100px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Reset Demo Data
        </button>
      </div>

    </div>
  );
}
