/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

const ecosystemModules = [
  { className: "patients", title: "Patients", value: "Ananya Rao", meta: "Waiting · P-104", state: "Live" },
  { className: "appointments", title: "Appointments", value: "06:30 PM", meta: "Dr. Mehta · OPD", state: "Next" },
  { className: "doctors", title: "Doctors", value: "32 online", meta: "4 on-call now", state: "Ready" },
  { className: "pharmacy", title: "Pharmacy", value: "184 units", meta: "Amoxicillin · In stock", state: "Stocked" },
  { className: "records", title: "Records", value: "04 results", meta: "Verified this hour", state: "Synced" },
  { className: "billing", title: "Billing", value: "₹1.24L", meta: "Collected today", state: "Live" },
  { className: "analytics", title: "Analytics", value: "+12%", meta: "Patient flow · Today", state: "Updated" },
];
export function FilmEcosystem() {
  return (
    <section className="film-ecosystem" id="ecosystem-showcase" aria-labelledby="ecosystem-title">
      <p className="film-ecosystem-label">08 — ECOSYSTEM</p>
      <div className="film-ecosystem-copy">
        <h2 id="ecosystem-title">A COMPLETE HOSPITAL ECOSYSTEM</h2>
        <span>Built to work together. Designed for real hospitals.</span>
      </div>
      <div className="film-ecosystem-field" aria-label="HospitalX module ecosystem">
        <div className="film-ecosystem-bloom" aria-hidden="true" />
        <div className="film-ecosystem-core">
          <span>H</span>
          <strong>HospitalX</strong>
          <small>Operations core</small>
        </div>
        {ecosystemModules.map(({ className, title, value, meta, state }) => (
          <article className={`film-ecosystem-module film-ecosystem-module--${className}`} key={title} tabIndex={0}>
            <header>
              <span>{title}</span>
              <i>{state}</i>
            </header>
            <strong>{value}</strong>
            <p>{meta}</p>
            <b aria-hidden="true"><em /><em /><em /><em /></b>
          </article>
        ))}
      </div>
      <div className="film-ecosystem-footer">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '0.02em', margin: '0 0 1rem 0' }}>ONE FLOW. FULL CONTROL.</h2>
        <p>Every department. One connected system. No silos. No duplicate work. Just care.</p>
      </div>
    </section>
  );
}
