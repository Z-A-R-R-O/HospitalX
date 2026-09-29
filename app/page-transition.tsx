"use client";

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
      {children}
    </div>
  );
}
