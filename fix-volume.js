const fs = require('fs');
const path = require('path');
const files = [
  'app/dashboard/page.tsx',
  'app/mobile/components.tsx',
  'components/interfrozt/WorkSection.tsx'
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let content = fs.readFileSync(f, 'utf8');
  // Replace .volume = 0.5 with Math.max(0, Math.min(1, 0.5))
  content = content.replace(
    /\(window as any\)\._tuturuAudio\.volume = ([\d.]+);/g,
    '(window as any)._tuturuAudio.volume = Math.max(0, Math.min(1, $1));'
  );
  fs.writeFileSync(f, content);
  console.log('Fixed:', f);
}
