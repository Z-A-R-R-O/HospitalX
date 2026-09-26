import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./font.css";
import "./design-system.css";

import { ConnectivityProvider } from "@/lib/offline/connectivity";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "HospitalX SwasthyaSetu Edition",
  description: "The Ultimate Offline-First Smart HMS.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  
  const content = (
    <ConnectivityProvider>
      {children}
    </ConnectivityProvider>
  );

  return (
    <html lang="en">
      <body>
        {clerkEnabled ? <ClerkProvider>{content}</ClerkProvider> : content}
      </body>
    </html>
  );
}
