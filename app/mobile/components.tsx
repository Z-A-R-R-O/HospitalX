"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Home,
  Menu,
  Plus,
  SlidersHorizontal,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useConnectivity } from "@/lib/offline/connectivity";
import { Mascot } from "page-mascot";
import "./mobile.css";

const tabs = [
  { label: "Today", href: "/mobile", icon: Home },
  { label: "AI", href: "/mobile/ai", icon: Bot },
  { label: "Patients", href: "/mobile/patients", icon: Users },
  { label: "Visits", href: "/mobile/appointments", icon: CalendarDays },
  { label: "Profile", href: "/mobile/profile", icon: CircleUserRound },
];

export function MobileShell({ children }: { children: React.ReactNode }) {
  const { isOnline, pendingCount } = useConnectivity();
  const pathname = usePathname();
  const [density, setDensity] = useState<"compact" | "relaxed">("compact");
  const [tweakOpen, setTweakOpen] = useState(false);

  return (
    <div className={`mobile-product mobile-density-${density}`}>
      <div className="mobile-ambient" aria-hidden="true" />
      <div className="mobile-frame">
        <header className="mobile-topbar">
          <Link className="mobile-brand" href="/mobile" aria-label="HospitalX mobile home">
            <span className="mobile-brand-mark"><Activity size={16} /></span>
            <span><strong>HospitalX</strong><small>Care, in context.</small></span>
          </Link>
          <div className="mobile-top-actions">
            <span className={`mobile-connectivity ${isOnline ? "is-online" : "is-offline"}`}>
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span>{isOnline ? "Online" : "Offline"}</span>
              {pendingCount > 0 && <b>{pendingCount}</b>}
            </span>
            <Link href="/settings" className="mobile-icon-button" aria-label="Open settings">
              <Menu size={18} />
            </Link>
          </div>
        </header>

        <main className="mobile-main">{children}</main>

        <nav className="mobile-tabbar" aria-label="Mobile navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.href === "/mobile"
              ? pathname === tab.href
              : pathname?.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} className={`mobile-tab ${active ? "is-active" : ""}`}>
                <Icon size={19} strokeWidth={active ? 2.3 : 1.8} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <button className="mobile-tweak-trigger" onClick={() => setTweakOpen((open) => !open)} aria-label="Open display settings">
          {tweakOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
        </button>
        {tweakOpen && (
          <div className="mobile-tweak-panel" aria-label="Display settings">
            <span>Display density</span>
            <button className={density === "compact" ? "is-selected" : ""} onClick={() => setDensity("compact")}>Compact</button>
            <button className={density === "relaxed" ? "is-selected" : ""} onClick={() => setDensity("relaxed")}>Relaxed</button>
          </div>
        )}
        {!pathname?.startsWith("/mobile/ai") && <MobileMadhu />}
      </div>
    </div>
  );
}

function MobileMadhu() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("mobileMadhuPosition");
    if (saved) {
      try { setPosition(JSON.parse(saved)); } catch { /* use the default position */ }
    }
  }, []);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const maxX = Math.max(0, Math.min(180, window.innerWidth - 112));
    const maxY = Math.max(0, Math.min(240, window.innerHeight - 190));
    const next = {
      x: Math.max(-80, Math.min(maxX, event.clientX - offset.x - (window.innerWidth - 112))),
      y: Math.max(-120, Math.min(maxY, event.clientY - offset.y - (window.innerHeight - 190))),
    };
    setPosition(next);
  };

  return (
    <div
      className={`mobile-madhu ${dragging ? "is-dragging" : ""}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
        setOffset({ x: event.clientX - (window.innerWidth - 112) - position.x, y: event.clientY - (window.innerHeight - 190) - position.y });
      }}
      onPointerMove={(event) => { if (dragging) move(event); }}
      onPointerUp={() => { setDragging(false); localStorage.setItem("mobileMadhuPosition", JSON.stringify(position)); }}
      onPointerCancel={() => setDragging(false)}
      aria-label="Move Madhu assistant"
    >
      <Link href="/mobile/ai" className="mobile-madhu-link" aria-label="Open Madhu AI">
        <span className="mobile-madhu-bubble">Ask Madhu</span>
        <Mascot directions="/mascots/nurse-directions.webp" reactions="/mascots/nurse-reactions.webp" size={76} label="Madhu, AI nurse" />
      </Link>
    </div>
  );
}

export function MobilePageHeader({ eyebrow, title, detail, action }: { eyebrow: string; title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="mobile-page-header">
      <div>
        <span className="mobile-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  );
}

export function MobileSectionHeading({ title, action }: { title: string; action?: string }) {
  return (
    <div className="mobile-section-heading">
      <h2>{title}</h2>
      {action && <button>{action}<ChevronRight size={14} /></button>}
    </div>
  );
}

export function MobileMetric({ label, value, tone = "blue", detail }: { label: string; value: string; tone?: "blue" | "green" | "orange" | "purple"; detail: string }) {
  return (
    <article className={`mobile-metric mobile-tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

export function MobileAction({ icon, title, detail, href, tone = "blue" }: { icon: React.ReactNode; title: string; detail: string; href: string; tone?: string }) {
  return (
    <Link href={href} className={`mobile-action mobile-action-${tone}`}>
      <span className="mobile-action-icon">{icon}</span>
      <span><strong>{title}</strong><small>{detail}</small></span>
      <ChevronRight size={17} />
    </Link>
  );
}

export function MobileEmpty({ title, detail }: { title: string; detail: string }) {
  return <div className="mobile-empty"><span><Plus size={18} /></span><strong>{title}</strong><p>{detail}</p></div>;
}
