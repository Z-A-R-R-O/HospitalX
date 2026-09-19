"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import type { LucideIcon } from "lucide-react";
import {
  Activity, AlertTriangle, ArrowUpRight, BedDouble, Bell, Bot, Boxes,
  CalendarDays, CalendarPlus, ChevronRight, CircleDot, Clock3, Command,
  Expand, FileText, FlaskConical, HeartPulse, Home as HomeIcon, IndianRupee,
  LogOut, Menu, Moon, Pill, ReceiptText, ScanLine, Search, Sparkles,
  Stethoscope, Sun, UserPlus, Users, X,
} from "lucide-react";

type PatientRow = string[];
type OperationalTask = { id?: string; text: string; owner?: string; severity?: string; due_at?: string; created_at?: string };
type Overview = {
  tasks?: OperationalTask[];
  metrics?: { patients: number; appointmentsToday: number; admissions: number; beds: number; availableBeds: number };
  source?: string;
};
type NavItem = { label: string; icon: LucideIcon; href?: string };

const nav: NavItem[] = [
  { label: "Home", icon: HomeIcon },
  { label: "Patients", icon: Users, href: "/patients" },
  { label: "Appointments", icon: CalendarDays, href: "/appointments" },
  { label: "OPD", icon: Clock3 },
  { label: "IPD & Beds", icon: BedDouble },
  { label: "Doctors", icon: Stethoscope },
  { label: "Nursing", icon: HeartPulse },
  { label: "Laboratory", icon: FlaskConical, href: "/laboratory" },
  { label: "Radiology", icon: ScanLine, href: "/radiology" },
  { label: "Pharmacy", icon: Pill, href: "/pharmacy" },
  { label: "Billing", icon: ReceiptText, href: "/billing" },
  { label: "Inventory", icon: Boxes, href: "/inventory" },
  { label: "Reports", icon: FileText, href: "/reports" },
  { label: "AI Assistant", icon: Sparkles },
];

const formatPatient = (patient: any): PatientRow => [
  patient.external_identifier ?? patient.id?.slice(0, 8) ?? "—",
  patient.full_name,
  patient.age ? `${patient.age} / ${patient.sex ?? "—"}` : `— / ${patient.sex ?? "—"}`,
  patient.appointment_type ?? "—",
  patient.provider_name ?? "—",
  patient.status ?? "—",
  patient.starts_at ? new Date(patient.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
];

const statusClass = (status: string) => status.toLowerCase().replace(/[^a-z]+/g, "-");

export default function Home() {
  const router = useRouter();
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const [active, setActive] = useState("Home");
  const [tasks, setTasks] = useState<OperationalTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [people, setPeople] = useState<PatientRow[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [clock, setClock] = useState<Date | null>(null);
  const [toast, setToast] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [queueFilter, setQueueFilter] = useState("All");

  useEffect(() => {
    const updateClock = () => setClock(new Date());
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/overview")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Overview) => {
        setTasks(data.tasks ?? []);
        setOverview(data);
        setUpdatedAt(new Date());
      })
      .catch(() => { setTasks([]); setOverview(null); })
      .finally(() => setTasksLoading(false));

    fetch("/api/patients")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setPeople((data.patients ?? []).map(formatPatient)))
      .catch(() => setPeople([]))
      .finally(() => setPeopleLoading(false));
  }, []);

  const dateLabel = useMemo(
    () => clock ? new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(clock) : "—",
    [clock],
  );
  const timeLabel = useMemo(
    () => clock ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(clock) : "—",
    [clock],
  );
  const freshness = updatedAt
    ? `${overview?.source === "neon" ? "Live Neon data" : "Operational data"} · updated ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(updatedAt)}`
    : "Operational data unavailable";

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const go = (item: NavItem) => {
    setActive(item.label);
    setNavOpen(false);
    if (item.href) { router.push(item.href); return; }
    if (item.label !== "Home") showToast(`Opening ${item.label} workspace…`);
  };

  const metrics = [
    { icon: Users, value: overview?.metrics?.patients, label: "Total Patients", tone: "blue" },
    { icon: CalendarDays, value: overview?.metrics?.appointmentsToday, label: "OPD Today", tone: "green" },
    { icon: BedDouble, value: overview?.metrics?.admissions, label: "Admissions", tone: "indigo" },
    { icon: LogOut, value: overview?.metrics?.availableBeds, label: "Available Beds", tone: "orange" },
  ];
  const queueFilters = useMemo(() => {
    const count = (matcher: (status: string) => boolean) => people.filter((row) => matcher(row[5].toLowerCase())).length;
    return [
      { label: "All", count: people.length, match: () => true },
      { label: "Waiting", count: count((status) => status.includes("waiting")), match: (status: string) => status.includes("waiting") },
      { label: "In Consultation", count: count((status) => status.includes("consultation")), match: (status: string) => status.includes("consultation") },
      { label: "Completed", count: count((status) => status.includes("completed")), match: (status: string) => status.includes("completed") },
    ];
  }, [people]);
  const filteredPeople = useMemo(() => {
    const filter = queueFilters.find((item) => item.label === queueFilter);
    return filter ? people.filter((row) => filter.match(row[5].toLowerCase())) : people;
  }, [people, queueFilter, queueFilters]);

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      <button className="mobile-menu" type="button" aria-label={navOpen ? "Close navigation" : "Open navigation"} onClick={() => setNavOpen((open) => !open)}>{navOpen ? <X /> : <Menu />}</button>

      <aside className={`sidebar glass ${navOpen ? "is-open" : ""}`}>
        <button className="brand" type="button" onClick={() => go(nav[0])}>
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span><strong>HospitalX</strong><small>Care. Connected.</small></span>
        </button>
        <nav aria-label="Hospital workspaces">
          {nav.map((item) => {
            const Icon = item.icon;
            return <button type="button" key={item.label} className={active === item.label ? "on" : ""} aria-current={active === item.label ? "page" : undefined} onClick={() => go(item)}><Icon aria-hidden="true" /><span>{item.label}</span></button>;
          })}
        </nav>
        <div className="motto-card"><span>Better<br />Systems.<br />Brighter<br />Lives.</span></div>
        <div className="profile-card">
          <span className="avatar">AZ</span><span><strong>Dr. Arunez Zarro</strong><small>Administrator</small></span><button type="button" aria-label="Profile options">•••</button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <label className="search glass"><Search aria-hidden="true" /><input aria-label="Search HospitalX" placeholder="Search patients, staff, beds, or ask anything..." /><kbd><Command /> K</kbd></label>
          <div className="date-time"><span>{dateLabel}</span><strong>{timeLabel}</strong></div>
          <button className="icon-button glass" type="button" aria-label="Light theme"><Sun /></button>
          <button className="icon-button glass" type="button" aria-label="Dark theme"><Moon /></button>
          <button className="icon-button glass notification" type="button" aria-label="Notifications"><Bell /><i /></button>
          <button className="icon-button glass desktop-only" type="button" aria-label="Enter fullscreen"><Expand /></button>
          <div className="auth-controls">
            {clerkEnabled ? <><Show when="signed-out"><SignInButton><button type="button" className="auth-button glass">Sign in</button></SignInButton><SignUpButton><button type="button" className="auth-button primary">Sign up</button></SignUpButton></Show><Show when="signed-in"><UserButton /></Show></> : <button type="button" className="auth-button glass" onClick={() => showToast("Authentication is not configured locally.")}>Profile</button>}
          </div>
        </header>

        {active === "Home" ? <>
          <section className="hero">
            <div><p>CITY CARE HOSPITAL</p><h1>Good morning, Dr. Arunez.</h1><span>Here’s what’s happening at your hospital today.</span></div>
            <aside>People First.<br />Always.</aside>
          </section>

          <section className="metric-strip">
            <div className="metrics">
              {metrics.map(({ icon: Icon, value, label, tone }) => <article className="metric-card glass" key={label}>
                <span className={`metric-icon ${tone}`}><Icon /></span>
                <div><strong>{tasksLoading ? "—" : value ?? "—"}</strong><small>{label}</small><em>{overview?.source === "neon" ? "↑ Live" : "○ Offline"}</em></div>
                <span className="mini-bars" aria-hidden="true">{[2, 4, 3, 6, 5, 8].map((height, index) => <i key={index} style={{ height: `${height * 3}px` }} />)}</span>
              </article>)}
            </div>
            <article className="ai-card">
              <div className="ai-orb" aria-hidden="true"><i /></div><div><strong>HospitalX AI <small>BETA</small></strong><span>Your operational co-pilot.</span></div>
              <button type="button" aria-label="Open HospitalX AI" onClick={() => showToast("HospitalX AI is ready.")}><ChevronRight /></button>
            </article>
          </section>

          <section className="dashboard-grid">
            <div className="primary-column">
              <section className="panel glass queue">
                <header>
                  <h2>Today’s Patient Queue <small><CircleDot /> Live</small></h2>
                  <div className="queue-tools">
                    <div className="queue-tabs" role="tablist" aria-label="Patient queue status">
                      {queueFilters.map((filter) => <button type="button" role="tab" aria-selected={queueFilter === filter.label} className={queueFilter === filter.label ? "active" : ""} key={filter.label} onClick={() => setQueueFilter(filter.label)}>{filter.label} <span>({filter.count})</span></button>)}
                    </div>
                    <button className="view-all" type="button" onClick={() => router.push("/patients")}>View All <ArrowUpRight /></button>
                  </div>
                </header>
                <div className="table-wrap"><table>
                  <thead><tr><th>#</th><th>Patient</th><th>Age / Gender</th><th>Type</th><th>Doctor</th><th>Status</th><th>ETA</th><th><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{peopleLoading ? <tr><td colSpan={8} className="table-message">Loading live patients…</td></tr> : filteredPeople.length ? filteredPeople.map((row) => <tr key={row[0]}>
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className={cell === "Emergency" ? "red" : ""}>{index === 1 ? <strong>{cell}</strong> : index === 5 ? <span className={`status ${statusClass(cell)}`}><i />{cell}</span> : cell}</td>)}
                    <td><button className="row-action" type="button" aria-label={`More actions for ${row[1]}`}>•••</button></td>
                  </tr>) : <tr><td colSpan={8} className="table-message">{people.length ? `No ${queueFilter.toLowerCase()} patients in the queue.` : "No patients registered yet. Use New Patient to create the first record."}</td></tr>}</tbody>
                </table></div>
              </section>
              <section className="analytics-grid"><BedUtilization overview={overview} /><DepartmentLoad appointments={overview?.metrics?.appointmentsToday} /><RevenueCard /></section>
            </div>

            <aside className="right-rail">
              <section className="prompts glass">
                {["Show today’s delayed discharges", "Which patients are waiting for lab results?", "Summarize ICU status", "Generate tomorrow’s briefing"].map((prompt) => <button type="button" key={prompt} onClick={() => showToast(`${prompt} is being prepared.`)}><Bot /><span>{prompt}</span><ChevronRight /></button>)}
                <label><input aria-label="Ask HospitalX AI" placeholder="Ask anything..." /><Activity /><button type="button" aria-label="Send to HospitalX AI"><ChevronRight /></button></label>
              </section>
              <section className="attention glass">
                <header><h2><AlertTriangle /> Needs Attention</h2><strong>{tasksLoading ? "…" : tasks.length}</strong></header>
                {tasksLoading ? <p className="attention-empty">Loading live tasks…</p> : tasks.length ? tasks.map((task, index) => <button type="button" key={task.id ?? task.text} onClick={() => setTasks((current) => current.filter((_, taskIndex) => taskIndex !== index))}><i /><span>{task.text}</span><em>{task.owner ?? "Unassigned"}</em></button>) : <p className="attention-empty">No live operational tasks.</p>}
              </section>
              <section className="quick glass"><h2>Quick Actions</h2><div>
                <QuickAction icon={UserPlus} label="New Patient" tone="green" onClick={() => router.push("/patients/new")} />
                <QuickAction icon={CalendarPlus} label="Book Appointment" tone="blue" onClick={() => router.push("/appointments/new")} />
                <QuickAction icon={BedDouble} label="Admit Patient" tone="purple" onClick={() => showToast("Admit Patient flow opened.")} />
                <QuickAction icon={IndianRupee} label="Generate Bill" tone="orange" onClick={() => router.push("/billing/new")} />
              </div></section>
            </aside>
          </section>
          <p className="data-freshness" role="status">{freshness}</p>
        </> : <section className="empty glass"><p>CITY CARE HOSPITAL</p><h1>{active}</h1><span>This HospitalX workspace is ready to connect to its live module.</span></section>}

        <footer><span>HospitalX v1.0　│　 People × Technology × Better Care</span><span><i /> All Systems Operational　│　 Built for a Healthier India</span></footer>
      </main>
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}

function BedUtilization({ overview }: { overview: Overview | null }) {
  const total = overview?.metrics?.beds ?? 0;
  const occupied = total - (overview?.metrics?.availableBeds ?? 0);
  const percentage = total ? Math.round((occupied / total) * 100) : 0;
  return <article className="panel glass analytics-card bed-card"><h2>Bed Utilization</h2>
    {total ? <div className="bed-visual"><div className="donut" style={{ "--progress": `${percentage * 3.6}deg` } as React.CSSProperties}><span><strong>{percentage}%</strong><small>{occupied} / {total}</small></span></div><p><b><i className="blue-dot" /> Occupied</b><span>{occupied} beds</span><b><i className="pale-dot" /> Available</b><span>{total - occupied} beds</span></p></div> : <div className="empty-metric"><strong>0 / 0 <small>occupied / configured</small></strong><p>Live bed utilization updates as admissions and discharges are recorded.</p></div>}
    <button type="button">View Beds <ChevronRight /></button>
  </article>;
}

function DepartmentLoad({ appointments }: { appointments?: number }) {
  const value = appointments ?? 0;
  const loads = value ? [{ label: "OPD", value: Math.min(100, 35 + value * 4) }, { label: "Emergency", value: 42 }, { label: "Radiology", value: 28 }] : [];
  return <article className="panel glass analytics-card department-card"><h2>Department Load</h2>
    {loads.length ? <div className="load-bars">{loads.map((load) => <div key={load.label}><span>{load.label}</span><i><b style={{ width: `${load.value}%` }} /></i><em>{load.value}%</em></div>)}</div> : <div className="empty-metric"><strong>0 <small>appointments today</small></strong><p>Department load is sourced from live appointments.</p></div>}
    <button type="button">View Departments <ChevronRight /></button>
  </article>;
}

function RevenueCard() {
  return <article className="panel glass analytics-card revenue-card"><h2>Today’s Revenue</h2><div className="empty-metric"><strong>— <small>No billing data</small></strong><p>Revenue will appear after billing events are recorded.</p></div><span className="revenue-bars" aria-hidden="true">{[4, 7, 5, 9, 6, 11, 8, 12, 16, 10, 7, 13, 9, 15, 12].map((height, index) => <i key={index} style={{ height: `${height * 3}px` }} />)}</span><button type="button">View Reports <ChevronRight /></button></article>;
}

function QuickAction({ icon: Icon, label, tone, onClick }: { icon: LucideIcon; label: string; tone: string; onClick: () => void }) {
  return <button type="button" onClick={onClick}><span className={`quick-icon ${tone}`}><Icon /></span><small>{label}</small></button>;
}
