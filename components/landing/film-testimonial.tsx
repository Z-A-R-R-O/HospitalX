/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export function FilmTestimonial() {
  return (
    <section className="film-testimonial" id="testimonial" aria-labelledby="testimonial-title">
      <p className="film-testimonial-label">13 — TESTIMONIAL</p>
      <div className='film-testimonial-divider' aria-hidden='true' />
      <div className="film-testimonial-content">
        <blockquote>
          <p id="testimonial-title">
            &ldquo;HospitalX transformed our daily operations.&rdquo;
          </p>
          <span className="film-testimonial-desc">
            A unified system that actually understands how hospitals work.
          </span>
        </blockquote>
        <cite className="film-testimonial-author">
          <strong>Dr. Suresh R.</strong>
          <span>Administrator, City Hospital</span>
        </cite>
      </div>
    </section>
  );
}
