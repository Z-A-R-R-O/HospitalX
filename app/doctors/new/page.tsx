"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    fullName: "", 
    specialty: "", 
    role: "Consultant", 
    shiftStart: "09:00", 
    shiftEnd: "17:00", 
    location: ""
  });
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Saving doctor profile...");
    const response = await fetch("/api/doctors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setStatus("Could not save doctor. Check the details and try again."); return; }
    setStatus("Doctor added. Returning to roster...");
    setTimeout(() => router.push("/dashboard"), 700);
  }

  function fillDemoData() {
    setForm({
      fullName: "Dr. Rajesh Sharma",
      specialty: "Cardiology",
      role: "Chief Medical Officer",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      location: "OT 2"
    });
  }

  return (
    <main className="form-shell">
      <button className="back" onClick={() => router.push("/dashboard")}>← Back to Command Center</button>
      <section className="form-card" style={{ maxWidth: '600px' }}>
        <p>CITY CARE HOSPITAL</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0 }}>Add Staff (Doctor)</h1>
          <button type="button" onClick={fillDemoData} style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: 'none', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>Auto-fill</button>
        </div>
        <span style={{ display: 'block', marginBottom: '24px' }}>Register a new medical professional in the roster.</span>
        
        <form onSubmit={submit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ gridColumn: '1 / -1' }}>Full name<input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Dr. Kavita Nair" /></label>
            
            <label>Specialty<select required value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })}><option value="">Select</option><option>Cardiology</option><option>Neurology</option><option>Orthopedics</option><option>Pediatrics</option><option>Emergency</option><option>General Medicine</option></select></label>
            <label>Role<select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Consultant</option><option>Attending</option><option>Senior Consultant</option><option>Chief Medical Officer</option></select></label>
            
            <label>Shift Start<input type="time" value={form.shiftStart} onChange={e => setForm({ ...form, shiftStart: e.target.value })} /></label>
            <label>Shift End<input type="time" value={form.shiftEnd} onChange={e => setForm({ ...form, shiftEnd: e.target.value })} /></label>
            
            <label style={{ gridColumn: '1 / -1' }}>Current Assignment / Location<input required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. OPD Room 4, General Ward A" /></label>
          </div>
          
          <button className="primary" type="submit" style={{ marginTop: '24px', width: '100%' }}>Add to Roster</button>
          {status && <small className="form-status" style={{ textAlign: 'center', display: 'block', marginTop: '12px' }}>{status}</small>}
        </form>
      </section>
    </main>
  );
}
