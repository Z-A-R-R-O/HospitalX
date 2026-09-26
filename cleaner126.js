const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/referrals/route.ts', 'utf8');

const oldPost = /const idempotencyKey = crypto\.randomUUID\(\);/;
const newPost = `const idempotencyKey = body.idempotency_key || body.idempotencyKey || crypto.randomUUID();`;
text = text.replace(oldPost, newPost);

const oldInsert = `    const res = (await db\`
      INSERT INTO referrals (
        idempotency_key, screening_id, patient_id, worker_id, organization_id,
        specialty, urgency, reason, worker_notes, status, appointment_id
      )
      VALUES (
        \${idempotencyKey}, \${screening_id || null}, \${patient_id}, \${worker_id}, \${organization_id},
        \${specialty}, \${urgency || 'routine'}, \${reason}, \${worker_notes || null},
        \${status || 'pending'}, \${appointmentId}
      )
      RETURNING *
    \`) as any[];`;

const newInsert = `    const res = (await db\`
      INSERT INTO referrals (
        idempotency_key, screening_id, patient_id, worker_id, organization_id,
        specialty, urgency, reason, worker_notes, status, appointment_id
      )
      VALUES (
        \${idempotencyKey}, \${screening_id || null}, \${patient_id}, \${worker_id}, \${organization_id},
        \${specialty}, \${urgency || 'routine'}, \${reason}, \${worker_notes || null},
        \${status || 'pending'}, \${appointmentId}
      )
      ON CONFLICT (idempotency_key) DO UPDATE SET status = EXCLUDED.status, worker_notes = EXCLUDED.worker_notes
      RETURNING *
    \`) as any[];`;

text = text.replace(oldInsert, newInsert);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/referrals/route.ts', text, 'utf8');
console.log('DONE');