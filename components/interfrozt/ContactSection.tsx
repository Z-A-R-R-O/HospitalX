"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { motion } from "framer-motion";
const LINKS = [
  { label: "GitHub", detail: "HospitalX source", href: "https://github.com/Z-A-R-R-O/HospitalX" },
  { label: "LinkedIn", detail: "Arunez Zarro", href: "https://www.linkedin.com/in/arunezzarro?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
];
export default function ContactSection() {
  return (
    <section id="contact" className="contact-page">
      <div className="contact-main">
        <motion.div className="contact-headline" initial={{ opacity: 0, y: 42, filter: "blur(10px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-14% 0px" }} transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
          <div className="contact-headline-top"><span>07 / Connect</span><i>HospitalX · Veyminore</i></div>
          <h2 className="font-display uppercase">Let&apos;s build<br />something<br /><em>meaningful.</em></h2>
          <div className="contact-closing-note"><p>Clinical infrastructure designed for care that must stay clear, connected, and available.</p><span>By Team Agitated Fyneshyt.</span></div>
          <div className="contact-form" aria-hidden="true"><i /><i /><i /></div>
        </motion.div>
        <motion.aside className="contact-panel" initial={{ opacity: 0, x: 34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-14% 0px" }} transition={{ delay: .12, duration: .9, ease: [0.16, 1, 0.3, 1] }}>
          <header><span>HospitalX / Veyminore</span><i>Open</i></header>
          <div className="contact-emails">
            <span>Direct</span>
            <a href="mailto:Arunezzarro@gmail.com">Arunezzarro@gmail.com <b aria-hidden="true">↗</b></a>
            <span>Support</span>
            <a href="mailto:support.veyminore@gmail.com">support.veyminore@gmail.com <b aria-hidden="true">↗</b></a>
          </div>
          <nav className="contact-links" aria-label="External links">
            {LINKS.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"><span>{link.detail}</span><strong>{link.label}</strong><i aria-hidden="true">↗</i></a>)}
          </nav>
          <div className="contact-legal">
            <span>Legal & copyright</span>
            <p>© 2026 HospitalX — Veyminore.</p>
            <strong>By Team Agitated Fyneshyt.</strong>
            <small>All rights reserved.</small>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
