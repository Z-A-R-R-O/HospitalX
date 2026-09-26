"use client";

import { useEffect, useRef, useCallback } from "react";

export function LandingEngine() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  /* ── Custom Cursor ─────────────────────────── */
  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    let raf: number;
    const animate = () => {
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.2;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.2;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.08;

      dot.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnterInteractive = () => {
      dot.classList.add("hovering");
      ring.classList.add("hovering");
    };
    const onLeaveInteractive = () => {
      dot.classList.remove("hovering");
      ring.classList.remove("hovering");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    const interactives = document.querySelectorAll("a, button, [role='button'], .lp-bento-card");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  /* ── Scroll-Reveal ─────────────────────────── */
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
