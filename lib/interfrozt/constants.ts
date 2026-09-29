/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export const SITE_TITLE = "HospitalX";
export const CORE_LINE = "Care. Connected.";
export const PRODUCT_LINES = [
  "Care, beautifully connected across every moment. Patients stay informed and supported. Teams move together with shared context. Workflows stay clear from start to finish. Built for better outcomes, every day.",
  "One patient journey, connected from end to end. Every team aligned around the same priorities. Every handoff visible before it becomes a gap. Every task moving with clarity and ownership. Nothing important gets lost between moments.",
  "From first intake to a confident discharge. One shared picture of every patient. Clear priorities for every role and every shift. Faster decisions, grounded in live context. Care keeps moving without losing its humanity.",
  "Less friction across the entire care journey. More human attention where it matters most. Connected operations behind every interaction. Confident teams, supported by clearer systems. Better care for every patient, every day.",
] as const;
export const HERO_TITLE = "CARE\nFLOWS\nFUTHER";
export const NAV_ITEMS = [
  { id: "hero", label: "Care" },
  { id: "work", label: "System" },
  { id: "approach", label: "Care Flow" },
  { id: "capabilities", label: "Modules" },
  { id: "docs", label: "System Docs" },
  { id: "veyminore", label: "Veyminore" },
  { id: "contact", label: "Connect" },
] as const;
export const WORK_ITEMS = [
  {
    title: "Command Center",
    slug: "command-center",
    href: "/system/command-center",
    type: "Hospital Operations",
    problem: "Hospital leaders lose time assembling a reliable picture from disconnected departments and delayed updates.",
    result: "One live operational view of patients, capacity, teams, tasks, and the signals that need attention now.",
    visual: "dashboard",
    previewImage: "/hospitalx-ui-backgrounds.png",
    previewImages: ["/hospitalx-ui-backgrounds.png"],
  },
  {
    title: "Care Flow",
    slug: "care-flow",
    href: "/system/patient-flow",
    type: "Clinical Orchestration",
    problem: "Patient journeys fragment when OPD, IPD, diagnostics, pharmacy, and billing operate as separate queues.",
    result: "A visible, coordinated path from arrival to discharge with ownership clear at every handoff.",
    visual: "object",
    previewImage: "/hospitalx-atrium-bg.png",
    previewImages: ["/hospitalx-atrium-bg.png"],
  },
  {
    title: "Continuity",
    slug: "continuity",
    href: "/system/clinical-workspace",
    type: "Offline-First Infrastructure",
    problem: "Care cannot pause when connectivity is weak, intermittent, or unavailable across the hospital network.",
    result: "Teams keep working safely offline and HospitalX synchronizes every change when the connection returns.",
    visual: "dashboard",
    previewImage: "/hospitalx-liquid-hero.png",
    previewImages: ["/hospitalx-liquid-hero.png"],
  },
] as const;
export const APPROACH_STEPS = [
  { step: "01", label: "Discover", desc: "We uncover the real problem behind the requirement." },
  { step: "02", label: "Define", desc: "We shape the right strategy and define the direction." },
  { step: "03", label: "Design", desc: "We craft intuitive experiences that are beautiful and purposeful." },
  { step: "04", label: "Build", desc: "We engineer reliable, scalable, and elegant solutions." },
  { step: "05", label: "Evolve", desc: "We measure, learn, and continuously improve what we build." },
] as const;
export const CAPABILITIES = [
  { id: "command", title: "Command Center", summary: "One operational picture for capacity, queues, teams, and the work requiring attention now." },
  { id: "flow", title: "Patient Flow", summary: "A visible path from first arrival to discharge, with ownership clear at every handoff." },
  { id: "clinical", title: "Clinical Workspace", summary: "Shared patient context for clinicians and nurses, without fragmented notes or duplicate work." },
  { id: "diagnostics", title: "Diagnostics & Pharmacy", summary: "Orders, results, medicines, and clinical decisions move together in one coordinated loop." },
  { id: "revenue", title: "Revenue & Inventory", summary: "Billing, claims, stock, and purchasing stay connected to the care that created each action." },
  { id: "intelligence", title: "Madhu Intelligence", summary: "HospitalX intelligence explains, prioritizes, and helps every team act with confidence." },
] as const;
export const INSIGHTS = [
  {
    id: "insight-1",
    title: "Designing Clarity Into Complex Workflows",
    slug: "designing-clarity-into-complex-workflows",
    tag: "May 12, 2026 / 6 min read",
    excerpt:
      "How to turn scattered product operations into calm, legible systems people can actually use.",
    publishedAt: "2026-05-12",
    readTime: "6 min read",
    visual: "lines",
    image: "/interfrozt/uploads/insights/clarity-workflows.png",
  },
  {
    id: "insight-2",
    title: "Why Great Systems Start With Deep Listening",
    slug: "why-great-systems-start-with-deep-listening",
    tag: "Apr 28, 2026 / 5 min read",
    excerpt:
      "The best product decisions usually arrive before the interface, in the space where teams learn what the problem really is.",
    publishedAt: "2026-04-28",
    readTime: "5 min read",
    visual: "signal",
    image: "/interfrozt/uploads/insights/deep-listening.png",
  },
  {
    id: "insight-3",
    title: "Building AI Products People Can Actually Trust",
    slug: "building-ai-products-people-can-actually-trust",
    tag: "Apr 10, 2026 / 4 min read",
    excerpt:
      "Useful AI products are less about spectacle and more about boundaries, confidence, and human-readable behavior.",
    publishedAt: "2026-04-10",
    readTime: "4 min read",
    visual: "field",
    image: "/interfrozt/uploads/insights/ai-trust.png",
  },
] as const;
