import { createHash, randomUUID } from "node:crypto";

/** The immutable record used by HospitalX to prove how operational state changed. */
export type DomainEvent = {
  id: string;
  eventType: string;
  aggregateType: string;
  aggregateId: string;
  organizationId: string;
  facilityId?: string;
  actorId: string;
  actorRole: string;
  deviceId?: string;
  idempotencyKey: string;
  expectedVersion?: number;
  resultingVersion: number;
  occurredAt: string;
  source: "ONLINE" | "OFFLINE";
  correlationId: string;
  payload: unknown;
  previousHash?: string;
  hash: string;
};

type EventInput = Omit<DomainEvent, "id" | "occurredAt" | "previousHash" | "hash"> & {
  id?: string;
  occurredAt?: string;
};

/**
 * The database trigger and this verifier deliberately use the same compact
 * wire format. JSONB renders keys in lexical order and uses a space after its
 * separators, so this renderer mirrors PostgreSQL's JSONB text form.
 */
function postgresJsonb(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(postgresJsonb).join(", ")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}: ${postgresJsonb(record[key])}`).join(", ")}}`;
}

function hashField(value: unknown): string {
  if (value === undefined || value === null) return "-";
  return Buffer.from(String(value), "utf8").toString("hex");
}

/** Hash material for the organization-wide append-only chain. */
export function eventHashMaterial(event: Omit<DomainEvent, "hash">): string {
  const occurredAt = new Date(event.occurredAt).toISOString();
  return [
    event.previousHash,
    event.id,
    event.eventType,
    event.aggregateType,
    event.aggregateId,
    event.organizationId,
    event.facilityId,
    event.actorId,
    event.actorRole,
    event.deviceId,
    event.idempotencyKey,
    event.expectedVersion,
    event.resultingVersion,
    occurredAt,
    event.source,
    event.correlationId,
    postgresJsonb(event.payload),
  ].map(hashField).join("|");
}

export function eventHash(event: Omit<DomainEvent, "hash">): string {
  return createHash("sha256").update(eventHashMaterial(event)).digest("hex");
}

export function appendEvent(input: EventInput, previous?: DomainEvent): DomainEvent {
  const unsigned = {
    ...input,
    id: input.id ?? randomUUID(),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    previousHash: previous?.hash,
  };
  return { ...unsigned, hash: eventHash(unsigned) };
}

export function verifyEventChain(events: DomainEvent[]) {
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    const expectedPrevious = index === 0 ? undefined : events[index - 1].hash;
    if (event.previousHash !== expectedPrevious) return { valid: false, index, reason: "previous_hash_mismatch" as const };
    const { hash, ...unsigned } = event;
    if (eventHash(unsigned) !== hash) return { valid: false, index, reason: "event_hash_mismatch" as const };
  }
  return { valid: true, checked: events.length } as const;
}

export class CommandLedger {
  private readonly events: DomainEvent[] = [];
  private readonly responses = new Map<string, unknown>();

  execute<T>(input: EventInput, result: T): { result: T; replayed: boolean; event: DomainEvent } {
    const key = `${input.organizationId}:${input.idempotencyKey}`;
    const existing = this.responses.get(key);
    if (existing) return { result: existing as T, replayed: true, event: this.events.find((event) => `${event.organizationId}:${event.idempotencyKey}` === key)! };
    const event = appendEvent(input, this.events.at(-1));
    this.events.push(event);
    this.responses.set(key, result);
    return { result, replayed: false, event };
  }

  all(): DomainEvent[] { return [...this.events]; }
}
