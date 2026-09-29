"use client";
import { useCallback, useEffect, useRef, useState } from "react";
const REPAIR_QUERY = "hx-repair";
const REPAIR_HISTORY_KEY = "hospitalx:auto-repair-history";
const REPAIR_WINDOW_MS = 5 * 60 * 1000;
const MAX_REPAIRS_PER_WINDOW = 2;
const HEALTH_INTERVAL_MS = 30 * 1000;
const HEALTH_TIMEOUT_MS = 5 * 1000;
type RepairRecord = { at: number; reason: string };
function readRepairHistory(): RepairRecord[] {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(REPAIR_HISTORY_KEY) ?? "[]") as RepairRecord[];
    const cutoff = Date.now() - REPAIR_WINDOW_MS;
    return parsed.filter((record) => Number.isFinite(record.at) && record.at > cutoff);
  } catch {
    return [];
  }
}
function isRecoverableAssetError(value: unknown) {
  const message = value instanceof Error ? `${value.name} ${value.message}` : String(value ?? "");
  return /ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module|CSS_CHUNK_LOAD_FAILED|__webpack_modules__\[moduleId\] is not a function/i.test(message);
}
export default function AutoRecovery() {
  const [repairing, setRepairing] = useState(false);
  const repairingRef = useRef(false);
  const healthFailures = useRef(0);
  const repair = useCallback(async (reason: string) => {
    if (repairingRef.current || !navigator.onLine) return;
    const history = readRepairHistory();
    if (history.length >= MAX_REPAIRS_PER_WINDOW) {
      console.error("[HospitalX recovery] Automatic repair paused to prevent a reload loop.", { reason });
      return;
    }
    repairingRef.current = true;
    setRepairing(true);
    window.sessionStorage.setItem(
      REPAIR_HISTORY_KEY,
      JSON.stringify([...history, { at: Date.now(), reason }]),
    );
    try {
      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.filter((name) => name.startsWith("hospitalx-")).map((name) => window.caches.delete(name)));
      }
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.update().catch(() => undefined)));
      }
    } finally {
      window.setTimeout(() => {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set(REPAIR_QUERY, Date.now().toString(36));
        window.location.replace(nextUrl.toString());
      }, 420);
    }
  }, []);
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has(REPAIR_QUERY)) {
      currentUrl.searchParams.delete(REPAIR_QUERY);
      window.history.replaceState(window.history.state, "", currentUrl.toString());
    }
    const onError = (event: ErrorEvent) => {
      if (isRecoverableAssetError(event.error ?? event.message)) void repair("asset-runtime");
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isRecoverableAssetError(event.reason)) void repair("asset-promise");
    };
    const onResourceError = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLScriptElement && target.src.includes("/_next/")) void repair("script-load");
      if (target instanceof HTMLLinkElement && target.href.includes("/_next/") && target.rel === "stylesheet") void repair("style-load");
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onResourceError, true);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onResourceError, true);
    };
  }, [repair]);
  useEffect(() => {
    let disposed = false;
    const checkHealth = async () => {
      if (disposed || document.visibilityState !== "visible" || !navigator.onLine) return;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);
      try {
        const response = await fetch("/api/health", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Health check returned ${response.status}`);
        if (healthFailures.current >= 3) void repair("health-restored");
        healthFailures.current = 0;
      } catch {
        healthFailures.current += 1;
      } finally {
        window.clearTimeout(timeout);
      }
    };
    const interval = window.setInterval(() => void checkHealth(), HEALTH_INTERVAL_MS);
    const onOnline = () => void checkHealth();
    window.addEventListener("online", onOnline);
    void checkHealth();
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("online", onOnline);
    };
  }, [repair]);
  if (!repairing) return null;
  return (
    <div className="hx-auto-repair" role="status" aria-live="assertive" aria-label="HospitalX is repairing and reloading">
      {/* The native image keeps this emergency path independent of Next's image chunks. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/veyminore-signature.png" alt="" />
      <span aria-hidden="true"><i /><i /><i /><i /><i /></span>
    </div>
  );
}
