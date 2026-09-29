export default function ProductLaunchCTA({ className = "" }: { className?: string }) {
  return (
    <nav className={`product-launch ${className}`.trim()} aria-label="HospitalX product actions">
      <div className="product-launch-actions">
        <a href="/dashboard" className="product-launch-open">
          <span>Open HospitalX</span><b aria-hidden="true">↗</b>
        </a>
        <a href="/download" className="product-launch-install">
          <span>Download app</span><b aria-hidden="true">↓</b>
        </a>
      </div>
    </nav>
  );
}
