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
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){try{const db=sql();const {id}=await params;const b=await request.json();const rows=await db`UPDATE clinical_orders SET status=COALESCE(${b.status??null},status),result=COALESCE(${b.result??null},result),completed_at=CASE WHEN ${b.status??""}='completed' THEN now() ELSE completed_at END WHERE id=${id} RETURNING *`;const order=Array.isArray(rows)?rows[0]:null;return order?NextResponse.json({order,source:"neon"}):NextResponse.json({error:"Order not found"},{status:404})}catch(e){console.error("order_update_failed",e);return NextResponse.json({error:"Unable to update order"},{status:500})}}
