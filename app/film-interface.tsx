"use client";

import { useState } from "react";

const views = ["Dashboard", "Patients", "Profile", "Appointments", "Prescription"] as const;
type View = (typeof views)[number];

const navigation = ["Dashboard", "Patients", "Pharmacy", "Billing", "Records"];

export function FilmInterface() {
  const [view, setView] = useState<View>("Dashboard");

  const moveView = (nextView: View) => {
    setView(nextView);
    requestAnimationFrame(() => {
      document.getElementById(`interface-tab-${nextView.toLowerCase()}`)?.focus();
    });
  };

  return (
    <section className="film-interface" id="interface" aria-labelledby="interface-title">
      <p className="film-interface-label">09 — INTERFACE</p>
      <div className="film-interface-copy">
        <p>The product is real.</p>
        <h2 id="interface-title">Care, in motion.</h2>
      </div>
      <div className="film-interface-stage" aria-label="Interactive HospitalX product preview">
        <div className="film-interface-shell">
          <aside>
            <strong>HospitalX</strong>
            <span>Care. Connected.</span>
            <nav aria-label="HospitalX product navigation">
              {navigation.map((item) => <span key={item} className={item === "Dashboard" ? "is-selected" : ""}>{item}</span>)}
            </nav>
            <small>City Care Hospital</small>
          </aside>
          <main>
            <header>
              <div className="film-interface-search">Search patients, staff, beds, or records</div>
              <span>Sat, Sep 26 · 6:42 PM</span>
            </header>
            <div className="film-interface-view-tabs" role="tablist" aria-label="Cinematic interface steps">
              {views.map((item) => (
                <button
                  key={item}
                  id={`interface-tab-${item.toLowerCase()}`}
                  type="button"
                  role="tab"
                  aria-selected={view === item}
                  aria-controls="interface-panel"
                  tabIndex={view === item ? 0 : -1}
                  className={view === item ? "is-active" : ""}
                  onClick={() => setView(item)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      event.preventDefault();
                      moveView(views[(views.indexOf(item) + 1) % views.length]);
                    }
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      moveView(views[(views.indexOf(item) - 1 + views.length) % views.length]);
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <div id="interface-panel" role="tabpanel" aria-labelledby={`interface-tab-${view.toLowerCase()}`}>
              <InterfaceView view={view} />
            </div>
            <footer className='film-interface-statusbar'>
              <span className='film-interface-status-dot' />
              <span>Connected</span>
              <span>System Status</span>
              <span className='film-interface-status-badge'>● Online</span>
              <span>10:02 AM</span>
            </footer>
          </main>
        </div>
      </div>
      <p className="film-interface-caption">Dashboard → Patients → Profile → Appointments → Prescription</p>
    </section>
  );
}

function InterfaceView({ view }: { view: View }) {
  if (view === "Patients") {
    return <div className="film-interface-content film-interface-patients"><h3>Patient registry</h3><p>Manage registered patients across the hospital network.</p><div className="film-interface-table"><b>P-104</b><strong>Ananya Rao</strong><span>32 / F</span><span>Chest pain</span><i>Active</i></div><div className="film-interface-table"><b>P-105</b><strong>Vikram Malhotra</strong><span>56 / M</span><span>Severe migraine</span><i>Waiting</i></div></div>;
  }
  if (view === "Profile") {
    return <div className="film-interface-content film-interface-profile"><div><span>Patient profile</span><h3>Ananya Rao</h3><p>P-104 · 32 years · O+</p></div><section><b>Current visit</b><strong>Chest pain and shortness of breath</strong><p>Dr. Rajesh Sharma · Cardiology</p><i>In consultation</i></section></div>;
  }
  if (view === "Appointments") {
    return <div className="film-interface-content film-interface-appointments"><h3>Appointments &amp; scheduling</h3><p>Today · Sunday, Sep 20</p><div><b>05:13 PM</b><strong>Ananya Rao</strong><span>Dr. Rajesh Sharma · In-person</span><i>Completed</i></div><div><b>06:43 PM</b><strong>Vikram Malhotra</strong><span>Dr. Priya Iyer · Telehealth</span><i>Scheduled</i></div></div>;
  }
  if (view === "Prescription") {
    return <div className="film-interface-content film-interface-prescription"><span>Prescription · P-104</span><h3>Ananya Rao</h3><div><b>Amoxicillin</b><p>500mg · Take after meals · 5 days</p><i>Ready for pharmacy</i></div><div><b>ECG review</b><p>Follow up with cardiology after results</p><i>Pending</i></div></div>;
  }
  return <div className="film-interface-content film-interface-dashboard"><div className="film-interface-dashboard-title"><span>City Care Hospital</span><h3>Good morning, Dr. Arunez.</h3><p>Here&apos;s what&apos;s happening at your hospital today.</p></div><div className="film-interface-metrics"><Metric value="124" label="Total patients" /><Metric value="18" label="OPD today" /><Metric value="06" label="Admissions" /></div><div className="film-interface-queue"><span>Today&apos;s patient queue</span><strong>Ananya Rao</strong><p>Chest pain · Cardiology · Waiting</p></div></div>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>;
}
