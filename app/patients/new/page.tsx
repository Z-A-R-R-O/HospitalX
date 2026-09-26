"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    fullName: "", 
    organizationId: "city-care", 
    externalIdentifier: "", 
    dateOfBirth: "", 
    sex: "", 
    phone: "",
    email: "",
    bloodGroup: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    address: "",
    primaryComplaint: "",
    medicalHistory: ""
  });
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Saving patient...");
    const response = await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setStatus("Could not save patient. Check the details and try again."); return; }
    setStatus("Patient saved. Returning to the queue...");
    setTimeout(() => router.push("/dashboard"), 700);
  }

  function fillDemoData() {
    setForm({
      fullName: "Ananya Sharma",
      organizationId: "city-care",
      externalIdentifier: "PT-29482",
      dateOfBirth: "1988-06-15",
      sex: "Female",
      phone: "+91 98765 43210",
      email: "ananya.s@example.com",
      bloodGroup: "O+",
      emergencyContactName: "Rajesh Sharma",
      emergencyContactPhone: "+91 91234 56789",
      address: "42 Residency Road, Bangalore, KA 560025",
      primaryComplaint: "Severe migraine and acute nausea since 48 hours.",
      medicalHistory: "Asthma (Mild). No known drug allergies."
    });
  }

  return (
    <main className="form-shell">
      <button className="back" onClick={() => router.push("/dashboard")}>← Back to Command Center</button>
      <section className="form-card" style={{ maxWidth: '700px' }}>
        <p>CITY CARE HOSPITAL</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0 }}>Register a patient</h1>
          <button type="button" onClick={fillDemoData} style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: 'none', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>Auto-fill Demo Data</button>
        </div>
        <span style={{ display: 'block', marginBottom: '24px' }}>Create a comprehensive patient record in the HospitalX registry.</span>
        
        <form onSubmit={submit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ gridColumn: '1 / -1' }}>Full name<input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Ananya Rao" /></label>
            
            <label>Patient ID<input value={form.externalIdentifier} onChange={e => setForm({ ...form, externalIdentifier: e.target.value })} placeholder="Optional (e.g. PT-1234)" /></label>
            <label>Date of birth<input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} /></label>
            
            <label>Sex<select value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></label>
            <label>Blood Group<select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></label>
            
            <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91" /></label>
            <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="patient@example.com" /></label>
            
            <label style={{ gridColumn: '1 / -1' }}>Address<input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full residential address" /></label>
            
            <label>Emergency Contact Name<input value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} placeholder="Name of relative" /></label>
            <label>Emergency Contact Phone<input value={form.emergencyContactPhone} onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })} placeholder="+91" /></label>
            
            <label style={{ gridColumn: '1 / -1' }}>Primary Complaint / Reason for Visit<input value={form.primaryComplaint} onChange={e => setForm({ ...form, primaryComplaint: e.target.value })} placeholder="Brief description of symptoms" /></label>
            
            <label style={{ gridColumn: '1 / -1' }}>Medical History & Allergies<textarea value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} placeholder="Known conditions, previous surgeries, allergies..." rows={3} style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', fontSize: '15px', color: 'var(--ink)', resize: 'vertical' }} /></label>
          </div>
          
          <button className="primary" type="submit" style={{ marginTop: '24px', width: '100%' }}>Save Comprehensive Profile</button>
          {status && <small className="form-status" style={{ textAlign: 'center', display: 'block', marginTop: '12px' }}>{status}</small>}
        </form>
      </section>
    </main>
  );
}
