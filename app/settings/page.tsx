"use client";

import { useRouter } from "next/navigation";
import { Settings, Sun, Moon, LogOut, Activity, User, Bell, Users, ChevronLeft, ShieldCheck, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("My Profile");
  const [theme, setTheme] = useState("system");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [firstName, setFirstName] = useState("Arunez");
  const [lastName, setLastName] = useState("Zarro");
  const [email, setEmail] = useState("dr.zarro@hospitalx.com");
  const [imageUrl, setImageUrl] = useState("");
  const [isClerkLoaded, setIsClerkLoaded] = useState(false);
  
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [mascotVisible, setMascotVisibleState] = useState(true);

  // Notifications State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSms, setNotifSms] = useState(false);

  // Org State
  const [orgName, setOrgName] = useState("City Care Hospital");
  const [orgAddress, setOrgAddress] = useState("123 Healthcare Blvd, Medical District");

  // Security State
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    // Load local storage states
    setIsDemoMode(localStorage.getItem("demoMode") === "true");
    setMascotVisibleState(localStorage.getItem("mascotVisible") !== "false");
    setTheme(localStorage.getItem("theme") || "system");
    
    if (localStorage.getItem("firstName")) setFirstName(localStorage.getItem("firstName"));
    if (localStorage.getItem("lastName")) setLastName(localStorage.getItem("lastName"));
    
    if (localStorage.getItem("notifEmail") !== null) setNotifEmail(localStorage.getItem("notifEmail") === "true");
    if (localStorage.getItem("notifPush") !== null) setNotifPush(localStorage.getItem("notifPush") === "true");
    if (localStorage.getItem("notifSms") !== null) setNotifSms(localStorage.getItem("notifSms") === "true");
    
    if (localStorage.getItem("orgName")) setOrgName(localStorage.getItem("orgName"));
    if (localStorage.getItem("orgAddress")) setOrgAddress(localStorage.getItem("orgAddress"));
    if (localStorage.getItem("twoFactor") !== null) setTwoFactor(localStorage.getItem("twoFactor") === "true");

    const checkClerk = () => {
      const clerk = (window as any).Clerk;
      if (clerk && clerk.user) {
        setFirstName(clerk.user.firstName || "");
        setLastName(clerk.user.lastName || "");
        setEmail(clerk.user.primaryEmailAddress?.emailAddress || "");
        setImageUrl(clerk.user.imageUrl || "");
        setIsClerkLoaded(true);
      }
    };
    checkClerk();
    setTimeout(checkClerk, 500);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const clerk = (window as any).Clerk;
    if (clerk && clerk.user) {
      try {
        await clerk.user.update({ firstName, lastName });
      } catch (e) {
        showToast("Failed to update profile.");
        setIsSaving(false);
        return;
      }
    } else {
      // Local fallback
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      // Dispatch storage event manually for other tabs/components
      window.dispatchEvent(new Event("storage"));
    }
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile updated successfully!");
    }, 600);
  };

  const handleSaveNotifications = () => {
    setIsSaving(true);
    localStorage.setItem("notifEmail", notifEmail.toString());
    localStorage.setItem("notifPush", notifPush.toString());
    localStorage.setItem("notifSms", notifSms.toString());
    setTimeout(() => {
      setIsSaving(false);
      showToast("Notification preferences saved");
    }, 600);
  };

  const handleSaveOrg = () => {
    setIsSaving(true);
    localStorage.setItem("orgName", orgName);
    localStorage.setItem("orgAddress", orgAddress);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Organization details updated");
    }, 600);
  };

  const handleSaveSecurity = () => {
    setIsSaving(true);
    localStorage.setItem("twoFactor", twoFactor.toString());
    setTimeout(() => {
      setIsSaving(false);
      showToast("Security settings updated");
    }, 600);
  };

  const handleSaveTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleSignOut = () => {
    const clerk = (window as any).Clerk;
    if (clerk && clerk.user) {
      clerk.signOut(() => router.push("/"));
    } else {
      showToast("Signed out successfully.");
      setTimeout(() => router.push("/"), 800);
    }
  };

  const tabs = [
    { name: 'My Profile', icon: User },
    { name: 'Appearance & Theme', icon: Sun },
    { name: 'Notifications', icon: Bell },
    { name: 'Organization', icon: Users },
    { name: 'Security', icon: ShieldCheck },
    { name: 'Advanced', icon: Activity }
  ];

  return (
    <div className="app-shell" style={{ display: "block", overflowY: "auto", minHeight: "100vh", padding: "40px 0" }}>
      <div className="ambient" aria-hidden="true"><span /><span /><span /></div>
      
      <div className={"toast " + (toast ? "show" : "")} role="status" style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>{toast}</div>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: 'var(--ink)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '32px' }}>
          <ChevronLeft size={18}/> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px', fontSize: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}><Settings color="var(--blue)" size={32}/> System Settings</h1>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '15px' }}>Manage your personal preferences, security, and organization configurations.</p>
          </div>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          
          <nav style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
             {tabs.map(tab => (
               <button 
                 key={tab.name}
                 onClick={() => setActiveTab(tab.name)}
                 style={{ 
                   display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', 
                   background: activeTab === tab.name ? 'var(--c-glass-50)' : 'transparent',
                   border: 'none', textAlign: 'left', fontWeight: 600, fontSize: '14px',
                   color: activeTab === tab.name ? 'var(--blue)' : 'var(--ink)', cursor: 'pointer', transition: 'background 0.2s'
                 }}>
                 <tab.icon size={18} /> {tab.name}
               </button>
             ))}
          </nav>

          <div className="settings-panel glass" style={{ flex: 1, padding: '40px', borderRadius: '24px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
             {activeTab === "My Profile" ? (
               <>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--c-glass-60)' }}>
                   <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #334155, #0f172a)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, overflow: 'hidden', boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}>
                     {imageUrl ? <img src={imageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (firstName ? firstName[0] : "A") + (lastName ? lastName[0] : "Z")}
                   </div>
                   <div>
                     <h3 style={{ margin: '0 0 8px', fontSize: '24px', color: 'var(--ink)' }}>{firstName} {lastName}</h3>
                     <p style={{ margin: 0, color: 'var(--muted)', fontSize: '15px' }}>{email} • Administrator</p>
                   </div>
                   <button style={{ marginLeft: 'auto', background: 'var(--c-white)', border: '1px solid var(--c-glass-60)', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>Upload Photo</button>
                 </div>

                 <h4 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--ink)' }}>Personal Information</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Name</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', padding: '14px', borderRadius: '10px', color: 'var(--ink)', fontSize: '15px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Name</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={{ background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', padding: '14px', borderRadius: '10px', color: 'var(--ink)', fontSize: '15px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</label>
                      <input type="text" defaultValue="Administrator" disabled style={{ background: 'var(--c-dark-05)', border: '1px solid var(--c-glass-60)', padding: '14px', borderRadius: '10px', color: 'var(--muted)', fontSize: '15px', cursor: 'not-allowed' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timezone</label>
                      <input type="text" defaultValue="Asia/Kolkata (IST)" style={{ background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', padding: '14px', borderRadius: '10px', color: 'var(--ink)', fontSize: '15px' }} />
                    </div>
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                   <button onClick={() => { setFirstName(localStorage.getItem("firstName") || "Arunez"); setLastName(localStorage.getItem("lastName") || "Zarro"); }} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--c-white)', border: '1px solid var(--c-glass-60)', fontWeight: 600, color: 'var(--ink)', cursor: 'pointer' }}>Discard Changes</button>
                   <button onClick={handleSaveProfile} disabled={isSaving} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--blue)', border: 'none', fontWeight: 600, color: 'white', cursor: 'pointer' }}>{isSaving ? "Saving..." : "Save Preferences"}</button>
                 </div>
               </>
             ) : activeTab === "Appearance & Theme" ? (
               <>
                 <h4 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--ink)' }}>Theme Preferences</h4>
                 <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
                   <button onClick={() => handleSaveTheme('light')} style={{ flex: 1, padding: '24px', borderRadius: '16px', border: "2px solid " + (theme === 'light' ? 'var(--blue)' : 'transparent'), background: 'var(--c-white)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--ink)', cursor: 'pointer', position: 'relative' }}>
                     {theme === 'light' && <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--blue)' }}><Check size={16}/></div>}
                     <Sun size={28}/> <strong>Light Mode</strong>
                   </button>
                   <button onClick={() => handleSaveTheme('dark')} style={{ flex: 1, padding: '24px', borderRadius: '16px', border: "2px solid " + (theme === 'dark' ? 'var(--blue)' : 'transparent'), background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'white', cursor: 'pointer', position: 'relative' }}>
                     {theme === 'dark' && <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--blue)' }}><Check size={16}/></div>}
                     <Moon size={28}/> <strong>Dark Mode</strong>
                   </button>
                   <button onClick={() => handleSaveTheme('system')} style={{ flex: 1, padding: '24px', borderRadius: '16px', border: "2px solid " + (theme === 'system' ? 'var(--blue)' : 'var(--c-glass-60)'), background: 'var(--c-glass-50)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--ink)', cursor: 'pointer', position: 'relative' }}>
                     {theme === 'system' && <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--blue)' }}><Check size={16}/></div>}
                     <Activity size={28}/> <strong>System Auto</strong>
                   </button>
                 </div>
               </>
             ) : activeTab === "Notifications" ? (
               <>
                 <h4 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--ink)' }}>Notification Preferences</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--c-glass-50)', borderRadius: '12px', border: '1px solid var(--c-glass-60)', cursor: 'pointer' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px' }}>Email Summaries</strong>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Receive daily patient queue and billing summaries via email.</span>
                      </div>
                      <input type="checkbox" checked={notifEmail} onChange={e => setNotifEmail(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue)' }} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--c-glass-50)', borderRadius: '12px', border: '1px solid var(--c-glass-60)', cursor: 'pointer' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px' }}>Push Notifications</strong>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Get browser alerts for new appointments and AI Co-pilot messages.</span>
                      </div>
                      <input type="checkbox" checked={notifPush} onChange={e => setNotifPush(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue)' }} />
                    </label>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--c-glass-50)', borderRadius: '12px', border: '1px solid var(--c-glass-60)', cursor: 'pointer' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px' }}>Critical SMS Alerts</strong>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Get SMS texts when critical lab values or ICU emergencies trigger.</span>
                      </div>
                      <input type="checkbox" checked={notifSms} onChange={e => setNotifSms(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue)' }} />
                    </label>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                   <button onClick={handleSaveNotifications} disabled={isSaving} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--blue)', border: 'none', fontWeight: 600, color: 'white', cursor: 'pointer' }}>{isSaving ? "Saving..." : "Save Preferences"}</button>
                 </div>
               </>
             ) : activeTab === "Organization" ? (
               <>
                 <h4 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--ink)' }}>Organization Profile</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital Name</label>
                      <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} style={{ background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', padding: '14px', borderRadius: '10px', color: 'var(--ink)', fontSize: '15px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Address</label>
                      <input type="text" value={orgAddress} onChange={e => setOrgAddress(e.target.value)} style={{ background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', padding: '14px', borderRadius: '10px', color: 'var(--ink)', fontSize: '15px' }} />
                    </div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                   <button onClick={handleSaveOrg} disabled={isSaving} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--blue)', border: 'none', fontWeight: 600, color: 'white', cursor: 'pointer' }}>{isSaving ? "Saving..." : "Save Organization"}</button>
                 </div>
               </>
             ) : activeTab === "Security" ? (
               <>
                 <h4 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--ink)' }}>Security & Authentication</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--c-glass-50)', borderRadius: '12px', border: '1px solid var(--c-glass-60)' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px' }}>Password</strong>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Last changed 4 months ago</span>
                      </div>
                      <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--c-glass-60)', background: 'var(--c-white)', fontWeight: 600, cursor: 'pointer' }}>Change Password</button>
                    </div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--c-glass-50)', borderRadius: '12px', border: '1px solid var(--c-glass-60)', cursor: 'pointer' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px' }}>Two-Factor Authentication (2FA)</strong>
                        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Require an OTP code to login to the administrator account.</span>
                      </div>
                      <input type="checkbox" checked={twoFactor} onChange={e => setTwoFactor(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--blue)' }} />
                    </label>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                   <button onClick={handleSaveSecurity} disabled={isSaving} style={{ padding: '12px 24px', borderRadius: '10px', background: 'var(--blue)', border: 'none', fontWeight: 600, color: 'white', cursor: 'pointer' }}>{isSaving ? "Saving..." : "Save Security Details"}</button>
                 </div>
               </>
             ) : activeTab === "Advanced" ? (
               <>
                 <h4 style={{ margin: '0 0 20px', fontSize: '18px', color: 'var(--ink)' }}>Advanced System Settings</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', borderRadius: '16px' }}>
                     <div>
                       <strong style={{ fontSize: '16px', color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>Demonstration Mode</strong>
                       <span style={{ fontSize: '14px', color: 'var(--muted)', display: 'block', maxWidth: '400px', lineHeight: 1.4 }}>Bypass live database connections and load a full suite of mock data for testing and demonstrations.</span>
                     </div>
                     <button 
                       onClick={() => {
                         const next = !isDemoMode;
                         setIsDemoMode(next);
                         localStorage.setItem("demoMode", next.toString());
                         router.push("/dashboard");
                         setTimeout(() => window.location.reload(), 100);
                       }}
                       style={{ 
                         padding: '10px 24px', 
                         borderRadius: '99px', 
                         background: isDemoMode ? 'rgba(239, 68, 68, 0.1)' : 'var(--blue)', 
                         color: isDemoMode ? 'var(--red)' : 'white', 
                         border: 'none', 
                         fontWeight: 600, 
                         cursor: 'pointer' 
                       }}>
                       {isDemoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
                     </button>
                   </div>
                   
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', borderRadius: '16px' }}>
                     <div>
                       <strong style={{ fontSize: '16px', color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>Madhu (AI Nurse)</strong>
                       <span style={{ fontSize: '14px', color: 'var(--muted)', display: 'block', maxWidth: '400px', lineHeight: 1.4 }}>Show Madhu, your interactive AI nurse mascot. Click to chat, drag to reposition, right-click for options.</span>
                     </div>
                     <button 
                       onClick={() => {
                         const next = !mascotVisible;
                         setMascotVisibleState(next);
                         localStorage.setItem("mascotVisible", next.toString());
                         showToast("Madhu " + (next ? "enabled" : "disabled") + ". Refreshing...");
                         setTimeout(() => window.location.reload(), 1000);
                       }}
                       style={{ 
                         padding: '10px 24px', 
                         borderRadius: '99px', 
                         background: mascotVisible ? 'rgba(239, 68, 68, 0.1)' : 'var(--blue)', 
                         color: mascotVisible ? 'var(--red)' : 'white', 
                         border: 'none', 
                         fontWeight: 600, 
                         cursor: 'pointer' 
                       }}>
                       {mascotVisible ? "Hide Madhu" : "Show Madhu"}
                     </button>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--c-glass-50)', border: '1px solid var(--c-glass-60)', borderRadius: '16px' }}>
                     <div>
                       <strong style={{ fontSize: '16px', color: 'var(--ink)', display: 'block', marginBottom: '4px' }}>Clear Local Storage</strong>
                       <span style={{ fontSize: '14px', color: 'var(--muted)', display: 'block' }}>Reset all local preferences, theme states, and cached offline data.</span>
                     </div>
                     <button 
                       onClick={() => { localStorage.clear(); window.location.reload(); }}
                       style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--c-white)', border: '1px solid var(--c-glass-60)', color: 'var(--ink)', fontWeight: 600, cursor: 'pointer' }}>
                       Clear Data
                     </button>
                   </div>

                 </div>
               </>
             ) : null}
          </div>

        </div>
      </main>
    </div>
  );
}
