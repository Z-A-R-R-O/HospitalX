"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { useEffect, useRef } from "react";
/**
 * A deliberately still cinematic frame for the intro.
 * The previous scroll scrub and pointer parallax made the background feel unstable.
 */
export function FilmIntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const holdFrame = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.min(0.1, video.duration);
      }
      video.pause();
    };
    video.addEventListener("loadedmetadata", holdFrame);
    video.addEventListener("loadeddata", holdFrame);
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", holdFrame);
      video.removeEventListener("loadeddata", holdFrame);
    };
  }, []);
  return (
    <video
      ref={videoRef}
      src="/Sunrise_over_planetary_horizon_1080p_20260927133318.mp4"
      poster="/hero_bg.jpg"
      className="film-intro-video"
      preload="auto"
      muted
      playsInline
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
