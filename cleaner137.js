const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', 'utf8');

const oldContainer = `<div style={{ display: 'flex', height: 'calc(100vh - 110px)', gap: '20px', width: '100%', overflow: 'hidden', paddingBottom: '20px' }}>`;
const newContainer = `<div className="full-chat-layout" style={{ display: 'flex', height: 'calc(100vh - 110px)', gap: '20px', width: '100%', overflow: 'hidden', paddingBottom: '20px' }}>`;
text = text.replace(oldContainer, newContainer);

const oldSidebar = `<aside style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>`;
const newSidebar = `<aside className="full-chat-sidebar" style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>`;
text = text.replace(oldSidebar, newSidebar);

fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', text, 'utf8');
console.log('DONE');