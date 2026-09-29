"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

type LandingHeaderProps = {
  clerkEnabled: boolean;
  mode?: "default" | "film";
};

export function LandingHeader({ clerkEnabled, mode = "default" }: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (mode === "film") {
    return (
      <div className="film-nav-wrap">
        <nav className="film-nav" aria-label="Primary navigation">
          <Link href="/" className="film-nav-brand">HOSPITALX</Link>
          <details className="film-menu">
            <summary aria-label="Open navigation"><Menu size={16} /></summary>
            <div className="film-menu-panel">
              <Link href="#product">Product</Link>
              <Link href="#intelligence">Intelligence</Link>
              <Link href="#download">Download</Link>
              <Link href="/dashboard">Open HospitalX <ArrowRight size={14} /></Link>
            </div>
          </details>
        </nav>
      </div>
    );
  }

  return (
    <div className={`lp-nav-wrap ${scrolled ? "scrolled" : ""}`}>
      <nav className="lp-nav">
        <Link href="/" className="lp-nav-brand">
          <span className="lp-nav-brand-icon">H</span>
          <span>HospitalX</span>
        </Link>

        <div className="lp-nav-links">
          <a href="#features">Product</a>
          <a href="#intelligence">Intelligence</a>
          <a href="#download">Download</a>
        </div>

        <div className="lp-nav-actions">
          {clerkEnabled ? (
            <>
              <Link href="/sign-in" className="sign-in-link">Sign in</Link>
              <Link href="/dashboard" className="lp-nav-cta">Open App <ArrowRight size={14} /></Link>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="sign-in-link">Sign in</Link>
              <Link href="/dashboard" className="lp-nav-cta">Open App <ArrowRight size={14} /></Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
