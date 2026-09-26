const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', 'utf8');

// For the full chat interface
const oldFull = `{isSlowConnection && <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '48px', animation: 'fadeIn 0.3s ease' }}>Improve your connection to get faster reply</span>}`;
const newFull = `{isSlowConnection && <span className="slow-connection-warning" style={{ fontSize: '12px', marginLeft: '48px' }}>Improve your connection to get faster reply</span>}`;
text = text.replace(oldFull, newFull);

// For the widget interface
const oldWidget = `{isSlowConnection && <span style={{ fontSize: '11px', color: '#a855f7', paddingLeft: '8px', opacity: 0.8, animation: 'fadeIn 0.3s ease' }}>Improve your connection to get faster reply</span>}`;
const newWidget = `{isSlowConnection && <span className="slow-connection-warning" style={{ fontSize: '11px', paddingLeft: '8px' }}>Improve your connection to get faster reply</span>}`;
text = text.replace(oldWidget, newWidget);

fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', text, 'utf8');
console.log('DONE');