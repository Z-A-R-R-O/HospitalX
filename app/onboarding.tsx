"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Activity, ArrowRight, BedDouble, Bot, CalendarDays, Check, Layers3,
  Search, ShieldCheck, Sparkles, Users, Wifi, WifiOff, X,
} from "lucide-react";

type SetupStatus = "not_started" | "in_progress" | "completed" | "skipped";
type CardPosition = "center" | "bottom-left" | "left" | "top-right" | "right";
type SetupStep = { id: string; title: string; subtitle?: string; description: string; target?: string; route?: string; position: CardPosition; demo?: string[]; icon?: keyof typeof ICONS };
type SpotlightRect = { top: number; left: number; right: number; bottom: number; width: number; height: number; radius: number };

const STEPS: SetupStep[] = [
  { id: "welcome", title: "Welcome to HospitalX", subtitle: "Your hospital, connected.", description: "A calm, guided introduction to the operating system behind your hospital. It takes about 90 seconds.", position: "center" },
  { id: "command", title: "Your command center.", description: "The most important activity stays together: patients, appointments, beds, staff, and operations.", target: ".hero", position: "bottom-left", icon: "command", demo: ["Patients", "OPD", "Beds", "Staff", "Labs", "Pharmacy"] },
  { id: "search", title: "Find anything, instantly.", description: "Search across patients, staff, beds, and records without jumping between modules.", target: ".search", position: "bottom-left", icon: "search" },
  { id: "metrics", title: "See the signal at a glance.", description: "Your most important operational numbers stay visible and current, so the next decision is always close.", target: ".metric-strip", position: "bottom-left", icon: "metrics" },
  { id: "queue", title: "Follow patient flow in real time.", description: "Know who is waiting, who is being consulted, and what needs attention next.", target: ".queue", position: "right", icon: "patients", demo: ["Waiting", "Triage", "Consultation", "Completed"] },
  { id: "attention", title: "Keep the details moving.", description: "Urgent operational items surface here, from pending results to capacity and stock alerts.", target: ".attention", position: "left", icon: "metrics" },
  { id: "patients", title: "One patient story.", description: "Identity, history, complaints, and care information live together in a clear patient registry.", route: "Patients", target: "main", position: "left", icon: "patients" },
  { id: "appointments", title: "Plan the day with confidence.", description: "Manage scheduled visits and follow each appointment from scheduled to completed.", route: "Appointments", target: "main", position: "left", icon: "calendar" },
  { id: "opd", title: "Move patients through OPD.", description: "A visual workflow makes the journey from arrival to discharge easy to see and manage.", route: "OPD", target: "main", position: "left", icon: "patients", demo: ["Waiting", "Triage", "Consultation", "Pharmacy", "Completed"] },
  { id: "beds", title: "Know your capacity.", description: "See available, occupied, cleaning, and assigned beds across every ward.", route: "IPD & Beds", target: "main", position: "left", icon: "beds" },
  { id: "team", title: "Your team, at a glance.", description: "See who is on duty, where they are assigned, and how care teams are distributed.", route: "Doctors", target: "main", position: "left", icon: "team" },
  { id: "clinical", title: "From request to result.", description: "Track investigations from the moment they are ordered to when results are ready.", route: "Laboratory", target: "main", position: "left", icon: "metrics" },
  { id: "operations", title: "Close the loop.", description: "Pharmacy, billing, and inventory connect the operational chain after consultation.", route: "Pharmacy", target: "main", position: "top-right", icon: "beds" },
  { id: "madhu", title: "Meet Madhu.", subtitle: "Your operational assistant.", description: "Ask questions about your hospital, understand what is happening, and work with your data without leaving the command center.", position: "center", icon: "ai", demo: ["How busy is the hospital today?", "OPD has 12 patients waiting. 3 consultations active."] },
  { id: "copilot", title: "Go deeper when you need to.", description: "Use the full AI workspace for analysis, summaries, handovers, and complex operational questions.", route: "AI Co-pilot", target: "main", position: "left", icon: "ai", demo: ["Summarize today's OPD.", "Which departments are overloaded?", "Show me pending lab work."] },
  { id: "offline", title: "Work now. Sync later.", subtitle: "HospitalX keeps moving.", description: "When connectivity drops, work continues safely. When it returns, changes synchronize back to the hospital database.", position: "center", icon: "offline" },
  { id: "finish", title: "You are ready.", subtitle: "A clearer hospital day starts here.", description: "HospitalX gives every team the context to move faster, communicate better, and care with confidence.", position: "center" },
];

const ICONS = { command: Layers3, search: Search, metrics: Activity, patients: Users, calendar: CalendarDays, beds: BedDouble, team: ShieldCheck, ai: Bot, offline: Wifi };

export function useSetupStatus() {
  const [status, setStatus] = useState<SetupStatus>("not_started");
  useEffect(() => { const saved = localStorage.getItem("hospitalx_setup_status") as SetupStatus | null; if (saved) setStatus(saved); }, []);
  return { status, setStatus };
}

export function HospitalXOnboarding({ setActive, onComplete }: { setActive: (label: string) => void; onComplete: (status: SetupStatus) => void }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const timerRef = useRef<number | null>(null);
  const current = STEPS[step];
  const progress = (step / (STEPS.length - 1)) * 100;

  useEffect(() => { if (current.route) setActive(current.route); else if (step <= 5) setActive("Home"); }, [current.route, setActive, step]);

  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      const element = current.target ? document.querySelector<HTMLElement>(current.target) : null;
      if (!element) { setSpotlight(null); return; }
      const box = element.getBoundingClientRect();
      const pad = window.innerWidth < 700 ? 5 : 8;
      const left = Math.max(8, box.left - pad); const top = Math.max(8, box.top - pad);
      const right = Math.min(window.innerWidth - 8, box.right + pad); const bottom = Math.min(window.innerHeight - 8, box.bottom + pad);
      setSpotlight({ top, left, right, bottom, width: right - left, height: bottom - top, radius: Number.parseFloat(getComputedStyle(element).borderRadius) || 18 });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    schedule(); window.addEventListener("resize", schedule); window.addEventListener("scroll", schedule, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); window.removeEventListener("scroll", schedule, true); };
  }, [current.target, step]);

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const finish = useCallback(() => { localStorage.setItem("hospitalx_setup_status", "completed"); localStorage.setItem("hospitalx_setup_completed_at", new Date().toISOString()); localStorage.setItem("hospitalx_setup_version", "2"); onComplete("completed"); }, [onComplete]);
  const skip = useCallback(() => { localStorage.setItem("hospitalx_setup_status", "skipped"); onComplete("skipped"); }, [onComplete]);
  const advance = useCallback(() => {
    if (phase === "exit") return;
    if (step === STEPS.length - 1) { finish(); return; }
    setPhase("exit");
    timerRef.current = window.setTimeout(() => { setStep((value) => value + 1); setPhase("enter"); }, 300);
  }, [finish, phase, step]);

  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") skip(); if (event.key === "Enter" && event.target === document.body) advance(); }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, [advance, skip]);

  const Icon = current.icon ? ICONS[current.icon] : Sparkles;
  const panelStyle = spotlight ? { "--spot-top": `${spotlight.top}px`, "--spot-left": `${spotlight.left}px`, "--spot-right": `${spotlight.right}px`, "--spot-bottom": `${spotlight.bottom}px` } as React.CSSProperties : undefined;
  const ringStyle = spotlight ? { top: spotlight.top, left: spotlight.left, width: spotlight.width, height: spotlight.height, borderRadius: spotlight.radius } : undefined;

  return (
    <div className="hx-onboarding" aria-label="HospitalX guided setup">
      {spotlight ? <div className="hx-spotlight-panels" style={panelStyle} aria-hidden="true"><span className="hx-panel hx-panel-top" /><span className="hx-panel hx-panel-left" /><span className="hx-panel hx-panel-right" /><span className="hx-panel hx-panel-bottom" /><span className="hx-spotlight-ring" style={ringStyle} /></div> : <div className="hx-spotlight-panels hx-spotlight-full" aria-hidden="true" />}
      <div className="hx-tour-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      {step > 0 && <div className="hx-tour-counter" aria-hidden="true"><strong>{String(step).padStart(2, "0")}</strong><i />{String(STEPS.length - 1).padStart(2, "0")}</div>}

      <section className={`hx-tour-card hx-tour-card-${current.position} hx-tour-card-${phase}`} role="dialog" aria-modal="true" aria-labelledby="hx-tour-title" aria-describedby="hx-tour-description">
        {step > 0 && <button className="hx-tour-close" onClick={skip} aria-label="Skip guided setup"><X size={17} /></button>}
        {current.id === "welcome" && <div className="hx-tour-logo"><span className="brand-mark" aria-hidden="true"><i /><i /></span></div>}
        {current.icon && current.id !== "finish" && <div className={`hx-tour-icon hx-tour-icon-${current.icon}`}><Icon size={22} /></div>}
        <div className="hx-tour-eyebrow">HOSPITALX <span>·</span> {String(step).padStart(2, "0")} / {String(STEPS.length - 1).padStart(2, "0")}</div>
        <h2 id="hx-tour-title">{current.title}</h2>
        {current.subtitle && <p className="hx-tour-subtitle">{current.subtitle}</p>}
        <p id="hx-tour-description" className="hx-tour-description">{current.description}</p>
        {current.demo && <div className={`hx-tour-demo hx-tour-demo-${current.id}`}>
          {current.id === "offline" ? <><div><Wifi size={16} /> Online</div><span>↓</span><div><WifiOff size={16} /> Offline</div><span>↓</span><strong>Changes sync when you are back</strong></> : current.id === "madhu" ? <><div className="hx-chat-user">“{current.demo[0]}”</div><div className="hx-chat-ai">{current.demo[1]}</div></> : current.demo.map((item, index) => <span className={index === 0 ? "is-active" : ""} key={item}>{item}</span>)}
        </div>}
        <div className="hx-tour-actions">{step === 0 ? <><button className="hx-tour-primary" onClick={advance}>Start guided setup <ArrowRight size={17} /></button><button className="hx-tour-secondary" onClick={skip}>Skip for now</button></> : <button className="hx-tour-primary" onClick={advance}>{step === STEPS.length - 1 ? "Enter HospitalX" : "Continue"}<ArrowRight size={17} /></button>}</div>
        {step > 0 && <div className="hx-tour-hint"><Check size={13} /> Press Enter to continue</div>}
      </section>
    </div>
  );
}
