/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import Link from "next/link";
export function FilmFinal() {
  return (
    <section className="film-final" id="final" aria-labelledby="final-title">
      <p className="film-final-label">14 — FINAL</p>
      <div className="film-final-atmosphere" aria-hidden="true">
        <span className="film-final-glow" />
      </div>
      <div className="film-final-content">
        <div className="film-final-logo">
          <span>H</span>
          <strong>HospitalX</strong>
        </div>
        <h2 id="final-title">EVOLVED.<br />BETTER.</h2>
        <p className="film-final-sub">A modern operating system<br />for hospitals.</p>
        <div className="film-final-actions">
          <Link href="/dashboard" className="film-final-btn film-final-btn--primary">
            EXPLORE HOSPITALX
          </Link>
          <Link href="#product" className="film-final-btn film-final-btn--ghost">
            VIEW SYSTEM
          </Link>
        </div>
      </div>
    </section>
  );
}
