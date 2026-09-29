/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { sql } from "@/db/client";
export const runtime = "nodejs";
export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, mode: "demo", database: "not_configured" });
  }
  try {
    await sql()`SELECT 1`;
    return NextResponse.json({ ok: true, mode: "live", database: "connected" });
  } catch {
    return NextResponse.json({ ok: true, mode: "degraded", database: "unavailable" });
  }
}
