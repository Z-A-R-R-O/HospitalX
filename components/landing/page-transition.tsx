"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const initialRender = useRef(true);
  useEffect(() => {
    initialRender.current = false;
  }, []);
  if (initialRender.current) return children;
  return (
    <div key={pathname} className="route-transition">
      <div className="route-transition-wash" aria-hidden="true" />
      <div className="route-transition-indicator" role="status" aria-label="Loading HospitalX view" aria-live="polite">
        <span>HospitalX</span>
        <i aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}
