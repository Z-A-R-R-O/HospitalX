/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export default function ProductVisual({ visual }: { visual: string }) {
  if (visual === "dashboard") {
    return (
      <div className="product-visual product-visual-light">
        <div className="dashboard-shell">
          <span />
          <span />
          <span />
          <div className="chart-line" />
        </div>
      </div>
    );
  }
  if (visual === "mobile") {
    return (
      <div className="product-visual product-visual-dark">
        <div className="phone-shell">
          <div className="phone-pill" />
          <div className="phone-card" />
          <div className="phone-card short" />
          <div className="phone-wave" />
        </div>
      </div>
    );
  }
  return (
    <div className="product-visual product-visual-object">
      <div className="object-chair">
        <span />
        <span />
      </div>
      <p>
        The ultimate
        <br />
        modern platform,
        <br />
        refined.
      </p>
    </div>
  );
}
