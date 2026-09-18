import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = sql();
    await db`CREATE TABLE IF NOT EXISTS hospital_tasks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), text TEXT NOT NULL, severity TEXT NOT NULL DEFAULT 'attention', owner TEXT NOT NULL DEFAULT 'Operations', resolved_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await db`CREATE TABLE IF NOT EXISTS audit_events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_type TEXT NOT NULL, actor TEXT NOT NULL, payload JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    const tasks = await db`SELECT id, text, created_at FROM hospital_tasks WHERE resolved_at IS NULL ORDER BY created_at DESC LIMIT 20`;
    return NextResponse.json({ tasks, source: "neon" });
  } catch (error) {
    console.error("overview_read_failed", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
