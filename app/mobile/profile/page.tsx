"use client";

import Link from "next/link";
import { Bell, ChevronRight, Globe2, LockKeyhole, Settings2 } from "lucide-react";
import { MobilePageHeader, MobileSectionHeading } from "../components";

const settings = [
  { label: "Notifications", detail: "Care alerts and sync updates", icon: Bell },
  { label: "Language", detail: "English · Hindi ready", icon: Globe2 },
  { label: "Privacy and access", detail: "Session and account controls", icon: LockKeyhole },
  { label: "Workspace settings", detail: "City Care Hospital", icon: Settings2 },
];

export default function MobileProfilePage() {
  return <div className="mobile-stack"><MobilePageHeader eyebrow="Your workspace" title="Profile" detail="Keep your care workspace focused and ready." /><section className="mobile-profile-card"><span className="mobile-large-avatar">AZ</span><div><strong>Arunez Zarro</strong><small>Operations administrator</small><em>City Care Hospital</em></div><button aria-label="Edit profile"><ChevronRight size={18} /></button></section><section><MobileSectionHeading title="Preferences" /><div className="mobile-settings-list">{settings.map(({ label, detail, icon: Icon }) => <Link href="/settings" className="mobile-setting-row" key={label}><span className="mobile-setting-icon"><Icon size={17} /></span><span><strong>{label}</strong><small>{detail}</small></span><ChevronRight size={16} /></Link>)}</div></section></div>;
}
