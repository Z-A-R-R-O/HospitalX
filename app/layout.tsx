import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./font.css";
import "./design-system.css";

export const metadata: Metadata = {
  title: "HospitalX | Command Center",
  description: "Real-time hospital operations command center.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return <html lang="en"><body>{clerkEnabled ? <ClerkProvider>{children}</ClerkProvider> : children}</body></html>;
}
