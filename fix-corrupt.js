const fs = require('fs');
let c = fs.readFileSync('Docs/04-setup.md', 'utf8');
c = c.replace(/\( ym\)/g, '(`vym`)');
fs.writeFileSync('Docs/04-setup.md', c);
