const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', 'utf8');

// 1. Add state variable
if (!text.includes('const [isSlowConnection, setIsSlowConnection] = useState(false);')) {
  text = text.replace(
    'const [isAiLoading, setIsAiLoading] = useState(false);',
    'const [isAiLoading, setIsAiLoading] = useState(false);\n  const [isSlowConnection, setIsSlowConnection] = useState(false);'
  );
}

// 2. Add setTimeout logic to submitToAi
const oldSubmitToAi = `    setIsAiLoading(true);

    let chatId = currentChatId;`;
    
const newSubmitToAi = `    setIsAiLoading(true);
    setIsSlowConnection(false);
    const slowTimer = setTimeout(() => {
      setIsSlowConnection(true);
    }, 5000);

    let chatId = currentChatId;`;
    
text = text.replace(oldSubmitToAi, newSubmitToAi);

const oldFinally = `    } finally {
      setIsAiLoading(false);
    }`;

const newFinally = `    } finally {
      setIsAiLoading(false);
      clearTimeout(slowTimer);
      setIsSlowConnection(false);
    }`;

text = text.replace(oldFinally, newFinally);

// 3. Add UI to floating widget loading bubble
const oldLoadingUIWidget = `{isAiLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'white', color: '#7c3aed', fontSize: '14px', border: '1px solid rgba(216,180,254,0.4)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(168,85,247,0.06)', fontWeight: 500 }}><Activity className="pulse" size={16} color="#7c3aed"/> Thinking...</div>
                </div>
              )}`;

const newLoadingUIWidget = `{isAiLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: 'white', color: '#7c3aed', fontSize: '14px', border: '1px solid rgba(216,180,254,0.4)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(168,85,247,0.06)', fontWeight: 500 }}><Activity className="pulse" size={16} color="#7c3aed"/> Thinking...</div>
                  {isSlowConnection && <span style={{ fontSize: '11px', color: '#a855f7', paddingLeft: '8px', opacity: 0.8, animation: 'fadeIn 0.3s ease' }}>Improve your connection to get faster reply</span>}
                </div>
              )}`;
              
text = text.replace(oldLoadingUIWidget, newLoadingUIWidget);

fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/dashboard/page.tsx', text, 'utf8');
console.log('DONE');