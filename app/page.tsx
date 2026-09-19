"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const nav = ["Home", "Patients", "Appointments", "OPD", "IPD & Beds", "Doctors", "Nursing", "Laboratory", "Radiology", "Pharmacy", "Billing", "Inventory", "Reports", "AI Assistant"];
const routes: Record<string, string> = {
  Patients: "/patients",
  Appointments: "/appointments",
  Laboratory: "/laboratory",
  Radiology: "/radiology",
  Pharmacy: "/pharmacy",
  Billing: "/billing",
};
type PatientRow = string[];
type Overview = {
  tasks?: { text: string }[];
  metrics?: { patients: number; appointmentsToday: number; admissions: number; beds: number; availableBeds: number };
  source?: string;
};
const formatPatient = (p: any): PatientRow => [
  p.external_identifier ?? p.id?.slice(0, 8) ?? "—",
  p.full_name,
  p.age ? `${p.age} / ${p.sex ?? "—"}` : `— / ${p.sex ?? "—"}`,
  p.appointment_type ?? "—",
  p.provider_name ?? "—",
  p.status ?? "—",
  p.starts_at ? new Date(p.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
];

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState("Home");
  const [tasks, setTasks] = useState<string[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [people, setPeople] = useState<PatientRow[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/overview")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d: Overview) => {
        setTasks((d.tasks ?? []).map((t) => t.text));
        setOverview(d);
        setUpdatedAt(new Date());
      })
      .catch(() => {
        setTasks([]);
        setOverview(null);
      })
      .finally(() => setTasksLoading(false));

    fetch("/api/patients")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => setPeople((d.patients ?? []).map(formatPatient)))
      .catch(() => setPeople([]))
      .finally(() => setPeopleLoading(false));
  }, []);

  const now = useMemo(() => new Date(), []);
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(now);
  const timeLabel = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(now);
  const freshness = updatedAt
    ? `${overview?.source === "neon" ? "Live Neon data" : "Operational data"} · updated ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(updatedAt)}`
    : "Operational data unavailable";

  const go = (workspace: string) => {
    setActive(workspace);
    const destination = routes[workspace];
    if (destination) {
      router.push(destination);
      return;
    }
    setToast(workspace === "Home" ? "" : `Opening ${workspace} workspace…`);
    setTimeout(() => setToast(""), 1800);
  };

  const metrics = [
    ["♙", overview?.metrics?.patients, "Total Patients"],
    ["▣", overview?.metrics?.appointmentsToday, "OPD Today"],
    ["▱", overview?.metrics?.admissions, "Admissions"],
    ["⇥", overview?.metrics?.availableBeds, "Available Beds"],
  ];

  return <div className="app">
    <aside>
      <button className="brand" type="button" onClick={() => go("Home")}><b>H</b><span><strong>HospitalX</strong><small>Care. Connected.</small></span></button>
      <nav>{nav.map((x, i) => <button type="button" key={x} className={active === x ? "on" : ""} onClick={() => go(x)}><i>{["⌂", "♙", "▣", "◷", "▱", "♧", "♡"][i % 7]}</i>{x}</button>)}</nav>
      <div className="quote">Better<br />Systems.<br />Brighter<br />Lives.</div>
      <div className="user"><b>AZ</b><span>Dr. Arunez Zarro<small>Administrator</small></span>•••</div>
    </aside>
    <main>
      <header>
        <label>⌕<input aria-label="Search HospitalX" placeholder="Search patients, staff, beds, or ask anything..." /></label>
        <div>{dateLabel}<br /><b>{timeLabel}</b></div>
        <button type="button" aria-label="Display settings">☼</button><button type="button" aria-label="Recent activity">◔</button><button type="button" aria-label="Account">♧</button>
      </header>
      {active === "Home" ? <>
        <section className="hero"><div><p>CITY CARE HOSPITAL</p><h1>Good morning, Dr. Arunez.</h1><span>Here’s what’s happening at your hospital today.</span></div><aside>People First.<br />Always.</aside></section>
        <section className="top">
          <div className="metrics">{metrics.map(([icon, value, label]) => <article key={String(label)}><i>{icon}</i><b>{tasksLoading ? "—" : value ?? "—"}<small>{label}</small><em>{overview?.source === "neon" ? "● Live" : "○ Offline"}</em></b><span aria-hidden="true">▁▃▅▂▆▃▇</span></article>)}</div>
          <div className="ai"><i>◉</i><div><b>HospitalX AI <small>BETA</small></b><span>Your operational co-pilot.</span></div><button type="button" aria-label="Open HospitalX AI" onClick={() => setToast("HospitalX AI is ready.")}>→</button></div>
        </section>
        <section className="grid">
          <div>
            <section className="panel queue">
              <header><h2>Today’s Patient Queue <small>● Live</small></h2><span>{peopleLoading ? "Loading…" : `${people.length} registered`}　 <b>View All →</b></span></header>
              <table><thead><tr><th>#</th><th>Patient</th><th>Age / Gender</th><th>Type</th><th>Doctor</th><th>Status</th><th>ETA</th><th /></tr></thead><tbody>{peopleLoading ? <tr><td colSpan={8}>Loading live patients…</td></tr> : people.length ? people.map((x) => <tr key={x[0]}>{x.map((c, i) => <td key={i} className={c === "Emergency" ? "red" : ""}>{i === 1 ? <b>{c}</b> : i === 5 ? <span className={"status " + c.replace(" ", "")}>● {c}</span> : c}</td>)}<td>•••</td></tr>) : <tr><td colSpan={8}>No patients registered yet. Use New Patient to create the first record.</td></tr>}</tbody></table>
            </section>
            <section className="charts"><Chart title="Bed Utilization" main={overview?.metrics ? `${overview.metrics.beds - overview.metrics.availableBeds} / ${overview.metrics.beds}` : "—"} sub="occupied / configured" body="Live bed utilization updates as admissions and discharges are recorded." /><Chart title="Department Load" main={overview?.metrics?.appointmentsToday ?? "—"} sub="appointments today" body="Department load is sourced from live appointments." /><Chart title="Today’s Revenue" main="—" sub="No billing data" body="Revenue will appear after billing events are recorded." /></section>
          </div>
          <div className="rail">
            <section className="prompts">{["Show today’s delayed discharges", "Which patients are waiting for lab results?", "Summarize ICU status", "Generate tomorrow’s briefing"].map((x) => <button type="button" key={x} onClick={() => setToast(`${x} is being prepared.`)}>▧　{x}</button>)}<label><input aria-label="Ask HospitalX AI" placeholder="Ask anything..." /><b>›</b></label></section>
            <section className="attention"><header><h2>⚠　Needs Attention</h2><b>{tasksLoading ? "…" : tasks.length}</b></header>{tasksLoading ? <p className="attention-empty">Loading live tasks…</p> : tasks.length ? tasks.map((x, i) => <button type="button" key={x} onClick={() => setTasks((t) => t.filter((_, n) => n !== i))}><i /> <span>{x}</span><em>{12 + i * 6} min ago</em></button>) : <p className="attention-empty">No live operational tasks.</p>}</section>
            <section className="quick"><h2>Quick Actions</h2><button type="button" onClick={() => go("Patients")}>♙<span>New Patient</span></button><button type="button" onClick={() => go("Appointments")}>▣<span>Book Appointment</span></button><button type="button" onClick={() => setToast("Admit Patient flow opened.")}>♙<span>Admit Patient</span></button><button type="button" onClick={() => go("Billing")}>▤<span>Generate Bill</span></button></section>
          </div>
        </section>
        <p className="data-freshness" role="status">{freshness}</p>
      </> : <section className="empty"><p>CITY CARE HOSPITAL</p><h1>{active}</h1><span>This HospitalX workspace is ready to connect to its live module.</span></section>}
      <footer>HospitalX v1.0　│　 People × Technology × Better Care <span>● All Systems Operational　│　 Built for a Healthier India</span></footer>
    </main>
    <div className={toast ? "toast show" : "toast"}>{toast}</div>
  </div>;
}

function Chart({ title, main, sub, body }: { title: string; main: string | number; sub: string; body: string }) {
  return <article className="panel chart"><h2>{title}</h2><strong>{main}<small>{sub}</small></strong><p><span>{body}</span></p><button type="button">View {title.includes("Revenue") ? "Reports" : title.includes("Bed") ? "Beds" : "Departments"} →</button></article>;
}
