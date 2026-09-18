# HospitalX Zero-to-Release Documentation

HospitalX is a real-time operating system for hospital operations. It does not
attempt to be another collection of hospital-management screens: it maintains a
trusted operational state, identifies blockers, and coordinates the next action.

## Product promise

Every person should be able to open HospitalX and understand their next step:

- doctors understand the patient in context;
- nurses understand the ward and care tasks due now;
- administrators understand hospital flow and exceptions;
- patients understand where they are in their care journey.

## Documentation map

| Document | Purpose |
| --- | --- |
| [01-product-vision.md](01-product-vision.md) | Product thesis, users, principles, differentiation |
| [02-scope-and-roadmap.md](02-scope-and-roadmap.md) | Release scope, exclusions, milestones, success measures |
| [03-architecture.md](03-architecture.md) | System boundaries, components, reliability and offline strategy |
| [04-domain-and-events.md](04-domain-and-events.md) | Canonical domain model, event contract and lifecycle examples |
| [05-workflows.md](05-workflows.md) | High-value operational and clinical-adjacent workflows |
| [06-security-compliance.md](06-security-compliance.md) | Access, audit, privacy, safety and India-first compliance posture |
| [07-api-and-integrations.md](07-api-and-integrations.md) | API conventions and adapter boundaries |
| [08-ux-and-design.md](08-ux-and-design.md) | Experience principles and role workspaces |
| [09-delivery-plan.md](09-delivery-plan.md) | Build sequence, team decisions and definition of done |

## Terms

- **Organization**: a hospital group or independent hospital tenant.
- **Facility**: one physical hospital location within an organization.
- **Encounter**: a clinically and operationally bounded patient visit, admission,
  emergency episode, or remote consultation.
- **Operational graph**: the linked state of people, resources, work, policies,
  and events that enables HospitalX to understand current hospital operations.
- **Command Center**: the role-aware view of current state, risks, and approved
  actions. It is not a static reporting dashboard.

## Non-negotiables

1. API-first, modular, event-driven, and audit-first.
2. The system must remain useful during unreliable connectivity.
3. Clinical decisions remain with authorized humans. Automation coordinates work;
   it does not diagnose, prescribe, or silently take clinically material action.
4. The core must work without AI. AI can summarize, search, predict, and propose
   actions only on top of trusted data and explicit workflow policy.
