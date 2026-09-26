const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/lib/patient-scheduling.ts', 'utf8');

const oldFunc = /export async function ensurePatientSchedulingSchema\(\) \{[\s\S]*?return db;\n\}/;
const newFunc = `export async function ensurePatientSchedulingSchema() {\n  return sql();\n}`;

text = text.replace(oldFunc, newFunc);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/lib/patient-scheduling.ts', text, 'utf8');
console.log('DONE');