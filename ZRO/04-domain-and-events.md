# Domain and Events

## Canonical entities

| Domain | Key entities |
| --- | --- |
| Organization | Organization, Facility, Department, User, Role, PermissionAssignment |
| Patient and care | Patient, Identifier, Allergy, Encounter, Appointment, QueueEntry, ClinicalNote, Prescription |
| Orders | Order, OrderItem, Specimen, Result, MedicationDispense, CriticalResultAcknowledgement |
| Capacity and work | Bed, BedAssignment, Task, Worklist, Escalation, Notification |
| Finance | Charge, Invoice, InvoiceLine, Payment, Refund, Payer/Package |
| Governance | AuditEntry, Consent, Attachment, PolicyVersion, Approval |

Every tenant-owned record includes `organization_id`; facility-bound records also
include `facility_id`. Patient matching must preserve source identifiers and
merge history—never silently overwrite one person with another.

## Event envelope

All published events use a versioned envelope:

```json
{
  "event_id": "uuid",
  "event_type": "lab.result.finalized.v1",
  "occurred_at": "2026-09-18T09:12:00Z",
  "organization_id": "org_…",
  "facility_id": "fac_…",
  "actor": {"type": "user", "id": "usr_…", "role": "lab_technician"},
  "subject": {"type": "order_item", "id": "orditem_…"},
  "correlation_id": "enc_…",
  "causation_id": "cmd_…",
  "schema_version": 1,
  "data": {}
}
```

Events must not contain unnecessary clinical data. Store references and retrieve
subject details through permission-checked APIs. Consumers must be idempotent by
`event_id` and tolerate delayed or repeated delivery.

## Event families

`patient.registered`, `appointment.scheduled`, `queue.entry.created`,
`encounter.started`, `consultation.signed`, `order.placed`,
`specimen.collected`, `lab.result.finalized`, `critical_result.flagged`,
`task.created`, `task.completed`, `bed.assigned`, `admission.created`,
`discharge.requested`, `invoice.issued`, `payment.recorded`, and
`approval.granted` are representative families. Each is versioned independently.

## State-machine rules

- An appointment is `scheduled → arrived → queued → in_consultation → completed`
  or `cancelled/no_show`; transitions retain actor and reason.
- An order item proceeds through `ordered → accepted → collected → in_progress →
  resulted/cancelled`; critical results require acknowledgement, not merely
  notification delivery.
- A bed assignment cannot overlap another active assignment for the same bed.
- A discharge is requested, has explicit blockers and approvers, then completes
  only when required policy conditions are satisfied.
- Finance mutations are append-only adjustments. Voids and refunds reference the
  original transaction and require configured authorization.

## Audit record

For every security- or care-relevant command, retain: who, what, when, facility,
source/device, target record, before/after representation or secure diff, reason,
authorization/approval, correlation ID, and outcome. Audit records are separate
from business events and should be tamper-evident and access-controlled.
