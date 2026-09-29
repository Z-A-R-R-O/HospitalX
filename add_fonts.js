const fs = require('fs');
let css = fs.readFileSync('app/font.css', 'utf8');
css = '@import url("https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&family=Bebas+Neue&display=swap");\n' + css;
fs.writeFileSync('app/font.css', css);
