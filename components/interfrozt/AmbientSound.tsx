"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TARGET_VOLUME = 0.075;

export default function AmbientSound() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const resumeAfterVisibilityRef = useRef(false);
  const userMutedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [audible, setAudible] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const fadeTo = useCallback((target: number, duration = 900, onComplete?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);
    const from = audio.volume;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, from + (target - from) * eased));

      if (progress < 1) fadeFrameRef.current = requestAnimationFrame(tick);
      else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    };

    fadeFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current) return false;

    if (!audio.paused) {
      setPlaying(true);
      return true;
    }

    audio.volume = 0;
    try {
      await audio.play();
      fadeTo(TARGET_VOLUME, 1350);
      setPlaying(true);
      setAudible(true);
      setNeedsGesture(false);
      return true;
    } catch {
      // Browsers do not offer a permission-request API for audible autoplay.
      // Keep the soundtrack stopped and present an explicit, user-initiated
      // enable action instead of silently starting a muted track.
      setPlaying(false);
      setAudible(false);
      setNeedsGesture(true);
      return false;
    }
  }, [fadeTo]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, 360, () => audio.pause());
    setPlaying(false);
    setAudible(false);
    setNeedsGesture(false);
  }, [fadeTo]);

  useEffect(() => {
    if (!mounted) return undefined;
    const audio = audioRef.current;
    if (!audio) return undefined;

    const reveal = () => {
      setReady(true);
      void start();
    };

    const unlockOrStart = (event: Event) => {
      if (userMutedRef.current) return;

      if (event.type === "pointerdown" && (event.target as Element | null)?.closest(".ambient-sound-control")) return;

      if (audio.paused) void start();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        resumeAfterVisibilityRef.current = !audio.paused;
        audio.pause();
      } else if (resumeAfterVisibilityRef.current && !userMutedRef.current) {
        void start();
      }
    };

    if (document.documentElement.classList.contains("landing-is-ready")) reveal();
    else window.addEventListener("hospitalx:landing-ready", reveal, { once: true });

    // Try once more after the window load event. Some browsers finish media
    // metadata before the landing loader releases, especially from a cold CDN.
    const retryOnLoad = () => {
      if (!userMutedRef.current && audio.paused) void start();
    };
    window.addEventListener("load", retryOnLoad, { once: true });

    window.addEventListener("pointerdown", unlockOrStart, { once: true, passive: true });
    window.addEventListener("keydown", unlockOrStart, { once: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("hospitalx:landing-ready", reveal);
      window.removeEventListener("load", retryOnLoad);
      window.removeEventListener("pointerdown", unlockOrStart);
      window.removeEventListener("keydown", unlockOrStart);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (fadeFrameRef.current !== null) cancelAnimationFrame(fadeFrameRef.current);
      audio.pause();
    };
  }, [fadeTo, mounted, start]);

  const toggle = () => {
    const audio = audioRef.current;
    if (playing) {
      userMutedRef.current = true;
      stop();
      return;
    }

    userMutedRef.current = false;
    setNeedsGesture(false);
    if (audio?.muted) audio.muted = false;
    void start();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <audio
        ref={audioRef}
        src="/audio/ambient-f1.mp3"
        loop
        autoPlay
        preload="auto"
        onCanPlay={() => void start()}
        onCanPlayThrough={() => void start()}
        onPlay={() => setPlaying(true)}
        onPause={() => { setPlaying(false); setAudible(false); }}
      />
      <button
        type="button"
        className="ambient-sound-control"
        data-playing={playing}
        data-needs-gesture={needsGesture}
        data-ready={ready}
        onClick={toggle}
        aria-label={playing && audible ? "Turn ambient soundtrack off" : "Enable ambient soundtrack"}
        aria-pressed={playing && audible}
      >
        <span className="ambient-sound-bars" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((bar) => <i key={bar} />)}
        </span>
        <span className="ambient-sound-label">
          {playing && audible ? "Sound off" : needsGesture ? "Sound blocked · enable" : "Play sound"}
        </span>
      </button>
    </>,
    document.body,
  );
}
