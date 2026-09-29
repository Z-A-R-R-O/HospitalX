const fs = require('fs');
const path = require('path');
const OLD_HEADER = `/*
 * Copyright (c) 2026 Hospital-X Evolute Edition. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Hospital-X.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Hospital-X.
 */`;
const NEW_HEADER = `/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */`;
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      processDir(p);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js')) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('Copyright (c) 2026 Hospital-X Evolute Edition.')) {
        content = content.replace(OLD_HEADER, NEW_HEADER);
        fs.writeFileSync(p, content);
      }
    }
  }
}
['app', 'components', 'lib', 'db', 'hooks', 'types', 'scripts'].forEach(dir => {
  if (fs.existsSync(dir)) processDir(dir);
});
['hx.js', 'veyminore.js', 'add-copyrights.js', 'docs-fix.js', 'fix-audio.js', 'fix-audio2.js', 'fix-corrupt.js'].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('Copyright (c) 2026 Hospital-X Evolute Edition.')) {
            content = content.replace(OLD_HEADER, NEW_HEADER);
            fs.writeFileSync(file, content);
        }
    }
});
