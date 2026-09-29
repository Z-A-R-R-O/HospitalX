import { sql } from "@/db/client";
import { requirePermission, UnauthorizedError } from "@/lib/permissions";
import { OrganizationContext, requireOrganizationContext } from "@/lib/request-context";
import { assertExpectedVersion } from "@/lib/proof/workflows";

export class CommandError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string, public readonly details: Record<string, unknown> = {}) {
    super(message);
    this.name = "CommandError";
  }
}

export type CommandContext = {
  organization: OrganizationContext;
  idempotencyKey: string;
  correlationId: string;
  db: ReturnType<typeof sql>;
};

type VersionedRecord = { version: number };

type CommandDefinition<Input, Response> = {
  permission: Parameters<typeof requirePermission>[1];
  validate: (body: unknown) => Input;
  /** Load the protected record before a versioned mutation. */
  loadCurrent?: (context: CommandContext, input: Input) => Promise<VersionedRecord | null>;
  expectedVersion?: (input: Input) => number | undefined;
  /** A single SQL statement (normally a CTE) that updates projection, event, and audit together. */
  persist: (context: CommandContext, input: Input, current?: VersionedRecord) => Promise<Response | null>;
};

function bodyIdempotencyKey(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as Record<string, unknown>).idempotencyKey ?? (body as Record<string, unknown>).idempotency_key;
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 200) : undefined;
}

function responseFromEvent(row: unknown): unknown {
  const payload = (row as { payload?: unknown }).payload;
  const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
  if (!parsed || typeof parsed !== "object" || !("response" in parsed)) return undefined;
  return (parsed as { response: unknown }).response;
}

/**
 * The only entry point for HTTP write commands.  Domain events are also the
 * idempotency response ledger: a retry reads the original serialized response,
 * rather than re-running a projection mutation.
 */
export async function handleCommand<Input, Response>(request: Request, definition: CommandDefinition<Input, Response>): Promise<{ response: Response; replayed: boolean }> {
  const organization = await requireOrganizationContext();
  requirePermission(organization, definition.permission);

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    throw new CommandError(400, "INVALID_JSON", "Request body must be valid JSON.");
  }
  const input = definition.validate(rawBody);
  const headerKey = request.headers.get("Idempotency-Key")?.trim();
  const idempotencyKey = (headerKey || bodyIdempotencyKey(rawBody) || crypto.randomUUID()).slice(0, 200);
  const correlationId = request.headers.get("X-Correlation-Id")?.trim().slice(0, 200) || crypto.randomUUID();
  const context: CommandContext = { organization, idempotencyKey, correlationId, db: sql() };

  const previous = await context.db`
    SELECT payload FROM domain_events
    WHERE organization_id = ${organization.organizationId} AND idempotency_key = ${idempotencyKey}
    LIMIT 1
  `;
  if (Array.isArray(previous) && previous[0]) {
    const response = responseFromEvent(previous[0]);
    if (response !== undefined) return { response: response as Response, replayed: true };
    throw new CommandError(409, "IDEMPOTENCY_RESPONSE_MISSING", "The prior command response cannot be replayed safely.");
  }

  let current: VersionedRecord | undefined;
  if (definition.loadCurrent) {
    current = await definition.loadCurrent(context, input) ?? undefined;
    if (!current) throw new CommandError(404, "NOT_FOUND", "The requested record does not exist in this organization.");
    const expected = definition.expectedVersion?.(input);
    try {
      assertExpectedVersion(Number(current.version), expected);
    } catch {
      throw new CommandError(409, "CONFLICT", "No silent overwrite: refresh and resolve the newer server state.", { serverVersion: current.version, expectedVersion: expected });
    }
  }

  let response: Response | null;
  try {
    response = await definition.persist(context, input, current);
  } catch (error) {
    // The event-chain trigger turns a competing idempotency insert into a
    // rollback, so a projection can never be updated without its event.
    if ((error as { code?: string }).code !== "23505") throw error;
    response = null;
  }
  if (response) return { response, replayed: false };

  // A competing request may have won the idempotency key after the initial lookup.
  const replay = await context.db`
    SELECT payload FROM domain_events
    WHERE organization_id = ${organization.organizationId} AND idempotency_key = ${idempotencyKey}
    LIMIT 1
  `;
  if (Array.isArray(replay) && replay[0]) {
    const saved = responseFromEvent(replay[0]);
    if (saved !== undefined) return { response: saved as Response, replayed: true };
  }
  throw new CommandError(409, "CONFLICT", "The record changed before this command could be applied.");
}

export function isAuthorizationError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError || (error as { name?: string }).name === "UnauthorizedError";
}
