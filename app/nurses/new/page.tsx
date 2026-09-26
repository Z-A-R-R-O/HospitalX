"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNursePage() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    fullName: "", 
    role: "Staff Nurse", 
    ward: "", 
    shiftStart: "07:00", 
    shiftEnd: "15:00", 
    patientLoad: 4
  });
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Saving nursing profile...");
    const response = await fetch("/api/nurses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setStatus("Could not save nurse. Check the details and try again."); return; }
    setStatus("Nurse assigned. Returning to nursing station...");
    setTimeout(() => router.push("/dashboard"), 700);
  }

  function fillDemoData() {
    setForm({
      fullName: "Anita Patel",
      role: "Charge Nurse",
      ward: "Intensive Care (ICU)",
      shiftStart: "07:00",
      shiftEnd: "15:00",
      patientLoad: 4
    });
  }

  return (
    <main className="form-shell">
      <button className="back" onClick={() => router.push("/dashboard")}>← Back to Command Center</button>
      <section className="form-card" style={{ maxWidth: '600px' }}>
        <p>CITY CARE HOSPITAL</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ margin: 0 }}>Assign Shift (Nursing)</h1>
          <button type="button" onClick={fillDemoData} style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', border: 'none', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: '0.2s' }}>Auto-fill</button>
        </div>
        <span style={{ display: 'block', marginBottom: '24px' }}>Assign a nurse to a ward and schedule their shift.</span>
        
        <form onSubmit={submit}>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ gridColumn: '1 / -1' }}>Full name<input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Jacob Thomas" /></label>
            
            <label>Role<select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Staff Nurse</option><option>Charge Nurse</option><option>Head Nurse</option><option>Trainee Nurse</option></select></label>
            <label>Ward Assignment<select required value={form.ward} onChange={e => setForm({ ...form, ward: e.target.value })}><option value="">Select Ward</option><option>Intensive Care (ICU)</option><option>General Ward A</option><option>General Ward B</option><option>Emergency (ER)</option><option>Pediatrics</option><option>Floor Supervisor</option></select></label>
            
            <label>Shift Start<input type="time" value={form.shiftStart} onChange={e => setForm({ ...form, shiftStart: e.target.value })} /></label>
            <label>Shift End<input type="time" value={form.shiftEnd} onChange={e => setForm({ ...form, shiftEnd: e.target.value })} /></label>
            
            <label style={{ gridColumn: '1 / -1' }}>Patient Load Capacity<input type="number" required value={form.patientLoad} onChange={e => setForm({ ...form, patientLoad: parseInt(e.target.value) || 0 })} placeholder="Max patients per shift" /></label>
          </div>
          
          <button className="primary" type="submit" style={{ marginTop: '24px', width: '100%' }}>Assign to Ward</button>
          {status && <small className="form-status" style={{ textAlign: 'center', display: 'block', marginTop: '12px' }}>{status}</small>}
        </form>
      </section>
    </main>
  );
}
