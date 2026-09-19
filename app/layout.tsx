import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import "./backgrounds.css";
import "./responsive.css";
import "./desktop.css";
import "./font.css";
import "./typography.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "HospitalX | Command Center",
  description: "Real-time hospital operations command center.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ClerkProvider>{children}</ClerkProvider></body></html>;
}
