/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { hospitalXClerkAppearance } from "@/components/auth/clerkAppearance";
export const metadata: Metadata = {
  title: "Create account — HospitalX",
  description: "Join the secure HospitalX care network.",
};
export default function SignUpPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  
  if (!clerkEnabled) {
    return (
      <AuthShell mode="sign-up">
        <div className="hx-auth-unavailable">
          <span>IDENTITY SERVICE</span>
          <h2>Registration is not configured.</h2>
          <p>Add the Clerk publishable key to enable secure HospitalX onboarding.</p>
          <Link href="/health-worker">OPEN HEALTH WORKER MODE <b>↗</b></Link>
        </div>
      </AuthShell>
    );
  }
  return (
    <AuthShell mode="sign-up">
      <SignUp
        appearance={hospitalXClerkAppearance}
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
