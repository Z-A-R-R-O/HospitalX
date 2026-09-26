const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', 'utf8');

text = text.replace(
  "<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>",
  "<div className=\"full-chat-history\" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>"
);

fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', text, 'utf8');
console.log('DONE');