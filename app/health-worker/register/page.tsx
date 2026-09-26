"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { savePatient } from '../../../lib/offline/db';
import { queuePatientSync } from '../../../lib/offline/sync-queue';
import type { OfflinePatient } from '../../../lib/offline/types';

export default function RegisterPatient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    sex: 'Female',
    phone: '',
    location: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.age) newErrors.age = "Age is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const localId = crypto.randomUUID();
    const idempotencyKey = crypto.randomUUID();
    
    const patient: OfflinePatient = {
      localId,
      idempotencyKey,
      fullName: formData.fullName,
      age: parseInt(formData.age, 10),
      sex: formData.sex,
      phone: formData.phone,
      location: formData.location,
      syncStatus: 'pending',
      createdAt: Date.now()
    };

    try {
      await savePatient(patient);
      await queuePatientSync(patient);
      
      setShowToast(true);
      setTimeout(() => {
        router.push('/health-worker');
      }, 1500);
    } catch (err) {
      console.error('Failed to register patient', err);
      alert('Failed to save patient. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    color: 'white',
    fontSize: '16px',
    marginTop: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    marginTop: '20px'
  };

  const errorStyle = {
    color: 'var(--red)',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block'
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px 0', color: 'white' }}>
        Register New Patient
      </h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: '' });
            }}
            placeholder="e.g. Kamala Devi"
            style={{ ...inputStyle, borderColor: errors.fullName ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}
          />
          {errors.fullName && <span style={errorStyle}>{errors.fullName}</span>}
        </div>

        <div>
          <label style={labelStyle}>Age *</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => {
              setFormData({ ...formData, age: e.target.value });
              if (errors.age) setErrors({ ...errors, age: '' });
            }}
            placeholder="Years"
            style={{ ...inputStyle, borderColor: errors.age ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}
          />
          {errors.age && <span style={errorStyle}>{errors.age}</span>}
        </div>

        <div>
          <label style={labelStyle}>Sex</label>
          <select
            value={formData.sex}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            style={inputStyle}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 9876543210"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Village / Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: '' });
            }}
            placeholder="e.g. Ward 4"
            style={{ ...inputStyle, borderColor: errors.location ? 'var(--red)' : 'rgba(255,255,255,0.1)' }}
          />
          {errors.location && <span style={errorStyle}>{errors.location}</span>}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--blue)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            marginTop: '32px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(39, 124, 244, 0.3)'
          }}
        >
          Register Patient
        </button>
      </form>

      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--green)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(10, 156, 109, 0.4)',
          zIndex: 50,
          animation: 'slideUp 0.3s var(--ease)'
        }}>
          Patient registered! Will sync when online.
        </div>
      )}
    </div>
  );
}
