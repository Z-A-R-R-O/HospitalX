"use client";

import { useEffect, useRef } from "react";

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

  /* ── Cinematic scene controller ────────────────────────────── */
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".lp");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sections = Array.from(root.querySelectorAll<HTMLElement>("section, footer"));
    let frame = 0;

    const updateScene = () => {
      frame = 0;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty("--scroll-progress", String(window.scrollY / maxScroll));

      const measurements = sections.map((section) => ({
        section,
        rect: section.getBoundingClientRect(),
      }));

      measurements.forEach(({ section, rect }, index) => {
        const isActive = rect.top < window.innerHeight * .72 && rect.bottom > window.innerHeight * .28;
        const isNear = rect.top < window.innerHeight * 1.35 && rect.bottom > -window.innerHeight * .2;
        section.classList.toggle("is-active", isActive);
        section.classList.toggle("is-near", isNear);
        section.classList.toggle("is-past", rect.bottom <= window.innerHeight * .28);
        section.style.setProperty("--section-index", String(index));
        section.style.setProperty("--section-progress", String(
          Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
        ));
      });
    };

    const scheduleScene = () => {
      if (!frame) frame = requestAnimationFrame(updateScene);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const x = event.clientX / Math.max(window.innerWidth, 1) - .5;
      const y = event.clientY / Math.max(window.innerHeight, 1) - .5;
      root.style.setProperty("--pointer-x", x.toFixed(4));
      root.style.setProperty("--pointer-y", y.toFixed(4));
    };

    const onPointerLeave = () => {
      root.style.setProperty("--pointer-x", "0");
      root.style.setProperty("--pointer-y", "0");
    };

    window.addEventListener("scroll", scheduleScene, { passive: true });
    window.addEventListener("resize", scheduleScene, { passive: true });
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });
    scheduleScene();

    return () => {
      window.removeEventListener("scroll", scheduleScene);
      window.removeEventListener("resize", scheduleScene);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* ── Magnetic controls ─────────────────────────────────────── */
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".lp");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const controls = Array.from(root.querySelectorAll<HTMLElement>(
      ".film-final-btn, .film-product-enter, .film-scroll-cue, .lp-nav-cta"
    ));

    const reset = (element: HTMLElement) => {
      element.style.setProperty("--magnetic-x", "0px");
      element.style.setProperty("--magnetic-y", "0px");
    };

    const handlers = controls.map((element) => {
      const onMove = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) * .16;
        const y = (event.clientY - (rect.top + rect.height / 2)) * .16;
        element.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`);
        element.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`);
      };
      const onLeave = () => reset(element);
      element.addEventListener("pointermove", onMove, { passive: true });
      element.addEventListener("pointerleave", onLeave, { passive: true });
      return { element, onMove, onLeave };
    });

    return () => {
      handlers.forEach(({ element, onMove, onLeave }) => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerleave", onLeave);
        reset(element);
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
