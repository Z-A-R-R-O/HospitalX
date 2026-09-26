"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHeader({ clerkEnabled }: { clerkEnabled: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
