const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Skipping migration.");
    process.exit(1);
  }
  
  console.log("Connecting to Neon Database...");
  const sql = neon(connectionString);
  
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  
  console.log("Running schema migrations...");
  try {
    // Neon's tagged template literal doesn't easily support multiple statements in a single run like a raw string query.
    // So we'll split by ';' and execute them one by one.
    const statements = schemaSql.split(';').filter(stmt => stmt.trim().length > 0);
    for (const stmt of statements) {
      await sql(stmt);
    }
    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
