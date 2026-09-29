import { Wifi, WifiOff, RefreshCw, Check } from "lucide-react";

const statusFlow = [
  { icon: Wifi, label: "Connected", detail: "All systems online", className: "connected" },
  { icon: WifiOff, label: "Network Lost", detail: "No internet connection", className: "lost" },
  { icon: RefreshCw, label: "HospitalX Continues", detail: "Full functionality offline", className: "continues" },
  { icon: RefreshCw, label: "Network Restored", detail: "Syncing data...", className: "restored" },
  { icon: Check, label: "Sync Complete", detail: "All data up to date", className: "synced" },
];

export function FilmOffline() {
  return (
    <section className="film-offline" id="offline" aria-labelledby="offline-title">
      <p className="film-offline-label">10 — OFFLINE-FIRST</p>

      <div className="film-offline-content">
        <div className="film-offline-copy">
          <h2 id="offline-title">
            BUILT<br />FOR REAL<br />HOSPITALS.
          </h2>
          <p className="film-offline-sub">
            Works online. Works offline.<br />Always on.
          </p>
        </div>

        <div className="film-offline-status" aria-label="Offline capability status flow">
          {statusFlow.map(({ icon: Icon, label, detail, className }) => (
            <div className={`film-offline-step film-offline-step--${className}`} key={label}>
              <span className="film-offline-step-icon">
                <Icon size={16} strokeWidth={2} />
              </span>
              <div>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
            </div>
          ))}
          <div className='film-offline-indicator'>
            <span className='film-offline-dot' />
            <span>Online</span>
          </div>
        </div>
      </div>

      <p className="film-offline-footer">
        OFFLINE-FIRST<br />BECAUSE CARE CAN&apos;T WAIT.
      </p>
    </section>
  );
}
