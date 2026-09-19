# Current Implementation Status

## Scope statement

HospitalX currently provides an early operational prototype and a responsive
Command Center shell. It is **not** ready for a clinical pilot or production
deployment. This page records the implementation state against the Zero-to-Release
documentation so roadmap intent is not mistaken for completed functionality.

## Implemented prototype coverage

- Responsive Command Center that constrains content on laptop, desktop, and
  ultrawide viewports while preserving a scrollable patient queue.
- Live overview reads for patients, appointments, bed occupancy/availability,
  and open operational tasks, with a visible source/freshness state.
- Patient registration and appointment creation forms backed by Neon.
- Basic laboratory/radiology orders, billing records, inventory records, and
  bed-admission endpoints.
- A read/write audit-events endpoint and a database schema starter.

## Alignment decisions

- The Command Center uses live values where a projection exists. It does not
  display seeded operational figures as live hospital state.
- The attention feed displays the available task owner rather than a fabricated
  elapsed-time label.
- Implemented sidebar destinations open their real workflows; unavailable
  workspaces remain clearly marked as pending modules.
- Responsive rules use fluid gutters, constrained content widths, flexible grid
  tracks, and breakpoints at 1800, 1200, 1040, 900, 640, and 380 pixels.

## Required work before a V0 pilot

The following requirements from the ZRO documents remain incomplete and must not
be treated as optional:

1. Authentication, role/attribute authorization, organization and facility
   enforcement on every request, MFA/session controls, and sensitive-read audit.
2. Canonical domain schemas and migrations; remove per-request `CREATE TABLE`
   statements and reconcile prototype table variants.
3. Command validation, idempotency keys, expected-version checks, event envelope,
   transactional outbox, projections, and durable audit records for every
   mutation.
4. Deterministic workflow state machines for appointments, orders, beds,
   discharges, and finance—including authorization and reason trails.
5. Patient duplicate matching, consent, allergies, timelines, clinical
   documentation, prescriptions, results, critical-result acknowledgement, and
   discharge blockers.
6. Append-only finance adjustments, payment/receipt/refund flows, and
   reconciliation.
7. Offline conflict handling, observability, backups/restore validation,
   OpenAPI contracts, automated failure-path tests, and support runbooks.

## Delivery guardrail

No clinical, financial, or AI-assisted action may be represented as authorized,
final, or safe until the applicable requirements above are implemented and tested.
AI remains assistive: it may summarize or prepare work, but cannot diagnose,
prescribe, sign, or bypass a required approval.
