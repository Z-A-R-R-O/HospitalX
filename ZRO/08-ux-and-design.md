# Experience and Design

## Shared interaction rules

- Show identity, location, current status, owner, next action, and freshness on
  operationally important screens.
- Default to the role's active work, not an empty dashboard.
- Use keyboard-friendly, low-latency flows for high-frequency clinical work.
- Make warnings distinct by severity and action; never rely on color alone.
- Preserve context across an action and make destructive/irreversible actions
  clearly reviewable.
- Support English and Tamil content architecture from the start; do not bake UI
  copy, date formats, or communication templates into business logic.

## Workspace definitions

| Workspace | Default view |
| --- | --- |
| Command Center | Hospital health, capacity, exceptions, accountable action proposals |
| Doctor | Today’s list, patient snapshot, longitudinal timeline, note/orders/prescription |
| Nurse | Assigned patients, medication/task rounds, observations, handover, escalation |
| Reception | Search/register, arrivals, schedule, queue, payment handoff |
| Lab/pharmacy | Prioritized worklist, order status, exception queue, verification controls |
| Patient Link | Appointment, token/wait estimate, care stage, reports, prescriptions, bills |

## Command Center card standard

Each card answers: **what is happening, why it matters, who owns it, what action
is available, and how fresh is this view?** A card links to its source records;
it never makes an opaque recommendation.

## Visual direction

Use a calm, premium, minimal system with strong typography, generous contrast,
and purposeful density. Command Center may feel polished and spacious; patient,
nurse, and doctor workflows must prioritize quick scanning and error resistance
over glass effects or ornamental animation.
