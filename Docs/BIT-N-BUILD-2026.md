# HospitalX at Bit N Build 2026

## The one-minute version

HospitalX keeps the operational thread of care intact when a patient moves between people, queues, and unreliable connections. It makes the next owner and next action visible—without asking a team to become archaeologists of their own hospital data.

The submission demonstrates a focused community-screening and referral journey, with tenant-aware server boundaries, offline queue semantics, audit-oriented events, and evidence surfaces for reviewers.

## Reviewer proof path

1. Open **Judge Mode** at `/judge` and reset the dedicated demo tenant.
2. Visit **Reliability Lab** at `/reliability` to run visible proof scenarios.
3. Open **Integrity Verifier** at `/verify` to inspect the persisted event chain.
4. Open **Command Center** at `/command` to see current state, ownership, freshness, and next actions.
5. Use the health-worker flow to observe offline, pending, syncing, conflict, failed, and stale states.

## What makes the build credible

| Capability | Evidence in the build |
| --- | --- |
| Tenant-aware operations | Request context and permission checks bind protected routes to the signed-in organization. |
| Safer writes | Command handlers centralize validation, idempotency, concurrency checks, events, and audit records. |
| Offline continuity | Queued mutations retain identity, base versions, dependencies, and visible resolution states. |
| Explainable operations | Command Center and timeline surfaces show source, freshness, owner, and next action. |
| AI boundaries | Madhu is assistive, permission-scoped, environment-configured, and blocked from diagnosis or prescribing. |
| Demonstrable reliability | Judge Mode, Reliability Lab, and Integrity Verifier use persisted proof rather than browser-only success claims. |

## Run locally

```bash
npm install
npm run migrate
npm run seed
npm run dev
```

For the local quality gate:

```bash
npm test
npx tsc --noEmit
npm run build
```

## Scope statement

HospitalX is submitted as an operational prototype, not a clinical decision system. It supports people doing accountable work; it does not diagnose, prescribe, or replace authorized clinical judgment. That boundary is deliberate—the demo should be impressive, but never imaginative about patient safety.

## CI database proof

The repository validates unit, security, workflow, and reliability behavior on every push. To run the live, database-backed Playwright proof in GitHub Actions, add a dedicated non-production `DATABASE_URL` repository secret. Use an isolated database or branch, never a production connection; the Reliability Lab deliberately resets its dedicated demo tenant.

## Documentation map

- [Developer guide](README.md) — setup, repository map, and quality gate
- [Product and release system](../ZRO/README.md) — vision, architecture, workflows, and release boundaries
- [Root README](../README.md) — product overview and entry points
