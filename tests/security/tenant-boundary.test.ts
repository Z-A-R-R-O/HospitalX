import test from "node:test";
import assert from "node:assert/strict";
import { assertPayloadOrganization } from "../../lib/security/tenant";

test("tenant selection comes from identity, not request payload", () => {
  const context = { userId: "user-a", organizationId: "org-a", role: "doctor" as const };
  assert.doesNotThrow(() => assertPayloadOrganization(context, "org-a"));
  assert.throws(() => assertPayloadOrganization(context, "org-b"), /Organization boundary violated/);
});
