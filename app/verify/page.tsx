"use client";
import { useEffect, useState } from "react";

type Report = { events?: number; replayed?: number; stateMatch?: boolean; chain?: { valid?: boolean }; chainScope?: string; mismatches?: Array<{ kind?: string; aggregate?: string; reason?: string }>; mode?: string; error?: string; message?: string };
export default function VerifyPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const verify = async () => { setLoading(true); const response = await fetch("/api/verify"); setReport(await response.json()); setLoading(false); };
  useEffect(() => { void verify(); }, []);
  const valid = Boolean(report?.chain?.valid && report?.stateMatch);
  return <main style={{ minHeight: "100vh", background: "#f4f7f5", color: "#102219", padding: "48px clamp(20px, 9vw, 150px)", fontFamily: "Arial, sans-serif" }}><p style={{ color: "#397650", letterSpacing: 2, fontSize: 12 }}>HOSPITALX / INTEGRITY</p><h1 style={{ fontSize: "clamp(38px, 7vw, 74px)", margin: "8px 0" }}>Replay verifier</h1><p style={{ color: "#516259", maxWidth: 650 }}>Load persisted event history, validate its hash links, replay protected projections, and compare them with database state.</p><button onClick={verify} disabled={loading} style={{ background: "#102219", color: "white", border: 0, borderRadius: 8, padding: "12px 16px", fontWeight: 700 }}>{loading ? "REPLAYING…" : "REPLAY SYSTEM"}</button>{report && <section style={{ marginTop: 28, border: "1px solid #c7d4ca", borderRadius: 18, padding: 24, background: "white" }}><h2 style={{ color: valid ? "#18763d" : "#b32525" }}>{valid ? "✓ STATE MATCH: YES" : "INTEGRITY FAILURE"}</h2>{report.error ? <p>{report.message ?? report.error}</p> : <><p>SOURCE EVENTS: {report.events ?? 0} &nbsp; · &nbsp; REPLAYED: {report.replayed ?? 0} &nbsp; · &nbsp; Source: {report.mode ?? "persisted"} &nbsp; · &nbsp; Chain: {report.chainScope ?? "organization"}</p>{report.mismatches?.length ? <ul>{report.mismatches.map((mismatch, index) => <li key={index}>{mismatch.kind}: {mismatch.aggregate ?? mismatch.reason ?? "state differs"}</li>)}</ul> : <p>✓ hash chain and replayed projections match.</p>}</>}</section>}<p style={{ marginTop: 24 }}><a href="/reliability" style={{ color: "#397650" }}>← Reliability Lab</a></p></main>;
}
