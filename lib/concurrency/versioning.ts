import { NextResponse } from "next/server";

export type VersionedConflict = {
  error: "CONFLICT";
  message: string;
  expectedVersion: number;
  serverVersion: number;
};

/** Validates the version supplied by a client before a mutable write. */
export function expectedVersion(body: unknown): number {
  const value = (body as Record<string, unknown> | null)?.expectedVersion ?? (body as Record<string, unknown> | null)?.baseVersion;
  const version = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(version) || version < 1) {
    throw new VersionInputError("expectedVersion (or baseVersion for offline replay) must be a positive integer.");
  }
  return version;
}

export class VersionInputError extends Error {
  constructor(message: string) { super(message); this.name = "VersionInputError"; }
}

export function versionConflict(expected: number, server: number) {
  const body: VersionedConflict = {
    error: "CONFLICT",
    message: "No silent overwrite: refresh and resolve the newer server state.",
    expectedVersion: expected,
    serverVersion: server,
  };
  return NextResponse.json(body, { status: 409 });
}
