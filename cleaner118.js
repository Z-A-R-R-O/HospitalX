const fs = require('fs');
let text = fs.readFileSync('e:/Arunez Zarro/HospitalX/app/settings/page.tsx', 'utf8');

const oldSignOut = `  const handleSignOut = () => {
    const clerk = (window as any).Clerk;
    if (clerk) {
      clerk.signOut(() => router.push("/sign-in"));
    } else {
      showToast("Signed out (Demo Mode)");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  };`;

const newSignOut = `  const handleSignOut = () => {
    const clerk = (window as any).Clerk;
    if (clerk && clerk.user) {
      clerk.signOut(() => router.push("/"));
    } else {
      showToast("Signed out successfully.");
      setTimeout(() => router.push("/"), 800);
    }
  };`;

text = text.replace(oldSignOut, newSignOut);
fs.writeFileSync('e:/Arunez Zarro/HospitalX/app/settings/page.tsx', text, 'utf8');
console.log('DONE');