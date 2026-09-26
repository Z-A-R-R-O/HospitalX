const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/ai/route.ts', 'utf8');
text = text.replace(/sk-or-v1-[a-zA-Z0-9]+/g, 'process.env.OPENROUTER_API_KEY');
// If the key was inside quotes, we need to fix it. e.g. "Bearer sk-or-v1-..." -> `Bearer ${process.env.OPENROUTER_API_KEY}`
text = text.replace(/"Bearer process\.env\.OPENROUTER_API_KEY"/g, '`Bearer ${process.env.OPENROUTER_API_KEY}`');
text = text.replace(/'Bearer process\.env\.OPENROUTER_API_KEY'/g, '`Bearer ${process.env.OPENROUTER_API_KEY}`');
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/ai/route.ts', text, 'utf8');
console.log("DONE");