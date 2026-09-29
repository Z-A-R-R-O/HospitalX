import { test } from "node:test";
import assert from "node:assert";
import { guardMadhuRequest } from "../../lib/ai/guardrails";

test("AI guardrails block clinical requests", () => {
  const cases = [
    { input: "What is my diagnosis?", expected: true },
    { input: "Can you prescribe me some medicine?", expected: true },
    { input: "What dose of paracetamol should I take?", expected: true },
    { input: "What is the recommended treatment?", expected: true },
    { input: "Can you summarize my recent appointments?", expected: false },
    { input: "Who is the owner of this workflow?", expected: false },
    { input: "Navigate me to the Command Center.", expected: false },
  ];

  for (const c of cases) {
    const result = guardMadhuRequest(c.input);
    assert.strictEqual(
      result.blocked, 
      c.expected, 
      `Expected ${c.expected} for input: "${c.input}"`
    );
  }
});
