/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { sql } from "@/db/client";
export type AuditEntry = {
  eventType: string;
  actor: string;
  subjectType: "patient" | "appointment";
  subjectId: string;
  organizationId: string;
  outcome: "accepted" | "rejected";
  reason?: string;
};
export async function writeAudit(entry: AuditEntry) {
  const db = sql();
  await db`INSERT INTO audit_events (event_type, actor, payload)
    VALUES (
      ${entry.eventType},
      ${entry.actor},
      ${JSON.stringify({
        subject: { type: entry.subjectType, id: entry.subjectId },
        organizationId: entry.organizationId,
        outcome: entry.outcome,
        reason: entry.reason ?? null,
      })}::jsonb
    )`;
}
