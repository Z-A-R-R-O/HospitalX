/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export const hospitalXClerkAppearance = {
  variables: {
    colorPrimary: "#df6742",
    colorBackground: "#f2efe8",
    colorText: "#111210",
    colorTextSecondary: "#6f706b",
    colorInputBackground: "#fbfaf6",
    colorInputText: "#111210",
    borderRadius: "0px",
    fontFamily: "SFProDisplay, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "14px",
  },
  elements: {
    rootBox: "hx-clerk-root",
    cardBox: "hx-clerk-card-box",
    card: "hx-clerk-card",
    header: "hx-clerk-header",
    headerTitle: "hx-clerk-title",
    headerSubtitle: "hx-clerk-subtitle",
    socialButtonsBlockButton: "hx-clerk-social",
    socialButtonsBlockButtonText: "hx-clerk-social-text",
    dividerLine: "hx-clerk-divider",
    dividerText: "hx-clerk-divider-text",
    formFieldLabel: "hx-clerk-label",
    formFieldInput: "hx-clerk-input",
    formButtonPrimary: "hx-clerk-primary",
    footer: "hx-clerk-footer",
    footerActionLink: "hx-clerk-link",
    identityPreview: "hx-clerk-identity",
    identityPreviewEditButton: "hx-clerk-link",
    formResendCodeLink: "hx-clerk-link",
    otpCodeFieldInput: "hx-clerk-otp",
    alert: "hx-clerk-alert",
  },
} as const;
