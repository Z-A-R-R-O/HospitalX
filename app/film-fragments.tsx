import { User, Calendar, Stethoscope, Folder, Pill, Receipt, LineChart } from 'lucide-react';

export function FilmFragments() {
  return (
    <section className="film-fragments" id="fragments" aria-labelledby="fragments-title">
      <div className="film-fragments-bg" />
      <p className="film-fragments-label">02 — FRAGMENTED</p>

      <div className="film-fragments-field">
        <div className="fragment-card fragment-card--patients">
          <div className="fragment-card-head">
            <User size={16} /> Patients <i className="status-dot"></i>
          </div>
          <strong>Ananya Rao</strong>
          <small>Waiting · P-104</small>
        </div>

        <div className="fragment-card fragment-card--appointments">
          <div className="fragment-card-head">
            <Calendar size={16} /> Appointments <i className="status-dot"></i>
          </div>
          <strong>06:30 PM</strong>
          <small>Dr. Mehta · OPD</small>
        </div>

        <div className="fragment-card fragment-card--doctors">
          <div className="fragment-card-head">
            <Stethoscope size={16} /> Doctors <i className="status-dot"></i>
          </div>
          <strong>32 online</strong>
          <small>4 on-call now</small>
        </div>

        <div className="fragment-card fragment-card--records">
          <div className="fragment-card-head">
            <Folder size={16} /> Records <i className="status-dot"></i>
          </div>
          <strong>04 results</strong>
          <small>Verified this hour</small>
        </div>

        <div className="fragment-card fragment-card--pharmacy">
          <div className="fragment-card-head">
            <Pill size={16} /> Pharmacy <i className="status-dot"></i>
          </div>
          <strong>184 units</strong>
          <small>Amoxicillin · In stock</small>
        </div>

        <div className="fragment-card fragment-card--billing">
          <div className="fragment-card-head">
            <Receipt size={16} /> Billing <i className="status-dot"></i>
          </div>
          <strong>₹1.24L</strong>
          <small>Collected today</small>
        </div>

        <div className="fragment-card fragment-card--analytics">
          <div className="fragment-card-head">
            <LineChart size={16} /> Analytics <i className="status-dot"></i>
          </div>
          <strong>+12%</strong>
          <small>Patient flow · Today</small>
        </div>
      </div>

      <div className="film-fragments-copy">
        <h2 id="fragments-title">HOSPITALS<br />SHOULDN'T FEEL THIS<br />FRAGMENTED.</h2>
      </div>
    </section>
  );
}
