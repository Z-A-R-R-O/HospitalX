"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", organizationId: "city-care", externalIdentifier: "", dateOfBirth: "", sex: "", phone: "" });
  const [status, setStatus] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("Saving patient…");
    const response = await fetch("/api/patients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setStatus("Could not save patient. Check the details and try again."); return; }
    setStatus("Patient saved. Returning to the queue…");
    setTimeout(() => router.push("/"), 700);
  }

  return <main className="form-shell"><button className="back" onClick={() => router.push("/")}>← Back to Command Center</button><section className="form-card"><p>CITY CARE HOSPITAL</p><h1>Register a patient</h1><span>Create a real patient record in the HospitalX registry.</span><form onSubmit={submit}><label>Full name<input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Ananya Rao" /></label><div className="form-grid"><label>Patient ID<input value={form.externalIdentifier} onChange={e => setForm({ ...form, externalIdentifier: e.target.value })} placeholder="Optional" /></label><label>Date of birth<input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} /></label><label>Sex<select value={form.sex} onChange={e => setForm({ ...form, sex: e.target.value })}><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></label><label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91" /></label></div><button className="primary" type="submit">Save patient</button>{status && <small className="form-status">{status}</small>}</form></section></main>;
}
