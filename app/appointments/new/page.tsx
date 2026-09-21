"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Patient = { id: string; full_name: string; external_identifier?: string | null };

export default function NewAppointmentPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [form, setForm] = useState({ patientId: "", providerName: "", appointmentType: "Consultation", startsAt: "" });
  const [status, setStatus] = useState("Loading patients…");
  useEffect(() => { fetch("/api/patients").then(r => r.ok ? r.json() : Promise.reject()).then(d => { setPatients(d.patients ?? []); setStatus(""); }).catch(() => setStatus("Could not load patients.")); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); setStatus("Saving appointment…"); const response = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (!response.ok) { setStatus("Could not save appointment. Check the details."); return; } setStatus("Appointment saved."); setTimeout(() => router.push("/dashboard"), 700); }
  return <main className="form-shell"><button className="back" onClick={() => router.push("/dashboard")}>← Back to Command Center</button><section className="form-card"><p>CITY CARE HOSPITAL</p><h1>Book an appointment</h1><span>Schedule a real appointment against a registered patient.</span><form onSubmit={submit}><label>Patient<select required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}><option value="">{patients.length ? "Select a patient" : "No patients registered"}</option>{patients.map(p => <option key={p.id} value={p.id}>{p.full_name}{p.external_identifier ? ` · ${p.external_identifier}` : ""}</option>)}</select></label><div className="form-grid"><label>Provider<input required value={form.providerName} onChange={e => setForm({ ...form, providerName: e.target.value })} placeholder="Dr. Priya" /></label><label>Type<select value={form.appointmentType} onChange={e => setForm({ ...form, appointmentType: e.target.value })}><option>Consultation</option><option>Follow-up</option><option>Emergency</option><option>Review</option></select></label></div><label>Start time<input required type="datetime-local" value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} /></label><button className="primary" type="submit" disabled={!patients.length}>Book appointment</button>{status && <small className="form-status">{status}</small>}</form></section></main>;
}
