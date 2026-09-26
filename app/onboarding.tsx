"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, Sparkles, Wifi, WifiOff, X } from "lucide-react";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
type SetupStep = {
  id: string;
  route?: string;
  target?: string;
  title: string;
  subtitle?: string;
  description: string;
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "left" | "right";
  action?: "highlight" | "navigate" | "demo" | "expand" | "reveal";
  demo?: string[];
};

type SetupStatus = "not_started" | "in_progress" | "completed" | "skipped";

/* ─────────────────────────────────────────────
   Steps
   ───────────────────────────────────────────── */
const STEPS: SetupStep[] = [
  {
    id: "welcome",
    title: "Welcome to HospitalX",
    subtitle: "Your hospital, connected.",
    description: "Let's take 90 seconds to get you familiar with the command center.",
    position: "center",
  },
  {
    id: "command-center",
    title: "This is your command center.",
    description: "HospitalX brings the most important activity in your hospital into one place — patients, appointments, beds, staff, and operations.",
    target: ".hero",
    position: "bottom-left",
    action: "highlight",
    demo: ["Patients", "OPD", "Beds", "Staff", "Lab", "Pharmacy", "Billing"],
  },
  {
    id: "search",
    title: "Find anything. Fast.",
    description: "Search across your hospital without jumping between modules. Patients, staff, beds — everything in one place.",
    target: ".search",
    position: "bottom-left",
    action: "highlight",
  },
  {
    id: "metrics",
    title: "Know what needs attention.",
    description: "Your most important operational numbers stay visible at a glance. Patients waiting, beds available, and revenue — all live.",
    target: ".metric-strip",
    position: "bottom-left",
    action: "highlight",
  },
  {
    id: "queue",
    title: "See patient flow in real time.",
    description: "Track who is waiting, who's being consulted, and who needs attention next. Every patient's journey is visible.",
    target: ".queue",
    position: "top-right",
    action: "highlight",
    demo: ["Waiting", "Triage", "Consultation", "Completed"],
  },
  {
    id: "attention",
    title: "HospitalX watches the details.",
    description: "Urgent operational items surface here so your team doesn't have to hunt for them. ICU alerts, pending results, low stock — all in one place.",
    target: ".attention",
    position: "left",
    action: "highlight",
  },
  {
    id: "patients",
    title: "Your patient registry.",
    description: "Every patient has one place for their identity, history, complaints, and care information. No more scattered records.",
    route: "Patients",
    action: "navigate",
    position: "bottom-right",
    target: "main",
  },
  {
    id: "appointments",
    title: "Plan the day.",
    description: "Manage scheduled visits and follow each appointment from scheduled to completed. Calendar views and timeline tracking built in.",
    route: "Appointments",
    action: "navigate",
    position: "bottom-right",
    target: "main",
  },
  {
    id: "opd",
    title: "Follow every patient through OPD.",
    description: "A visual Kanban board that tracks each patient from arrival to discharge. Drag, update, and monitor in real time.",
    route: "OPD",
    action: "navigate",
    position: "bottom-right",
    target: "main",
    demo: ["Waiting", "Triage", "Consultation", "Pharmacy", "Completed"],
  },
  {
    id: "beds",
    title: "See your hospital's capacity.",
    description: "Know which beds are available, occupied, cleaning, or assigned. ICU, General, Emergency — every ward at a glance.",
    route: "IPD & Beds",
    action: "navigate",
    position: "bottom-right",
    target: "main",
  },
  {
    id: "staff",
    title: "Your team, at a glance.",
    description: "See who's on duty, where they're assigned, and how your teams are distributed. Doctors and nursing staff, unified.",
    route: "Doctors",
    action: "navigate",
    position: "bottom-right",
    target: "main",
  },
  {
    id: "clinical",
    title: "From request to result.",
    description: "Track investigations from the moment they're ordered to when results are ready. Lab work, imaging, pathology — all connected.",
    route: "Laboratory",
    action: "navigate",
    position: "bottom-right",
    target: "main",
  },
  {
    id: "operations",
    title: "Close the loop.",
    description: "Hospital operations don't stop at consultation. Pharmacy dispensing, billing, and inventory — HospitalX keeps the operational chain connected.",
    route: "Pharmacy",
    action: "navigate",
    position: "bottom-right",
    target: "main",
  },
  {
    id: "madhu",
    title: "Meet Madhu.",
    subtitle: "Your operational assistant.",
    description: "Ask questions about your hospital, understand what's happening, and work with your data — without leaving the command center.",
    position: "center",
    action: "reveal",
    demo: [
      "\"How busy is the hospital today?\"",
      "\"OPD has 12 patients waiting. 3 consultations active. ICU at 85% capacity.\""
    ],
  },
  {
    id: "copilot",
    title: "Go deeper when you need to.",
    description: "Use the full AI workspace for operational analysis, summaries, handover reports, and complex tasks.",
    route: "AI Co-pilot",
    action: "navigate",
    position: "bottom-right",
    target: "main",
    demo: [
      "Summarize today's OPD.",
      "Which departments are overloaded?",
      "Show me pending lab work.",
      "Prepare a handover summary."
    ],
  },
  {
    id: "offline",
    title: "HospitalX keeps working.",
    subtitle: "Work now. Sync later.",
    description: "When connectivity drops, HospitalX continues operating. When connection returns, your changes synchronize safely to the hospital database.",
    position: "center",
    action: "demo",
  },
  {
    id: "finish",
    title: "You're ready.",
    subtitle: "HospitalX is built to keep your hospital moving.",
    description: "",
    position: "center",
  },
];

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
interface OnboardingProps {
  setActive: (label: string) => void;
  onComplete: () => void;
}

export function HospitalXOnboarding({ setActive, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [cardAnim, setCardAnim] = useState("setup-card-enter");
  const [demoIndex, setDemoIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = STEPS[step];
  const total = STEPS.length;
  const progress = ((step) / (total - 1)) * 100;

  /* Demo cycling for steps with demo arrays */
  useEffect(() => {
    if (!current.demo || current.demo.length <= 1) return;
    setDemoIndex(0);
    const interval = setInterval(() => {
      setDemoIndex(prev => (prev + 1) % current.demo!.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [step, current.demo]);

  /* Navigate to route if step requires it */
  useEffect(() => {
    if (current.route) {
      setActive(current.route);
    }
    if (current.id === "command-center" || current.id === "search" || current.id === "metrics" || current.id === "queue" || current.id === "attention") {
      setActive("Home");
    }
  }, [step, current, setActive]);

  /* Highlight target element and/or nav button and handle stacking contexts */
  useEffect(() => {
    let els: HTMLElement[] = [];
    
    if (current.target) {
      const el = document.querySelector(current.target) as HTMLElement;
      if (el) els.push(el);
    }
    
    if (current.route) {
      const navEl = document.querySelector(`[data-tour="${current.route}"]`) as HTMLElement;
      if (navEl) els.push(navEl);
    }
    
    const cleanupFns: Array<() => void> = [];
    
    els.forEach(el => {
      el.classList.add("setup-highlight");
      
      // Walk up the tree to fix stacking contexts unconditionally
      const parents: HTMLElement[] = [];
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        parents.push(parent);
        parent.classList.add("setup-parent-highlight");
        if (window.getComputedStyle(parent).position === 'static') {
          parent.style.position = 'relative';
          parent.dataset.setupPos = 'true';
        }
        parent = parent.parentElement;
      }
      
      cleanupFns.push(() => {
        el.classList.remove("setup-highlight");
        parents.forEach(p => {
          p.classList.remove("setup-parent-highlight");
          if (p.dataset.setupPos === 'true') {
            p.style.position = '';
            delete p.dataset.setupPos;
          }
        });
      });
    });
    
    return () => cleanupFns.forEach(fn => fn());
  }, [step, current]);

  const advance = useCallback(() => {
    if (step >= total - 1) {
      finish();
      return;
    }
    setCardAnim("setup-card-exit");
    setTimeout(() => {
      setStep(s => s + 1);
      setCardAnim("setup-card-enter");
    }, 280);
  }, [step, total]);

  const finish = useCallback(() => {
    localStorage.setItem("hospitalx_setup_status", "completed");
    localStorage.setItem("hospitalx_setup_completed_at", new Date().toISOString());
    localStorage.setItem("hospitalx_setup_version", "1");
    setVisible(false);
    setActive("Home");
    onComplete();
  }, [setActive, onComplete]);

  const skip = useCallback(() => {
    localStorage.setItem("hospitalx_setup_status", "skipped");
    setVisible(false);
    setActive("Home");
    onComplete();
  }, [setActive, onComplete]);

  if (!visible) return null;

  /* ── Position logic ── */
  const positionStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = { position: "absolute", zIndex: 100002 };
    switch (current.position) {
      case "top-left": return { ...base, top: "120px", left: "40px" };
      case "top-right": return { ...base, top: "120px", right: "40px" };
      case "bottom-left": return { ...base, bottom: "80px", left: "40px" };
      case "bottom-right": return { ...base, bottom: "80px", right: "40px" };
      case "left": return { ...base, top: "50%", left: "40px", transform: "translateY(-50%)" };
      case "right": return { ...base, top: "50%", right: "40px", transform: "translateY(-50%)" };
      default: return { ...base, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
  };

  const isWelcome = current.id === "welcome";
  const isFinish = current.id === "finish";
  const isMadhu = current.id === "madhu";
  const isOffline = current.id === "offline";

  return (
    <div className="setup-overlay" style={{ position: "fixed", inset: 0, zIndex: 100000 }}>
      {/* Cinematic veil */}
      <div className="setup-veil" onClick={skip} />

      {/* Progress bar */}
      {!isWelcome && (
        <div className="setup-progress-bar">
          <div className="setup-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Step counter */}
      {!isWelcome && !isFinish && (
        <div className="setup-counter">
          <span className="setup-counter-current">{String(step).padStart(2, "0")}</span>
          <span className="setup-counter-divider" />
          <span className="setup-counter-total">{String(total - 1).padStart(2, "0")}</span>
        </div>
      )}

      {/* Card */}
      <div
        ref={cardRef}
        className={`setup-card ${cardAnim} ${isWelcome ? "setup-card-welcome" : ""} ${isFinish ? "setup-card-finish" : ""} ${isMadhu ? "setup-card-madhu" : ""}`}
        style={positionStyle()}
      >
        {/* Close */}
        {!isWelcome && !isFinish && (
          <button className="setup-skip-btn" onClick={skip} aria-label="Skip setup">
            <X size={16} />
          </button>
        )}

        {/* Logo breathing for welcome */}
        {isWelcome && (
          <div className="setup-logo-breathing">
            <span className="brand-mark" aria-hidden="true"><i /><i /></span>
          </div>
        )}

        {/* Madhu reveal */}
        {isMadhu && (
          <div className="setup-madhu-icon">
            <Sparkles size={32} />
          </div>
        )}

        {/* Offline animation */}
        {isOffline && (
          <div className="setup-offline-demo">
            <div className="setup-wifi-indicator online">
              <Wifi size={20} /> <span>Online</span>
            </div>
            <div className="setup-wifi-arrow">↓</div>
            <div className="setup-wifi-indicator offline">
              <WifiOff size={20} /> <span>Offline</span>
            </div>
            <div className="setup-wifi-arrow">↓</div>
            <div className="setup-sync-text">Changes sync when you're back</div>
          </div>
        )}

        {/* Eyebrow */}
        {!isWelcome && !isFinish && (
          <span className="setup-eyebrow">HOSPITALX · {String(step).padStart(2, "0")} / {String(total - 1).padStart(2, "0")}</span>
        )}

        {/* Title */}
        <h2 className="setup-title">{current.title}</h2>

        {/* Subtitle */}
        {current.subtitle && (
          <p className="setup-subtitle">{current.subtitle}</p>
        )}

        {/* Description */}
        {current.description && (
          <p className="setup-description">{current.description}</p>
        )}

        {/* Demo flow visualization */}
        {current.demo && current.demo.length > 1 && !isMadhu && (
          <div className="setup-demo-flow">
            {current.demo.map((item, i) => (
              <span key={item} className={`setup-demo-item ${i === demoIndex ? "active" : ""}`}>
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Madhu conversation demo */}
        {isMadhu && current.demo && (
          <div className="setup-madhu-convo">
            <div className="setup-convo-user">
              <span>You</span>
              <p>{current.demo[0]}</p>
            </div>
            <div className="setup-convo-madhu">
              <span>Madhu</span>
              <p>{current.demo[1]}</p>
            </div>
          </div>
        )}

        {/* Copilot commands */}
        {current.id === "copilot" && current.demo && (
          <div className="setup-command-grid">
            {current.demo.map(cmd => (
              <div key={cmd} className="setup-command-pill">{cmd}</div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="setup-actions">
          {isWelcome ? (
            <>
              <button className="setup-primary-btn" onClick={advance}>
                Start setup <ArrowRight size={16} />
              </button>
              <button className="setup-secondary-btn" onClick={skip}>
                Skip for now
              </button>
            </>
          ) : isFinish ? (
            <>
              <button className="setup-primary-btn setup-finish-btn" onClick={finish}>
                Enter HospitalX <ArrowRight size={16} />
              </button>
              <button className="setup-secondary-btn" onClick={() => { setStep(0); setCardAnim("setup-card-enter"); }}>
                Replay setup
              </button>
            </>
          ) : (
            <button className="setup-primary-btn" onClick={advance}>
              Continue <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hook: should show onboarding?
   ───────────────────────────────────────────── */
export function useSetupStatus() {
  const [status, setStatus] = useState<SetupStatus>("not_started");
  useEffect(() => {
    const stored = localStorage.getItem("hospitalx_setup_status") as SetupStatus | null;
    if (stored) setStatus(stored);
  }, []);
  return { status, setStatus };
}
