/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/font.css";
import "@/styles/design-system.css";
import "@/styles/page-transitions.css";
import "@/styles/interfrozt.css";
import "@/styles/auth.css";
import { ConnectivityProvider } from "@/lib/offline/connectivity";
import { PageTransition } from "@/components/landing/page-transition";
import { ServiceWorkerRegistry } from "@/components/offline/ServiceWorkerRegistry";
import AutoRecovery from "@/components/system/AutoRecovery";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  manifest: "/manifest.json",
  title: "Hospital-X Evolute edition",
  description: "The Ultimate Offline-First Smart HMS.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  
  const content = (
    <ConnectivityProvider>
      <PageTransition>{children}</PageTransition>
    </ConnectivityProvider>
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ServiceWorkerRegistry />
        <AutoRecovery />
        {clerkEnabled ? <ClerkProvider>{content}</ClerkProvider> : content}
      </body>
    </html>
  );
}
