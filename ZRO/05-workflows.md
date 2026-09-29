# Workflows

## OPD visit

1. Receptionist finds or registers the patient and records required consent.
2. An appointment is scheduled or a walk-in queue entry is created.
3. Arrival marks the queue entry ready; the workspace shows current wait and
   late-state exceptions.
4. Doctor starts an encounter, reviews contextual history, signs the note, and
   creates prescriptions and orders.
5. Orders route to the relevant worklists. Charges are captured from configured
   rules but remain reviewable.
6. Billing issues an invoice and records payment. The patient receives only
   consented communications and documents.

## Laboratory and critical result

1. Authorized clinician places an order; lab accepts and identifies collection.
2. Collection records specimen identity, collector, time, and exceptions.
3. Result is finalized by authorized laboratory staff with reference ranges and
   source attachment where appropriate.
4. A configured critical threshold creates an escalation task for the responsible
   clinician or coverage role.
5. Notification delivery does not close the safety loop. Acknowledgement, action
   or override reason, and escalation timeout are separately recorded.

## Discharge coordination

1. Clinician requests discharge and the system computes policy-visible blockers.
2. Billing, pharmacy, nursing, and consultant tasks are assigned with owners and
   due times.
3. Command Center groups delays by blocker, patient, and owner—not merely counts.
4. When prerequisites are completed, an authorized user approves discharge;
   documents, final invoice steps, bed release, and patient communication follow
   explicit policy and events.

## Workflow-engine constraints

Workflows are declarative, versioned, testable policy. Every automated effect has
a triggering event, policy version, idempotency key, owner, retry policy, and
audit entry. A workflow may create work or propose an action; it cannot bypass
permissions, required approval, consent, or safety escalation rules.
