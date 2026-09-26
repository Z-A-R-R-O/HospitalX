const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/layout.tsx', 'utf8');

if (!text.includes('PWARegister')) {
  text = text.replace(
    'import "./globals.css";',
    'import "./globals.css";\nimport { PWARegister } from "./pwa-register";'
  );
  text = text.replace(
    '<body className={inter.className}>',
    '<body className={inter.className}>\n        <PWARegister />'
  );
}

fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/layout.tsx', text, 'utf8');
console.log('DONE');