const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/api/ai/route.ts', 'utf8');
text = text.replace(/const apiKey = "process.env.OPENROUTER_API_KEY";/g, 'const apiKey = process.env.OPENROUTER_API_KEY;');
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/api/ai/route.ts', text, 'utf8');
console.log("DONE");