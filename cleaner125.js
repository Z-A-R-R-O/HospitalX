const fs = require('fs');

let schema = fs.readFileSync('e:/Arunez Zarro/HospitalX/db/schema.sql', 'utf8');
schema = schema.replace(
  'CREATE TABLE IF NOT EXISTS appointments (\n  id UUID',
  'CREATE TABLE IF NOT EXISTS appointments (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  idempotency_key TEXT UNIQUE,\n'
);
// Fix double id if it occurred
schema = schema.replace(/id UUID PRIMARY KEY DEFAULT gen_random_uuid\(\),\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid\(\),\n/, 'id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n');
fs.writeFileSync('e:/Arunez Zarro/HospitalX/db/schema.sql', schema, 'utf8');

let appt = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/appointments/route.ts', 'utf8');
const oldAppt = `const result = await db\`INSERT INTO appointments (organization_id, patient_id, full_name, provider_id, provider_name, appointment_type, starts_at, duration_minutes, status, priority) 
      VALUES (\${context.organizationId}, \${patientId}, \${fullName}, \${providerId}, \${providerName}, \${type}, \${startsAt}, \${duration}, 'scheduled', 'normal') 
      RETURNING *\`;`;
const newAppt = `const result = await db\`INSERT INTO appointments (idempotency_key, organization_id, patient_id, full_name, provider_id, provider_name, appointment_type, starts_at, duration_minutes, status, priority) 
      VALUES (\${idempotencyKey}, \${context.organizationId}, \${patientId}, \${fullName}, \${providerId}, \${providerName}, \${type}, \${startsAt}, \${duration}, 'scheduled', 'normal') 
      ON CONFLICT (idempotency_key) DO UPDATE SET status = EXCLUDED.status
      RETURNING *\`;`;
appt = appt.replace(oldAppt, newAppt);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/appointments/route.ts', appt, 'utf8');

console.log('DONE');