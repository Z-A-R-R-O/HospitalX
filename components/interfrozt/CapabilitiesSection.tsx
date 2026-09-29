"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutDashboard, Microscope, Route, Sparkles, Stethoscope, WalletCards, type LucideIcon } from "lucide-react";
type CapabilityItem = {
  id: string;
  title: string;
  summary: string;
  icon?: string;
};
const MODULE_DETAILS: Record<string, { code: string; teams: string; signal: string; promise: string; Icon: LucideIcon; href: string }> = {
  command: {
    code: "HX / OPS-01",
    teams: "Hospital leadership · Operations · Care coordinators",
    signal: "Capacity, queues, staffing, delayed work, and escalation risk",
    promise: "One live operational picture—without waiting for another report.",
    Icon: LayoutDashboard,
    href: "/system/command-center",
  },
  flow: {
    code: "HX / FLOW-02",
    teams: "Front desk · Nursing · Wards · Bed management",
    signal: "Current stage, owner, next action, blockers, and expected movement",
    promise: "Every handoff remains visible from arrival through follow-up.",
    Icon: Route,
    href: "/system/patient-flow",
  },
  clinical: {
    code: "HX / CLINICAL-03",
    teams: "Doctors · Nurses · Allied health · Care teams",
    signal: "History, observations, notes, orders, risks, and the current plan",
    promise: "The right clinical context follows the patient—not the workstation.",
    Icon: Stethoscope,
    href: "/system/clinical-workspace",
  },
  diagnostics: {
    code: "HX / CARE-04",
    teams: "Laboratory · Imaging · Pharmacy · Clinicians",
    signal: "Orders, collections, results, prescriptions, dispensing, and exceptions",
    promise: "Evidence and treatment move together in one coordinated loop.",
    Icon: Microscope,
    href: "/system/diagnostics-pharmacy",
  },
  revenue: {
    code: "HX / RESOURCE-05",
    teams: "Billing · Finance · Stores · Procurement",
    signal: "Charges, claims, payments, stock, expiry risk, and replenishment",
    promise: "Every resource action stays connected to the care behind it.",
    Icon: WalletCards,
    href: "/system/revenue-inventory",
  },
  intelligence: {
    code: "HX / MADHU-06",
    teams: "Every HospitalX team",
    signal: "Delays, workload, risk, missing context, and recommended next actions",
    promise: "Madhu turns a complex hospital into clear, explainable priorities.",
    Icon: Sparkles,
    href: "/system/madhu-intelligence",
  },
};
export default function CapabilitiesSection({ capabilities }: { capabilities: readonly CapabilityItem[] }) {
  const modules = capabilities.slice(0, 6);
  const [activeId, setActiveId] = useState(modules[0]?.id ?? "command");
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const activeModule = modules.find((module) => module.id === activeId) ?? modules[0];
  const activeDetails = MODULE_DETAILS[activeModule?.id ?? "command"] ?? MODULE_DETAILS.command;
  const ActiveModuleIcon = activeDetails.Icon;
  const selectModuleFromKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? modules.length - 1
        : (index + (event.key === "ArrowDown" ? 1 : -1) + modules.length) % modules.length;
    const nextModule = modules[nextIndex];
    if (!nextModule) return;
    setActiveId(nextModule.id);
    window.requestAnimationFrame(() => document.getElementById(`module-tab-${nextModule.id}`)?.focus());
  };
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video || reduceMotion) return;
    const observer = new IntersectionObserver(([entry]) => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      const canPlay = window.innerWidth >= 768 && !connection?.saveData;
      if (entry.isIntersecting && canPlay) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, [reduceMotion]);
  return (
    <section id="capabilities" ref={sectionRef} className="capabilities-page modules-page relative w-full overflow-hidden">
      <div className="modules-film" aria-label="HospitalX evolved">
        <video ref={videoRef} className="modules-film-video" src="/interfrozt/media/hospitalx-evolved.mp4" poster="/film-04-bg.jpg" muted loop playsInline preload="none" aria-hidden="true" />
        <div className="modules-film-shade" aria-hidden="true" />
        <div className="modules-film-grid" aria-hidden="true" />
        <div className="modules-film-bar">
          <span>04 / Connected modules</span>
        </div>
        <motion.div className="modules-film-copy" initial={{ opacity: 0, y: 52, filter: "blur(14px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}>
          <span className="modules-film-kicker">From disconnected to decisive</span>
          <h2 className="font-display uppercase"><span className="modules-film-care">Care,</span><br /><em>evolved.</em></h2>
        </motion.div>
        <div className="modules-film-caption">
          <span>Patients · Teams · Operations</span>
          <strong>One continuous flow.</strong>
        </div>
        <a className="modules-film-next" href="#docs">Explore the system <span aria-hidden="true">↓</span></a>
      </div>
      <section id="docs" className="section-band module-docs">
        <motion.header className="module-docs-header" initial={{ opacity: 0, y: 44, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
          <div><span>05 / System documentation</span><h2 className="font-display uppercase">One hospital.<br /><em>Six connected layers.</em></h2></div>
          <p>Every module shares the same patient context, operational truth, and offline-first foundation. Select a layer to inspect how it works.</p>
        </motion.header>
        <div className="module-docs-workbench">
          <div className="module-docs-list" role="tablist" aria-label="HospitalX modules">
            {modules.map((module, index) => {
              const ModuleIcon = MODULE_DETAILS[module.id]?.Icon ?? LayoutDashboard;
              return <motion.button key={module.id} id={`module-tab-${module.id}`} type="button" role="tab" tabIndex={module.id === activeModule?.id ? 0 : -1} className={module.id === activeModule?.id ? "is-active" : ""} aria-selected={module.id === activeModule?.id} aria-controls="module-document-panel" onMouseEnter={() => setActiveId(module.id)} onFocus={() => setActiveId(module.id)} onClick={() => setActiveId(module.id)} onKeyDown={(event) => selectModuleFromKeyboard(event, index)} initial={{ opacity: 0, x: -38 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ delay: index * 0.07, duration: 0.82, ease: [0.16, 1, 0.3, 1] }}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="module-list-mark" aria-hidden="true"><ModuleIcon strokeWidth={1.35} /></span>
                <strong>{module.title}</strong><i aria-hidden="true">↗</i>
              </motion.button>
            })}
          </div>
          <motion.aside id="module-document-panel" role="tabpanel" aria-labelledby={`module-tab-${activeModule?.id}`} key={activeModule?.id} className="module-document" initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }} aria-live="polite">
            <header><span>{activeDetails.code}</span><span>LIVE / CONNECTED</span></header>
            <div className="module-document-stage">
              <div className="module-document-copy">
                <span className="module-document-label">Active module</span>
                <h3>{activeModule?.title}</h3>
                <p className="module-document-summary">{activeModule?.summary}</p>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeModule?.id} className="module-document-visual" aria-hidden="true" initial={{ opacity: 0, scale: .78, rotate: -7, x: 26 }} animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }} exit={{ opacity: 0, scale: 1.08, rotate: 5, x: -18 }} transition={{ duration: .58, ease: [0.16, 1, 0.3, 1] }}>
                  <span className="module-visual-index">0{modules.findIndex((module) => module.id === activeModule?.id) + 1}</span>
                  <ActiveModuleIcon className="module-document-icon" strokeWidth={0.72} />
                  <i /><i /><i />
                </motion.div>
              </AnimatePresence>
            </div>
            <dl>
              <div><dt>Teams</dt><dd>{activeDetails.teams}</dd></div>
              <div><dt>Live signal</dt><dd>{activeDetails.signal}</dd></div>
              <div><dt>System promise</dt><dd>{activeDetails.promise}</dd></div>
            </dl>
            <a href={activeDetails.href}>Open module docs <span aria-hidden="true">→</span></a>
          </motion.aside>
        </div>
        <footer className="module-docs-footer"><span>Six modules. One operational truth.</span><a href="#contact">Bring HospitalX to your team <span aria-hidden="true">→</span></a></footer>
      </section>
    </section>
  );
}

