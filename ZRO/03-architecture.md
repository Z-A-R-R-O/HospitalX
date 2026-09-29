# Architecture

## Logical layers

```text
Experience: role workspaces, patient link, command center
Application: commands, queries, policy checks, workflow orchestration
Domain: patients, encounters, orders, tasks, beds, billing, clinical records
Event and data: transactional store, outbox, event stream, projections, search
Foundation: identity, audit, encryption, observability, integration adapters
```

Start as a modular monolith with a relational transactional database. Enforce
module boundaries in code and schemas, publish domain events through a reliable
outbox, and split services only after measured scale or deployment needs justify
it. This avoids distributed-system complexity before the domain is stable.

## Command and query model

- A **command** expresses an intent, is authenticated, authorized, validated,
  executed atomically, and yields events.
- An **event** is an immutable statement that a meaningful fact occurred.
- A **projection** provides a read-optimized view such as a patient timeline,
  ward task board, queue, or Command Center card.
- A **workflow** listens for events and creates tasks, notifications, or proposed
  actions according to versioned policy.

The transactional record is authoritative. Derived views can be rebuilt from
events and current domain records; they must never become the only source of a
care or billing fact.

## Core components

| Component | Responsibility |
| --- | --- |
| Identity and access | Authentication, organization/facility scoping, role and attribute policies |
| Domain modules | Own commands, state machines, records, and events for their bounded context |
| Workflow engine | Policy-driven subscriptions, task creation, escalation, approvals, retries |
| Notification service | In-app, SMS/WhatsApp/email adapters; delivery status; consent controls |
| Integration gateway | Versioned adapters for ABDM, labs, devices, payment providers, messaging |
| Search and intelligence | Permission-filtered search and explainable, non-authoritative suggestions |
| Audit and observability | Tamper-evident audit logs, traces, metrics, alerting, data-access reporting |

## Offline-resilient operation

Clients must treat local queued work as provisional until server acknowledgement.
Each write carries an idempotency key, local timestamp, user/device identity, and
expected record version when applicable. On reconnect, sync in dependency order,
deduplicate idempotently, and present conflicts for resolution rather than
silently overwriting clinically relevant data. Read-only cached patient context
must have an obvious freshness indicator.

## Reliability targets

- no duplicate financial or care action after retry;
- auditable handling of rejected or conflicting offline writes;
- graceful read-only access to appropriately cached records during an outage;
- backups, restore tests, monitoring, and incident runbooks before pilot;
- explicit source and freshness on Command Center and AI-derived views.
