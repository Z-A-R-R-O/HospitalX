const fs = require('fs');
const path = require('path');
const dir = 'Docs';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
for (const f of files) {
  let p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/HospitalX/g, 'Hospital-X');
  
  // Fix literal veyminore commands
  c = c.replace(/`veyminore`/g, '`vym`');
  c = c.replace(/\nveyminore\n/g, '\nvym\n');
  c = c.replace(/veyminore@/g, 'vym@');
  
  fs.writeFileSync(p, c);
}
