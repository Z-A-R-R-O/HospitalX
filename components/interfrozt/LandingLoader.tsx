"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
const MINIMUM_DISPLAY_MS = 2250;
const MAXIMUM_DISPLAY_MS = 2350;
const FINAL_BEAT_MS = 100;
function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    const finish = () => resolve();
    image.onload = finish;
    image.onerror = finish;
    image.src = src;
    if (image.complete) void image.decode?.().catch(() => undefined).finally(finish);
  });
}
function preloadAudio(src: string) {
  return new Promise<void>((resolve) => {
    const audio = new Audio();
    const finish = () => {
      audio.removeEventListener("canplay", finish);
      audio.removeEventListener("error", finish);
      resolve();
    };
    audio.addEventListener("canplay", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    audio.preload = "auto";
    audio.src = src;
    audio.load();
  });
}
function waitForFirstVideoFrame() {
  return new Promise<void>((resolve) => {
    const video = document.querySelector<HTMLVideoElement>("[data-landing-critical-video]");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!video || connection?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resolve();
      return;
    }
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      resolve();
      return;
    }
    const finish = () => {
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("error", finish);
      resolve();
    };
    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("error", finish, { once: true });
    video.preload = "auto";
    video.load();
  });
}
function delay(duration: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, duration));
}
export default function LandingLoader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0.06);
  const loadingClassRemoved = useRef(false);
  const releasePage = () => {
    if (loadingClassRemoved.current) return;
    loadingClassRemoved.current = true;
    document.documentElement.classList.remove("landing-is-loading");
    document.documentElement.classList.add("landing-is-ready");
    window.dispatchEvent(new Event("hospitalx:landing-ready"));
  };
  useEffect(() => {
    loadingClassRemoved.current = false;
    document.documentElement.classList.add("landing-is-loading");
    document.documentElement.classList.remove("landing-is-ready");
    let cancelled = false;
    const timers: number[] = [];
    const schedule = (callback: () => void, duration: number) => {
      const timer = window.setTimeout(() => {
        if (!cancelled) callback();
      }, duration);
      timers.push(timer);
    };
    if (reduceMotion) {
      schedule(() => setProgress(1), 160);
      schedule(() => {
        releasePage();
        setVisible(false);
      }, 320);
    } else {
      schedule(() => setProgress(0.3), 520);
      schedule(() => setProgress(0.58), 1280);
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      const tasks = [
        fontsReady,
        preloadImage("/veyminore-logo.png"),
        preloadImage("/interfrozt/assets/hero/interfrozt-cinematic-poster.jpg"),
        preloadAudio("/audio/ambient-f1.mp3"),
        waitForFirstVideoFrame(),
      ];
      let completed = 0;
      const essentialsReady = Promise.allSettled(tasks.map((task) => task.finally(() => {
        completed += 1;
        if (!cancelled) setProgress(Math.min(0.9, 0.16 + (completed / tasks.length) * 0.74));
      })));
      void Promise.race([
        Promise.all([essentialsReady, delay(MINIMUM_DISPLAY_MS)]),
        delay(MAXIMUM_DISPLAY_MS),
      ]).then(() => {
        if (cancelled) return;
        setProgress(1);
        schedule(() => {
          releasePage();
          setVisible(false);
        }, FINAL_BEAT_MS);
      });
    }
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      releasePage();
    };
  }, [reduceMotion]);
  return (
    <AnimatePresence onExitComplete={releasePage}>
      {visible && (
        <motion.div
          className="vey-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.12 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-label="Loading HospitalX"
        >
          <motion.div
            className="vey-loader-mark"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.975 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.015 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="vey-loader-orbit" aria-hidden="true"><i /><i /></span>
            <Image className="vey-loader-logo" src="/veyminore-logo.png" alt="Veyminore" width={2172} height={724} priority sizes="(max-width: 680px) 88vw, 44vw" />
            <Image className="vey-loader-logo vey-loader-logo-shine" src="/veyminore-logo.png" alt="" width={2172} height={724} priority sizes="(max-width: 680px) 88vw, 44vw" />
            <span className="vey-loader-signal" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((bar) => <i key={bar} />)}</span>
            <span className="vey-loader-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

