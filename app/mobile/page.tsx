"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarPlus, ClipboardList, ScanLine, Sparkles } from "lucide-react";
import { MobileAction, MobileEmpty, MobileMetric, MobilePageHeader, MobileSectionHeading } from "./components";

type Overview = { metrics?: { patients?: number; appointmentsToday?: number; admissions?: number; availableBeds?: number }; tasks?: { id?: string; text: string; owner?: string; severity?: string }[] };

const fallback: Overview = {
  metrics: { patients: 128, appointmentsToday: 18, admissions: 6, availableBeds: 12 },
  tasks: [
    { id: "task-1", text: "Review Ramesh Das referral", owner: "Dr. Priya Iyer", severity: "urgent" },
    { id: "task-2", text: "Confirm afternoon neurology slots", owner: "Front desk", severity: "attention" },
  ],
};

export default function MobileDashboard() {
  const [overview, setOverview] = useState<Overview>(fallback);

  useEffect(() => {
    fetch("/api/overview", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data && setOverview(data))
      .catch(() => undefined);
  }, []);

  const metrics = overview.metrics ?? fallback.metrics!;

  return (
    <div className="mobile-stack">
      <MobilePageHeader eyebrow="Saturday, 26 September" title="Good morning, Arunez" detail="Here is the care picture for City Care Hospital." action={<button className="mobile-avatar" aria-label="Open profile">AZ</button>} />

      <section className="mobile-hero-card">
        <div><span className="mobile-eyebrow">Command brief</span><h2>Keep every next step visible.</h2><p>There are 2 referrals waiting for review and 4 appointments starting soon.</p></div>
        <div className="mobile-hero-orb"><Sparkles size={22} /></div>
        <a href="/mobile/ai">Open care brief <ArrowUpRight size={15} /></a>
      </section>

      <section className="mobile-metric-grid" aria-label="Hospital metrics">
        <MobileMetric label="Patients" value={String(metrics.patients ?? 0)} detail="active today" tone="blue" />
        <MobileMetric label="Visits" value={String(metrics.appointmentsToday ?? 0)} detail="scheduled today" tone="purple" />
        <MobileMetric label="Admissions" value={String(metrics.admissions ?? 0)} detail="in progress" tone="orange" />
        <MobileMetric label="Beds" value={String(metrics.availableBeds ?? 0)} detail="available now" tone="green" />
      </section>

      <section>
        <MobileSectionHeading title="Quick actions" />
        <div className="mobile-action-list">
          <MobileAction icon={<ClipboardList size={18} />} title="New screening" detail="Offline ready" href="/health-worker/screen" tone="green" />
          <MobileAction icon={<CalendarPlus size={18} />} title="Book a visit" detail="Find the next slot" href="/appointments/new" tone="purple" />
          <MobileAction icon={<ScanLine size={18} />} title="Review referrals" detail="2 need attention" href="/mobile/patients" tone="orange" />
        </div>
      </section>

      <section>
        <MobileSectionHeading title="Attention now" action="View all" />
        <div className="mobile-task-list">
          {(overview.tasks ?? []).slice(0, 3).map((task) => <article className="mobile-task" key={task.id ?? task.text}><span className={`mobile-task-dot ${task.severity === "urgent" ? "is-urgent" : ""}`} /><div><strong>{task.text}</strong><small>{task.owner ?? "Operations"}</small></div><ArrowUpRight size={16} /></article>)}
          {!overview.tasks?.length && <MobileEmpty title="No open tasks" detail="Your care team is clear for now." />}
        </div>
      </section>
    </div>
  );
}
