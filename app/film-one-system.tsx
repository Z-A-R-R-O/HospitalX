"use client";

import { useState } from "react";

const modules = [
  { id: "patients", label: "Patients", status: "124 active" },
  { id: "appointments", label: "Appointments", status: "18 scheduled" },
  { id: "doctors", label: "Doctors", status: "32 available" },
  { id: "prescriptions", label: "Prescriptions", status: "8 prepared" },
  { id: "pharmacy", label: "Pharmacy", status: "96% available" },
  { id: "billing", label: "Billing", status: "Syncing" },
  { id: "records", label: "Records", status: "Synced" },
  { id: "analytics", label: "Analytics", status: "Updated now" },
];

export function FilmOneSystem() {
  const [activeModule, setActiveModule] = useState("patients");

  return (
    <section className="film-one-system" id="one-system" aria-labelledby="one-system-title">
      <p className="film-one-system-label">07 — ONE SYSTEM</p>
      <span className="film-one-system-brand">HOSPITALX</span>

      <div className="film-one-system-layout">
        <div className="film-one-system-copy">
          <h2 id="one-system-title">ONE SYSTEM.</h2>
          <p>Everything connected.<br />From patient to analytics.</p>
        </div>

        <div className="film-one-system-right">
          <div className="film-one-system-stack">
              <img
                src="/film-07-bg.jpg"
                alt="Technology stack"
                width={1024}
                height={1024}
                loading="lazy"
              />
          </div>
          <div className="film-one-system-modules">
            {modules.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`film-one-system-module ${activeModule === m.id ? "is-active" : ""}`}
                aria-pressed={activeModule === m.id}
                onClick={() => setActiveModule(m.id)}
              >
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
