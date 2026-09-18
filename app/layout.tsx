import type { Metadata } from "next";
import "./globals.css";
import "./backgrounds.css";
import "./responsive.css";
import "./desktop.css";
import "./font.css";
import "./typography.css";

export const metadata: Metadata = {
  title: "HospitalX | Command Center",
  description: "Real-time hospital operations command center.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
