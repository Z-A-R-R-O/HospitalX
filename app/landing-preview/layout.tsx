/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import type { Metadata } from "next";
import GlitchCursor from "@/components/cursor/GlitchCursor";
export const metadata: Metadata = {
  title: "HospitalX — Care Flows Futher",
  description: "A connected, offline-first hospital operating system for modern care.",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};
export default function LandingPreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlitchCursor />
      {children}
    </>
  );
}
