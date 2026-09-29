"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { CORE_LINE, NAV_ITEMS, SITE_TITLE } from "@/lib/interfrozt/constants";
export default function NavigationRail({
  siteTitle = SITE_TITLE,
  coreLine = CORE_LINE,
}: {
  siteTitle?: string;
  coreLine?: string;
}) {
  const [activeId, setActiveId] = useState<string>(NAV_ITEMS[0].id);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeIndex = useMemo(
    () => Math.max(0, NAV_ITEMS.findIndex((item) => item.id === activeId)),
    [activeId],
  );
  const progress = NAV_ITEMS.length > 1
    ? (activeIndex / (NAV_ITEMS.length - 1)) * 100
    : 0;
  const activeItem = NAV_ITEMS[activeIndex];
  const railStyle = {
    "--rail-progress": `${progress}%`,
  } as CSSProperties;
  useEffect(() => {
    setMounted(true);
    const sections = NAV_ITEMS.flatMap((item) => {
      const section = document.getElementById(item.id);
      return section ? [section] : [];
    });
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-43% 0px -52% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    const updateFromHash = () => {
      const id = window.location.hash.slice(1);
      if (NAV_ITEMS.some((item) => item.id === id)) setActiveId(id);
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);
  const navigation = (
    <>
      <nav
        className="site-rail"
        style={railStyle}
        aria-label="Primary navigation"
      >
        <a
          href="#hero"
          className="site-rail-brand"
          aria-label={`Go to ${siteTitle} home`}
        >
          <Image className="site-rail-logo" src="/veyminore-logo.png" alt="Veyminore" width={2172} height={724} sizes="112px" priority />
        </a>
        <div className="site-rail-spine" aria-hidden="true">
          <span />
        </div>
        <ul className="site-rail-list">
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="site-rail-link"
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="site-rail-link-index" style={{ visibility: "hidden" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="site-rail-link-label">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="site-rail-footer" aria-hidden="true">
          <span>{coreLine}</span>
        </div>
      </nav>
      <nav
        className="mobile-chapter-dock"
        data-open={mobileOpen}
        aria-label="Primary navigation"
      >
        <div id="mobile-chapter-menu" className="mobile-chapter-panel" aria-hidden={!mobileOpen}>
          <p>Navigate HospitalX</p>
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="mobile-chapter-link"
              data-active={activeId === item.id}
              aria-current={activeId === item.id ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </div>
        <button
          type="button"
          className="mobile-chapter-toggle"
          aria-expanded={mobileOpen}
          aria-controls="mobile-chapter-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Image src="/veyminore-logo.png" alt="Veyminore" width={2172} height={724} sizes="84px" priority />
          <span className="mobile-chapter-current">
            <small>{String(activeIndex + 1).padStart(2, "0")} / {String(NAV_ITEMS.length).padStart(2, "0")}</small>
            <strong>{activeItem.label}</strong>
          </span>
          <span className="mobile-chapter-toggle-icon" aria-hidden="true" />
        </button>
      </nav>
    </>
  );
  // Keep fixed navigation outside route-transition transforms and pinned hero
  // containers. Without a portal, browser transform containment can crop a
  // fixed rail to the active section instead of the viewport.
  return mounted ? createPortal(navigation, document.body) : null;
}

