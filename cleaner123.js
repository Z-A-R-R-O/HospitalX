const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/patients/route.ts', 'utf8');
text = text.replace('ON CONFLICT (idempotency_key) DO UPDATE SET updated_at = NOW()', 'ON CONFLICT (idempotency_key) DO UPDATE SET full_name = EXCLUDED.full_name');
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/patients/route.ts', text, 'utf8');
console.log('DONE');