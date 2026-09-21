"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";

export function LandingHeader({ clerkEnabled }: { clerkEnabled: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`landing-header-wrapper ${scrolled ? "scrolled" : ""}`}>
      <header className="landing-header glass-nav">
        <div className="brand">
          <Link href="/">
            <Image 
              src="/veyminore-logo.png" 
              alt="Veyminore" 
              width={140} 
              height={46} 
              className="veyminore-logo-img"
              priority
            />
          </Link>
        </div>
        <nav className="main-nav">
          <Link href="#">Product</Link>
          <Link href="#">Solutions</Link>
          <Link href="#">Resources</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Company</Link>
        </nav>
        <div className="header-actions">
          <button className="icon-btn search-btn"><Search size={18} /></button>
          
          {clerkEnabled ? (
            <>
              <Show when="signed-out">
                <Link href="/sign-in" className="sign-in-link">Sign in</Link>
                <Link href="/dashboard" className="btn btn-black get-started-btn">Get HospitalX <ArrowRight size={16} /></Link>
              </Show>
              <Show when="signed-in">
                <Link href="/dashboard" className="btn btn-black get-started-btn">Dashboard <ArrowRight size={16} /></Link>
                <UserButton />
              </Show>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="sign-in-link">Sign in</Link>
              <Link href="/dashboard" className="btn btn-black get-started-btn">Get HospitalX <ArrowRight size={16} /></Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
