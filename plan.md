# HospitalX Product Plan

## 1. Product direction

HospitalX is a hospital operations platform with an offline health-worker workflow.
It connects community screening, patient records, referrals, appointments, and hospital operations.

The first focused product is an offline neurological screening and referral workflow.
It supports early review by a qualified professional. It does not diagnose a condition.

The product has one platform and three clients:

1. Responsive web app for hospital staff and administrators.
2. Desktop app for high-volume hospital operations.
3. Mobile app for health workers and field teams.

All clients use the same domain rules, API contracts, authorization rules, and audit records.

## 2. Current repository state

### 2.1 Runtime and dependencies

- Next.js 15 App Router application.
- React 19 and TypeScript with strict mode.
- Neon serverless PostgreSQL driver.
- Clerk integration that is optional in local demo mode.
- `idb` for browser-side IndexedDB storage.
- `uuid` for local identifiers.
- Lucide icons and a large custom CSS system.
- Commands currently include `dev`, `build`, and `start`.

### 2.2 Existing web product

The repository contains these main areas:

- Landing page and authentication pages.
- Dashboard and Command Center views.
- Patients and patient registration.
- Appointments and appointment creation.
- Doctors and nurses.
- Laboratory and radiology order creation.
- Pharmacy and inventory.
- Billing.
- Admissions and beds.
- Reports and audit history.
- Settings and demo controls.
- Health Worker workspace.

The web app is responsive. The Health Worker area uses a narrow mobile layout with bottom navigation.
There is no packaged desktop or mobile application yet.

### 2.3 Existing Health Worker product

The Health Worker area already contains:

- Patient registration.
- Screening launcher and screening session pages.
- Referral list and referral creation.
- Online and offline status display.
- Demo offline toggle.
- IndexedDB patient, screening, referral, and sync queue stores.
- Sync engine with retries and exponential backoff.
- Server sync route for patient, screening, and referral mutations.

### 2.4 Existing screening product

The screening library contains 15 questions in five categories:

- Orientation and memory.
- Speech and language.
- Motor function.
- Tremor and coordination.
- Daily impact.

The scoring engine is deterministic. It produces category scores, risk level, observations, limitations, confidence text, recommended action, and a clinical disclaimer.

The current score is a screening aid. It must not be presented as a diagnostic model or validated clinical instrument.

### 2.5 Existing server surface

The repository contains routes for:

- Health checks.
- Overview data.
- Patients.
- Appointments.
- Doctors and nurses.
- Beds and admissions.
- Orders.
- Billing.
- Inventory.
- Tasks.
- Audit events.
- Screenings.
- Referrals.
- Offline sync.
- Demo seed data.
- AI chat proxy.

The routes currently mix two modes:

- Neon-backed data.
- Local demo fallback data when `DATABASE_URL` is absent.

This is useful for a demo. It must be separated from production behavior before a pilot.

### 2.6 Existing database state

`db/schema.sql` defines starter tables for patients, appointments, beds, tasks, audit events, screenings, and referrals.

The code also creates tables during requests through `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE` statements.
Several routes use table columns that do not match the starter schema.
The next database task must replace this drift with versioned migrations and one canonical schema.

### 2.7 Verified current checks

- Dependencies are installed.
- `npm run build` passes.
- The development server runs on `http://localhost:3000`.
- The root page returns HTTP 200.
- The health endpoint returns database unavailable when `DATABASE_URL` is not configured.

The current repository is a prototype. It is not ready for a clinical pilot.

## 3. Product goals

### 3.1 Primary goal

Help a health worker complete an offline screening and referral workflow, then connect the referral to a hospital appointment and an accountable follow-up action.

### 3.2 Secondary goals

- Give hospitals one current operational view.
- Keep patient identity and referral state consistent across clients.
- Work during unreliable connectivity.
- Show clear data freshness and sync state.
- Require human review for clinical decisions.
- Support English and Hindi first, with Tamil-ready content architecture.

### 3.3 Explicit exclusions

Do not build these in the first product release:

- A full mental-health peer-support network.
- Autonomous diagnosis or treatment advice.
- A general-purpose AI doctor.
- Full PACS or advanced claims processing.
- A multi-country compliance layer.
- A separate frontend codebase for each client.

## 4. Users and client surfaces

### 4.1 Health worker mobile surface

The mobile surface supports:

- Worker sign-in.
- Patient search and registration.
- Offline screening.
- Voice and local-language prompts.
- Referral creation.
- Appointment lookup.
- Sync queue review.

### 4.2 Hospital web surface

The web surface supports:

- Command Center.
- Patient timeline.
- Doctor and nurse workspaces.
- Appointment and queue management.
- Screening review.
- Referral worklist.
- Orders, results, beds, billing, inventory, and audit.

### 4.3 Desktop surface

The desktop surface packages the same web experience for hospital workstations.
It adds:

- Keyboard shortcuts.
- Printer and scanner integration.
- Local cache.
- System notifications.
- Window management.
- Workstation lock.

Desktop packaging starts after the responsive web workflow is stable.

### 4.4 Patient surface

Patient access is a later release.
It may include appointments, care-stage updates, documents, bills, and consented notifications.
It is not part of the first screening release.

## 5. Target architecture

Use a modular monolith first.
Keep domain ownership clear inside the Next.js application.
Split services only after measured scale or deployment needs require it.

```text
Web browser
Desktop wrapper
Mobile wrapper
       |
Shared UI and client contracts
       |
Versioned HospitalX API
       |
Application commands and queries
       |
Domain modules and policy checks
       |
PostgreSQL + outbox + audit log
       |
Integration adapters
```

### 5.1 Domain modules

Create clear ownership for:

- Identity and access.
- Organization and facility.
- Patient identity.
- Encounters and clinical notes.
- Appointments and queue.
- Screening.
- Referrals.
- Orders and results.
- Beds and admissions.
- Billing.
- Tasks and notifications.
- Audit and observability.
- Offline sync.

Each module owns its validation, commands, state transitions, persistence, events, and tests.

### 5.2 Client strategy

Use the current Next.js app as the web source.
Add an installable PWA path for early mobile delivery.
Package the stable web client with Capacitor for Android access to the microphone, camera, storage, and notifications.
Package the hospital workstation client with Tauri after the web client has stable desktop behavior.

Do not duplicate domain logic in the wrappers.

## 6. Data and API plan

### 6.1 Canonical records

At minimum, define these records:

- Organization.
- Facility.
- User.
- Role and permission assignment.
- Patient.
- Patient identifier.
- Consent.
- Screening session.
- Screening response.
- Screening result.
- Referral.
- Appointment.
- Encounter.
- Order and result.
- Task.
- Audit entry.
- Sync mutation.

Every tenant-owned record must include `organization_id`.
Facility-bound records must include `facility_id`.

### 6.2 API rules

All mutations must support:

- Authentication.
- Organization and facility scope.
- Permission checks.
- Input validation.
- Idempotency keys.
- Expected record version where needed.
- Standard error responses.
- Correlation ID.
- Audit entry.

Use versioned API paths or documented version headers.
Publish an OpenAPI document for the first supported resource set.

### 6.3 Screening API

Support these operations:

- Create a screening session.
- Save screening responses.
- Complete a screening session.
- Read screening result.
- Create a referral from a screening.
- Assign a reviewer.
- Record review outcome.
- Link a referral to an appointment.

The server must recalculate or verify the screening result.
It must not trust a client-provided risk level without validation.

### 6.4 Sync API

The sync API must:

- Accept ordered mutation batches.
- Resolve patient dependencies before screening dependencies.
- Resolve screening dependencies before referral dependencies.
- Deduplicate by idempotency key.
- Return per-mutation status.
- Return server identifiers.
- Return conflict details.
- Support safe retry.
- Record rejected and failed mutations.

Do not run schema changes inside the sync request.

## 7. Database and migration plan

### Phase DB-1: Freeze the model

- Compare `db/schema.sql` with every SQL statement in the API routes.
- Remove duplicate table definitions.
- Select canonical column names.
- Select UUID and external identifier rules.
- Add organization and facility scope to every domain table.
- Define indexes and unique constraints.

### Phase DB-2: Add migrations

- Add a migration directory.
- Add a migration runner or documented Neon migration command.
- Move all DDL out of request handlers.
- Add foreign keys and check constraints.
- Add `version` and `updated_at` where conflict detection needs them.
- Add indexes for patient search, referrals, appointments, and sync lookup.

### Phase DB-3: Add event and audit storage

- Add an append-only audit table.
- Add an outbox table.
- Add event envelope fields.
- Add idempotency records.
- Add sync conflict records.

## 8. Security and clinical safety

Before pilot use, implement:

- Real Clerk authentication in deployed environments.
- Server-side organization and facility checks.
- Role and attribute authorization.
- MFA policy for privileged roles.
- Sensitive-read audit events.
- Secure session handling.
- Rate limiting.
- Secure file and audio handling.
- Data retention and deletion rules.
- Consent before voice recording.

Screening copy must always state:

- The tool does not diagnose.
- A qualified professional must review the result.
- Results can be affected by illness, medication, fatigue, pain, language, and environment.
- An urgent clinical concern requires the local emergency process.

The AI route must not provide unsupervised clinical advice.
It must use a server-side secret, strict input limits, audit records, and a clear assistive label.

## 9. Delivery phases

### Phase 0: Product and repository baseline

Deliver:

- This plan.
- Decision log.
- Route and schema inventory.
- Demo data policy.
- Environment variable documentation.
- Target client decision.

Exit criteria:

- Team agrees on the first vertical slice.
- No new feature starts outside the approved scope.

### Phase 1: Foundation cleanup

Deliver:

- Canonical migrations.
- Shared request context.
- Authorization boundary.
- Standard API errors.
- Server-side validation.
- Audit helper.
- Idempotency helper.
- Test setup.

Exit criteria:

- Core routes use one schema.
- Request handlers do not create tables.
- Unauthorized requests fail.
- Demo mode is explicit and cannot run in production.

### Phase 2: Patient and appointment vertical slice

Deliver:

- Search and duplicate-aware registration.
- Consent capture.
- Patient timeline.
- Appointment creation.
- Queue states.
- Appointment audit history.

Exit criteria:

- A staff user can register a patient, book an appointment, and see the timeline.
- Retry does not create duplicates.

### Phase 3: Offline Health Worker vertical slice

Deliver:

- IndexedDB schema versioning.
- Offline patient registration.
- Screening session persistence.
- Referral persistence.
- Ordered sync.
- Retry and failure states.
- Conflict review.

Exit criteria:

- The complete workflow works with the browser offline.
- Refresh does not lose local data.
- Reconnection syncs patient, screening, and referral in order.
- The user can inspect and retry a failed mutation.

### Phase 4: Screening and referral safety

Deliver:

- Question and translation registry.
- Screening consent.
- Timed task controls.
- Result verification on the server.
- Explainable category findings.
- Professional review state.
- Referral assignment.
- Appointment linkage.

Exit criteria:

- An incomplete screening cannot appear complete.
- The risk result includes findings and limitations.
- A referral requires a human review path.
- The UI does not claim diagnosis.

### Phase 5: Hospital Command Center

Deliver:

- Screening volume.
- Pending referrals.
- Referral urgency.
- Review ownership.
- Appointment conversion.
- Sync failures.
- Trend views with minimum necessary patient detail.

Exit criteria:

- Every card shows what happened, why it matters, who owns it, and freshness.
- Dashboard values come from persisted data.
- No card uses fabricated live values.

### Phase 6: Web product hardening

Deliver:

- Shared loading, empty, error, and permission states.
- Responsive mobile and desktop layouts.
- English and Hindi copy path.
- Tamil-ready content keys.
- Accessibility review.
- Keyboard navigation.
- Performance review.

Exit criteria:

- Health Worker works on a small phone viewport.
- Command Center works on laptop and wide screens.
- Critical warnings do not rely on color alone.

### Phase 7: Desktop application

Deliver:

- Tauri shell.
- Secure session storage.
- Auto-update strategy.
- Print and scanner integration.
- Keyboard shortcuts.
- Offline cache.
- Workstation lock.

Exit criteria:

- Desktop app starts independently.
- Staff can complete the approved workflows.
- Desktop and web show the same account data.

### Phase 8: Mobile application

Deliver:

- Capacitor Android shell.
- Microphone permission.
- Camera permission.
- Push notification path.
- Background sync where supported.
- Encrypted local storage plan.
- App release process.

Exit criteria:

- The app installs on a test Android device.
- Offline screening works after app restart.
- Permissions are explained before use.
- Failed sync is visible and recoverable.

### Phase 9: Pilot readiness

Deliver:

- Backup and restore test.
- Monitoring and alerting.
- Incident runbook.
- Data export.
- Security review.
- Failure-path tests.
- Pilot training guide.
- Support ownership.

Exit criteria:

- The team can restore data from backup.
- The team can identify and resolve a failed sync.
- The pilot workflow has a named owner at every approval step.

## 10. Hackathon cutline

If time is limited, build only this flow:

1. Health worker opens the mobile layout.
2. Worker enables demo offline mode.
3. Worker registers a patient.
4. Worker completes the screening.
5. App shows an explainable review recommendation.
6. Worker creates a referral.
7. Worker restores connectivity.
8. Sync completes in dependency order.
9. Administrator opens the Command Center.
10. Administrator assigns review and books an appointment.

The following are stretch features:

- Voice recording.
- Native mobile packaging.
- Desktop packaging.
- AI-generated summaries.
- Advanced trend charts.
- Additional languages.

The deterministic screening engine and offline sync must work before any AI feature.

## 11. Testing plan

### Unit tests

- Screening scoring and thresholds.
- Incomplete screening rules.
- Translation keys.
- Patient identifier normalization.
- Idempotency behavior.
- Sync dependency ordering.
- Conflict classification.
- Authorization policy decisions.

### API tests

- Request validation.
- Unauthorized access.
- Organization isolation.
- Facility isolation.
- Duplicate mutation retry.
- Screening completion.
- Referral creation.
- Sync success and failure.
- Audit event creation.

### Browser tests

- Patient registration.
- Offline screening.
- Referral creation.
- Reconnect and sync.
- Dashboard update.
- Appointment booking.
- Mobile viewport.
- Desktop viewport.

### Release checks

Run these checks before each release:

```text
npm install
npm run build
database migrations
unit tests
API tests
browser tests
offline restart test
backup restore test
```

## 12. Deployment plan

### Local development

- Copy `.env.example` to `.env.local`.
- Set `DATABASE_URL` for Neon.
- Set Clerk keys only when authentication is required.
- Set the AI provider key only for the assistive AI route.
- Run migrations.
- Run `npm run dev`.

### Preview

- Use a separate Neon branch.
- Use preview Clerk credentials.
- Use non-production data.
- Run migration and browser checks.
- Show database and sync health.

### Production pilot

- Use pooled Neon connection for application traffic.
- Use a direct connection for migrations and restore tasks.
- Store secrets outside source control.
- Enable backups and restore checks.
- Enable monitoring.
- Restrict demo endpoints.
- Record deployment version in audit metadata.

## 13. Immediate next tasks

Complete these tasks in order:

1. Add a route and schema inventory test.
2. Reconcile `db/schema.sql`, `lib/patient-scheduling.ts`, and all route SQL.
3. Add the first migration set.
4. Add a shared authorization and tenant-scope helper.
5. Add mutation idempotency to patient, screening, referral, and appointment writes.
6. Add screening and sync unit tests.
7. Add browser coverage for offline registration through referral sync.
8. Add production-safe environment and demo-mode checks.
9. Add a web manifest and installable PWA behavior.
10. Package the stable workflow for Android and desktop.

## 14. Definition of done

HospitalX is ready for the first real pilot when:

- Users and facilities are isolated server-side.
- Every sensitive mutation and read is auditable.
- Canonical migrations replace request-time DDL.
- Patient, screening, referral, and appointment records are durable.
- Offline writes are ordered, idempotent, retryable, and reviewable.
- Conflicts do not silently overwrite clinical data.
- Screening results are explainable and non-diagnostic.
- A qualified reviewer owns the referral decision.
- Web, desktop, and mobile clients use the same API contracts.
- Backup restore and failure recovery are tested.
- The complete health-worker-to-specialist workflow passes browser tests.
