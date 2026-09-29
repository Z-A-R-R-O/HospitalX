"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { type FormEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mascot } from "page-mascot";
import { createPortal } from "react-dom";
import { WORK_ITEMS } from "@/lib/interfrozt/constants";
type WorkDisplayItem = { slug?: string; title: string; type: string; problem: string; result: string; visual: string; previewImage?: string; previewImages?: readonly string[]; href?: string };
type MadhuMessage = { role: "assistant" | "user"; text: string };
const WORK_COMMAND_LINES = ["patient context connected", "care teams synchronized", "offline continuity ready"] as const;
const MADHU_KNOWLEDGE = [
  { question: "What is HospitalX?", answer: "HospitalX is a connected hospital operating system for patients, appointments, OPD, IPD, care teams, diagnostics, pharmacy, billing, inventory, and reporting." },
  { question: "How does offline care work?", answer: "HospitalX keeps essential workflows available locally, safely queues changes, and synchronizes them when connectivity returns—so care never waits for the network." },
  { question: "What can Madhu do?", answer: "I can explain the platform, surface delayed discharges and pending work, prepare handovers, and help teams understand what needs attention next." },
] as const;
function projectHref(item: WorkDisplayItem) {
  if (item.href) return item.href;
  const slug = item.slug || item.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/work/${slug}`;
}
function answerLandingQuestion(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.includes("offline") || normalized.includes("network") || normalized.includes("sync")) return MADHU_KNOWLEDGE[1].answer;
  if (normalized.includes("madhu") || normalized.includes("assistant") || normalized.includes(" ai")) return MADHU_KNOWLEDGE[2].answer;
  if (normalized.includes("patient") || normalized.includes("opd") || normalized.includes("ipd") || normalized.includes("workflow")) return "HospitalX gives every care team one live patient picture—from registration and consultation through diagnostics, admission, discharge, and follow-up. Every handoff remains visible.";
  if (normalized.includes("billing") || normalized.includes("pharmacy") || normalized.includes("lab") || normalized.includes("diagnostic")) return "Billing, pharmacy, labs, diagnostics, and inventory share the same operational context in HospitalX, so teams spend less time reconciling systems and more time moving care forward.";
  if (normalized.includes("start") || normalized.includes("demo") || normalized.includes("open")) return "You can open HospitalX from this page to explore the live workspace, or use the contact section to plan a rollout for your hospital.";
  return MADHU_KNOWLEDGE[0].answer;
}
function LandingMadhuCard({ ready, enabled, onEnable, onOpen, onDisable, onDismiss }: { ready: boolean; enabled: boolean; onEnable: () => void; onOpen: () => void; onDisable: () => void; onDismiss: () => void }) {
  if (enabled) {
    return (
      <motion.div className="landing-madhu-card landing-madhu-active" data-cursor="madhu" initial={{ opacity: 0, y: 18 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}>
        <span className="landing-madhu-active-signal" aria-hidden="true"><i /></span>
        <div><span>Madhu is active</span><strong>Your care co-pilot is moving with you.</strong></div>
        <div className="landing-madhu-active-actions"><button type="button" onClick={onOpen}>Open chat <span aria-hidden="true">↗</span></button><button type="button" onClick={onDisable}>Hide</button></div>
      </motion.div>
    );
  }
  return (
    <motion.div className="landing-madhu-card" data-cursor="madhu" initial={{ opacity: 0, y: 34, scale: 0.985 }} animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 34, scale: 0.985 }} transition={{ delay: ready ? 2.05 : 0, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
      <div className="landing-madhu-portrait">
        <Mascot directions="/mascots/nurse-directions.webp" reactions="/mascots/nurse-reactions.webp" size={168} label="Madhu, HospitalX AI nurse" />
        <span />
      </div>
      <div className="landing-madhu-content">
        <span className="landing-madhu-eyebrow">HospitalX intelligence</span>
        <strong>Meet Madhu.</strong>
        <p>Your animated care co-pilot can explain the system, answer HospitalX questions, and stay with you as you explore.</p>
        <div className="landing-madhu-actions"><button type="button" onClick={onEnable}>Enable Madhu <span aria-hidden="true">→</span></button><button type="button" onClick={onDismiss}>Not now</button></div>
      </div>
    </motion.div>
  );
}
function LandingMadhuOverlay({ enabled, openSignal, onDisable }: { enabled: boolean; openSignal: number; onDisable: () => void }) {
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MadhuMessage[]>([{ role: "assistant", text: "Hi, I’m Madhu. Ask me how HospitalX keeps care connected." }]);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number; moved: boolean } | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const soundPlayedRef = useRef(false);
  useEffect(() => {
    const saved = window.localStorage.getItem("mascotPos");
    let next = { x: Math.max(18, window.innerWidth - 180), y: Math.max(90, window.innerHeight - 208) };
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { x?: number; y?: number };
        if (typeof parsed.x === "number" && typeof parsed.y === "number") next = parsed as { x: number; y: number };
      } catch { /* Use the safe default. */ }
    }
    setPosition({ x: Math.min(Math.max(12, next.x), Math.max(12, window.innerWidth - 148)), y: Math.min(Math.max(76, next.y), Math.max(76, window.innerHeight - 156)) });
    setHydrated(true);
  }, []);
  useEffect(() => { if (openSignal > 0) setOpen(true); }, [openSignal]);
  useEffect(() => { messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" }); }, [messages, open]);
  const moveMadhu = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 5 && !drag.moved) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setPosition({ x: Math.min(Math.max(12, drag.originX + deltaX), Math.max(12, window.innerWidth - 148)), y: Math.min(Math.max(76, drag.originY + deltaY), Math.max(76, window.innerHeight - 156)) });
  };
  const stopMovingMadhu = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    window.localStorage.setItem("mascotPos", JSON.stringify(position));
    if (!drag.moved) {
      if (!soundPlayedRef.current) {
        const audio = new Audio("/tuturu.mp3");
        audio.volume = 0.12;
        void audio.play().catch(() => undefined);
        soundPlayedRef.current = true;
      }
      setOpen((value) => !value);
    }
    dragRef.current = null;
  };
  const submitQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "assistant", text: answerLandingQuestion(trimmed) }]);
    setInput("");
    setOpen(true);
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); submitQuestion(input); };
  if (!hydrated || !enabled) return null;
  const opensLeft = position.x > window.innerWidth / 2;
  return createPortal(
    <motion.div className="landing-madhu-overlay" style={{ left: position.x, top: position.y }} initial={{ opacity: 0, scale: 0.8, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
      <AnimatePresence>
      {open && (
        <motion.aside data-cursor="madhu" className={`landing-madhu-chat ${opensLeft ? "opens-left" : "opens-right"}`} initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 10, scale: 0.97, filter: "blur(5px)" }} transition={{ duration: .42, ease: [0.16, 1, 0.3, 1] }} aria-label="Chat with Madhu">
          <header><div><span>HospitalX guide</span><strong>Ask Madhu</strong></div><button type="button" data-cursor="madhu-close" onClick={() => setOpen(false)} aria-label="Close Madhu chat"><span aria-hidden="true">×</span></button></header>
          <div className="landing-madhu-messages" ref={messagesRef} aria-live="polite">{messages.map((message, index) => <motion.p layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={`${message.role}-${index}`} className={message.role}>{message.text}</motion.p>)}</div>
          <div className="landing-madhu-quick">{MADHU_KNOWLEDGE.slice(0, 2).map((item) => <button key={item.question} type="button" onClick={() => submitQuestion(item.question)}>{item.question}</button>)}</div>
          <form onSubmit={onSubmit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about HospitalX…" aria-label="Message Madhu" /><button type="submit" aria-label="Send message">→</button></form>
          <button type="button" className="landing-madhu-hide" onClick={onDisable}>Hide Madhu</button>
        </motion.aside>
      )}
      </AnimatePresence>
      <div className="landing-madhu-float" data-cursor="madhu" role="button" tabIndex={0} aria-label="Move or open Madhu"
        onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen((value) => !value); } }}
        onPointerDown={(event) => { dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y, moved: false }; }}
        onPointerMove={moveMadhu} onPointerUp={stopMovingMadhu} onPointerCancel={() => { dragRef.current = null; }}>
        <Mascot directions="/mascots/nurse-directions.webp" reactions="/mascots/nurse-reactions.webp" size={148} label="Madhu, HospitalX AI nurse" />
      </div>
    </motion.div>,
    document.body,
  );
}
export default function WorkSection({ items = WORK_ITEMS }: { items?: readonly WorkDisplayItem[] }) {
  const [gatewayReady, setGatewayReady] = useState(false);
  const [madhuEnabled, setMadhuEnabled] = useState(false);
  const [madhuDismissed, setMadhuDismissed] = useState(false);
  const [madhuOpenSignal, setMadhuOpenSignal] = useState(0);
  const gatewayRef = useRef<HTMLDivElement>(null);
  const gatewayHeldRef = useRef(false);
  useEffect(() => {
    const landingPreference = window.localStorage.getItem("landingMadhuEnabled");
    setMadhuEnabled(landingPreference === "true");
    setMadhuDismissed(window.sessionStorage.getItem("landingMadhuDismissed") === "true");
  }, []);
  useEffect(() => {
    const gateway = gatewayRef.current;
    if (!gateway) return;
    let revealTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || gatewayHeldRef.current) return;
      gatewayHeldRef.current = true;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      revealTimer = setTimeout(() => setGatewayReady(true), reducedMotion ? 0 : 220);
    }, { threshold: [0.42] });
    observer.observe(gateway);
    return () => {
      observer.disconnect();
      if (revealTimer) clearTimeout(revealTimer);
      gatewayHeldRef.current = false;
    };
  }, []);
  const enableMadhu = () => { window.localStorage.setItem("landingMadhuEnabled", "true"); window.sessionStorage.removeItem("landingMadhuDismissed"); setMadhuDismissed(false); setMadhuEnabled(true); };
  const disableMadhu = () => { window.localStorage.setItem("landingMadhuEnabled", "false"); setMadhuEnabled(false); };
  const dismissMadhu = () => { window.sessionStorage.setItem("landingMadhuDismissed", "true"); setMadhuDismissed(true); };
  return (
    <section className="work-section relative w-full overflow-hidden bg-frost text-carbon">
      <div className="work-portal-echo" aria-hidden="true"><span /></div>
      <div className="work-reveal-space" aria-hidden="true"><span /></div>
      <div id="work" className="section-band work-gateway"><motion.div className="grid-shell work-gateway-grid" ref={gatewayRef} initial={{ opacity: 0, y: 42, scale: 0.992 }} animate={gatewayReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 42, scale: 0.992 }} transition={{ delay: gatewayReady ? 0.08 : 0, duration: 1.45, ease: [0.16, 1, 0.3, 1] }}>
        <motion.div className="work-gateway-copy md:col-span-5" initial={{ opacity: 0, x: -46, filter: "blur(12px)" }} animate={gatewayReady ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: -46, filter: "blur(12px)" }} transition={{ delay: gatewayReady ? 0.42 : 0, duration: 1.42, ease: [0.16, 1, 0.3, 1] }}>
          <span className="work-kicker">02 / The care operating system</span><h2 className="work-gateway-title font-display uppercase">One hospital.<br />Every flow connected.</h2><p className="work-gateway-copytext">HospitalX brings clinical care, hospital operations, and the people behind them into one calm, continuously connected system.</p><a href="#contact" className="work-gateway-cta">Bring HospitalX to your team <span aria-hidden="true">&rarr;</span></a>
        </motion.div>
        <div className="md:col-span-7"><motion.div className="work-proof-board" initial={{ opacity: 0, x: 52, filter: "blur(16px)", scale: 0.985 }} animate={gatewayReady ? { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 } : { opacity: 0, x: 52, filter: "blur(16px)", scale: 0.985 }} transition={{ delay: gatewayReady ? 0.68 : 0, duration: 1.55, ease: [0.16, 1, 0.3, 1] }}>
          <div className="work-terminal"><div className="work-terminal-bar"><span>hx/care-network</span><span>live</span></div><div className="work-command-lines">
            {WORK_COMMAND_LINES.map((line, index) => <motion.div key={line} className="work-command-line" initial={{ opacity: 0, x: -14 }} animate={gatewayReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }} transition={{ delay: gatewayReady ? 1.18 + index * 0.25 : 0, duration: 0.78, ease: [0.16, 1, 0.3, 1] }}><span aria-hidden="true">&gt;</span><span>{line}</span></motion.div>)}
            <motion.div className="work-command-line work-command-line-final" initial={{ opacity: 0, x: -14 }} animate={gatewayReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }} transition={{ delay: gatewayReady ? 1.93 : 0, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}><span aria-hidden="true">&gt;</span><span>care flow active <i aria-hidden="true" /></span></motion.div>
          </div></div>
          <div className="work-proof-list">{items.map((item, index) => <motion.article key={item.title} className="work-proof-row" initial={{ opacity: 0, y: 18 }} animate={gatewayReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }} transition={{ delay: gatewayReady ? 1.34 + index * 0.22 : 0, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}><a href={projectHref(item)} className="work-proof-link"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.title}</h3><p>{item.type}</p></div><strong>{item.result}</strong></a></motion.article>)}<div className="work-proof-footer"><span>Patients · Teams · Workflow · Continuity</span><a href="/dashboard">Open HospitalX <span aria-hidden="true">→</span></a></div></div>
          {!madhuDismissed && <LandingMadhuCard ready={gatewayReady} enabled={madhuEnabled} onEnable={enableMadhu} onOpen={() => setMadhuOpenSignal((value) => value + 1)} onDisable={disableMadhu} onDismiss={dismissMadhu} />}
        </motion.div></div>
      </motion.div></div>
      <LandingMadhuOverlay enabled={madhuEnabled} openSignal={madhuOpenSignal} onDisable={disableMadhu} />
    </section>
  );
}

