/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { NextResponse } from "next/server";
import { sql } from "@/db/client";
export const runtime="nodejs";
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){try{const db=sql();const {id}=await params;const b=await request.json();const rows=await db`UPDATE inventory_items SET quantity=COALESCE(${b.quantity??null},quantity),reorder_level=COALESCE(${b.reorderLevel??null},reorder_level),updated_at=now() WHERE id=${id} RETURNING *`;const item=Array.isArray(rows)?rows[0]:null;return item?NextResponse.json({item,source:"neon"}):NextResponse.json({error:"Item not found"},{status:404})}catch(e){console.error("inventory_update_failed",e);return NextResponse.json({error:"Unable to update item"},{status:500})}}
