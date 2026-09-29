/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSystemModule, systemModules } from "@/lib/system-docs";
import styles from "./page.module.css";
type PageProps = { params: Promise<{ module: string }> };
export function generateStaticParams() {
  return systemModules.map((module) => ({ module: module.slug }));
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { module: slug } = await params;
  const module = getSystemModule(slug);
  if (!module) return {};
  return {
    title: `${module.title} — HospitalX System Documentation`,
    description: module.summary,
  };
}
export default async function SystemModulePage({ params }: PageProps) {
  const { module: slug } = await params;
  const module = getSystemModule(slug);
  if (!module) notFound();
  const activeIndex = systemModules.findIndex((item) => item.slug === module.slug);
  const previous = systemModules[(activeIndex - 1 + systemModules.length) % systemModules.length];
  const next = systemModules[(activeIndex + 1) % systemModules.length];
  return (
    <main className={styles.page}>
      <div className={styles.noise} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/#docs" aria-label="HospitalX system documentation home">
          <span className={styles.brandMark} aria-hidden="true">✦</span>
          <strong>HospitalX</strong>
          <em>System docs</em>
        </Link>
        <div className={styles.topMeta}><span>{module.code}</span><span className={styles.live}>Live documentation</span></div>
        <Link className={styles.close} href="/#docs">Back to overview <span aria-hidden="true">↓</span></Link>
      </header>
      <aside className={styles.rail} aria-label="System modules">
        <span className={styles.railLabel}>Connected layers</span>
        <nav>
          {systemModules.map((item) => (
            <Link key={item.slug} href={`/system/${item.slug}`} className={item.slug === module.slug ? styles.active : ""} aria-current={item.slug === module.slug ? "page" : undefined}>
              <span>{item.index}</span><strong>{item.title}</strong><i aria-hidden="true">↗</i>
            </Link>
          ))}
        </nav>
        <span className={styles.railFoot}>One operational truth</span>
      </aside>
      <div className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{module.eyebrow}</span>
            <p className={styles.giantIndex} aria-hidden="true">{module.index}</p>
            <h1>{module.title}</h1>
            <p className={styles.summary}>{module.summary}</p>
            <div className={styles.heroActions}>
              <Link href={module.liveHref}>Open live system <span aria-hidden="true">→</span></Link>
              <span>Offline-first · Role-aware · Connected</span>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <span className={styles.visualCode}>{module.code}</span>
            <img src={module.image} alt="" />
            <i /><i /><i /><b />
          </div>
        </section>
        <section className={styles.intro}>
          <span className={styles.sectionNumber}>00 / Purpose</span>
          <p>{module.description}</p>
        </section>
        <section className={styles.signalGrid}>
          <article>
            <span className={styles.sectionNumber}>01 / Connected teams</span>
            <ul>{module.teams.map((team) => <li key={team}><span aria-hidden="true">+</span>{team}</li>)}</ul>
          </article>
          <article>
            <span className={styles.sectionNumber}>02 / Live signals</span>
            <ul>{module.signals.map((signal) => <li key={signal}><span aria-hidden="true">✓</span>{signal}</li>)}</ul>
          </article>
        </section>
        <section className={styles.workflow}>
          <header><span className={styles.sectionNumber}>03 / How it moves</span><h2>From signal<br /><em>to action.</em></h2></header>
          <ol>
            {module.workflow.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <div><strong>{step.title}</strong><p>{step.detail}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.outcomes}>
          <span className={styles.sectionNumber}>04 / System outcome</span>
          <div>{module.outcomes.map((outcome) => <article key={outcome.label}><strong>{outcome.value}</strong><span>{outcome.label}</span></article>)}</div>
        </section>
        <footer className={styles.footer}>
          <Link href={`/system/${previous.slug}`}><span>Previous layer · {previous.index}</span><strong>← {previous.title}</strong></Link>
          <div><span>HospitalX / System documentation</span><b>Care keeps moving.</b></div>
          <Link href={`/system/${next.slug}`}><span>Next layer · {next.index}</span><strong>{next.title} →</strong></Link>
        </footer>
      </div>
    </main>
  );
}
