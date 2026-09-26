const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/layout.tsx', 'utf8');

// Insert manifest into metadata if not exists
if (!text.includes('manifest: "/manifest.json"')) {
  text = text.replace(
    'export const metadata: Metadata = {',
    'export const metadata: Metadata = {\n  manifest: "/manifest.json",'
  );
}
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/layout.tsx', text, 'utf8');
console.log('DONE');