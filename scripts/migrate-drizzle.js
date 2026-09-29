/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { migrate } = require('drizzle-orm/neon-http/migrator');
async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  console.log('Running Drizzle migrations...');
  await migrate(db, { migrationsFolder: 'db/migrations' });
  console.log('Migrations complete!');
}
run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
