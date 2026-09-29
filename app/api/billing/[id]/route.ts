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
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){try{const db=sql();const {id}=await params;const b=await request.json();const rows=await db`UPDATE billing_transactions SET status=COALESCE(${b.status??null},status),paid_at=CASE WHEN ${b.status??""}='paid' THEN now() ELSE paid_at END WHERE id=${id} RETURNING *`;const bill=Array.isArray(rows)?rows[0]:null;return bill?NextResponse.json({bill,source:"neon"}):NextResponse.json({error:"Bill not found"},{status:404})}catch(e){console.error("billing_update_failed",e);return NextResponse.json({error:"Unable to update bill"},{status:500})}}
