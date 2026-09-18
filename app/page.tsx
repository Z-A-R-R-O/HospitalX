"use client";

import { useEffect, useMemo, useState } from "react";

type Task = { id: number; title: string; detail: string; owner: string; severity: "critical" | "attention"; action: string };
const initialTasks: Task[] = [
  { id: 1, title: "Critical lab results awaiting acknowledgement", detail: "3 results · Dr. Kumar’s coverage team", owner: "Lab escalation", severity: "critical", action: "Notify coverage" },
  { id: 2, title: "Discharges blocked by billing", detail: "2 patients · Ward B", owner: "Billing desk", severity: "attention", action: "Assign billing" },
  { id: 3, title: "ICU capacity approaching threshold", detail: "4 beds available · one turnover delayed", owner: "Bed manager", severity: "critical", action: "Review beds" },
  { id: 4, title: "Appointments running behind schedule", detail: "12 appointments · Cardiology OPD", owner: "Front office", severity: "attention", action: "Balance queue" },
  { id: 5, title: "Pharmacy clearance pending", detail: "1 discharge · Ward C", owner: "Pharmacy", severity: "attention", action: "Request clearance" },
  { id: 6, title: "Consultant approval pending", detail: "1 discharge · Ward B", owner: "Clinical office", severity: "attention", action: "Send reminder" },
];
const queue = [
  ["#07", "Meena Iyer", "New consultation", "Dr. Kumar", "Ready", "18 min"],
  ["#08", "R. Prakash", "Follow-up", "Dr. Kumar", "Ready", "26 min"],
  ["#09", "S. Anjali", "New consultation", "Dr. Das", "Delayed", "31 min"],
  ["#10", "Vikram Rao", "Review results", "Dr. Chen", "Checked in", "12 min"],
];

export default function Home() {
  const [section, setSection] = useState("command");
  const [tasks, setTasks] = useState(initialTasks);
  const [notice, setNotice] = useState("");
  const visibleTasks = useMemo(() => tasks.slice(0, 4), [tasks]);
  const resolve = (task: Task) => { setTasks(current => current.filter(item => item.id !== task.id)); setNotice(`${task.action} sent — recorded in the operational timeline.`); window.setTimeout(() => setNotice(""), 3200); };
  const go = (name: string) => setSection(name);
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(context.registerTool({ name: "get_operational_tasks", title: "Get operational tasks", description: "Read current HospitalX operational tasks and their accountable owners.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: () => ({ tasks: tasks.map(({ id, title, owner, severity }) => ({ id, title, owner, severity })) }) }, { signal: lifecycle.signal }));
      void Promise.resolve(context.registerTool({ name: "resolve_operational_task", title: "Resolve operational task", description: "Mark one visible demonstration task as resolved in this local Command Center session.", inputSchema: { type: "object", properties: { taskId: { type: "number" } }, required: ["taskId"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute: (input: unknown) => { const taskId = typeof input === "object" && input !== null ? (input as { taskId?: unknown }).taskId : undefined; if (typeof taskId !== "number") throw new Error("taskId must be a number"); const task = tasks.find(item => item.id === taskId); if (!task) throw new Error("Task not found"); resolve(task); return { id: taskId, status: "resolved" }; } }, { signal: lifecycle.signal }));
    } catch { /* Optional browser feature. */ }
    return () => lifecycle.abort();
  }, [tasks]);

  return <div className="shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => go("command")} aria-label="Open command center"><span className="brand-mark">+</span>HospitalX</button>
      <div className="facility"><b>City Hospital</b><span>Chennai · Main facility</span></div>
      <nav aria-label="Hospital workspaces">
        <Nav label="Command Center" id="command" active={section} onClick={go} />
        <Nav label="Patient queue" id="queue" count="126" active={section} onClick={go} />
        <Nav label="Beds" id="beds" count="82%" active={section} onClick={go} />
        <Nav label="Patients" id="patients" active={section} onClick={go} />
        <Nav label="Care tasks" id="tasks" count={String(tasks.length)} active={section} onClick={go} />
      </nav>
      <div className="system-state"><span className="online-dot" /> Operational systems normal<br /><small>Last update: just now</small></div>
    </aside>
    <main>
      <header className="topbar"><div><p className="eyebrow">Friday, 18 September</p><h1>{section === "command" ? "Good morning, City Hospital." : pageTitle(section)}</h1></div><div className="profile"><span>09:42 IST</span><i>AM</i><div><b>Arun Mehta</b><small>Hospital administrator</small></div></div></header>
      {section === "command" && <Command tasks={visibleTasks} resolve={resolve} openTasks={() => go("tasks")} showNotice={setNotice} />}
      {section === "tasks" && <TaskPanel tasks={tasks} resolve={resolve} />}
      {section === "queue" && <QueuePanel />}
      {section === "beds" && <BedsPanel />}
      {section === "patients" && <EmptyPatientPanel />}
    </main>
    <div role="status" className={`toast ${notice ? "visible" : ""}`}>{notice}</div>
  </div>;
}

function Nav({ label, id, count, active, onClick }: { label: string; id: string; count?: string; active: string; onClick: (id: string) => void }) { return <button className={active === id ? "active" : ""} onClick={() => onClick(id)}>{label}{count && <em>{count}</em>}</button>; }
function pageTitle(section: string) { return ({ queue: "Patient queue", beds: "Bed capacity", patients: "Patient context", tasks: "Operational tasks" } as Record<string, string>)[section]; }
function TaskRow({ task, resolve }: { task: Task; resolve: (task: Task) => void }) { return <article className="task"><span className={`severity ${task.severity}`} /><div><h3>{task.title}</h3><p>{task.detail}</p></div><div className="task-owner">{task.owner}<button onClick={() => resolve(task)}>{task.action}</button></div></article>; }
function Command({ tasks, resolve, openTasks, showNotice }: { tasks: Task[]; resolve: (task: Task) => void; openTasks: () => void; showNotice: (notice: string) => void }) { return <><section className="metrics"><Metric label="Patients today" value="842" detail="↑ 8.4% vs last Friday" /><Metric label="OPD arrivals" value="126" detail="104 checked in" /><Metric label="Bed occupancy" value="82%" detail="4 ICU beds available" warning /><Metric label="Discharges due" value="14" detail="8 completed on time" /></section><div className="dashboard-grid"><section className="card attention-card"><CardHead title="Needs attention" description="Exceptions that need an owner or decision" action="View all" onAction={openTasks} /><div className="task-list">{tasks.map(task => <TaskRow key={task.id} task={task} resolve={resolve} />)}</div></section><aside className="right-rail"><section className="card"><CardHead title="Today’s patient flow" description="Live operational state" /><div className="flows"><Flow name="Registered" amount="842" width="95" /><Flow name="In OPD" amount="126" width="61" /><Flow name="In lab" amount="54" width="38" /><Flow name="Admitted" amount="38" width="74" /></div></section><section className="card queue-card"><CardHead title="Queue pulse" description="Next patients across OPD" /><div className="mini-queue">{queue.slice(0, 3).map(row => <div key={row[0]}><b>{row[0]}</b><p><strong>{row[1]}</strong><span>{row[3]} · {row[2]}</span></p><em>{row[5]}</em></div>)}</div></section></aside></div><section className="brief"><div><h2>Operational briefing</h2><p>ICU capacity is stable, but the evening discharge lane needs help: two patients are waiting on billing and one is waiting on pharmacy clearance.</p></div><button onClick={() => showNotice("Team briefing prepared with current blockers and owners.")}>Prepare team briefing</button></section></> }
function Metric({ label, value, detail, warning }: { label: string; value: string; detail: string; warning?: boolean }) { return <article className="metric"><span>{label}</span><strong>{value}</strong><small className={warning ? "warning" : ""}>{detail}</small></article>; }
function CardHead({ title, description, action, onAction }: { title: string; description: string; action?: string; onAction?: () => void }) { return <header className="card-head"><div><h2>{title}</h2><p>{description}</p></div>{action && <button className="text-button" onClick={onAction}>{action}</button>}</header>; }
function Flow({ name, amount, width }: { name: string; amount: string; width: string }) { return <div className="flow"><span>{name}</span><div><i style={{ width: `${width}%` }} /></div><b>{amount}</b></div>; }
function TaskPanel({ tasks, resolve }: { tasks: Task[]; resolve: (task: Task) => void }) { return <section className="card full-card"><CardHead title="Work created from hospital events and workflow policy" description="Each task has an accountable owner and traceable action." />{tasks.length ? <div className="task-list">{tasks.map(task => <TaskRow key={task.id} task={task} resolve={resolve} />)}</div> : <div className="empty">All operational tasks are clear.</div>}</section>; }
function QueuePanel() { return <section className="card full-card"><CardHead title="Current OPD queue" description="Live arrival and consultation state" /><div className="responsive-table"><table><thead><tr><th>Token</th><th>Patient & reason</th><th>Provider</th><th>Status</th><th>Wait</th></tr></thead><tbody>{queue.map(row => <tr key={row[0]}><td>{row[0]}</td><td><b>{row[1]}</b><small>{row[2]}</small></td><td>{row[3]}</td><td><span className={row[4] === "Delayed" ? "status delayed" : "status"}>{row[4]}</span></td><td>{row[5]}</td></tr>)}</tbody></table></div></section>; }
function BedsPanel() { return <section className="metrics single-grid"><Metric label="ICU available" value="4" detail="1 bed under turnover" warning /><Metric label="Emergency available" value="7" detail="Within safe threshold" /><Metric label="General ward" value="31" detail="Beds available" /><Metric label="Approaching discharge" value="4" detail="Needs coordination" warning /></section>; }
function EmptyPatientPanel() { return <section className="card empty"><h2>Patient registry</h2><p>Connect this workspace to the live clinical API in the next build slice. Select a patient from the queue to begin.</p></section>; }
