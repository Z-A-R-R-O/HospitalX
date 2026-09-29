# Scope and Roadmap

## V0: first deployable operational core

V0 supports one facility with OPD and basic admissions. It must deliver a
complete, auditable flow rather than partial modules.

| Capability | V0 outcome |
| --- | --- |
| Identity and tenancy | Organizations, facilities, users, roles, permission checks, sessions |
| Patient | Search, duplicate-aware registration, demographics, contacts, allergies, timeline |
| Appointment and queue | Provider schedule, walk-ins, token queue, arrival/late/no-show states |
| Consultation | Encounter note, diagnoses, prescriptions, orders, follow-up |
| Laboratory | Order intake, collection and result status, result entry/attachment, critical-result escalation |
| Billing | Charge capture, invoice, payment, receipt, refund/void authorization trail |
| Admission and beds | Admission, transfer, discharge request, bed occupancy and availability |
| Timeline and audit | Immutable meaningful-event timeline and searchable audit trail |

### Explicit V0 exclusions

Advanced claims, full inventory/procurement, radiology PACS, multi-location
consolidation, patient self-service portal, predictive intelligence, and
autonomous workflows are not V0 commitments. Integrate or model interfaces where
needed; do not build superficial versions.

## Later releases

| Release | Focus |
| --- | --- |
| V1 | Command Center, nursing workspace, notifications, pharmacy, patient link, workflow engine, operational analytics |
| V2 | Natural-language search, explainable operational summaries, action proposals, forecasts, briefing generation |
| V3 | Policy-governed administrative automation: routing, reminders, work creation, and approved execution |

## Success measures

Baseline each metric during pilot discovery and compare after rollout.

- median registration-to-queue creation time;
- median arrival-to-consultation wait and percentage of late appointments;
- turnaround time for laboratory orders and critical-result acknowledgement;
- time from discharge request to completed discharge, by blocker type;
- percentage of work items with an owner and due state;
- staff task-completion rate and user-reported workflow friction;
- uptime, sync success, and audit-event completeness.

## Release gate

V0 is ready for a pilot only when end-to-end OPD, lab, billing, and admission
flows have role-based authorization, deterministic state transitions, complete
audit records, recovery from interrupted sync, exports/backups, and operational
support runbooks.
