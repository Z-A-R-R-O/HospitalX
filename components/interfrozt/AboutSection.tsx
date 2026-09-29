"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { motion } from "framer-motion";
import { useState, type PointerEvent } from "react";
const PRINCIPLES = [
  { number: "01", title: "Always available", text: "Offline-first by design, so care continues when the network cannot." },
  { number: "02", title: "Quietly secure", text: "Every role, action, and clinical boundary is protected by default." },
  { number: "03", title: "Human intelligence", text: "AI supports judgment with clear context while people remain in control." },
  { number: "04", title: "One living system", text: "Every surface shares the same operational truth and product language." },
];
const SIGNALS = [
  { label: "Edge", status: "Ready", metric: "Local", detail: "Core care workflows stay available on the device.", samples: [34, 46, 40, 62, 54, 71, 58, 76, 66, 82, 72, 88] },
  { label: "Continuity", status: "Protected", metric: "Sealed", detail: "Queued clinical changes retain order, ownership, and integrity.", samples: [82, 78, 84, 86, 83, 91, 87, 92, 90, 94, 92, 96] },
  { label: "Context", status: "Connected", metric: "Live", detail: "Every surface resolves against one shared operational picture.", samples: [42, 58, 49, 68, 61, 79, 70, 86, 74, 91, 83, 94] },
];
export default function AboutSection() {
  const [activeSignal, setActiveSignal] = useState(0);
  const signal = SIGNALS[activeSignal];
  const moveCard = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--card-rx", `${(0.5 - y) * 5}deg`);
    event.currentTarget.style.setProperty("--card-ry", `${(x - 0.5) * 6}deg`);
    event.currentTarget.style.setProperty("--glow-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--glow-y", `${y * 100}%`);
  };
  const resetCard = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--card-rx", "0deg");
    event.currentTarget.style.setProperty("--card-ry", "0deg");
    event.currentTarget.style.setProperty("--glow-x", "50%");
    event.currentTarget.style.setProperty("--glow-y", "20%");
  };
  return (
    <section id="veyminore" className="veyminore-page">
      <div className="veyminore-ambient" aria-hidden="true"><i /><i /></div>
      <header className="veyminore-bar">
        <span>06 / Veyminore</span>
        <span>Behind HospitalX</span>
        <span className="veyminore-live">System online</span>
      </header>
      <div className="section-band veyminore-shell">
        <div className="veyminore-hero">
          <motion.div className="veyminore-copy" initial={{ opacity: 0, y: 46, filter: "blur(12px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .38 }} transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}>
            <span className="veyminore-eyebrow">The system behind the system</span>
            <h2 className="font-display uppercase">Built by<br /><em>Veyminore.</em></h2>
            <p className="veyminore-lede">Technology should disappear into the quality of care it enables.</p>
            <p className="veyminore-body">Veyminore is the product and engineering system behind HospitalX—shaping complex clinical infrastructure into something calm, intuitive, and dependable.</p>
            <div className="veyminore-actions"><a href="/system/command-center">Explore the system <span aria-hidden="true">→</span></a><a href="/dashboard">Open HospitalX <span aria-hidden="true">↗</span></a></div>
          </motion.div>
          <motion.div className="veyminore-object" initial={{ opacity: 0, scale: .92, y: 34 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ delay: .12, duration: 1.25, ease: [0.16, 1, 0.3, 1] }} aria-label="Veyminore system status">
            <div className="veyminore-orbit" aria-hidden="true"><i /><i /><i /></div>
            <div className="veyminore-monogram" aria-hidden="true">V</div>
            <article className="veyminore-card" onPointerMove={moveCard} onPointerLeave={resetCard}>
              <header><span>HospitalX</span><span>Veyminore Edition</span></header>
              <button className="veyminore-card-status" type="button" onClick={() => setActiveSignal((activeSignal + 1) % SIGNALS.length)} aria-label="Cycle through system signals">
                <i /><div><span>System status</span><strong>Operational</strong></div><small>Tap to inspect</small>
              </button>
              <div className="veyminore-signal-list" role="tablist" aria-label="System signals">
                {SIGNALS.map((item, index) => <button key={item.label} type="button" role="tab" aria-selected={activeSignal === index} aria-controls="veyminore-signal-panel" className={activeSignal === index ? "is-active" : ""} onClick={() => setActiveSignal(index)}><span>{item.label}</span><strong>{item.status}</strong><i aria-hidden="true">→</i></button>)}
              </div>
              <motion.div id="veyminore-signal-panel" className="veyminore-inspector" key={signal.label} role="tabpanel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .38, ease: [0.16, 1, 0.3, 1] }}>
                <div><span>{signal.label} signal</span><strong>{signal.metric}</strong><p>{signal.detail}</p></div>
                <div className="veyminore-wave" aria-hidden="true">{signal.samples.map((sample, index) => <i key={`${signal.label}-${index}`} style={{ height: `${sample}%`, ['--i' as any]: index } as React.CSSProperties} />)}</div>
              </motion.div>
              <footer><span>Care keeps moving.</span><b>06</b></footer>
            </article>
          </motion.div>
        </div>
        <div className="veyminore-principles">
          {PRINCIPLES.map((principle, index) => (
            <motion.article key={principle.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ delay: index * .07, duration: .8, ease: [0.16, 1, 0.3, 1] }}>
              <span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.text}</p>
            </motion.article>
          ))}
        </div>
        <footer className="veyminore-footer"><span>HospitalX / Veyminore Edition</span><strong>Engineered for care that cannot pause.</strong><span>Team Agitated Fyneshyt · 2026</span></footer>
      </div>
    </section>
  );
}
