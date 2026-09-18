# Delivery Plan

## Build order

1. Establish tenant model, identity, authorization, audit framework, core event
   envelope, outbox, observability, and deployment/backup baseline.
2. Build patient identity, appointments, queue, and patient timeline.
3. Build encounter documentation, orders, prescription, and lab worklist/result
   flow.
4. Build charge capture, invoicing, payment, admissions, beds, and discharge
   blockers.
5. Pilot the complete operational loop at one facility, measure real work, fix
   safety and reliability gaps, then add V1 workspaces and workflows.

## Pilot discovery checklist

- Map actual patient, sample, medicine, payment, admission, and discharge flows.
- Identify current identifiers, duplicate-patient patterns, payer/package rules,
  roles, shift coverage, approval boundaries, and downtime procedures.
- Agree data migration scope, data owner, retention expectations, support model,
  training plan, success baselines, and incident contacts.
- Validate integration dependencies and sandbox access before promising dates.

## Engineering definition of done

A feature is done only when it has domain ownership, authorization checks,
validation, events, audit records, operational metrics/logging, tests for normal
and failure paths, accessible UI states, copy/localization readiness, API or
contract documentation, and an explicit rollback/support path.

## Decision log seeds

The team must resolve these early and record the decision with owner/date:

1. Pilot hospital profile and which workflow is the first wedge.
2. Tenant and facility data-isolation model.
3. Identity provider and MFA policy.
4. Clinical terminology, document, attachment, and data-retention strategy.
5. Offline target platforms and conflict-resolution UX.
6. Initial ABDM and messaging integration scope after current-spec validation.
7. Hosting, backup, recovery, and production-support ownership.

## Suggested repository next step

Turn this documentation into executable contracts: create the module boundaries,
OpenAPI skeleton, event-schema registry, authorization test matrix, and first
vertical-slice acceptance tests for registration → queue → consultation → lab →
billing.
