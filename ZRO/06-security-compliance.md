# Security, Privacy, and Clinical Safety

## Security baseline

- Tenant and facility isolation is enforced server-side on every request.
- Use least-privilege roles plus contextual checks (assigned facility,
  department, care-team relationship, break-glass policy).
- Encrypt data in transit and at rest; manage keys separately from application
  secrets; rotate credentials and log privileged access.
- Use MFA for privileged roles, short-lived sessions, device/session management,
  rate limiting, secure uploads, backups, restore testing, and vulnerability
  management.
- Audit every sensitive read, export, mutation, impersonation, and break-glass
  access; make audit search available only to authorized roles.

## Privacy and consent

Collect the minimum data necessary for the active purpose. Keep consent,
communication preferences, retention, correction, export, and deletion/archival
policies configurable per applicable law and hospital policy. Do not reuse care
data for model training or secondary purposes without an explicit, documented
legal and consent basis.

## India-first integration posture

ABDM, payer, messaging, laboratory, and device integrations are adapters behind
a gateway. Before enabling any production integration, validate the current
applicable specifications, consent flows, certification/partner requirements,
data-locality expectations, and hospital legal policy. This documentation is an
engineering posture, not legal advice or a statement of compliance.

## Clinical-safety guardrails

- Never present generated content as a diagnosis, prescription, or final result.
- Label AI-generated summaries and suggestions, link their source data and
  freshness, and require human review for use in the clinical record.
- Prohibit automation from signing notes, prescribing, changing results, or
  completing a clinically required approval.
- Treat critical-value acknowledgement, allergy visibility, identity matching,
  and medication administration as high-risk workflows requiring dedicated
  safety review, test scenarios, and escalation paths.
