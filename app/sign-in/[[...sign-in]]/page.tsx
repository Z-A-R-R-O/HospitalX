/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { hospitalXClerkAppearance } from "@/components/auth/clerkAppearance";
export const metadata: Metadata = {
  title: "Sign in — HospitalX",
  description: "Secure access to the HospitalX care operating system.",
};
export default function SignInPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  
  if (!clerkEnabled) {
    return (
      <AuthShell mode="sign-in">
        <div className="hx-auth-unavailable">
          <span>IDENTITY SERVICE</span>
          <h2>Access is not configured.</h2>
          <p>Add the Clerk publishable key to enable secure HospitalX account access.</p>
          <Link href="/health-worker">OPEN HEALTH WORKER MODE <b>↗</b></Link>
        </div>
      </AuthShell>
    );
  }
  return (
    <AuthShell mode="sign-in">
      <SignIn
        appearance={hospitalXClerkAppearance}
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
