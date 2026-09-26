const fs = require('fs');

const apis = [
  'e:/Arunez Zarro/HospitalX/app/api/patients/route.ts',
  'e:/Arunez Zarro/HospitalX/app/api/appointments/route.ts',
  'e:/Arunez Zarro/HospitalX/app/api/doctors/route.ts',
  'e:/Arunez Zarro/HospitalX/app/api/nurses/route.ts'
];

for (const p of apis) {
  let text = fs.readFileSync(p, 'utf8');
  text = text.replace(/getOrganizationContext/g, 'requireOrganizationContext');
  text = text.replace(/const context = await requireOrganizationContext\(\);\n  if \(\!context\.userId\) return NextResponse\.json\(\{ error\: \"Unauthorized\" \}\, \{ status\: 401 \}\);/g, 'const context = await requireOrganizationContext();');
  fs.writeFileSync(p, text, 'utf8');
}
console.log('DONE');