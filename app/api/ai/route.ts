/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from 'next/server';
import { getPermissionFilteredContext } from "@/lib/ai/context";
import { guardMadhuRequest } from "@/lib/ai/guardrails";
import { env } from "@/lib/env";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission, UnauthorizedError } from "@/lib/permissions";

export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const identity = await requireOrganizationContext();
    requirePermission(identity, "patients:read");
    const { messages } = await req.json();
    const requestText = Array.isArray(messages) ? messages.filter((message: unknown) => typeof (message as { content?: unknown })?.content === "string").map((message: { content: string }) => message.content).join("\n") : "";
    const safety = guardMadhuRequest(requestText);
    if (safety.blocked) {
      return NextResponse.json({ summary: safety.text, openItems: [], nextAction: "Ask an authorized clinician to review the patient and make the decision.", sources: [], freshness: new Date().toISOString(), approvalBoundary: safety.safety, text: safety.text, blocked: true }, { status: 400 });
    }
    const context = await getPermissionFilteredContext();
    if ("error" in context) return NextResponse.json({ error: context.error }, { status: 403 });
    if (!env.openRouterKey) {
      return NextResponse.json({ summary: "Madhu is ready to summarize protected workflow context once an AI provider is configured.", openItems: [], nextAction: "Review the visible queue and assign the next accountable owner.", sources: context.sources, freshness: context.freshness, approvalBoundary: "HUMAN_REVIEW_REQUIRED", text: "Madhu is temporarily unavailable." }, { status: 503 });
    }
    const response = await fetch(env.aiApiUrl || "https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.openRouterKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.aiModel || "nvidia/nemotron-3.5-lightning:free",
        messages: [
          { 
            role: "system", 
            content: "You are Madhu, HospitalX's operational assistant. Use only the supplied permission-filtered context. You may summarize workflow status and prepare drafts, but never diagnose, prescribe, recommend treatment, or approve actions. An authorized human retains the approval boundary."
          },
          ...(Array.isArray(messages) ? messages.slice(-12) : []),
          { role: "system", content: `Protected context: ${JSON.stringify(context.data)}` }
        ]
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      try {
         const errData = JSON.parse(errorText);
         return NextResponse.json({ error: `API Error: ${errData.error?.message || errorText}` }, { status: response.status });
      } catch (e) {
         return NextResponse.json({ error: "Error communicating with AI API." }, { status: response.status });
      }
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "No response generated.";
    return NextResponse.json({ summary: text, openItems: [], nextAction: "Review the visible queue and assign the next accountable owner.", sources: context.sources, freshness: context.freshness, approvalBoundary: "HUMAN_REVIEW_REQUIRED", text });
  } catch (error) {
    if (error instanceof UnauthorizedError) return NextResponse.json({ error: error.message }, { status: 403 });
    if ((error as Error).name === "AuthenticationError") return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    console.error("AI Route Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response." }, { status: 500 });
  }
}

