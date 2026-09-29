"use client";
import { useState } from "react";

type Result = { id: string; name: string; passed: boolean; request: Record<string, unknown>; response: Record<string, unknown>; eventCount: number; auditCount: number; stateOutcome: string };
type Run = { tenant: string; generatedAt: string; scenarios: Result[] };
const labels = ["Duplicate registration", "Offline queue and sync", "Stale-version conflict", "Cross-tenant access", "Unauthorized clinical action", "Unsafe Madhu request", "Event tampering"];

function evidence(value: Record<string, unknown>) { return JSON.stringify(value, null, 2); }

export default function ReliabilityLab() {
  const [run, setRun] = useState<Run | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function runLab() {
    setRunning(true); setError(null);
    try {
      const response = await fetch("/api/reliability/run", { method: "POST" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "The live reliability run failed.");
      setRun(body);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The live reliability run failed."); }
    finally { setRunning(false); }
  }
  const visible = run?.scenarios ?? labels.map((name, index) => ({ id: String(index + 1).padStart(2, "0"), name, passed: false, request: {}, response: {}, eventCount: 0, auditCount: 0, stateOutcome: "Run the live Lab to collect evidence." }));
  const passed = run?.scenarios.filter((scenario) => scenario.passed).length ?? 0;
  return <main style={{ minHeight: "100vh", background: "#08110e", color: "#e9f7ef", padding: "48px clamp(20px, 7vw, 110px)", fontFamily: "Arial, sans-serif" }}>
    <p style={{ color: "#75d69a", letterSpacing: 2, fontSize: 12 }}>HOSPITALX / PROOF SYSTEM</p>
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}><div><h1 style={{ fontSize: "clamp(38px, 7vw, 76px)", margin: "8px 0" }}>Reliability Lab</h1><p style={{ fontSize: 19, color: "#b4c9bc" }}>Live evidence, not presentation state.</p></div><button onClick={runLab} disabled={running} style={{ border: 0, background: running ? "#335e42" : "#e9f7ef", color: "#08110e", borderRadius: 999, padding: "12px 18px", fontWeight: 800 }}>{running ? "RESETTING & RUNNING…" : "RUN LIVE ATTACKS"}</button></div>
    <p style={{ maxWidth: 760, lineHeight: 1.6, color: "#b4c9bc" }}>Each run resets the dedicated deterministic tenant <code>{run?.tenant ?? "DEMO-2026-09-30"}</code>, executes live database-backed scenarios, and preserves the request, response, event count, audit count, and resulting state.</p>
    {error && <p role="alert" style={{ border: "1px solid #ff7f73", background: "#4a1d19", padding: 14, borderRadius: 10 }}>{error}</p>}
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: 16, marginTop: 30 }}>{visible.map((scenario) => <article key={scenario.id} style={{ border: `1px solid ${run ? (scenario.passed ? "#4cc879" : "#ff7f73") : "#284136"}`, borderRadius: 18, padding: 22, background: "#0c1913" }}><p style={{ color: "#75d69a", margin: 0 }}>TEST {scenario.id}</p><h2 style={{ margin: "8px 0 12px" }}>{scenario.name}</h2>{run ? <><strong style={{ color: scenario.passed ? "#75d69a" : "#ff9d94" }}>{scenario.passed ? "✓ INVARIANT HELD" : "✕ INVARIANT FAILED"}</strong><p style={{ color: "#b4c9bc" }}>{scenario.stateOutcome}</p><p style={{ fontSize: 13, color: "#9bb5a4" }}>Events: {scenario.eventCount} · Audits: {scenario.auditCount}</p><details><summary style={{ cursor: "pointer", color: "#d5e5da" }}>Request and response evidence</summary><pre style={{ marginTop: 12, whiteSpace: "pre-wrap", fontSize: 11, color: "#b4c9bc", overflowX: "auto" }}>{evidence({ request: scenario.request, response: scenario.response })}</pre></details></> : <p style={{ color: "#b4c9bc" }}>{scenario.stateOutcome}</p>}</article>)}</section>
    <footer style={{ marginTop: 36, color: "#b4c9bc" }}>{run ? `Live run: ${passed} / ${run.scenarios.length} invariants held · ${new Date(run.generatedAt).toLocaleString()}` : "No hard-coded scenario result is shown before a live run."} · <a href="/verify" style={{ color: "#75d69a" }}>Open integrity verifier →</a></footer>
  </main>;
}
