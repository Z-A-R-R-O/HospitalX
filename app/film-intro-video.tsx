"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed scroll-scrubbed background video for the film intro section.
 * Plays the sunrise video in sync with scroll position through the intro.
 */
export function FilmIntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let targetTime = 0;
    let videoActivated = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const intro = video.closest<HTMLElement>(".film-intro");
    if (!intro) return;

    const activateVideo = () => {
      if (videoActivated) return;
      videoActivated = true;
      video.load();
    };

    const handleScroll = () => {
      if (window.scrollY > 4) activateVideo();
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const rect = intro.getBoundingClientRect();
      const scrollDistance = Math.max(intro.offsetHeight, 1);
      // Progress: 0 at top of section, 1 when section scrolled fully out
      const progress = Math.max(0, Math.min(-rect.top / scrollDistance, 1));
      targetTime = progress * video.duration;
      scheduleRender();
    };

    const renderLoop = () => {
      rafId = 0;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        if (reducedMotion) {
          video.currentTime = targetTime;
        } else if (Math.abs(targetTime - video.currentTime) > 0.01) {
          video.currentTime += (targetTime - video.currentTime) * 0.12;
          rafId = requestAnimationFrame(renderLoop);
        }
      }
    };

    const scheduleRender = () => {
      if (!rafId) rafId = requestAnimationFrame(renderLoop);
    };

    const revealFirst = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.currentTime < 0.1) {
        video.currentTime = 0.1;
      }
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    video.addEventListener("loadedmetadata", handleScroll);
    video.addEventListener("loadeddata", revealFirst);
    video.addEventListener("canplay", revealFirst);
    if (window.scrollY > 4) activateVideo();
    revealFirst();
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("loadedmetadata", handleScroll);
      video.removeEventListener("loadeddata", revealFirst);
      video.removeEventListener("canplay", revealFirst);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/Sunrise_over_planetary_horizon_1080p_20260927133318.mp4"
      poster="/hero_bg.jpg"
      className="film-intro-video"
      preload="none"
      muted
      playsInline
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
