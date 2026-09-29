/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { requireOrganizationContext } from "@/lib/request-context";
import { requirePermission } from "@/lib/permissions";
import { getNurses, createNurse } from "@/lib/nurses";
export const runtime = "nodejs";
export async function GET() {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'staff:read');
    
    const nurses = await getNurses(context.organizationId);
    return NextResponse.json({ nurses });
  } catch (error: any) {
    console.error("nurses_read_failed", error);
    
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
export async function POST(request: Request) {
  const context = await requireOrganizationContext();
  
  try {
    requirePermission(context, 'staff:write');
    
    const body = await request.json();
    const nurse = await createNurse(context.organizationId, body);
    
    return NextResponse.json({ nurse }, { status: 201 });
  } catch (error: any) {
    console.error("nurse_create_failed", error);
    
    if (error.name === "UnauthorizedError") {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message === "Name and Role required") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Unable to create nurse" }, { status: 500 });
  }
}
