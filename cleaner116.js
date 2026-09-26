const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', 'utf8');

const oldLoadingUIFull = `{isAiLoading && (
                <div className="full-msg assistant loading">
                  <div className="msg-avatar"><Sparkles /></div>
                  <div className="msg-content"><Activity className="pulse" /></div>
                </div>
              )}`;

const newLoadingUIFull = `{isAiLoading && (
                <div className="full-msg assistant loading" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="msg-avatar"><Sparkles /></div>
                    <div className="msg-content" style={{ display: 'flex', alignItems: 'center', minHeight: '40px' }}><Activity className="pulse" /></div>
                  </div>
                  {isSlowConnection && <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: '48px', animation: 'fadeIn 0.3s ease' }}>Improve your connection to get faster reply</span>}
                </div>
              )}`;
              
text = text.replace(oldLoadingUIFull, newLoadingUIFull);

fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', text, 'utf8');
console.log('DONE');