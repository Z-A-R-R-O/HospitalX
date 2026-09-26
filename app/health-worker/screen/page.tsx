"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Search, ArrowRight, UserPlus, Brain, Activity, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

// Use correct imports based on provided schema
import { getAllPatients } from '@/lib/offline/db';
import type { OfflinePatient } from '@/lib/offline/types';

export default function ScreeningLauncherPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<OfflinePatient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await getAllPatients();
        // Sort by most recent first
        const sorted = data.sort((a, b) => b.createdAt - a.createdAt);
        setPatients(sorted);
      } catch (err) {
        console.error('Failed to load patients:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (p.localId && p.localId.includes(search))
  );

  const glassStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(30px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '20px',
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', color: '#fff', fontFamily: 'SF Pro Display, sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'var(--blue, #277cf4)', 
            padding: '12px', 
            borderRadius: '16px',
            boxShadow: '0 8px 16px rgba(39, 124, 244, 0.3)'
          }}>
            <Brain size={32} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Start Neurological Screening</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0', fontSize: '0.95rem' }}>
              Select a patient to begin the assessment
            </p>
          </div>
        </header>

        <section style={{ ...glassStyle, padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <FileText size={20} style={{ color: 'var(--purple, #7357e8)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>15 Questions</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Comprehensive</p>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ flex: 1, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Clock size={20} style={{ color: 'var(--orange, #ef9519)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>~3 Minutes</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Quick & Guided</p>
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ flex: 1, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Activity size={20} style={{ color: 'var(--green, #0a9c6d)' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>5 Categories</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Full spectrum</p>
              </div>
            </div>
          </div>
        </section>

        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...glassStyle,
              width: '100%',
              padding: '16px 16px 16px 48px',
              fontSize: '1rem',
              color: '#fff',
              outline: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'rgba(255,255,255,0.6)' }}>
            Loading patients...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ ...glassStyle, padding: '3rem 1.5rem', textAlign: 'center' }}>
            <User style={{ margin: '0 auto 1rem', color: 'rgba(255,255,255,0.4)' }} size={48} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
              {search ? 'No matches found' : 'No patients registered'}
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              {search ? 'Try adjusting your search terms.' : 'Register a new patient to begin screening.'}
            </p>
            <Link 
              href="/health-worker/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#fff',
                color: '#000',
                padding: '12px 24px',
                borderRadius: '24px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'transform 0.2s ease'
              }}
            >
              <UserPlus size={18} />
              Register Patient
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPatients.map(patient => (
              <button
                key={patient.localId}
                onClick={() => router.push(`/health-worker/screen/new?patient=${patient.localId}`)}
                style={{
                  ...glassStyle,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
                    {patient.fullName}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.75rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                    <span>{patient.age ? `${patient.age} yrs` : 'Age unknown'}</span>
                    <span>•</span>
                    <span>{patient.sex || 'Sex unknown'}</span>
                    {patient.location && (
                      <>
                        <span>•</span>
                        <span>{patient.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <ArrowRight size={20} color="#fff" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
