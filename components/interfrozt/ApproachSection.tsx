"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRightLeft, HeartPulse, Pill, ScanLine, UserRoundPlus } from "lucide-react";
const CARE_STAGES = [
  {
    step: "01",
    title: "Arrival",
    team: "Front desk + triage",
    description: "Identity, urgency, history, and intent arrive as one reliable patient context.",
    signal: "Context ready",
    Icon: UserRoundPlus,
    owner: "Triage desk",
    next: "Nursing assessment · 04 min",
  },
  {
    step: "02",
    title: "Assessment",
    team: "Nursing + clinician",
    description: "Vitals, notes, risks, and next actions stay visible to the people delivering care.",
    signal: "Priority clear",
    Icon: HeartPulse,
    owner: "Dr. A. Shah",
    next: "Diagnostics · 08 min",
  },
  {
    step: "03",
    title: "Diagnosis",
    team: "Lab + imaging",
    description: "Orders, results, and clinical decisions move together without fragmented queues.",
    signal: "Evidence shared",
    Icon: ScanLine,
    owner: "Diagnostics team",
    next: "Treatment plan · 12 min",
  },
  {
    step: "04",
    title: "Treatment",
    team: "Care team + pharmacy",
    description: "Plans, medicines, tasks, and ownership remain synchronized through every handoff.",
    signal: "Care in motion",
    Icon: Pill,
    owner: "Care team 04",
    next: "Review response · 30 min",
  },
  {
    step: "05",
    title: "Continuity",
    team: "Discharge + follow-up",
    description: "The next team receives a complete story before the patient leaves the current one.",
    signal: "Nothing lost",
    Icon: ArrowRightLeft,
    owner: "Transition nurse",
    next: "Follow-up · 48 hours",
  },
] as const;
export default function ApproachSection() {
  const [activeStage, setActiveStage] = useState(0);
  const currentStage = CARE_STAGES[activeStage];
  const stageProgress = activeStage / (CARE_STAGES.length - 1);
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % CARE_STAGES.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, []);
  return (
    <section id="approach" className="approach-page care-flow-page relative w-full text-frost">
      <div className="care-flow-breath" aria-hidden="true">
        <span>Care flow</span><i />
      </div>
      <motion.div
        className="care-flow-dark relative w-full overflow-hidden"
        initial={{ opacity: 0.18, y: 96, scale: 0.978, borderRadius: "32px 32px 0 0" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, borderRadius: "0px" }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 1.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="care-flow-atmosphere" aria-hidden="true"><span /><span /></div>
        <div className="section-band care-flow-shell relative z-10">
        <header className="approach-topbar care-flow-topbar flex items-center justify-between">
          <span className="approach-kicker">03 / Care flow <i aria-hidden="true" /></span>
          <a href="/dashboard" className="approach-start-link">
            <span>Open HospitalX</span><span aria-hidden="true">&rarr;</span>
          </a>
        </header>
        <div className="care-flow-hero grid-shell">
          <motion.div
            className="care-flow-heading md:col-span-8"
            initial={{ opacity: 0, y: 42, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.42 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="care-flow-overline">A continuous patient journey</span>
            <h2 className="care-flow-title font-display uppercase">
              <span>One patient.</span>
              <span>Every moment connected.</span>
            </h2>
            <p>
              HospitalX keeps context, responsibility, and the next action moving
              together—from the first arrival to confident continuity of care.
            </p>
          </motion.div>
          <motion.aside
            className="care-live-card md:col-span-4"
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.18, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Live patient journey status"
          >
            <header><span>Live journey</span><i /> <strong>HX–2047</strong></header>
            <div className="care-live-patient">
              <span className="care-live-avatar">AS</span>
              <div><strong>Arunez .S</strong><span>Care path active</span></div>
              <em>Stable</em>
            </div>
            <motion.dl
              key={currentStage.step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <div><dt>Current</dt><dd>{currentStage.title}</dd></div>
              <div><dt>Owner</dt><dd>{currentStage.owner}</dd></div>
              <div><dt>Next</dt><dd>{currentStage.next}</dd></div>
            </motion.dl>
            <div className="care-live-route" aria-label={`Stage ${activeStage + 1} of ${CARE_STAGES.length}`}>
              {CARE_STAGES.map((stage, index) => (
                <span key={stage.step} data-state={index < activeStage ? "done" : index === activeStage ? "active" : "next"} />
              ))}
            </div>
          </motion.aside>
        </div>
        <motion.div
          className="care-journey-board"
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ delay: 0.14, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="care-journey-header">
            <span>Patient journey / live orchestration</span>
            <span><i /> All teams connected</span>
          </div>
          <div className="care-journey-track" aria-hidden="true">
            <span className="care-track-line" />
            <motion.span
              className="care-track-progress"
              animate={{ scaleX: stageProgress }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="care-track-patient"
              animate={{ left: `${stageProgress * 100}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            ><i /></motion.span>
          </div>
          <ol className="care-stages">
            {CARE_STAGES.map((stage, index) => {
              const StageIcon = stage.Icon;
              return <motion.li
                key={stage.step}
                className="care-stage"
                data-active={activeStage === index}
                data-complete={activeStage > index}
                role="button"
                tabIndex={0}
                aria-pressed={activeStage === index}
                onMouseEnter={() => setActiveStage(index)}
                onFocus={() => setActiveStage(index)}
                onClick={() => setActiveStage(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveStage(index);
                  }
                }}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: 0.22 + index * 0.1, duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="care-stage-index"><span>{stage.step}</span><i /></div>
                <span className="care-generated-icon" aria-hidden="true">
                  <StageIcon strokeWidth={1.25} />
                </span>
                <span className="care-stage-team">{stage.team}</span>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
                <div className="care-stage-signal"><i />{stage.signal}</div>
              </motion.li>
            })}
          </ol>
        </motion.div>
          <footer className="care-flow-footer">
            <span>Every handoff stays visible.</span>
            <strong>No context lost between teams.</strong>
            <a href="#capabilities">Explore connected modules <span aria-hidden="true">&rarr;</span></a>
          </footer>
        </div>
      </motion.div>
    </section>
  );
}

