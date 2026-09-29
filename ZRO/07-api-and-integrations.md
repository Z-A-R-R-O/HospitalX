# APIs and Integrations

## API conventions

Expose versioned HTTPS APIs with JSON request/response bodies, OAuth/OIDC-based
authentication, organization/facility scoping, cursor pagination, standardized
problem responses, and idempotency keys for every mutation that can be retried.

Example mutation headers:

```text
Authorization: Bearer <token>
Idempotency-Key: 9b5c…
X-Facility-Id: fac_123
If-Match: "record-version"
```

Commands return the canonical resource, its version, correlation ID, and a list
of accepted events. APIs never trust tenant, role, price, or authorization fields
supplied by a client.

## Initial resource surface

`/patients`, `/appointments`, `/queues`, `/encounters`, `/orders`, `/results`,
`/beds`, `/admissions`, `/discharges`, `/invoices`, `/payments`, `/tasks`,
`/notifications`, `/timeline`, `/audit`, and `/command-center` form the initial
resource families. Publish OpenAPI specifications alongside implementation.

## Integration gateway

Adapters translate external messages into validated internal commands/events.
They must isolate external identifiers, credentials, retries, schemas, outages,
and vendor-specific behavior from core domain modules.

| Adapter class | Examples | Required controls |
| --- | --- | --- |
| National-health | ABDM-related services | Current spec validation, consent, correlation, certification controls |
| Diagnostics/devices | LIS, analyzers, PACS | Patient/order matching, source traceability, replay protection |
| Financial | Payment provider, insurer | Idempotency, reconciliation, authorization, immutable adjustments |
| Communication | SMS, WhatsApp, email | Consent, templates, delivery status, PII minimization |

All inbound integrations go through authentication, schema validation,
deduplication, quarantine/error handling, and observable retries. No integration
may write directly to core tables.
