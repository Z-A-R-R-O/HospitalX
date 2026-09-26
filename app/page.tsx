import Link from "next/link";
import { ArrowRight, Download, Play, CheckCircle2, Zap, Users, BarChart3, Shield, Wifi, WifiOff, Bot, Stethoscope, Pill, FlaskConical, CreditCard, Activity } from "lucide-react";
import { LandingHeader } from "./landing-header";
import { LandingEngine } from "./landing-engine";
import "./landing.css";

export default function LandingPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="lp">
      <LandingEngine />
      <LandingHeader clerkEnabled={clerkEnabled} />

      {/* ════ HERO ════════════════════════════════ */}
      <section className="lp-hero">
        <div className="lp-hero-blobs" aria-hidden="true">
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-blob lp-blob-3" />
        </div>

        <div className="lp-hero-content">
          <p className="eyebrow reveal">SwasthyaSetu Edition</p>
          <h1 className="lp-hero-title reveal reveal-delay-1">
            Care Flows<br />Further.
          </h1>
          <p className="lp-hero-sub reveal reveal-delay-2">
            The ultimate offline-first hospital operating system.<br />
            Unifying patients, staff, and operations — from chaos to clarity.
          </p>
          <div className="lp-hero-ctas reveal reveal-delay-3">
            <Link href="/dashboard" className="lp-btn lp-btn-primary">
              Open HospitalX <ArrowRight size={16} />
            </Link>
            <button className="lp-btn lp-btn-ghost" type="button">
              <Play size={16} /> Watch Film
            </button>
          </div>

          <div className="lp-hero-preview reveal reveal-delay-4">
            <div className="lp-hero-mockup">
              <video
                src="/Hero-scroll.mp4"
                poster="/hero_bg.jpg"
                autoPlay
                muted
                loop
                playsInline
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
            <div className="lp-hero-glow" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ════ METRICS RIBBON ══════════════════════ */}
      <section className="lp-metrics">
        {[
          { value: "500+", label: "Hospitals" },
          { value: "2M+", label: "Patients Managed" },
          { value: "99.9%", label: "Uptime" },
          { value: "40%", label: "Faster Workflows" },
        ].map((m) => (
          <div className="lp-metric reveal" key={m.label}>
            <div className="lp-metric-value">{m.value}</div>
            <div className="lp-metric-label">{m.label}</div>
          </div>
        ))}
      </section>

      {/* ════ FEATURES BENTO ══════════════════════ */}
      <section className="lp-features" id="features">
        <div className="lp-features-header reveal">
          <p className="eyebrow">Built for Real Impact</p>
          <h2>Everything a hospital<br />needs. Nothing it doesn't.</h2>
          <p>Complete operations, unified in one intelligent platform.</p>
        </div>

        <div className="lp-bento">
          <div className="lp-bento-card wide reveal">
            <div className="lp-bento-icon"><Users size={22} /></div>
            <h3>Patient Management</h3>
            <p>Complete registry with demographics, history, complaints, and real-time status tracking across every touchpoint. From walk-in to discharge — every moment documented.</p>
          </div>
          <div className="lp-bento-card reveal reveal-delay-1">
            <div className="lp-bento-icon"><Stethoscope size={22} /></div>
            <h3>OPD Queue</h3>
            <p>Live Kanban board for walk-in patients. Triage, consult, and post-consult — track every stage visually.</p>
          </div>
          <div className="lp-bento-card reveal reveal-delay-1">
            <div className="lp-bento-icon"><Activity size={22} /></div>
            <h3>IPD & Beds</h3>
            <p>Real-time ward and bed occupancy. ICU vs General views with instant admission workflow.</p>
          </div>
          <div className="lp-bento-card reveal reveal-delay-2">
            <div className="lp-bento-icon"><FlaskConical size={22} /></div>
            <h3>Laboratory</h3>
            <p>Sample tracking, test results, and report generation — all integrated with patient records.</p>
          </div>
          <div className="lp-bento-card wide reveal reveal-delay-2">
            <div className="lp-bento-icon"><Pill size={22} /></div>
            <h3>Pharmacy & Inventory</h3>
            <p>Prescription management, stock tracking with expiry alerts, purchase orders, and supplier management. Automated low-stock warnings keep your shelves ready, always.</p>
          </div>
          <div className="lp-bento-card reveal reveal-delay-3">
            <div className="lp-bento-icon"><CreditCard size={22} /></div>
            <h3>Billing & Insurance</h3>
            <p>Automated invoicing, insurance claims, payment tracking, and detailed financial analytics.</p>
          </div>
          <div className="lp-bento-card reveal reveal-delay-3">
            <div className="lp-bento-icon"><BarChart3 size={22} /></div>
            <h3>Analytics</h3>
            <p>Department-level dashboards, revenue trends, patient flow patterns, and custom reports.</p>
          </div>
          <div className="lp-bento-card reveal reveal-delay-4">
            <div className="lp-bento-icon"><Shield size={22} /></div>
            <h3>Staff & Roles</h3>
            <p>Doctor schedules, nurse rosters, role-based access control, and audit logging.</p>
          </div>
        </div>
      </section>

      {/* ════ AI INTELLIGENCE ═════════════════════ */}
      <section className="lp-ai" id="intelligence">
        <div className="lp-ai-inner">
          <div className="lp-ai-content reveal">
            <p className="eyebrow">Intelligence in Action</p>
            <h2>Meet Madhu.<br />Your AI co-pilot.</h2>
            <p>
              Ask anything about your hospital. Madhu understands your data,
              surfaces insights, and helps you make faster, smarter decisions — all in natural language.
            </p>
            <div className="lp-ai-features">
              <div className="lp-ai-feature"><Zap size={18} /> Natural language queries across all modules</div>
              <div className="lp-ai-feature"><Zap size={18} /> Predictive patient flow and bed forecasting</div>
              <div className="lp-ai-feature"><Zap size={18} /> Smart prescription and diagnosis suggestions</div>
              <div className="lp-ai-feature"><Zap size={18} /> Anomaly detection in lab results</div>
            </div>
            <Link href="/dashboard" className="lp-btn lp-btn-ghost">
              Try Madhu <ArrowRight size={16} />
            </Link>
          </div>

          <div className="lp-ai-visual reveal reveal-delay-2">
            <div className="lp-ai-chat">
              <div className="lp-ai-msg user">How many beds are occupied in ICU right now?</div>
              <div className="lp-ai-msg bot" style={{ animationDelay: ".2s" }}>
                Currently 14 out of 20 ICU beds are occupied (70% utilization).
                3 patients are scheduled for discharge tomorrow, which will bring it to 55%.
              </div>
              <div className="lp-ai-msg user" style={{ animationDelay: ".4s" }}>
                Show me today&apos;s emergency admissions
              </div>
              <div className="lp-ai-msg bot" style={{ animationDelay: ".6s" }}>
                4 emergency admissions today: 2 cardiac, 1 trauma, 1 respiratory.
                Average wait time: 12 minutes. All triaged within 8 min — well within target.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ OFFLINE-FIRST CALLOUT ═══════════════ */}
      <section className="lp-metrics" style={{ borderBottom: "none" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 600 }}>
          <p className="eyebrow"><WifiOff size={14} /> Offline-First Architecture</p>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-.03em", lineHeight: 1.1,
            background: "linear-gradient(180deg, #fff, rgba(255,255,255,.55))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: "1rem"
          }}>
            Works without WiFi.<br />Syncs when connected.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,.4)", lineHeight: 1.7 }}>
            Rural clinics, disaster zones, network dead spots — HospitalX keeps running.
            Every action is cached locally and auto-synced the moment connectivity returns.
          </p>
        </div>
      </section>

      {/* ════ DOWNLOAD CTA ════════════════════════ */}
      <section className="lp-cta" id="download">
        <div className="lp-cta-inner">
          <p className="eyebrow reveal">Available Everywhere</p>
          <h2 className="reveal reveal-delay-1">Download<br />HospitalX</h2>
          <p className="reveal reveal-delay-2">
            Join 500+ hospitals already building a healthier tomorrow.
          </p>

          <div className="lp-cta-buttons reveal reveal-delay-2">
            <Link href="/dashboard" className="lp-btn lp-btn-primary">
              <Download size={16} /> Download for Windows
            </Link>
            <Link href="/dashboard" className="lp-btn lp-btn-ghost">
              Open in Browser <ArrowRight size={16} />
            </Link>
          </div>

          <div className="lp-platforms reveal reveal-delay-3">
            <div className="lp-platform-badge available">
              <svg width="16" height="16" viewBox="0 0 88 88" fill="none"><path d="M0 12.4L35.6 7.4V41.6H0V12.4ZM40.8 6.6L88 0V40.8H40.8V6.6ZM0 46.2H35.6V80.4L0 75.4V46.2ZM40.8 46.2H88V88L40.8 81.2V46.2Z" fill="currentColor"/></svg>
              Windows <small>v1.0</small>
            </div>
            <div className="lp-platform-badge">
              macOS <small>Coming soon</small>
            </div>
            <div className="lp-platform-badge">
              Android <small>Coming soon</small>
            </div>
          </div>

          <div className="lp-trust-signals reveal reveal-delay-4">
            <span><CheckCircle2 size={14} /> No credit card required</span>
            <span><CheckCircle2 size={14} /> Free for educational use</span>
            <span><CheckCircle2 size={14} /> Regular updates</span>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ══════════════════════════════ */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <span>Veyminore</span>
          <span style={{ opacity: .4, fontWeight: 400 }}>© 2026</span>
        </div>
        <div className="lp-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <a href="#">GitHub</a>
        </div>
        <div className="lp-footer-right">A Healthier Tomorrow.</div>
      </footer>
    </div>
  );
}
