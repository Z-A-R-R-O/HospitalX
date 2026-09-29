import Link from "next/link";

const systemMetrics = [
  { value: "124", label: "Patients" },
  { value: "18", label: "Appointments" },
  { value: "06", label: "Departments" },
];

export function FilmProduct() {
  return (
    <section className="film-product" id="product" aria-labelledby="product-title">
      <p className="film-product-label">06 — PRODUCT</p>
      <div className="film-product-identity">
        <h2 id="product-title">HOSPITALX</h2>
        <p>By Veyminore</p>
        <span>A modern operating system for hospitals.</span>
      </div>

      <div className="film-product-object" aria-label="HospitalX product interface">
        <div className="film-product-trail film-product-trail--one" aria-hidden="true" />
        <div className="film-product-trail film-product-trail--two" aria-hidden="true" />
        <div className="film-product-console">
          <header>
            <strong>HospitalX</strong>
            <span>System live</span>
          </header>
          <div className="film-product-metrics">
            {systemMetrics.map(({ value, label }) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="film-product-flow">
            <div>
              <span>Operational flow</span>
              <strong>All systems connected</strong>
            </div>
            <svg viewBox="0 0 300 82" aria-hidden="true">
              <path d="M2 60C35 61 37 26 72 37C103 47 111 72 144 50C179 27 195 20 224 37C252 54 264 20 298 22" />
              <circle cx="72" cy="37" r="3" />
              <circle cx="224" cy="37" r="3" />
            </svg>
          </div>
        </div>
        <span className="film-product-layer film-product-layer--left">Patients</span>
        <span className="film-product-layer film-product-layer--right">Records</span>
      </div>

      <Link href="/dashboard" className="film-product-enter">
        EXPLORE HOSPITALX
      </Link>
    </section>
  );
}
