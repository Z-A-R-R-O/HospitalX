/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
type AuthShellProps = {
  mode: "sign-in" | "sign-up";
  children: ReactNode;
};
const copy = {
  "sign-in": {
    index: "01 / RETURN",
    eyebrow: "SECURE HOSPITAL ACCESS",
    title: "WELCOME BACK\nTO THE FLOW.",
    body: "Return to one calm operational picture—patients, teams, tasks, and the context connecting every decision.",
  },
  "sign-up": {
    index: "02 / BEGIN",
    eyebrow: "JOIN THE CARE NETWORK",
    title: "ONE IDENTITY.\nEVERY HANDOFF.",
    body: "Create your secure HospitalX identity and enter a care system designed to keep responsibility and context moving together.",
  },
} as const;
export default function AuthShell({ mode, children }: AuthShellProps) {
  const content = copy[mode];
  return (
    <main className="hx-auth-page" data-mode={mode}>
      <a className="hx-auth-skip" href="#auth-form">Skip to authentication</a>
      <section className="hx-auth-story" aria-label="HospitalX introduction">
        <div className="hx-auth-grid" aria-hidden="true" />
        <header className="hx-auth-brand-row">
          <Link className="hx-auth-brand" href="/" aria-label="Return to HospitalX landing page">
            <Image src="/images/veyminore-signature.png" alt="Veyminore" width={2172} height={724} priority />
          </Link>
          <span>HOSPITALX</span>
        </header>
        <div className="hx-auth-message">
          <p className="hx-auth-eyebrow"><i />{content.eyebrow}</p>
          <h1>{content.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="hx-auth-body">{content.body}</p>
        </div>
        <div className="hx-auth-signals" aria-label="Platform qualities">
          <span><b>01</b> Context connected</span>
          <span><b>02</b> Roles protected</span>
          <span><b>03</b> Care continuous</span>
        </div>
        <footer className="hx-auth-story-footer">
          <span><i /> SYSTEM OPERATIONAL</span>
          <span>VEYMINORE EDITION</span>
        </footer>
      </section>
      <section className="hx-auth-access" id="auth-form" aria-label="Account access">
        <header className="hx-auth-access-header">
          <span>{content.index}</span>
          <Link href="/">RETURN TO SITE <b aria-hidden="true">↗</b></Link>
        </header>
        <div className="hx-auth-form-stage">
          <div className="hx-auth-orbit" aria-hidden="true"><i /><i /></div>
          {children}
        </div>
        <footer className="hx-auth-access-footer">
          <span>ENCRYPTED SESSION</span>
          <span>HOSPITALX · VEYMINORE</span>
        </footer>
      </section>
    </main>
  );
}
