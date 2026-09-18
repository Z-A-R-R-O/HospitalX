import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
export const runtime = "nodejs";
export async function GET() { try { await sql()`SELECT 1`; return NextResponse.json({ ok: true, database: "connected" }); } catch { return NextResponse.json({ ok: false, database: "unavailable" }, { status: 503 }); } }
