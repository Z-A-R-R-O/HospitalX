"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}
export default function DownloadPage() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [message, setMessage] = useState("Install directly from a supported browser.");
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setInstalled(standalone);
    const capture = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
      setMessage("Ready to install on this device.");
    };
    const complete = () => {
      setInstalled(true);
      setPromptEvent(null);
      setMessage("HospitalX is installed on this device.");
    };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", complete);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", complete);
    };
  }, []);
  const install = async () => {
    if (installed) return;
    if (!promptEvent) {
      setMessage("Use your browser's Install app command. In Chrome or Edge, open the address-bar install icon or browser menu.");
      return;
    }
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setMessage(choice.outcome === "accepted" ? "Installing HospitalX…" : "Install cancelled. You can return whenever you're ready.");
    if (choice.outcome === "accepted") setInstalled(true);
    setPromptEvent(null);
  };
  return (
    <main className="dl">
      {/* —— Top bar —— */}
      <header className="dl-bar dl-in">
        <a href="/" className="dl-logo" aria-label="HospitalX home">
          <span>HospitalX</span>
          <small>Veyminore edition</small>
        </a>
        <nav>
          <span>Product / Download</span>
          <a href="/dashboard">Open app <i aria-hidden="true">↗</i></a>
        </nav>
      </header>
      {/* —— Centered hero —— */}
      <section className="dl-hero">
        <div className="dl-hero-text dl-in dl-d2">
          <span className="dl-kicker">HospitalX for your device</span>
          <h1 className="font-display uppercase">Care, ready <em>anywhere.</em></h1>
          <p>Run HospitalX as a native app or open it directly in your browser. Same connected system, same care experience.</p>
        </div>
        {/* —— Primary action row —— */}
        <div className="dl-actions dl-in dl-d3">
          <a className="dl-btn dl-btn-primary" href="/downloads/HospitalX-Setup.exe" download>
            <span>
              <strong>Download for Windows</strong>
              <small>Version 0.1 · Native setup · 1.5 MB</small>
            </span>
            <b aria-hidden="true">↓</b>
          </a>
          <button className="dl-btn dl-btn-secondary" type="button" onClick={install} disabled={installed}>
            <span>
              <strong>{installed ? "Web app installed" : "Install web app"}</strong>
              <small>{message}</small>
            </span>
            <b aria-hidden="true">{installed ? "✓" : "↓"}</b>
          </button>
          <a className="dl-btn dl-btn-tertiary" href="/dashboard">
            <span>
              <strong>Open in browser</strong>
              <small>No installation required</small>
            </span>
            <b aria-hidden="true">↗</b>
          </a>
        </div>
        {/* —— Product visual —— */}
        <div className="dl-visual dl-in dl-d4">
          <div className="dl-visual-inner">
            <Image
              src="/film-04-bg.jpg"
              alt="HospitalX clinical systems connected through one operating platform"
              fill
              priority
              sizes="(max-width: 900px) 95vw, 80vw"
            />
          </div>
          <div className="dl-visual-badge" aria-hidden="true">
            <i /><span>Veyminore edition</span>
          </div>
        </div>
      </section>
      {/* —— Source row —— */}
      <section className="dl-source dl-in dl-d5">
        <div>
          <h2>Source package</h2>
          <p>Download the complete HospitalX source for development and deployment.</p>
        </div>
        <a href="https://github.com/Z-A-R-R-O/HospitalX/archive/refs/heads/main.zip" download>
          Download ZIP <i aria-hidden="true">↓</i>
        </a>
      </section>
      {/* —— Footer —— */}
      <footer className="dl-footer">
        <a href="/">← Return to HospitalX</a>
        <span>Built for care that cannot pause.</span>
        <span>© 2026 HospitalX — Veyminore</span>
      </footer>
    </main>
  );
}

