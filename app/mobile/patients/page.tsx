"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Search, UserPlus } from "lucide-react";
import { MobileEmpty, MobilePageHeader, MobileSectionHeading } from "../components";

type Patient = { id?: string; full_name?: string; age?: number; gender?: string; sex?: string; primary_complaint?: string; status?: string };

const demoPatients: Patient[] = [
  { id: "demo-1", full_name: "Vikram Malhotra", age: 68, gender: "Male", primary_complaint: "Tremor follow-up", status: "Active" },
  { id: "demo-2", full_name: "Ananya Sharma", age: 42, gender: "Female", primary_complaint: "Sleep and mood review", status: "Active" },
  { id: "demo-3", full_name: "Ramesh Iyer", age: 74, gender: "Male", primary_complaint: "Memory screening", status: "Review" },
];

export default function MobilePatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => { fetch("/api/patients").then((response) => response.ok ? response.json() : null).then((data) => setPatients(data?.patients?.length ? data.patients : demoPatients)).catch(() => setPatients(demoPatients)); }, []);
  const visible = patients.filter((patient) => (patient.full_name ?? "").toLowerCase().includes(query.toLowerCase()));

  return <div className="mobile-stack"><MobilePageHeader eyebrow="Care directory" title="Patients" detail="Find a patient, review context, or start a screening." action={<a className="mobile-round-action" href="/health-worker/register" aria-label="Register patient"><UserPlus size={18} /></a>} /><label className="mobile-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients" /></label><MobileSectionHeading title={`${visible.length || 0} people`} /><div className="mobile-patient-list">{visible.map((patient) => <a className="mobile-patient-row" href="/patients" key={patient.id ?? patient.full_name}><span className="mobile-patient-avatar">{(patient.full_name ?? "P").slice(0, 1)}</span><span><strong>{patient.full_name ?? "Unnamed patient"}</strong><small>{[patient.age ? `${patient.age} years` : null, patient.gender ?? patient.sex, patient.status ?? "Active"].filter(Boolean).join(" · ")}</small><em>{patient.primary_complaint ?? "No active complaint recorded"}</em></span><ArrowUpRight size={16} /></a>)}{!visible.length && <MobileEmpty title="No patients found" detail="Try another name or register a new patient." />}</div></div>;
}
