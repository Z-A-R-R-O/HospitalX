"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarPlus, Clock3 } from "lucide-react";
import { MobileEmpty, MobilePageHeader, MobileSectionHeading } from "../components";

type Appointment = { id?: string; full_name?: string; provider_name?: string; appointment_type?: string; starts_at?: string; status?: string };

export default function MobileAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  useEffect(() => { fetch("/api/appointments").then((response) => response.ok ? response.json() : null).then((data) => setAppointments(data?.appointments ?? [])).catch(() => undefined); }, []);

  return <div className="mobile-stack"><MobilePageHeader eyebrow="Today" title="Visits" detail="The next handoff should always be clear." action={<a className="mobile-round-action" href="/appointments/new" aria-label="Book appointment"><CalendarPlus size={18} /></a>} /><section className="mobile-next-visit"><span className="mobile-eyebrow">Next visit</span><strong>{appointments[0]?.full_name ?? "Vikram Malhotra"}</strong><p>{appointments[0]?.provider_name ?? "Dr. Priya Iyer"} · {appointments[0]?.appointment_type ?? "Neurology"}</p><div><Clock3 size={15} />{appointments[0]?.starts_at ? new Date(appointments[0].starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "10:30 AM"}<span>Today</span></div></section><MobileSectionHeading title="Upcoming" action="Calendar" /><div className="mobile-appointment-list">{appointments.slice(1, 6).map((appointment) => <article className="mobile-appointment-row" key={appointment.id}><span className="mobile-time"><strong>{appointment.starts_at ? new Date(appointment.starts_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "—"}</strong><small>{appointment.status ?? "scheduled"}</small></span><span><strong>{appointment.full_name ?? "Patient"}</strong><small>{appointment.provider_name ?? "Care team"}</small></span><ArrowUpRight size={16} /></article>)}{!appointments.length && <MobileEmpty title="No visits today" detail="Book a visit when a patient is ready." />}</div></div>;
}
