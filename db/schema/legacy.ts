/*
 * Compatibility adapter for legacy callers.
 *
 * Schema creation belongs exclusively to Drizzle migrations. Callers retain
 * this function while they migrate to the canonical repositories.
 */
import { sql } from "@/db/client";

export async function ensurePatientSchedulingSchema() {
  return sql();
}
