"use client";
import { useEffect, useRef } from "react";
import "./cursor.css";
const CURSOR_CORE_PATH = "M 0 0 L 24 12 L 14 16 L 10 34 Z";
/** Lightweight landing cursor: one DOM transform while the pointer settles. */
export default function GlitchCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cursor = cursorRef.current;
    if (!cursor) return;
    let frame = 0;
    let enabled = false;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let initialized = false;
    const setEnabled = () => {
      enabled = canHover.matches && !reducedMotion.matches;
      document.body.classList.toggle("cursor-custom", enabled);
      document.body.classList.toggle("cursor-native", !enabled);
      if (!enabled && frame) { cancelAnimationFrame(frame); frame = 0; }
    };
    const updateState = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const madhuClose = element?.closest("[data-cursor='madhu-close']");
      const madhu = element?.closest("[data-cursor='madhu']");
      const interactive = element?.closest("a, button, [role='button'], [data-cursor]");
      cursor.classList.toggle("is-madhu-close", Boolean(madhuClose));
      cursor.classList.toggle("is-madhu", !madhuClose && Boolean(madhu));
      cursor.classList.toggle("is-hover", !madhuClose && !madhu && Boolean(interactive));
    };
    const render = () => {
      frame = 0;
      if (!enabled || document.hidden) return;
      currentX += (targetX - currentX) * 0.34;
      currentY += (targetY - currentY) * 0.34;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (Math.abs(targetX - currentX) > 0.15 || Math.abs(targetY - currentY) > 0.15) frame = requestAnimationFrame(render);
    };
    const requestRender = () => {
      if (!frame && enabled && !document.hidden) frame = requestAnimationFrame(render);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!enabled) return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!initialized) { initialized = true; currentX = targetX; currentY = targetY; }
      updateState(event.target);
      requestRender();
    };
    const onPointerDown = () => {
      if (!enabled) return;
      cursor.classList.add("is-clicking");
      window.setTimeout(() => cursor.classList.remove("is-clicking"), 150);
    };
    const onVisibilityChange = () => {
      if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    };
    const onPointerLeave = () => cursor.classList.remove("is-hover", "is-madhu", "is-madhu-close");
    setEnabled();
    canHover.addEventListener("change", setEnabled);
    reducedMotion.addEventListener("change", setEnabled);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      canHover.removeEventListener("change", setEnabled);
      reducedMotion.removeEventListener("change", setEnabled);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame) cancelAnimationFrame(frame);
      document.body.classList.remove("cursor-custom", "cursor-native");
    };
  }, []);
  return <div ref={cursorRef} className="glitch-cursor" aria-hidden="true"><svg className="glitch-cursor-svg" viewBox="0 0 32 40"><path className="cursor-core-path" d={CURSOR_CORE_PATH} /></svg></div>;
}

