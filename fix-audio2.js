const fs = require('fs');
const files = ['app/dashboard/page.tsx', 'app/mobile/components.tsx', 'components/interfrozt/WorkSection.tsx'];
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\(window as any\)\._tuturuAudio = new Audio\('\/tuturu\.mp3'\);\s*\(window as any\)\._tuturuAudio\.volume = 0\.35;\s*\(window as any\)\._tuturuAudio\.play\(\)\.catch\(\(e\)=>console\.error\('Audio play failed:',\s*e\)\);\s*\(window as any\)\._tuturuPlayed = true;/g, 
    "(window as any)._tuturuAudio = new Audio('/tuturu.mp3'); (window as any)._tuturuAudio.volume = 0.5; (window as any)._tuturuAudio.play().then(()=>console.log('Tuturu played!')).catch((e)=>console.error('Tuturu failed:', e)); (window as any)._tuturuPlayed = true;");
  fs.writeFileSync(f, content);
}
