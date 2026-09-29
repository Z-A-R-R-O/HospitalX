/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import AboutSection from "@/components/interfrozt/AboutSection";
import ApproachSection from "@/components/interfrozt/ApproachSection";
import CapabilitiesSection from "@/components/interfrozt/CapabilitiesSection";
import ContactSection from "@/components/interfrozt/ContactSection";
import HeroSection from "@/components/interfrozt/HeroSection";
import LandingLoader from "@/components/interfrozt/LandingLoader";
import NavigationRail from "@/components/interfrozt/NavigationRail";
import WorkSection from "@/components/interfrozt/WorkSection";
import {
  CAPABILITIES,
  CORE_LINE,
  HERO_TITLE,
  PRODUCT_LINES,
  SITE_TITLE,
  WORK_ITEMS,
} from "@/lib/interfrozt/constants";
export default function LandingPreviewPage() {
  return (
    <div className="interfrozt-preview">
      <a className="landing-skip-link" href="#main-content">Skip to main content</a>
      <LandingLoader />
      <NavigationRail siteTitle={SITE_TITLE} coreLine={CORE_LINE} />
      <main id="main-content" tabIndex={-1} className="lg:ml-rail">
        <HeroSection heroTitle={HERO_TITLE} productLines={PRODUCT_LINES} />
        <WorkSection items={WORK_ITEMS} />
        <ApproachSection />
        <CapabilitiesSection capabilities={CAPABILITIES} />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}
