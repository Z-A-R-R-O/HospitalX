"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { useEffect, useRef, useCallback } from "react";
export function LandingEngine() {
  /* —— Cinematic scene controller —————————————————————————————— */
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".lp");
    if (!root) return;
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
    window.addEventListener("scroll", scheduleScene, { passive: true });
    window.addEventListener("resize", scheduleScene, { passive: true });
    scheduleScene();
    return () => {
      window.removeEventListener("scroll", scheduleScene);
      window.removeEventListener("resize", scheduleScene);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  /* —— Magnetic controls ——————————————————————————————————————— */
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
  /* —— Scroll-Reveal ——————————————————————————— */
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
  return null;
}
