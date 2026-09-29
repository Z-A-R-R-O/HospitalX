"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { useState } from "react";
import { CalendarDays, UserPlus, Stethoscope, Pill, ReceiptText, LogOut, ArrowRight } from "lucide-react";
const tabs = ["Operation", "Clinical", "Business"] as const;
type Tab = (typeof tabs)[number];
const workflows = {
  Operation: [
    { icon: CalendarDays, title: "Appointments", desc: "Manage OPD/IPD with ease." },
    { icon: UserPlus, title: "Admissions", desc: "Fast and paperless." },
    { icon: Stethoscope, title: "Patient Care", desc: "Complete medical records." },
    { icon: Pill, title: "Prescriptions", desc: "Integrated pharmacy." },
    { icon: ReceiptText, title: "Billing", desc: "Accurate and transparent." },
    { icon: LogOut, title: "Discharge", desc: "Faster, smoother, connected." },
  ],
  Clinical: [
    { icon: Stethoscope, title: "Diagnosis", desc: "AI-assisted clinical decisions." },
    { icon: Pill, title: "Treatment", desc: "Evidence-based protocols." },
    { icon: CalendarDays, title: "Follow-up", desc: "Automated scheduling." },
    { icon: UserPlus, title: "Referrals", desc: "Seamless specialist routing." },
    { icon: ReceiptText, title: "Lab Orders", desc: "Integrated diagnostics." },
    { icon: LogOut, title: "Reports", desc: "Complete clinical history." },
  ],
  Business: [
    { icon: ReceiptText, title: "Revenue", desc: "Real-time financial tracking." },
    { icon: CalendarDays, title: "Scheduling", desc: "Optimized resource allocation." },
    { icon: UserPlus, title: "Staff", desc: "Workforce management." },
    { icon: Stethoscope, title: "Quality", desc: "Compliance monitoring." },
    { icon: Pill, title: "Inventory", desc: "Supply chain analytics." },
    { icon: LogOut, title: "Reporting", desc: "Executive dashboards." },
  ],
};
export function FilmWorkflows() {
  const [activeTab, setActiveTab] = useState<Tab>("Operation");
  const moveTab = (nextTab: Tab) => {
    setActiveTab(nextTab);
    requestAnimationFrame(() => {
      document.getElementById(`workflow-tab-${nextTab.toLowerCase()}`)?.focus();
    });
  };
  return (
    <section className="film-workflows" id="workflows" aria-labelledby="workflows-title">
      <p className="film-workflows-label">11 — WORKFLOWS</p>
      <div className="film-workflows-header">
        <h2 id="workflows-title">
          FROM ADMISSION<br />TO DISCHARGE.
        </h2>
        <p>Every workflow. One seamless system.</p>
      </div>
      <div className="film-workflows-tabs" role="tablist" aria-label="Workflow categories">
        {tabs.map((tab) => (
          <button
            key={tab}
            id={`workflow-tab-${tab.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="workflow-panel"
            tabIndex={activeTab === tab ? 0 : -1}
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                moveTab(tabs[(tabs.indexOf(tab) + 1) % tabs.length]);
              }
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                moveTab(tabs[(tabs.indexOf(tab) - 1 + tabs.length) % tabs.length]);
              }
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        id="workflow-panel"
        className="film-workflows-grid"
        role="tabpanel"
        aria-labelledby={`workflow-tab-${activeTab.toLowerCase()}`}
        aria-label={`${activeTab} workflows`}
      >
        {workflows[activeTab].map(({ icon: Icon, title, desc }, i) => (
          <article className="film-workflows-card" key={title}>
            <div className="film-workflows-card-icon">
              <Icon size={18} strokeWidth={1.6} />
            </div>
            <div>
              <strong>{title}</strong>
              <p>{desc}</p>
            </div>
            <span className="film-workflows-arrow" aria-hidden="true">
              <ArrowRight size={14} />
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
