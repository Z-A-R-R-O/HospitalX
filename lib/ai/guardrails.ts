const unsafeClinicalRequest = /\b(diagnos(?:e|is)|prescri(?:be|ption)|what medicine|dosage|dose|treat(?:ment)?|should (?:i|they|the patient) take)\b/i;

export function guardMadhuRequest(text: string) {
  if (unsafeClinicalRequest.test(text)) {
    return {
      blocked: true,
      text: "I can summarize available patient context, navigate HospitalX, explain workflow status, and prepare drafts. I cannot diagnose, prescribe, recommend medication, or approve clinical action. An authorized professional must make that decision.",
      safety: "HUMAN_REVIEW_REQUIRED",
    };
  }
  return { blocked: false, safety: "NON_CLINICAL_CONTEXT_ONLY" };
}
