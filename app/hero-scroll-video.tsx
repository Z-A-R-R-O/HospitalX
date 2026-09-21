"use client";

import { useEffect, useRef } from "react";

export function HeroScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let targetTime = 0;
    
    // We want the video to be fully scrubbed by the time we scroll 1.5x viewport height
    const handleScroll = () => {
      if (video.duration) {
        const scrollMax = window.innerHeight * 1.5;
        const scrollFraction = Math.min(window.scrollY / scrollMax, 1);
        targetTime = scrollFraction * video.duration;
      }
    };

    const renderLoop = () => {
      if (video && video.duration) {
        // Smoothly interpolate current time towards target time
        // The closer to 1 the lerp factor, the stiffer. 0.1 is very smooth/buttery.
        video.currentTime += (targetTime - video.currentTime) * 0.08;
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    // Initialize
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Play video briefly to load first frame properly on iOS
    video.play().then(() => {
      video.pause();
      rafId = requestAnimationFrame(renderLoop);
    }).catch(e => {
      // Autoplay might be blocked, but we can still scrub
      rafId = requestAnimationFrame(renderLoop);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="hero-bg" style={{ background: '#000' }}>
      <video
        ref={videoRef}
        src="/Hero-scroll.mp4"
        poster="/hero_bg.jpg"
        className="bg-img"
        preload="metadata"
        muted
        playsInline
        style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: 1 }}
      />
    </div>
  );
}
