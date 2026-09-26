"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton, SignOutButton } from "@clerk/nextjs";
import { AppointmentsView, OPDView, IPDView, DoctorsView, NursingView, LaboratoryView, RadiologyView, PharmacyView, BillingView, InventoryView, ReportsView } from "../components";
import { Mascot } from "page-mascot";
import { HospitalXOnboarding, useSetupStatus } from "../onboarding";
import "../onboarding.css";
import type { LucideIcon } from "lucide-react";
import {
  MoreHorizontal, Settings, User,
  Activity, AlertTriangle, ArrowUpRight, BedDouble, Bell, Bot, Boxes,
  CalendarDays, CalendarPlus, ChevronRight, CircleDot, Clock3, Command,
  Expand, FileText, FlaskConical, HeartPulse, Home as HomeIcon, IndianRupee,
  LogOut, Menu, Moon, Pill, ReceiptText, ScanLine, Search, Sparkles,
  Stethoscope, Sun, UserPlus, Users, X, CreditCard, Plus, MessageSquare} from "lucide-react";

type PatientRow = string[];
type OperationalTask = { id?: string; text: string; owner?: string; severity?: string; due_at?: string; created_at?: string };
type Overview = {
  tasks?: OperationalTask[];
  metrics?: { patients: number; appointmentsToday: number; admissions: number; beds: number; availableBeds: number };
  source?: string;
};
type NavItem = { label: string; icon: LucideIcon; href?: string };
type ChatMessage = { role: "user" | "assistant"; content: string };

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
  patient.external_identifier ?? patient.id?.slice(0, 8) ?? "-",
  patient.full_name,
  patient.age ? `${patient.age} / ${patient.sex ?? "-"}` : `- / ${patient.sex ?? "-"}`,
  patient.blood_group ?? "-",
  patient.primary_complaint ? (patient.primary_complaint.length > 25 ? patient.primary_complaint.substring(0, 25) + "..." : patient.primary_complaint) : "-",
  patient.status ?? "Triage",
  patient.starts_at ? new Date(patient.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Waiting",
];

const statusClass = (status: string) => status.toLowerCase().replace(/[^a-z]+/g, "-");

import { demoPatients as mockPeople, demoTasks as mockTasks, demoOverview as mockOverview } from "../lib/demo-data";


const demoChats: Record<string, { role: 'user' | 'assistant', content: string }[]> = {
  "Q3 Revenue Analysis": [
    { role: "user", content: "Can you summarize our Q3 revenue trends?" },
    { role: "assistant", content: "Certainly! In Q3, overall revenue increased by 12% compared to Q2. The primary driver was a 25% increase in elective surgeries in the Orthopedics department. However, outpatient pharmacy revenue saw a slight 4% dip due to supply chain delays with our primary vendor." },
    { role: "user", content: "What's the projection for Q4?" },
    { role: "assistant", content: "Based on current bookings and seasonal trends, Q4 is projected to grow an additional 8%. I recommend optimizing staffing in the General Ward to handle the anticipated winter influx." }
  ],
  "Patient #8492 Status": [
    { role: "user", content: "What is the status of patient Rajesh Kumar (MRN-8492)?" },
    { role: "assistant", content: "Rajesh Kumar (45/M) is currently in Consultation with Dr. Priya (Cardiology). His latest vitals show a slightly elevated BP of 145/92. His recent ECG results are uploaded and pending Dr. Priya's review." },
    { role: "user", content: "Remind the lab to expedite his lipid panel." },
    { role: "assistant", content: "I've flagged Rajesh Kumar's lipid panel as 'Urgent' in the Laboratory Information System. The lab technicians have been notified and the results should be available within 30 minutes." }
  ],
  "ICU Capacity Planning": [
    { role: "user", content: "How are our ICU beds looking today?" },
    { role: "assistant", content: "We are currently operating at 92% ICU capacity (23 out of 25 beds occupied). 2 patients are scheduled for transfer to the General Ward this afternoon, which will free up capacity." },
    { role: "user", content: "Are there any incoming critical patients?" },
    { role: "assistant", content: "Yes, there is 1 critical patient currently in Emergency Triage awaiting an ICU bed. With the 2 afternoon transfers, we will have sufficient capacity, but I will monitor the situation closely." }
  ]
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
  const { status: setupStatus, setStatus: setSetupStatus } = useSetupStatus();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (setupStatus === "not_started") setShowOnboarding(true);
  }, [setupStatus]);

  const [queueFilter, setQueueFilter] = useState("All");
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
    else if (saved === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) setIsDark(true);
  }, []);
  const [isDemoMode, setIsDemoMode] = useState(false);
  useEffect(() => { setIsDemoMode(localStorage.getItem("demoMode") === "true"); }, []);
  const toggleDemoMode = () => { const next = !isDemoMode; setIsDemoMode(next); localStorage.setItem("demoMode", next.toString()); window.location.reload(); };
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isExitDemoAlertOpen, setIsExitDemoAlertOpen] = useState(false);
  const [mascotVisible, setMascotVisible] = useState(true);

  const [mascotSpeech, setMascotSpeech] = useState<string | null>(null);

  useEffect(() => {
    if (!mascotVisible) return;
    
    const messages: Record<string, string> = {
      "Home": "Welcome back! Let's check today's operations.",
      "Patients": "Accessing patient records and histories.",
      "Appointments": "Let's review the upcoming schedules.",
      "OPD": "Outpatient department is active.",
      "IPD & Beds": "Checking ward capacity and bed availability.",
      "Doctors": "Here is the doctor directory and duty roster.",
      "Nursing": "Nursing station overview.",
      "Laboratory": "Viewing pending tests and lab results.",
      "Radiology": "Accessing imaging and scans.",
      "Pharmacy": "Checking inventory and prescriptions.",
      "Billing": "Reviewing invoices and revenue.",
      "Inventory": "Checking hospital supplies and stock.",
      "Reports": "Generating analytical insights."
    };

    const msg = messages[active];
    if (msg) {
      setMascotSpeech(msg);
      const timer = setTimeout(() => setMascotSpeech(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [active, mascotVisible]);

  const [mascotPos, setMascotPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showMascotMenu, setShowMascotMenu] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMascotVisible(localStorage.getItem("mascotVisible") !== "false");
    const savedPos = localStorage.getItem("mascotPos");
    if (savedPos) setMascotPos(JSON.parse(savedPos));
    else setMascotPos({ x: window.innerWidth - 160, y: window.innerHeight - 160 });
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX - dragOffset.x;
      const ny = e.clientY - dragOffset.y;
      setMascotPos({ x: Math.max(0, Math.min(nx, window.innerWidth - 114)), y: Math.max(0, Math.min(ny, window.innerHeight - 114)) });
    };
    const onUp = () => {
      setIsDragging(false);
      localStorage.setItem("mascotPos", JSON.stringify(mascotPos));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging, dragOffset, mascotPos]);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


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
        const isDemo = localStorage.getItem("demoMode") === "true";
    if (isDemo) {
      setTasks(mockTasks);
      setOverview(mockOverview);
      setPeople(mockPeople);
      setUpdatedAt(new Date());
      setTasksLoading(false);
      setPeopleLoading(false);
      return;
    }
    fetch("/api/overview")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Overview) => {
        setTasks(data.tasks?.length ? data.tasks : []);
        setOverview(data.metrics ? data : null);
        setUpdatedAt(new Date());
      })
      .catch(() => { setTasks([]); setOverview(null); })
      .finally(() => setTasksLoading(false));

    fetch("/api/patients")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => setPeople(data.patients?.length ? data.patients.map(formatPatient) : []))
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
    ? `${overview?.source === "neon" ? "Live Neon data" : "Operational data"} — updated ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(updatedAt)}`
    : "Operational data unavailable";

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const go = (item: NavItem) => {
    setNavOpen(false);
    if (item.href) {
      router.push(item.href);
    } else {
      setActive(item.label);
      if (item.label === "AI Co-pilot") setIsChatOpen(false);
    }
    setNavOpen(false);
  };

  const metrics = [
    { icon: Users, value: overview?.metrics?.patients ?? 0, label: "Total Patients", tone: "blue", trend: overview ? "12%" : "—" },
    { icon: CalendarDays, value: overview?.metrics?.appointmentsToday ?? 0, label: "OPD Today", tone: "green", trend: overview ? "8%" : "—" },
    { icon: BedDouble, value: overview?.metrics?.admissions ?? 0, label: "Admissions", tone: "indigo", trend: overview ? "5%" : "—" },
    { icon: LogOut, value: 0, label: "Discharges", tone: "orange", trend: overview ? "27%" : "—" },
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
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<Record<string, ChatMessage[]>>(demoChats);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fullChatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    if (fullChatScrollRef.current) fullChatScrollRef.current.scrollTop = fullChatScrollRef.current.scrollHeight;
  }, [chatHistory, isAiLoading]);

  const submitToAi = async (text: string) => {
    if (!text.trim() || isAiLoading) return;
    
    const userMsg: ChatMessage = { role: "user", content: text };
    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setAiQuery("");
    if (active !== "AI Co-pilot") {
      setIsChatOpen(true);
    }
    setIsAiLoading(true);
    setIsSlowConnection(false);
    const slowTimer = setTimeout(() => {
      setIsSlowConnection(true);
    }, 5000);

    let chatId = currentChatId;
    if (!chatId) {
      chatId = text.substring(0, 22) + (text.length > 22 ? "..." : "");
      setCurrentChatId(chatId);
    }
    setSavedChats(prev => ({ ...prev, [chatId]: newHistory }));
    
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
        const finalHistory: ChatMessage[] = [...newHistory, { role: "assistant", content: data.text }];
        setChatHistory(finalHistory);
        setSavedChats(prev => ({ ...prev, [chatId]: finalHistory }));
      }
    } catch (err) {
      showToast("Failed to connect to AI.");
    } finally {
      setIsAiLoading(false);
      clearTimeout(slowTimer);
      setIsSlowConnection(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitToAi(aiQuery);
  };

  return (
    <div className={`app-shell${showOnboarding ? " is-onboarding" : ""}`}>
      {showOnboarding && (
        <HospitalXOnboarding
          setActive={(label: string) => setActive(label)}
          onComplete={(status) => { setShowOnboarding(false); setSetupStatus(status); }}
        />
      )}
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      <button className="mobile-menu" style={{ opacity: navOpen ? 0 : 1, pointerEvents: navOpen ? "none" : "auto", transition: "opacity 0.2s" }} type="button" aria-label="Open navigation" onClick={() => setNavOpen(true)}><Menu /></button>

      {navOpen && <div className="sidebar-overlay" onClick={() => setNavOpen(false)} />}
      <aside className={`sidebar glass ${navOpen ? "is-open" : ""}`}>
        <button type="button" className="sidebar-close-btn desktop-only-hide" onClick={() => setNavOpen(false)} aria-label="Close sidebar"><X size={20} /></button>
        <button className="brand" type="button" onClick={() => go(nav[0])}>
          <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          <span><strong>HospitalX</strong><small>Care. Connected.</small></span>
        </button>
        <nav aria-label="Hospital workspaces">
          {nav.map((item) => {
            const Icon = item.icon;
            return <button type="button" key={item.label} data-tour={item.label} className={active === item.label ? "on" : ""} aria-current={active === item.label ? "page" : undefined} onClick={() => go(item)}><Icon aria-hidden="true" /><span>{item.label}</span></button>;
          })}
        </nav>
        <div className="motto-card">
          <div className="motto-rotator">
            <span>Better<br />Systems.<br />Brighter<br />Lives.</span>
            <span>Smarter<br />Care.<br />Healthier<br />Future.</span>
            <span>Seamless<br />Tech.<br />Better<br />Healing.</span>
          </div>
        </div>
        <div className="profile-card" ref={profileMenuRef}>
          <span className="avatar">AZ</span><span><strong>Dr. Arunez Zarro</strong><small>Administrator</small></span>
          <button type="button" aria-label="Profile options" onClick={() => router.push("/settings")}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <label className="search glass"><Search aria-hidden="true" /><input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search HospitalX" placeholder="Search patients, staff, beds, or ask anything..." /><kbd><Command /> K</kbd></label>
          <div className="date-time"><span>{dateLabel}</span><strong>{timeLabel}</strong></div>
          <button className="icon-button glass theme-toggle" type="button" aria-label="Toggle theme" onClick={() => { const next = !isDark; setIsDark(next); localStorage.setItem("theme", next ? "dark" : "light"); }}>
            <Sun className="sun-icon" />
            <Moon className="moon-icon" />
          </button>
          <div style={{ position: 'relative', display: 'flex' }}>
            <button className="icon-button glass notification" type="button" aria-label="Notifications" onClick={() => setIsNotifOpen(!isNotifOpen)}><Bell /><i /></button>
            {isNotifOpen && (
              <div className="notification-menu">
                <header style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '14px' }}>Notifications</strong>
                  <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }} onClick={() => setIsNotifOpen(false)}><X size={14} /></button>
                </header>
                <div className="notif-list">
                  <button onClick={() => setIsNotifOpen(false)}><div className="notif-dot bg-red" /><div className="notif-text"><strong>Critical lab result</strong><small>Patient Rajesh Kumar</small></div></button>
                  <button onClick={() => setIsNotifOpen(false)}><div className="notif-dot bg-blue" /><div className="notif-text"><strong>New Admission Request</strong><small>ER Dept: Trauma</small></div></button>
                  <button onClick={() => setIsNotifOpen(false)}><div className="notif-dot bg-green" /><div className="notif-text"><strong>Discharge cleared</strong><small>Bed 402 - Ready for cleaning</small></div></button>
                </div>
              </div>
            )}
          </div>
          <button className="icon-button glass desktop-only" type="button" aria-label="Toggle fullscreen" onClick={toggleFullscreen}><Expand /></button>
          <div className="auth-controls">
                        {isDemoMode ? (
              <button type="button" className="auth-button glass" style={{ color: '#64748b', borderColor: 'rgba(100, 116, 139, 0.25)' }} onClick={() => setIsExitDemoAlertOpen(true)}>
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em' }}>DEMO</span>
              </button>
            ) : clerkEnabled ? (
              <><Show when="signed-out"><SignInButton><button type="button" className="auth-button glass">Sign in</button></SignInButton><SignUpButton><button type="button" className="auth-button primary">Sign up</button></SignUpButton></Show><Show when="signed-in"><UserButton /></Show></>
            ) : (
              <button type="button" className="auth-button glass" aria-label="Settings" onClick={() => router.push("/settings")}>
                <Settings size={16} />
              </button>
            )}
          </div>
        </header>

        <div key={active} className="tab-transition">
        {active === "Home" ? <>
          <section className="hero">
            <div><p>CITY CARE HOSPITAL</p><h1>Good morning, Dr. Arunez.</h1><span>Here's what's happening at your hospital today.</span></div>
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
                <strong style={{ fontSize: '24px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                  Madhu
                  <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI</span>
                </strong>
                <span>Your operational assistant.</span>
              </div>
              <button type="button" aria-label="Open Madhu AI" onClick={() => { setActive("AI Co-pilot"); setIsChatOpen(false); }}><ArrowUpRight strokeWidth={2.5} /></button>
            </article>
          </section>

          <section className="dashboard-grid">
            <div className="primary-column">
              <section className="panel glass queue">
                <header>
                  <h2>Today's Patient Queue <small><CircleDot /> Live</small></h2>
                  <div className="queue-tools">
                    <div className="queue-tabs" role="tablist" aria-label="Patient queue status">
                      {queueFilters.map((filter) => <button type="button" role="tab" aria-selected={queueFilter === filter.label} className={queueFilter === filter.label ? "active" : ""} key={filter.label} onClick={() => setQueueFilter(filter.label)}>{filter.label} <span>({filter.count})</span></button>)}
                    </div>
                    <button className="view-all" type="button" onClick={() => router.push("/patients")}>View All <ArrowUpRight /></button>
                  </div>
                </header>
                <div className="table-wrap"><table>
                  <thead><tr><th>#</th><th>Patient</th><th>Age / Gender</th><th>Blood Group</th><th>Complaint</th><th>Status</th><th>ETA</th><th><span className="sr-only">Actions</span></th></tr></thead>
                  <tbody>{peopleLoading ? <tr><td colSpan={8} className="table-message">Loading live patients...</td></tr> : filteredPeople.length ? filteredPeople.map((row) => <tr key={row[0]}>
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`} className={cell === "Emergency" ? "red" : ""}>{index === 1 ? <strong>{cell}</strong> : index === 5 ? <span className={`status ${statusClass(cell)}`}><i />{cell}</span> : cell}</td>)}
                    <td><button className="row-action" type="button" aria-label={`More actions for ${row[1]}`}>•••</button></td>
                  </tr>) : <tr><td colSpan={8} className="table-message">{people.length ? `No ${queueFilter.toLowerCase()} patients in the queue.` : "No patients registered yet. Use New Patient to create the first record."}</td></tr>}</tbody>
                </table></div>
              </section>
              <section className="analytics-grid"><BedUtilization overview={overview} setActive={setActive} /><DepartmentLoad appointments={overview?.metrics?.appointmentsToday} setActive={setActive} /><RevenueCard appointments={overview?.metrics?.appointmentsToday} setActive={setActive} /></section>
            </div>

            <aside className="right-rail">
              <section className="attention glass" style={{ position: 'sticky', top: '24px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                <header><h2><AlertTriangle /> Needs Attention</h2><strong>{tasksLoading ? "—" : tasks.length}</strong></header>
                {tasksLoading ? <p className="attention-empty">Loading live tasks...</p> : tasks.length ? tasks.map((task, index) => <button type="button" key={task.id ?? task.text} onClick={() => setTasks((current) => current.filter((_, taskIndex) => taskIndex !== index))}><i /><span>{task.text}</span><em>{task.owner ?? "Unassigned"}</em></button>) : <p className="attention-empty">No live operational tasks.</p>}
              </section>
              
            </aside>
          </section>
          <p className="data-freshness" role="status">{freshness}</p>
        </> : active === "AI Co-pilot" ? (
          <div className="full-chat-layout" style={{ display: 'flex', height: 'calc(100vh - 110px)', gap: '20px', width: '100%', overflow: 'hidden', paddingBottom: '20px' }}>
            <aside className="full-chat-sidebar" style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
               <button className="primary" style={{ width: '100%', justifyContent: 'center', height: '44px' }} onClick={() => { setChatHistory([]); setAiQuery(""); setCurrentChatId(null); }}><Plus size={18} /> New Chat</button>
               <div className="panel glass" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                 <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#4c1d95', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', opacity: 0.8 }}>Recent Chats</h3>
                 <div className="full-chat-history" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                   {Object.keys(savedChats).map(chat => (
                     <button key={chat} type="button" onClick={() => { setChatHistory(savedChats[chat]); setCurrentChatId(chat); setIsChatOpen(true); }} style={{ padding: '10px 12px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '14px', color: 'var(--ink)', borderRadius: '10px', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '10px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}><MessageSquare size={16} color="#7c3aed" /> {chat}</button>
                   ))}
                 </div>
               </div>
            </aside>
            <section className="full-chat-page" style={{ flex: 1, margin: 0, height: '100%' }}>
              
            <div className="full-chat-messages" ref={fullChatScrollRef}>
              {chatHistory.length === 0 && (
                <div className="full-chat-empty">
                  <div style={{ margin: "0 auto 24px", display: "flex", justifyContent: "center" }}><Mascot directions="/mascots/nurse-directions.webp" reactions="/mascots/nurse-reactions.webp" size={160} label="Madhu" /></div>
                  <h2>Hi! I’m Madhu, your AI nurse. How can I help?</h2>
                  <div className="suggestion-grid">
                    {["Summarize the ICU status for today", "Which patients have delayed discharges?", "Generate a shift handover briefing", "Analyze revenue trends this week"].map(p => (
                      <button type="button" key={p} className="glass" onClick={() => submitToAi(p)}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`full-msg ${msg.role}`}>
                  <div className="msg-avatar">{msg.role === 'assistant' ? <Sparkles /> : 'AZ'}</div>
                  <div className="msg-content">
                    {msg.content.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="full-msg assistant loading" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="msg-avatar"><Sparkles /></div>
                    <div className="msg-content" style={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}><Activity className="pulse" /></div>
                  </div>
                  {isSlowConnection && <span className="slow-connection-warning" style={{ fontSize: '12px', marginLeft: '48px' }}>Improve your connection to get faster reply</span>}
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
          </div>
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
                    <th>Blood Group</th>
                    <th>Complaint / Reason</th>
                    <th>Status</th>
                    <th>ETA / Time</th>
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
        ) : active === "Doctors" ? (
          <DoctorsView />
        ) : active === "Nursing" ? (
          <NursingView />
        ) : active === "Laboratory" ? (
          <LaboratoryView />
        ) : active === "Radiology" ? (
          <RadiologyView />
        ) : active === "Pharmacy" ? (
          <PharmacyView />
        ) : active === "Billing" ? (
          <BillingView />
        ) : active === "Inventory" ? (
          <InventoryView />
        ) : active === "Reports" ? (
          <ReportsView />
        ) : (
          <section className="empty glass"><p>CITY CARE HOSPITAL</p><h1>{active}</h1><span>This HospitalX workspace is ready to connect to its live module.</span></section>
        )}

        {active !== "AI Co-pilot" && (
          <footer><span>HospitalX v1.0 — People × Technology × Better Care</span><span><i /> All Systems Operational — Built for a Healthier India</span></footer>
        )}
        </div>
      {mascotVisible && active !== "AI Co-pilot" && (
      <div ref={mascotRef} style={{ position: 'fixed', left: mascotPos.x, top: mascotPos.y, zIndex: 9999, userSelect: 'none' }}
        onMouseDown={(e) => { if (e.button === 0) { setIsDragging(true); setDragOffset({ x: e.clientX - mascotPos.x, y: e.clientY - mascotPos.y }); } }}
        onContextMenu={(e) => { e.preventDefault(); setShowMascotMenu(!showMascotMenu); }}
      >
        
        {mascotSpeech && !isChatOpen && !showMascotMenu && (
          <div style={{ position: 'absolute', bottom: '90%', right: '50%', transform: 'translateX(20%)', marginBottom: '8px', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '16px 16px 0 16px', border: '1px solid rgba(168,85,247,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', color: '#4c1d95', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', pointerEvents: 'none', animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 10001 }}>
            {mascotSpeech}
            <div style={{ position: 'absolute', bottom: '-5px', right: '4px', width: '10px', height: '10px', background: 'rgba(255, 255, 255, 0.95)', borderRight: '1px solid rgba(168,85,247,0.3)', borderBottom: '1px solid rgba(168,85,247,0.3)', transform: 'rotate(45deg)' }} />
          </div>
        )}

<div style={{ cursor: isDragging ? 'grabbing' : 'grab' }} onClick={(e) => { if (!isDragging) { setIsChatOpen(!isChatOpen); setShowMascotMenu(false); } }}>
          <Mascot directions="/mascots/nurse-directions.webp" reactions="/mascots/nurse-reactions.webp" size={120} label="Madhu - AI Nurse" />
        </div>

        {showMascotMenu && (
          <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: '12px', width: '180px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(40px) saturate(200%)', border: '1px solid rgba(0, 0, 0, 0.08)', boxShadow: '0 16px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.02) inset', overflow: 'hidden', zIndex: 10000, padding: '6px' }}>
            <button type="button" onClick={() => { setIsChatOpen(!isChatOpen); setShowMascotMenu(false); }} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: '#1d1d1f', fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', transition: 'background 0.1s' }} onMouseOver={(e) => {e.currentTarget.style.background = '#007AFF'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1d1d1f'}}><Sparkles size={16}/> Chat with Madhu</button>
            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
            <button type="button" onClick={() => { setMascotVisible(false); localStorage.setItem("mascotVisible", "false"); setShowMascotMenu(false); setIsChatOpen(false); }} style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: 'none', color: '#ff3b30', fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '8px', transition: 'background 0.1s' }} onMouseOver={(e) => {e.currentTarget.style.background = '#ff3b30'; e.currentTarget.style.color = '#fff'}} onMouseOut={(e) => {e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff3b30'}}><X size={16}/> Hide Madhu</button>
          </div>
        )}

        {isChatOpen && (
          <div className="ai-floating-widget"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px', zIndex: 2 }}>
              <button type="button" onClick={() => { setChatHistory([]); setAiQuery(""); setCurrentChatId(null); }} title="New Chat" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4c1d95', opacity: 0.4, width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', outline: 'none' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.opacity = '1'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.4'; }}><Plus size={15} strokeWidth={2.5} /></button>
              <button type="button" onClick={() => { setIsChatOpen(false); setActive("AI Co-pilot"); }} title="Open Full Window" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4c1d95', opacity: 0.4, width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', outline: 'none' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.opacity = '1'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.4'; }}><Expand size={14} strokeWidth={2.5} /></button>
              <button type="button" onClick={() => setIsChatOpen(false)} title="Close" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#4c1d95', opacity: 0.4, width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', outline: 'none' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.opacity = '1'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.4'; }}><X size={15} strokeWidth={2.5} /></button>
            </div>
            
            <div ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 16px 20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255, 255, 255, 0.3)', minHeight: '240px' }}>
              {chatHistory.length === 0 && (
                <div style={{ margin: 'auto 0', textAlign: 'center', padding: '0 16px' }}>
                  <h3 style={{ color: '#4c1d95', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px', lineHeight: 1.1 }}>Hii! I'm Madhu.</h3>
                  <p style={{ color: '#7c3aed', fontSize: '14px', fontWeight: 500, margin: 0, opacity: 0.9 }}>How can I help you today?</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginTop: i === 0 ? '16px' : '0' }}>
                  <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'white', color: msg.role === 'user' ? 'white' : '#4c1d95', fontSize: '14px', letterSpacing: '-0.01em', lineHeight: 1.4, border: msg.role === 'user' ? 'none' : '1px solid rgba(216,180,254,0.4)', boxShadow: msg.role === 'user' ? '0 6px 16px rgba(124, 58, 237, 0.25)' : '0 4px 12px rgba(168,85,247,0.06)' }}>
                    {msg.content.split('\n').map((line, j) => <p key={j} style={{ margin: 0, minHeight: line === '' ? '14px' : 'auto' }}>{line}</p>)}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'white', color: '#7c3aed', fontSize: '14px', border: '1px solid rgba(216,180,254,0.4)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(168,85,247,0.06)', fontWeight: 500 }}><Activity className="pulse" size={16} color="#7c3aed"/> Thinking...</div>
                  {isSlowConnection && <span className="slow-connection-warning" style={{ fontSize: '11px', paddingLeft: '8px' }}>Improve your connection to get faster reply</span>}
                </div>
              )}
            </div>
            
            <form onSubmit={handleAiSubmit} style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.7)', borderTop: '1px solid rgba(216, 180, 254, 0.3)', display: 'flex', gap: '10px', flexShrink: 0 }}>
              <input ref={aiInputRef} value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="Message Madhu..." style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid rgba(216, 180, 254, 0.6)', background: '#ffffff', color: '#4c1d95', fontSize: '14px', letterSpacing: '-0.01em', outline: 'none', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(168,85,247,0.02)' }} onFocus={(e) => e.target.style.borderColor = '#7c3aed'} onBlur={(e) => e.target.style.borderColor = 'rgba(216, 180, 254, 0.6)'} />
              <button type="submit" disabled={isAiLoading || !aiQuery.trim()} style={{ width: '44px', height: '44px', borderRadius: '22px', background: (isAiLoading || !aiQuery.trim()) ? 'rgba(168,85,247,0.2)' : 'linear-gradient(135deg, #a855f7, #7c3aed)', border: 'none', color: (isAiLoading || !aiQuery.trim()) ? 'rgba(124,58,237,0.5)' : 'white', cursor: (isAiLoading || !aiQuery.trim()) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', boxShadow: (isAiLoading || !aiQuery.trim()) ? 'none' : '0 6px 16px rgba(124, 58, 237, 0.3)' }}><ArrowUpRight size={20} strokeWidth={2.5}/></button>
            </form>
          </div>
        )}
      </div>
      )}
      
      {isExitDemoAlertOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: '270px', borderRadius: '16px', background: 'var(--c-glass-80)', backdropFilter: 'blur(32px) saturate(200%)', border: '1px solid var(--c-glass-60)', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '20px 16px 16px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 600, color: 'var(--ink)' }}>Exit Demo Mode?</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: 1.3 }}>This will reconnect you to the live production database.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--c-dark-10)' }}>
              <button onClick={() => { setIsExitDemoAlertOpen(false); toggleDemoMode(); }} style={{ padding: '12px', background: 'transparent', border: 'none', borderBottom: '1px solid var(--c-dark-10)', color: 'var(--red)', fontSize: '16px', fontWeight: 400, cursor: 'pointer' }}>Exit Demo</button>
              <button onClick={() => setIsExitDemoAlertOpen(false)} style={{ padding: '12px', background: 'transparent', border: 'none', color: 'var(--blue)', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </main>

      

      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}

function BedUtilization({ overview, setActive }: { overview: Overview | null, setActive?: (t: string) => void }) {
  const total = overview?.metrics?.beds ?? 200;
  const available = overview?.metrics?.availableBeds ?? total;
  const occupied = total - available;
  const percentage = total === 0 ? 0 : Math.round((occupied / total) * 100);
  return <article className="panel glass analytics-card bed-card"><h2>Bed Utilization</h2>
    <div className="bed-visual"><div className="donut" style={{ "--progress": `${percentage * 3.6}deg` } as React.CSSProperties}><span><strong>{percentage}%</strong><small>{occupied} / {total}</small></span></div><div className="bed-legend"><p><b><i style={{ background: 'var(--c-legend-icu)' }} /> ICU</b><span>{Math.round(occupied * 0.1)} / {Math.round(total * 0.1)}</span></p><p><b><i style={{ background: 'var(--c-legend-gen)' }} /> General</b><span>{Math.round(occupied * 0.7)} / {Math.round(total * 0.7)}</span></p><p><b><i style={{ background: 'var(--c-legend-em)' }} /> Emergency</b><span>{Math.round(occupied * 0.15)} / {Math.round(total * 0.15)}</span></p><p><b><i style={{ background: 'var(--c-legend-iso)' }} /> Isolation</b><span>{Math.round(occupied * 0.05)} / {Math.round(total * 0.05)}</span></p></div></div>
    <button type="button" onClick={() => setActive && setActive("IPD & Beds")}>View Beds <ChevronRight /></button>
  </article>;
}

function DepartmentLoad({ appointments, setActive }: { appointments?: number, setActive?: (t: string) => void }) {
  const opdVal = appointments ? Math.min(100, Math.round((appointments * 0.4 / 150) * 100)) : 0;
  const erVal = appointments ? Math.min(100, Math.round((appointments * 0.2 / 50) * 100)) : 0;
  const radVal = appointments ? Math.min(100, Math.round((appointments * 0.15 / 80) * 100)) : 0;
  const labVal = appointments ? Math.min(100, Math.round((appointments * 0.15 / 100) * 100)) : 0;
  const pharmVal = appointments ? Math.min(100, Math.round((appointments * 0.1 / 120) * 100)) : 0;

  const loads = [
    { label: "OPD", value: opdVal, color: "var(--c-legend-gen)" },
    { label: "Emergency", value: erVal, color: "var(--c-legend-em)" },
    { label: "Radiology", value: radVal, color: "var(--c-legend-gen)" },
    { label: "Laboratory", value: labVal, color: "var(--c-legend-gen)" },
    { label: "Pharmacy", value: pharmVal, color: "var(--c-legend-gen)" },
  ];
  return <article className="panel glass analytics-card department-card"><h2>Department Load</h2>
    {appointments ? <div className="load-bars">{loads.map((load, index) => <div key={load.label}><span>{load.label}</span><i><b style={{ width: `${load.value}%` , background: load.color, animationDelay: `${index * 80 + 350}ms`  }} /></i><em>{load.value}%</em></div>)}</div> : <div className="empty-metric"><strong>0 <small>appointments today</small></strong><p>Department load is sourced from live appointments.</p></div>}
    <button type="button" onClick={() => setActive && setActive("OPD")}>View Departments <ChevronRight /></button>
  </article>;
}

function RevenueCard({ appointments, setActive }: { appointments?: number, setActive?: (t: string) => void }) {
  const rev = appointments ? appointments * 500 : 0;
  return <article className="panel glass analytics-card revenue-card"><h2>Today's Revenue</h2>
    <div className="revenue-content">
      <strong>₹ {rev.toLocaleString('en-IN')} <span className="trend" style={{ opacity: rev ? 1 : 0.3 }}>↑ {rev ? "18%" : "0%"}</span></strong>
    </div>
    <div className="revenue-chart">
      <span className="revenue-bars" aria-hidden="true">{[4, 7, 5, 9, 6, 11, 8, 12, 16, 10, 7, 13, 9, 15, 12].map((height, index) => <i key={index} style={{ height: rev ? `${height * 3}px` : '4px', opacity: rev ? 1 : 0.2, animationDelay: `${index * 40 + 200}ms` }} />)}</span>
      <div className="revenue-labels"><span>6am</span><span>10am</span><span>2pm</span><span>6pm</span><span>10pm</span></div>
    </div>
    <button type="button" onClick={() => setActive && setActive("Reports")}>View Reports <ChevronRight /></button>
  </article>;
}
function QuickAction({ icon: Icon, label, tone, onClick }: { icon: LucideIcon; label: string; tone: string; onClick: () => void }) {
  return <button type="button" onClick={onClick}><span className={`quick-icon ${tone}`}><Icon /></span><small>{label}</small></button>;
}
