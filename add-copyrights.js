const fs = require('fs');
const path = require('path');
const HEADER = `/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */\n\n`;
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
      if (!content.startsWith('/*\n * Copyright')) {
        // If it has 'use client' or 'use server', insert after it.
        const lines = content.split('\n');
        let insertIndex = 0;
        if (lines[0] && (lines[0].includes('use client') || lines[0].includes('use server'))) {
          insertIndex = 1;
        }
        lines.splice(insertIndex, 0, HEADER);
        fs.writeFileSync(p, lines.join('\n'));
      }
    }
  }
}
// Only process our specific source directories to avoid touching build artifacts or node_modules
['app', 'components', 'lib', 'db', 'hooks', 'types', 'scripts'].forEach(dir => {
  if (fs.existsSync(dir)) processDir(dir);
});
// Also tag the root files
['hx.js', 'veyminore.js'].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.startsWith('/*\n * Copyright')) {
            fs.writeFileSync(file, HEADER + content);
        }
    }
});
