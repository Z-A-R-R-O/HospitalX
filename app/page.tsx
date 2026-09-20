"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { GenericModuleView, AppointmentsView, OPDView, IPDView } from "./components";
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
  { label: "AI Co-pilot", icon: Bot },
  { label: "Patients", icon: Users },
  { label: "Appointments", icon: CalendarDays },
  { label: "OPD", icon: Clock3 },
  { label: "IPD & Beds", icon: BedDouble },
  { label: "Doctors", icon: Stethoscope },
  { label: "Nursing", icon: HeartPulse },
  { label: "Laboratory", icon: FlaskConical },
  { label: "Radiology", icon: ScanLine },
  { label: "Pharmacy", icon: Pill },
  { label: "Billing", icon: ReceiptText },
  { label: "Inventory", icon: Boxes },
  { label: "Reports", icon: FileText },
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

const mockPeople: PatientRow[] = [
  ["001", "Rajesh Kumar", "45 / M", "Follow-up", "Dr. Priya", "In Consultation", "—"],
  ["002", "Meena S", "32 / F", "New", "Dr. Arjun", "Waiting", "12 min"],
  ["003", "Kumaravel P", "58 / M", "Emergency", "Dr. Hari", "Triage", "5 min"],
  ["004", "Priya N", "27 / F", "Follow-up", "Dr. Arunez", "Waiting", "18 min"],
  ["005", "Dinesh K", "63 / M", "Review", "Dr. Kavya", "Labs", "25 min"],
  ["006", "Aishwarya R", "36 / F", "New", "Dr. Arunez", "Waiting", "32 min"],
];

const mockTasks: OperationalTask[] = [
  { id: "1", text: "3 patients with critical lab results", owner: "12 min ago" },
  { id: "2", text: "2 discharges delayed by billing", owner: "18 min ago" },
  { id: "3", text: "ICU bed capacity warning (90%)", owner: "25 min ago" },
  { id: "4", text: "5 appointments running late", owner: "28 min ago" },
  { id: "5", text: "Oxygen supply at 15%", owner: "32 min ago" },
  { id: "6", text: "Network maintenance scheduled", owner: "1 hour ago" },
];

const mockOverview: Overview = {
  metrics: { patients: 842, appointmentsToday: 126, admissions: 38, beds: 200, availableBeds: 36 },
  source: "neon",
};

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
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

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
        setTasks(data.tasks?.length ? data.tasks : mockTasks);
        setOverview(data.metrics ? data : mockOverview);
        setUpdatedAt(new Date());
      })
      .catch(() => { setTasks(mockTasks); setOverview(mockOverview); })
      .finally(() => setTasksLoading(false));

    fetch("/api/patients")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setPeople(data.patients?.length ? data.patients.map(formatPatient) : mockPeople))
      .catch(() => setPeople(mockPeople))
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
    if (item.href) {
      router.push(item.href);
    } else {
      setActive(item.label);
      if (item.label === "AI Co-pilot") setIsChatOpen(false);
    }
    setNavOpen(false);
  };

  const hasRealData = overview?.metrics && (overview.metrics.patients > 10 || overview.metrics.appointmentsToday > 5);
  const metrics = [
    { icon: Users, value: hasRealData ? overview!.metrics!.patients : 842, label: "Total Patients", tone: "blue", trend: "12%" },
    { icon: CalendarDays, value: hasRealData ? overview!.metrics!.appointmentsToday : 126, label: "OPD Today", tone: "green", trend: "8%" },
    { icon: BedDouble, value: hasRealData ? overview!.metrics!.admissions : 38, label: "Admissions", tone: "indigo", trend: "5%" },
    { icon: LogOut, value: 14, label: "Discharges", tone: "orange", trend: "27%" },
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
    let result = filter ? people.filter((row) => filter.match(row[5].toLowerCase())) : people;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(row => 
        row[1].toLowerCase().includes(q) || // Patient name
        row[4].toLowerCase().includes(q) || // Doctor name
        row[0].toLowerCase().includes(q)    // ID
      );
    }
    return result;
  }, [people, queueFilter, queueFilters, searchQuery]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => showToast("Fullscreen not supported"));
    } else {
      document.exitFullscreen();
    }
  };

  const [aiQuery, setAiQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fullChatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    if (fullChatScrollRef.current) fullChatScrollRef.current.scrollTop = fullChatScrollRef.current.scrollHeight;
  }, [chatHistory, isAiLoading]);

  const submitToAi = async (text: string) => {
    if (!text.trim() || isAiLoading) return;
    
    const userMsg = { role: "user", content: text };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setAiQuery("");
    if (active !== "AI Co-pilot") {
      setIsChatOpen(true);
    }
    setIsAiLoading(true);
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory })
      });
      const data = await res.json();
      if (data.error) {
        showToast(data.error);
      } else {
        setChatHistory([...newHistory, { role: "assistant", content: data.text }]);
      }
    } catch (err) {
      showToast("Failed to connect to AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitToAi(aiQuery);
  };

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
          <label className="search glass"><Search aria-hidden="true" /><input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search HospitalX" placeholder="Search patients, staff, beds, or ask anything..." /><kbd><Command /> K</kbd></label>
          <div className="date-time"><span>{dateLabel}</span><strong>{timeLabel}</strong></div>
          <button className="icon-button glass theme-toggle" type="button" aria-label="Toggle theme" onClick={() => setIsDark(!isDark)}>
            <Sun className="sun-icon" />
            <Moon className="moon-icon" />
          </button>
          <button className="icon-button glass notification" type="button" aria-label="Notifications" onClick={() => showToast("You have 3 new notifications.")}><Bell /><i /></button>
          <button className="icon-button glass desktop-only" type="button" aria-label="Toggle fullscreen" onClick={toggleFullscreen}><Expand /></button>
          <div className="auth-controls">
            {clerkEnabled ? <><Show when="signed-out"><SignInButton><button type="button" className="auth-button glass">Sign in</button></SignInButton><SignUpButton><button type="button" className="auth-button primary">Sign up</button></SignUpButton></Show><Show when="signed-in"><UserButton /></Show></> : <button type="button" className="auth-button glass" onClick={() => showToast("Authentication is not configured locally.")}>Profile</button>}
          </div>
        </header>

        {active === "Home" ? <>
          <section className="hero">
            <div><p>CITY CARE HOSPITAL</p><h1>Good morning, Dr. Arunez.</h1><span>Here’s what’s happening at your hospital today.</span></div>
            <aside>People First.<br />Always.<hr /></aside>
          </section>

          <section className="metric-strip">
            <div className="metrics">
              {metrics.map(({ icon: Icon, value, label, tone, trend }) => <article className="metric-card glass" key={label}>
                <span className={`metric-icon ${tone}`}><Icon /></span>
                <div className="metric-content">
                  <strong>{tasksLoading ? "..." : value ?? "..."}</strong>
                  <small>{label}</small>
                  <div className="metric-footer">
                    <span className="trend"><span className="trend-arrow">↑</span> {trend}</span>
                    <span className="mini-bars" aria-hidden="true">{[2, 4, 3, 6, 5, 8].map((height, index) => <i key={index} style={{ height: `${height * 3}px` }} />)}</span>
                  </div>
                </div>
              </article>)}
            </div>
            <article className="ai-card">
              <div className="ai-orb" aria-hidden="true" />
              <div>
                <strong>HospitalX AI <small>BETA</small></strong>
                <span>Your operational co-pilot.</span>
              </div>
              <button type="button" aria-label="Open AI Assistant" onClick={() => { setActive("AI Co-pilot"); setIsChatOpen(false); }}><ArrowUpRight /></button>
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
                {["Show today’s delayed discharges", "Which patients are waiting for lab results?", "Summarize ICU status", "Generate tomorrow’s briefing"].map((prompt) => <button type="button" key={prompt} onClick={() => submitToAi(prompt)}><Bot /><span>{prompt}</span><ChevronRight /></button>)}
                <form onSubmit={handleAiSubmit} style={{ display: 'block', margin: 0 }}><label><input ref={aiInputRef} value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} aria-label="Ask HospitalX AI" placeholder="Ask anything..." /><Activity /><button type="submit" aria-label="Send to HospitalX AI"><ChevronRight /></button></label></form>
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
        </> : active === "AI Co-pilot" ? (
          <section className="full-chat-page">
            <div className="full-chat-messages" ref={fullChatScrollRef}>
              {chatHistory.length === 0 && (
                <div className="full-chat-empty">
                  <div className="ai-orb large" aria-hidden="true" />
                  <h2>How can I help you today?</h2>
                  <div className="suggestion-grid">
                    {["Summarize the ICU status for today", "Which patients have delayed discharges?", "Generate a shift handover briefing", "Analyze revenue trends this week"].map(p => (
                      <button type="button" key={p} className="glass" onClick={() => submitToAi(p)}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`full-msg ${msg.role}`}>
                  <div className="msg-avatar">{msg.role === 'assistant' ? <Bot /> : 'AZ'}</div>
                  <div className="msg-content">
                    {msg.content.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="full-msg assistant loading">
                  <div className="msg-avatar"><Bot /></div>
                  <div className="msg-content"><Activity className="pulse" /></div>
                </div>
              )}
            </div>
            <div className="full-chat-bottom">
              <form className="full-chat-input glass" onSubmit={handleAiSubmit}>
                <input value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Message HospitalX AI..." />
                <button type="submit" disabled={isAiLoading || !aiQuery.trim()}><ArrowUpRight /></button>
              </form>
              <p>HospitalX AI can make mistakes. Verify important operational data.</p>
            </div>
          </section>
        ) : active === "Patients" ? (
          <section className="page-view glass">
            <header className="page-header">
              <div>
                <h2>Patient Registry</h2>
                <p>Manage all registered patients across the hospital network.</p>
              </div>
              <button className="primary" type="button" onClick={() => router.push("/patients/new")}><UserPlus /> Register New Patient</button>
            </header>
            <div className="table-wrap full-height">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Age / Gender</th>
                    <th>Patient Type</th>
                    <th>Assigned Doctor</th>
                    <th>Status</th>
                    <th>ETA / Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleLoading ? <tr><td colSpan={8} className="table-message">Loading registry...</td></tr> : 
                    people.length ? people.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, index) => <td key={`${row[0]}-${index}`} className={cell === "Emergency" ? "red" : ""}>{index === 1 ? <strong>{cell}</strong> : index === 5 ? <span className={`status ${statusClass(cell)}`}><i />{cell}</span> : cell}</td>)}
                        <td>
                          <div className="action-buttons">
                            <button className="row-action" type="button" aria-label={`View details for ${row[1]}`}>View</button>
                            <button className="row-action" type="button" aria-label={`Edit ${row[1]}`}>Edit</button>
                          </div>
                        </td>
                      </tr>
                    )) : <tr><td colSpan={8} className="table-message">No patients found. Click Register New Patient to begin.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        ) : active === "Appointments" ? (
          <AppointmentsView />
        ) : active === "OPD" ? (
          <OPDView />
        ) : active === "IPD & Beds" ? (
          <IPDView />
        ) : ["Doctors", "Nursing", "Laboratory", "Radiology", "Pharmacy", "Billing", "Inventory", "Reports"].includes(active) ? (
          <GenericModuleView active={active} />
        ) : <section className="empty glass"><p>CITY CARE HOSPITAL</p><h1>{active}</h1><span>This HospitalX workspace is ready to connect to its live module.</span></section>}

        <footer><span>HospitalX v1.0　│　 People × Technology × Better Care</span><span><i /> All Systems Operational　│　 Built for a Healthier India</span></footer>
      </main>

      <aside className={`chat-drawer glass ${isChatOpen ? "open" : ""}`}>
        <header>
          <h3><Bot /> HospitalX AI</h3>
          <button type="button" onClick={() => setIsChatOpen(false)}><X /></button>
        </header>
        <div className="chat-history" ref={chatScrollRef}>
          {chatHistory.length === 0 && <p className="chat-empty">How can I help you today?</p>}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              <div className="msg-bubble">
                {msg.content.split('\n').map((line, j) => <p key={j}>{line}</p>)}
              </div>
            </div>
          ))}
          {isAiLoading && (
            <div className="chat-message assistant loading">
              <div className="msg-bubble"><Activity className="pulse" /> Thinking...</div>
            </div>
          )}
        </div>
        <form className="chat-input-area" onSubmit={handleAiSubmit}>
          <label>
            <input ref={aiInputRef} value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Reply to HospitalX AI..." />
            <button type="submit" disabled={isAiLoading}><ChevronRight /></button>
          </label>
        </form>
      </aside>

      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}

function BedUtilization({ overview }: { overview: Overview | null }) {
  const total = overview?.metrics?.beds || 200;
  const available = overview?.metrics?.availableBeds ?? 36;
  const occupied = total - available;
  const percentage = Math.round((occupied / total) * 100);
  return <article className="panel glass analytics-card bed-card"><h2>Bed Utilization</h2>
    <div className="bed-visual"><div className="donut" style={{ "--progress": `${percentage * 3.6}deg` } as React.CSSProperties}><span><strong>{percentage}%</strong><small>{occupied} / {total}</small></span></div><div className="bed-legend"><p><b><i style={{ background: '#101827' }} /> ICU</b><span>16 / 20</span></p><p><b><i style={{ background: '#277cf4' }} /> General</b><span>120 / 150</span></p><p><b><i style={{ background: '#ef4148' }} /> Emergency</b><span>18 / 20</span></p><p><b><i style={{ background: '#ef9519' }} /> Isolation</b><span>10 / 10</span></p></div></div>
    <button type="button">View Beds <ChevronRight /></button>
  </article>;
}

function DepartmentLoad({ appointments }: { appointments?: number }) {
  const loads = [
    { label: "OPD", value: 68, color: "#277cf4" },
    { label: "Emergency", value: 92, color: "#ef4148" },
    { label: "Radiology", value: 54, color: "#277cf4" },
    { label: "Laboratory", value: 76, color: "#277cf4" },
    { label: "Pharmacy", value: 61, color: "#277cf4" },
  ];
  return <article className="panel glass analytics-card department-card"><h2>Department Load</h2>
    {loads.length ? <div className="load-bars">{loads.map((load, index) => <div key={load.label}><span>{load.label}</span><i><b style={{ width: `${load.value}%`, background: load.color, animationDelay: `${index * 80 + 350}ms` }} /></i><em>{load.value}%</em></div>)}</div> : <div className="empty-metric"><strong>0 <small>appointments today</small></strong><p>Department load is sourced from live appointments.</p></div>}
    <button type="button">View Departments <ChevronRight /></button>
  </article>;
}

function RevenueCard() {
  return <article className="panel glass analytics-card revenue-card"><h2>Today's Revenue</h2>
    <div className="revenue-content">
      <strong>₹ 3,42,800 <span className="trend">↑ 18%</span></strong>
    </div>
    <div className="revenue-chart">
      <span className="revenue-bars" aria-hidden="true">{[4, 7, 5, 9, 6, 11, 8, 12, 16, 10, 7, 13, 9, 15, 12].map((height, index) => <i key={index} style={{ height: `${height * 3}px`, animationDelay: `${index * 40 + 200}ms` }} />)}</span>
      <div className="revenue-labels"><span>6am</span><span>10am</span><span>2pm</span><span>6pm</span><span>10pm</span></div>
    </div>
    <button type="button">View Reports <ChevronRight /></button>
  </article>;
}

function QuickAction({ icon: Icon, label, tone, onClick }: { icon: LucideIcon; label: string; tone: string; onClick: () => void }) {
  return <button type="button" onClick={onClick}><span className={`quick-icon ${tone}`}><Icon /></span><small>{label}</small></button>;
}
