import React from 'react';

const problems = [
  "MANUAL WORK",
  "DISCONNECTED SYSTEMS",
  "DELAYED RECORDS",
  "MISSING INFORMATION",
  "PATIENT WAIT TIMES",
  "YEAR-OLD UIs"
];

export function FilmProblem() {
  return (
    <section className="film-problem" id="problem" aria-labelledby="problem-title">
      <div className="film-problem-atmosphere" />
      <p className="film-problem-label">03 — PROBLEM</p>
      
      <div className="film-problem-huge">
        <h2 id="problem-title">SLOW</h2>
      </div>
      <span className='film-problem-enough'>ENOUGH.</span>

      <div className="film-problem-list">
        {problems.map((point) => (
          <div key={point} className="film-problem-item">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}
