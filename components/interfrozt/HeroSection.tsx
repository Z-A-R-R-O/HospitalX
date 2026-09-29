"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import ProductLaunchCTA from "@/components/interfrozt/ProductLaunchCTA";
const VIDEO_END_PROGRESS = 0.965;
export default function HeroSection({
  heroTitle,
  productLines,
}: {
  heroTitle: string;
  productLines: readonly string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const introHiddenRef = useRef(false);
  const finalFlashRef = useRef(false);
  const gatewayReleasedRef = useRef(false);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const [introHidden, setIntroHidden] = useState(false);
  const [finalFlash, setFinalFlash] = useState(false);
  const [gatewayReleased, setGatewayReleased] = useState(false);
  const [activeProductLine, setActiveProductLine] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Match the animation endpoint to the moment the sticky viewport releases:
    // the section's bottom reaches the viewport's bottom, not its top.
    offset: ["start start", "end end"],
  });
  const introY = useTransform(scrollYProgress, [0, 0.025, 0.055], [0, -8, -18]);
  const titleGlow = useTransform(scrollYProgress, [0, 0.02, 0.05], [0.18, 0.24, 0]);
  const architectureX = useTransform(scrollYProgress, [0, 0.62, 0.84], [0, -18, -58]);
  const architectureScale = useTransform(scrollYProgress, [0, 0.62, 0.84], [1, 1.035, 1.12]);
  const videoScale = useTransform(scrollYProgress, [0, 0.45, 0.92, 1], [1.03, 1.07, 1.12, 1.16]);
  const videoX = useTransform(scrollYProgress, [0, 0.62, 1], [0, -10, -24]);
  const videoY = useTransform(scrollYProgress, [0, 0.7, 1], [0, -6, -12]);
  const titleStyle = reduceMotion
    ? undefined
    : {
        y: introY,
        "--energy": titleGlow,
      };
  useEffect(() => {
    if (productLines.length < 2) return undefined;
    const rotation = window.setInterval(() => {
      setActiveProductLine((current) => (current + 1) % productLines.length);
    }, 5200);
    return () => window.clearInterval(rotation);
  }, [productLines.length]);
  useMotionValueEvent(scrollYProgress, "change", (rawProgress) => {
    const progress = Math.min(1, Math.max(0, rawProgress));
    const shouldHideIntro = progress > 0.065;
    if (shouldHideIntro !== introHiddenRef.current) {
      introHiddenRef.current = shouldHideIntro;
      setIntroHidden(shouldHideIntro);
    }
    const shouldFlash = progress >= VIDEO_END_PROGRESS && progress < 0.999;
    if (shouldFlash !== finalFlashRef.current) {
      finalFlashRef.current = shouldFlash;
      setFinalFlash(shouldFlash);
    }
    const shouldReleaseGateway = progress >= 0.999;
    if (shouldReleaseGateway !== gatewayReleasedRef.current) {
      gatewayReleasedRef.current = shouldReleaseGateway;
      setGatewayReleased(shouldReleaseGateway);
    }
  });
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return undefined;
    const tick = () => {
      const duration = Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : 8;
      const target = Math.min(duration - 0.035, Math.max(0, targetTimeRef.current));
      const current = currentTimeRef.current || video.currentTime || 0;
      const delta = target - current;
      const next = Math.abs(delta) < 0.03 ? target : current + delta * 0.38;
      currentTimeRef.current = next;
      try {
        if (Math.abs(video.currentTime - next) > 0.024) {
          video.currentTime = next;
        }
      } catch {
        // Some browsers briefly reject seeks before metadata is ready.
      }
      frameRef.current = Math.abs(target - next) < 0.03
        ? null
        : window.requestAnimationFrame(tick);
    };
    const requestSmoothSeek = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };
    const setVideoTime = (progress: number) => {
      const duration = Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : 8;
      const videoProgress = Math.min(1, Math.max(0, progress / VIDEO_END_PROGRESS));
      targetTimeRef.current = Math.min(
        duration - 0.035,
        Math.max(0, videoProgress * (duration - 0.07)),
      );
      if (videoProgress >= 0.995) {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        currentTimeRef.current = targetTimeRef.current;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {
          // Some browsers briefly reject seeks before metadata is ready.
        }
        return;
      }
      requestSmoothSeek();
    };
    const handleMetadata = () => {
      video.pause();
      currentTimeRef.current = video.currentTime || 0;
      setVideoTime(scrollYProgress.get());
    };
    video.muted = true;
    video.pause();
    video.addEventListener("loadedmetadata", handleMetadata);
    const unsubscribe = scrollYProgress.on("change", setVideoTime);
    if (video.readyState >= 1) handleMetadata();
    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      unsubscribe();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [reduceMotion, scrollYProgress]);
  return (
    <section
      id="hero"
      ref={sectionRef}
      className={`cinema-home relative h-[230vh] w-full bg-[#efeee9] text-carbon ${gatewayReleased ? "is-gateway-released" : ""}`}
    >
      <div className="cinema-sticky sticky top-0 min-h-screen overflow-hidden">
        <motion.div
          className="cinema-architecture"
          style={
            reduceMotion
              ? undefined
              : {
                  x: architectureX,
                  scale: architectureScale,
                }
          }
          aria-hidden="true"
        />
        <motion.div
          className="cinema-video-frame"
          style={
            reduceMotion
              ? undefined
              : {
                  scale: videoScale,
                  x: videoX,
                  y: videoY,
                }
          }
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            className="cinema-video"
            data-landing-critical-video
            src="/interfrozt/assets/hero/interfrozt-cinematic-home.mp4"
            poster="/interfrozt/assets/hero/interfrozt-cinematic-poster.jpg"
            muted
            playsInline
            preload="auto"
          />
          <div className="cinema-video-grade" />
        </motion.div>
        <div className="cinema-vignette" aria-hidden="true" />
        <motion.div className={`cinema-intro-ui ${introHidden ? "is-hidden" : ""}`}>
          <ProductLaunchCTA />
        </motion.div>
        <motion.a
          href="#work"
          className={`cinema-explore-link cinema-intro-ui ${introHidden ? "is-hidden" : ""}`}
          animate={
            !reduceMotion
              ? {
                  y: [0, -3, 0],
                  opacity: [0.72, 1, 0.72],
                  textShadow: [
                    "0 0 6px rgba(245,245,245,0.12)",
                    "0 0 24px rgba(245,245,245,0.5)",
                    "0 0 6px rgba(245,245,245,0.12)",
                  ],
                }
              : undefined
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Explore
          <br />
          The Platform
        </motion.a>
        <motion.div
          className={`cinema-copy cinema-intro-ui pointer-events-none absolute z-20 ${introHidden ? "is-hidden" : ""}`}
          style={titleStyle}
        >
          <h1 className="energy-title font-display uppercase leading-[0.84] text-carbon">
            {heroTitle.split("\n").map((line, index) => (
              <span
                key={line}
                className={index === 2 ? "clarity-line" : undefined}
              >
                {line}
              </span>
            ))}
          </h1>
          <div className="cinema-rule" />
          <div className="hero-message-rotator mt-7 max-w-[390px] text-[13px] leading-7 text-carbon/82">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeProductLine}
                initial={reduceMotion ? false : { opacity: 0, y: 9 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -9 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {productLines[activeProductLine].split(". ").map((line) => (
                  <span key={line} className="block">
                    {line.replace(/\.$/, "")}.
                  </span>
                ))}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
        <motion.div
          className={`portal-wash ${finalFlash ? "is-final-active" : ""}`}
          aria-hidden="true"
        />
        <motion.div
          className={`portal-flash ${finalFlash ? "is-final-active" : ""}`}
          aria-hidden="true"
        />
        <motion.a
          href="#work"
          className={`scroll-cue cinema-intro-ui ${introHidden ? "is-hidden" : ""}`}
          aria-label="Scroll to explore the HospitalX system"
        >
          <span className="scroll-motion" aria-hidden="true">
            <span className="scroll-motion-light" />
            <span className="scroll-motion-arrow" />
          </span>
          <span className="scroll-label">Scroll</span>
        </motion.a>
      </div>
    </section>
  );
}
