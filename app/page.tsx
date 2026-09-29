/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import type { Metadata } from "next";
import GlitchCursor from "@/components/cursor/GlitchCursor";
import AmbientSound from "@/components/interfrozt/AmbientSound";
import LandingPreviewPage from "@/app/landing-preview/page";
export const metadata: Metadata = {
  title: "HospitalX — Care Flows Futher",
  description: "A connected, offline-first hospital operating system for patients, clinical teams, operations, diagnostics, pharmacy, billing, and continuity of care.",
  keywords: ["HospitalX", "hospital management system", "offline-first healthcare", "clinical operations", "patient flow"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "HospitalX — Care Flows Futher",
    description: "One calm, continuously connected operating system for modern care.",
    type: "website",
    images: [{ url: "/interfrozt/assets/hero/interfrozt-cinematic-poster.jpg", width: 1600, height: 900, alt: "HospitalX — Care Flows Futher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "HospitalX — Care Flows Futher",
    description: "One calm, continuously connected operating system for modern care.",
    images: ["/interfrozt/assets/hero/interfrozt-cinematic-poster.jpg"],
  },
};
export default function LandingPage() {
  return (
    <>
      <link rel="preload" href="/interfrozt/assets/hero/interfrozt-cinematic-poster.jpg" as="image" type="image/jpeg" fetchPriority="high" />
      <link rel="preload" href="/fonts/SFPRODISPLAYREGULAR.OTF" as="font" type="font/otf" crossOrigin="anonymous" />
      <GlitchCursor />
      <LandingPreviewPage />
      <AmbientSound />
    </>
  );
}
