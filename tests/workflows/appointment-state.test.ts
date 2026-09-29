import test from "node:test";
import assert from "node:assert/strict";
import { canTransitionAppointment } from "../../lib/proof/workflows";

test("appointment state machine permits only forward transitions", () => {
  assert.equal(canTransitionAppointment("REQUESTED", "CONFIRMED"), true);
  assert.equal(canTransitionAppointment("scheduled", "arrived"), true);
  assert.equal(canTransitionAppointment("COMPLETED", "IN_PROGRESS"), false);
});
