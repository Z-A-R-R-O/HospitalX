import test from "node:test";
import assert from "node:assert/strict";
import { appendEvent, CommandLedger, verifyEventChain } from "../../lib/proof/engine";
import { assertExpectedVersion, canTransitionAppointment } from "../../lib/proof/workflows";
import { guardMadhuRequest } from "../../lib/ai/guardrails";
import { assertPayloadOrganization } from "../../lib/security/tenant";

const input = { eventType: "PATIENT_REGISTERED", aggregateType: "patient", aggregateId: "HX-1", organizationId: "ORG-A", actorId: "user-1", actorRole: "receptionist", idempotencyKey: "request-1", resultingVersion: 1, source: "ONLINE" as const, correlationId: "journey-1", payload: { name: "Ananya" }, occurredAt: "2026-09-30T08:42:00.000Z" };

test("event history is tamper-evident", () => {
  const first = appendEvent(input);
  const second = appendEvent({ ...input, eventType: "TRIAGE_COMPLETED", idempotencyKey: "request-2", resultingVersion: 2 }, first);
  assert.deepEqual(verifyEventChain([first, second]), { valid: true, checked: 2 });
  assert.equal(verifyEventChain([{ ...first, payload: { name: "Changed" } }, second]).valid, false);
});

test("idempotency replays the original result within an organization", () => {
  const ledger = new CommandLedger();
  const first = ledger.execute(input, { patientId: "HX-1" });
  const retry = ledger.execute(input, { patientId: "HX-duplicate" });
  assert.equal(first.replayed, false);
  assert.equal(retry.replayed, true);
  assert.equal(retry.result.patientId, "HX-1");
  assert.equal(ledger.all().length, 1);
});

test("stale versions and illegal appointment transitions are blocked", () => {
  assert.equal(assertExpectedVersion(17, 17), 18);
  assert.throws(() => assertExpectedVersion(18, 17), /VERSION_CONFLICT/);
  assert.equal(canTransitionAppointment("CONFIRMED", "ARRIVED"), true);
  assert.equal(canTransitionAppointment("scheduled", "arrived"), true);
  assert.equal(canTransitionAppointment("COMPLETED", "IN_PROGRESS"), false);
});

test("Madhu blocks diagnostic and prescribing prompts", () => {
  assert.equal(guardMadhuRequest("Tell me what medicine this patient should take").blocked, true);
  assert.equal(guardMadhuRequest("Why is this appointment blocked?").blocked, false);
});

test("a request body cannot switch the signed-in organization", () => {
  const context = { userId: "user-a", organizationId: "ORG-A", role: "doctor" as const };
  assert.doesNotThrow(() => assertPayloadOrganization(context, undefined));
  assert.doesNotThrow(() => assertPayloadOrganization(context, "ORG-A"));
  assert.throws(() => assertPayloadOrganization(context, "ORG-B"), /Organization boundary violated/);
});
