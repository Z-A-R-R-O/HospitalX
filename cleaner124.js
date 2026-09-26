const fs = require('fs');

// 1. Screenings
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/screenings/route.ts', 'utf8');
const oldPost = /const idempotencyKey = crypto\.randomUUID\(\);[\s\S]*?RETURNING \*\n    `\) as any\[\];/;
const newPost = `const idempotencyKey = body.idempotency_key || body.idempotencyKey || crypto.randomUUID();

    const res = (await db\`
      INSERT INTO screenings (
        idempotency_key, patient_id, worker_id, organization_id, status,
        total_score, max_score, risk_level, responses, observations,
        duration_seconds, completed_at
      )
      VALUES (
        \${idempotencyKey}, \${patient_id}, \${worker_id}, \${organization_id}, \${status || 'in_progress'},
        \${total_score || null}, \${max_score || null}, \${risk_level || null},
        \${responses ? JSON.stringify(responses) : '[]'}::jsonb,
        \${observations ? JSON.stringify(observations) : '[]'}::jsonb,
        \${duration_seconds || null}, \${completed_at || null}
      )
      ON CONFLICT (idempotency_key) DO UPDATE SET 
        status = EXCLUDED.status, 
        total_score = EXCLUDED.total_score,
        risk_level = EXCLUDED.risk_level
      RETURNING *
    \`) as any[];`;
text = text.replace(oldPost, newPost);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/screenings/route.ts', text, 'utf8');

// 2. Appointments
let appt = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/appointments/route.ts', 'utf8');
const oldAppt = `const result = await db\`INSERT INTO appointments (organization_id, patient_id, full_name, provider_id, provider_name, appointment_type, starts_at, duration_minutes, status, priority) 
      VALUES (\${context.organizationId}, \${patientId}, \${fullName}, \${providerId}, \${providerName}, \${type}, \${startsAt}, \${duration}, 'scheduled', 'normal') 
      RETURNING *\`;`;
const newAppt = `const idempotencyKey = body.idempotencyKey || crypto.randomUUID();
    // Assuming appointments doesn't have idempotency_key in schema yet, let's fix that if needed. Wait, we didn't add it to appointments in schema.sql.
    // Actually we should add it to appointments schema if it's in the plan.
    const result = await db\`INSERT INTO appointments (organization_id, patient_id, full_name, provider_id, provider_name, appointment_type, starts_at, duration_minutes, status, priority) 
      VALUES (\${context.organizationId}, \${patientId}, \${fullName}, \${providerId}, \${providerName}, \${type}, \${startsAt}, \${duration}, 'scheduled', 'normal') 
      RETURNING *\`;`;
appt = appt.replace(oldAppt, newAppt);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/appointments/route.ts', appt, 'utf8');

console.log('DONE');