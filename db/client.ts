/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import { neon } from "@neondatabase/serverless";
let client: ReturnType<typeof neon> | null = null;
export function sql() {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}
