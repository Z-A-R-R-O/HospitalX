/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export type SystemModule = {
  slug: string;
  index: string;
  code: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  image: string;
  teams: string[];
  signals: string[];
  workflow: { title: string; detail: string }[];
  outcomes: { value: string; label: string }[];
  liveHref: string;
};
export const systemModules: SystemModule[] = [
  {
    slug: "command-center", index: "01", code: "HX / OPS-01", title: "Command Center", eyebrow: "Operational truth, in one view",
    summary: "A live command surface for capacity, queues, teams, delayed work, and the signals that need attention now.",
    description: "Command Center turns hospital-wide activity into one calm operating picture. Leaders see what is moving, what is blocked, and who owns the next action—without waiting for another report or status meeting.",
    image: "/interfrozt/icons/module-command.png",
    teams: ["Hospital leadership", "Operations", "Care coordinators", "Bed management"],
    signals: ["Live capacity and occupancy", "Queue pressure and wait time", "Staffing gaps and workload", "Delayed work and escalation risk"],
    workflow: [
      { title: "Collect", detail: "Operational signals arrive from every connected HospitalX module." },
      { title: "Resolve", detail: "Patient, team, place, and task context are joined into one shared picture." },
      { title: "Prioritize", detail: "Risk, delay, and capacity pressure surface in the order teams can act on them." },
      { title: "Coordinate", detail: "Owners receive a clear next action while leaders retain system-wide visibility." },
    ],
    outcomes: [{ value: "LIVE", label: "Operational picture" }, { value: "01", label: "Shared source of truth" }, { value: "24/7", label: "Continuity of context" }],
    liveHref: "/dashboard",
  },
  {
    slug: "patient-flow", index: "02", code: "HX / FLOW-02", title: "Patient Flow", eyebrow: "Every handoff stays visible",
    summary: "A continuous patient journey from arrival to discharge, with ownership clear at every handoff.",
    description: "Patient Flow makes the current stage, responsible team, next action, blockers, and expected movement visible as one connected care path. Nothing important disappears between departments.",
    image: "/interfrozt/icons/module-flow.png",
    teams: ["Front desk", "Triage", "Nursing", "Wards and bed management"],
    signals: ["Current journey stage", "Owner and next action", "Expected movement time", "Blockers and handoff risk"],
    workflow: [
      { title: "Arrive", detail: "Identity, urgency, history, and intent form one reliable patient context." },
      { title: "Assess", detail: "Vitals, notes, risks, and clinical priorities remain visible to the care team." },
      { title: "Treat", detail: "Orders, medicines, tasks, and ownership move together through each handoff." },
      { title: "Continue", detail: "Discharge and follow-up teams receive the complete story before transition." },
    ],
    outcomes: [{ value: "05", label: "Connected stages" }, { value: "0", label: "Invisible handoffs" }, { value: "1", label: "Continuous care path" }],
    liveHref: "/dashboard",
  },
  {
    slug: "clinical-workspace", index: "03", code: "HX / CLINICAL-03", title: "Clinical Workspace", eyebrow: "Context follows the patient",
    summary: "One clinical surface for history, observations, notes, orders, risks, and the current plan.",
    description: "Clinical Workspace brings the information required for care into a focused, role-aware surface. The right context reaches the right clinician without forcing teams to reconstruct the patient story.",
    image: "/interfrozt/icons/module-clinical.png",
    teams: ["Doctors", "Nurses", "Allied health", "Care teams"],
    signals: ["Longitudinal patient history", "Observations and notes", "Orders and results", "Risks and active care plan"],
    workflow: [
      { title: "Review", detail: "A unified patient timeline replaces fragmented records and repeated searching." },
      { title: "Document", detail: "Structured notes preserve clinical meaning while keeping entry fast." },
      { title: "Decide", detail: "Orders, results, risks, and guidance meet at the point of care." },
      { title: "Hand over", detail: "The current plan and its ownership travel with the patient." },
    ],
    outcomes: [{ value: "360°", label: "Patient context" }, { value: "ROLE", label: "Aware workspace" }, { value: "SAFE", label: "Clinical continuity" }],
    liveHref: "/dashboard",
  },
  {
    slug: "diagnostics-pharmacy", index: "04", code: "HX / CARE-04", title: "Diagnostics & Pharmacy", eyebrow: "Evidence meets treatment",
    summary: "A coordinated loop connecting clinical orders, diagnostic evidence, prescriptions, dispensing, and exceptions.",
    description: "Diagnostics & Pharmacy closes the distance between a clinical decision and the treatment it informs. Orders remain traceable, results arrive in context, and medicine workflows stay connected to the patient journey.",
    image: "/interfrozt/icons/module-diagnostics.png",
    teams: ["Laboratory", "Imaging", "Pharmacy", "Clinicians"],
    signals: ["Order and collection status", "Result availability", "Prescription and dispense state", "Critical findings and exceptions"],
    workflow: [
      { title: "Order", detail: "The clinical question and patient context travel with every request." },
      { title: "Produce", detail: "Collection, imaging, validation, and result status remain visible." },
      { title: "Interpret", detail: "Evidence reaches the responsible clinician with priority intact." },
      { title: "Treat", detail: "Prescription, stock, dispense, and administration complete the loop." },
    ],
    outcomes: [{ value: "LOOP", label: "Closed care cycle" }, { value: "STAT", label: "Priority preserved" }, { value: "TRACE", label: "Order to treatment" }],
    liveHref: "/laboratory",
  },
  {
    slug: "revenue-inventory", index: "05", code: "HX / RESOURCE-05", title: "Revenue & Inventory", eyebrow: "Resources stay connected to care",
    summary: "A shared operational layer for charges, claims, payments, stock, expiry risk, and replenishment.",
    description: "Revenue & Inventory connects the commercial and material work behind care. Teams can trace every charge and stock movement back to the patient journey while acting before shortages or leakage become disruption.",
    image: "/interfrozt/icons/module-revenue.png",
    teams: ["Billing", "Finance", "Stores", "Procurement"],
    signals: ["Charges and claim state", "Payment and exception queues", "Stock and consumption", "Expiry and replenishment risk"],
    workflow: [
      { title: "Capture", detail: "Care activity creates accurate resource and charge events at source." },
      { title: "Validate", detail: "Rules expose missing context, duplication, and exceptions early." },
      { title: "Reconcile", detail: "Payments, claims, stock, and consumption stay linked to operations." },
      { title: "Forecast", detail: "Demand and risk signals guide replenishment and financial planning." },
    ],
    outcomes: [{ value: "1:1", label: "Care-to-resource trace" }, { value: "EARLY", label: "Risk visibility" }, { value: "CLEAR", label: "Operational control" }],
    liveHref: "/inventory/new",
  },
  {
    slug: "madhu-intelligence", index: "06", code: "HX / MADHU-06", title: "Madhu Intelligence", eyebrow: "Clarity across the whole hospital",
    summary: "An explainable care co-pilot that surfaces delays, workload, risk, missing context, and the next useful action.",
    description: "Madhu works across HospitalX rather than inside one isolated screen. She explains what is happening, preserves source context, and helps every team move from complex signals to confident action.",
    image: "/interfrozt/icons/module-intelligence.png",
    teams: ["Clinical teams", "Operations", "Leadership", "Every HospitalX user"],
    signals: ["Delay and workload patterns", "Clinical and operational risk", "Missing or conflicting context", "Recommended next actions"],
    workflow: [
      { title: "Observe", detail: "Madhu reads connected system signals without interrupting the workflow." },
      { title: "Explain", detail: "Answers reveal the underlying sources and operational context." },
      { title: "Recommend", detail: "Priorities become concise, role-relevant next actions." },
      { title: "Assist", detail: "Teams retain control while Madhu helps prepare, coordinate, and follow through." },
    ],
    outcomes: [{ value: "ASK", label: "Natural interaction" }, { value: "WHY", label: "Explainable answers" }, { value: "NEXT", label: "Actionable guidance" }],
    liveHref: "/dashboard",
  },
];
export function getSystemModule(slug: string) {
  return systemModules.find((module) => module.slug === slug);
}
