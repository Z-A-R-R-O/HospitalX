"use client";

import { useEffect, useRef } from "react";

export function HeroScrollVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current?.closest<HTMLElement>(".hero-wrapper");
    if (!video || !wrapper) return;

    let rafId = 0;
    let targetTime = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const openingOffset = 0.2;

    const handleScroll = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
      const scrollDistance = Math.max(wrapper.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min((window.scrollY - wrapperTop) / scrollDistance, 1));
      targetTime = openingOffset + progress * Math.max(video.duration - openingOffset, 0);
    };

    const revealOpeningFrame = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.currentTime < openingOffset) {
        video.currentTime = openingOffset;
      }
      handleScroll();
    };

    const renderLoop = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = reducedMotion ? targetTime : video.currentTime + (targetTime - video.currentTime) * 0.12;
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    video.addEventListener("loadedmetadata", handleScroll);
    video.addEventListener("loadeddata", revealOpeningFrame);
    video.addEventListener("canplay", revealOpeningFrame);
    revealOpeningFrame();
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      video.removeEventListener("loadedmetadata", handleScroll);
      video.removeEventListener("loadeddata", revealOpeningFrame);
      video.removeEventListener("canplay", revealOpeningFrame);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="hero-bg" aria-hidden="true">
      <video
        ref={videoRef}
        src="/Hero-scroll.mp4"
        poster="/hero_bg.jpg"
        className="bg-img"
        preload="auto"
        muted
        playsInline
        tabIndex={-1}
      />
    </div>
  );
}
