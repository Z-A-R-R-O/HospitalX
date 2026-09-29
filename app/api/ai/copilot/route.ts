/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
export const runtime = "edge";
export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'clinical_notes:read');
    
    const body = await request.json();
    const { patientId, symptoms, notes } = body;
    if (!symptoms) {
      return NextResponse.json({ error: "Symptoms data required" }, { status: 400 });
    }
    // SIMULATED AI LATENCY & REASONING (For demonstration)
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Dynamic pattern matching based on input
    const inputString = JSON.stringify(symptoms).toLowerCase();
    let riskLevel = "low_concern";
    let summary = "Patient presents with standard neurological baseline. No immediate specialist intervention required. Recommend routine follow-up in 6 months.";
    let tags = ["Routine", "Stable"];
    if (inputString.includes("migraine") || inputString.includes("vision")) {
      riskLevel = "review_recommended";
      summary = "Patient exhibits signs of visual aura accompanying migraine patterns. Flagged for review by attending neurologist within 48 hours to rule out vascular anomalies.";
      tags = ["Migraine Protocol", "Visual Aura", "48h Review"];
    }
    if (inputString.includes("numbness") || inputString.includes("speech") || inputString.includes("weakness")) {
      riskLevel = "specialist_referral_recommended";
      summary = "CRITICAL: Patient presents with asymmetric weakness and speech irregularities. High probability of acute neurological event (TIA/Stroke). Immediate referral to Stroke Center protocol activated.";
      tags = ["STROKE PROTOCOL", "Acute", "Immediate Action"];
    }
    return NextResponse.json({
      copilot: {
        riskLevel,
        generatedSummary: summary,
        suggestedTags: tags,
        confidenceScore: 0.94,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    if (error.name === "UnauthorizedError") return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ error: "AI Engine unavailable" }, { status: 500 });
  }
}
