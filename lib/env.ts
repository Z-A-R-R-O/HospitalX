/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDemoMode: !process.env.DATABASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  openRouterKey: process.env.OPENROUTER_API_KEY,
  
  requireDb: () => {
    if (!process.env.DATABASE_URL) {
      throw new Error("CRITICAL: DATABASE_URL is missing in production environment");
    }
    return process.env.DATABASE_URL;
  }
};
