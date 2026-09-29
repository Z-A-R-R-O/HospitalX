import { seedDemoTenant } from "../lib/demo/seed";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to seed the deterministic demo tenant.");

seedDemoTenant()
  .then((result) => console.log(`Seeded ${result.tenant}: ${result.heroPatient.name}; ${result.events} events; ${result.audits} audits.`))
  .catch((error) => { console.error(error); process.exitCode = 1; });
