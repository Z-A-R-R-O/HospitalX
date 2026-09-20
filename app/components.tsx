import { Aperture, Disc, FileImage, UploadCloud, Eye, Brain, TestTube, Microscope, Printer, FileCheck, Syringe, ClipboardList, CheckSquare, AlertTriangle, MessageSquare, MapPin, Phone, Sparkles, CheckCircle2, Wrench, Activity, AlertCircle, ArrowRight, UserPlus, CalendarDays, Clock3, BedDouble, Stethoscope, HeartPulse, FlaskConical, ScanLine, Pill, ReceiptText, Boxes, FileText, Plus, Search, Filter, MoreHorizontal, Video } from "lucide-react";

export function AppointmentsView() {
  const appointments = [
    { id: "APT-001", time: "09:00 AM", duration: "30m", patient: "Ananya Rao", type: "In-Person", doctor: "Dr. Sharma", dept: "Cardiology", status: "Checked-in", tone: "blue" },
    { id: "APT-002", time: "09:30 AM", duration: "15m", patient: "Vikram Malhotra", type: "Telehealth", doctor: "Dr. Iyer", dept: "Neurology", status: "Waiting", tone: "orange" },
    { id: "APT-003", time: "10:00 AM", duration: "45m", patient: "Priya Singh", type: "In-Person", doctor: "Dr. Mehta", dept: "Orthopedics", status: "Scheduled", tone: "gray" },
    { id: "APT-004", time: "11:15 AM", duration: "30m", patient: "Ramesh Das", type: "In-Person", doctor: "Dr. Sharma", dept: "Cardiology", status: "In-Consult", tone: "green" },
  ];

  return (
    <section className="page-view appointments-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><CalendarDays /> Appointments & Scheduling</h2>
          <p>Manage upcoming visits, telehealth, and in-person consultations.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search patient or ID..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Book</button>
        </div>
      </header>

      <div className="appointments-layout" style={{ display: 'flex', gap: '20px', padding: '24px', height: 'calc(100% - 70px)' }}>
        <aside className="calendar-sidebar glass" style={{ width: '280px', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)' }}>
           <div className="mini-calendar">
             <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>September 2026</h3>
             <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
               {['S','M','T','W','T','F','S'].map((d,i) => <span key={i} style={{ color: 'var(--muted)' }}>{d}</span>)}
               {Array.from({length: 30}).map((_, i) => (
                 <span key={i} style={{ 
                   padding: '6px 0', borderRadius: '50%', cursor: 'pointer',
                   background: i+1 === 20 ? 'var(--blue)' : 'transparent', 
                   color: i+1 === 20 ? '#fff' : 'inherit',
                   border: [14, 21, 28].includes(i) ? '1px solid var(--red)' : '1px solid transparent'
                 }}>{i + 1}</span>
               ))}
             </div>
           </div>
           <div className="schedule-stats">
             <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--muted)' }}>Today's Overview</h4>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontWeight: 500 }}>
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue)' }}></span> 42 Total Appointments</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></span> 12 Waiting</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></span> 18 Completed</li>
             </ul>
           </div>
        </aside>

        <main className="timeline-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Sunday, Sep 20</h3>
            <div className="view-toggles" style={{ display: 'flex', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', padding: '4px' }}>
              <button style={{ padding: '4px 12px', borderRadius: '6px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: 'none', fontWeight: 600, fontSize: '12px', color: '#0f172a', cursor: 'pointer' }}>List</button>
              <button style={{ padding: '4px 12px', borderRadius: '6px', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Timeline</button>
            </div>
          </div>

          <div className="appointment-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
            {appointments.map(apt => (
              <div key={apt.id} className="apt-card glass" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.45)' }}>
                <div className="apt-time" style={{ width: '80px', flexShrink: 0 }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>{apt.time}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{apt.duration}</span>
                </div>
                <div className="apt-divider" style={{ width: '2px', height: '40px', background: 'rgba(15,23,42,0.1)', borderRadius: '2px' }} />
                <div className="apt-info" style={{ flex: 1 }}>
                  <div className="apt-patient" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px' }}>{apt.patient}</h4>
                    <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(15,23,42,0.05)', borderRadius: '4px', fontWeight: 600 }}>{apt.id}</span>
                    {apt.type === "Telehealth" && <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(139,92,246,0.1)', color: 'var(--purple)', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Video size={10}/> Telehealth</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {apt.doctor} ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {apt.dept}</p>
                </div>
                <div className="apt-status" style={{ width: '120px' }}>
                  <span className={`status ${apt.tone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}><i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {apt.status}</span>
                </div>
                <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                  <button className="row-action" style={{ background: '#fff' }}>Check In</button>
                  <button className="row-action" style={{ padding: '4px 6px' }}><MoreHorizontal size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}

export function OPDView() {
  const queue = [
    { id: "A-102", patient: "Sunita Verma", age: "45y", doctor: "Dr. Iyer", vitals: "BP: 120/80 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ HR: 72", status: "Triage", waitTime: "12m", priority: "normal" },
    { id: "A-103", patient: "Vikram Malhotra", age: "58y", doctor: "Dr. Iyer", vitals: "BP: 155/95 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ HR: 90", status: "Triage", waitTime: "4m", priority: "high" },
    { id: "B-041", patient: "Neha Gupta", age: "29y", doctor: "Dr. Sharma", vitals: "BP: 118/76 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ HR: 65", status: "Consultation", waitTime: "Room 4", priority: "normal" },
    { id: "C-019", patient: "Rohan Das", age: "12y", doctor: "Dr. Patel", vitals: "BP: 110/70 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ Temp: 101F", status: "Consultation", waitTime: "Room 2", priority: "high" },
    { id: "A-100", patient: "Priya Singh", age: "34y", doctor: "Dr. Iyer", vitals: "BP: 125/82 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ HR: 78", status: "Post-Consult", waitTime: "Pharmacy", priority: "normal" },
  ];

  const getCol = (status: string) => queue.filter(q => q.status === status);

  const renderCard = (apt: any) => (
    <div key={apt.id} className="opd-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', border: apt.priority === 'high' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.5)', position: 'relative', boxShadow: '0 4px 12px rgba(31,48,71,0.03)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{apt.id}</span>
           {apt.priority === 'high' && <AlertCircle size={16} color="var(--red)" />}
         </div>
         <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock3 size={12}/> {apt.waitTime}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
         <h4 style={{ margin: '0 0 2px', fontSize: '15px' }}>{apt.patient} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {apt.age}</span></h4>
         <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {apt.doctor}</p>
      </div>
      <div style={{ padding: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink)', fontWeight: 500 }}>
        <Activity size={14} color="var(--blue)" /> {apt.vitals}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button className="row-action" style={{ flex: 1, padding: '6px', fontSize: '12px', background: '#fff', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.8)', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>Move <ArrowRight size={14}/></button>
      </div>
    </div>
  );

  return (
    <section className="page-view opd-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Clock3 /> Outpatient Queue (OPD)</h2>
          <p>Live tracking of walk-in patients, triaging, and active consultations.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter Dept</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Issue Token</button>
        </div>
      </header>

      <div className="opd-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: "Walk-ins Today", value: "142", trend: "+12%" },
            { label: "Avg Wait Time", value: "14m", trend: "-2m" },
            { label: "Active Consults", value: "8", trend: "0%" },
            { label: "Pharmacy Queue", value: "12", trend: "+4%" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)' }}>
               <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>{kpi.value}</h3>
                 <span style={{ fontSize: '12px', fontWeight: 600, color: kpi.trend.startsWith('+') && kpi.label !== 'Walk-ins Today' ? 'var(--red)' : 'var(--green)' }}>{kpi.trend}</span>
               </div>
            </div>
          ))}
        </div>

        <div className="opd-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', flex: 1, overflow: 'hidden' }}>
          {[
            { title: "Triage & Vitals", status: "Triage", color: "var(--blue)" },
            { title: "In Consultation", status: "Consultation", color: "var(--orange)" },
            { title: "Post-Consult / Pharmacy", status: "Post-Consult", color: "var(--green)" }
          ].map(col => (
            <div key={col.title} className="kanban-col glass" style={{ display: 'flex', flexDirection: 'column', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)', overflowY: 'auto' }}>
               <h4 style={{ margin: '0 0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><i style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }}/> {col.title}</span>
                 <span className="badge" style={{ padding: '2px 8px', borderRadius: '12px', background: 'rgba(15,23,42,0.05)', fontSize: '12px' }}>{getCol(col.status).length}</span>
               </h4>
               <div className="kanban-cards" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {getCol(col.status).map(renderCard)}
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IPDView() {
  const wards = [
    {
      name: "Intensive Care Unit (ICU)",
      type: "critical",
      beds: [
        { id: "ICU-01", status: "Occupied", patient: "Ramesh Das", age: "62y", doctor: "Dr. Sharma", admitted: "2 Days ago", tone: "red" },
        { id: "ICU-02", status: "Occupied", patient: "Anita Roy", age: "41y", doctor: "Dr. Iyer", admitted: "5 Hrs ago", tone: "red" },
        { id: "ICU-03", status: "Available", tone: "green" },
        { id: "ICU-04", status: "Cleaning", tone: "orange" },
        { id: "ICU-05", status: "Available", tone: "green" },
      ]
    },
    {
      name: "General Ward A",
      type: "general",
      beds: [
        { id: "GEN-14", status: "Occupied", patient: "Kavita Nair", age: "28y", doctor: "Dr. Patel", admitted: "4 Days ago", tone: "blue" },
        { id: "GEN-15", status: "Occupied", patient: "Vikram Singh", age: "35y", doctor: "Dr. Mehta", admitted: "1 Day ago", tone: "blue" },
        { id: "GEN-16", status: "Available", tone: "green" },
        { id: "GEN-17", status: "Available", tone: "green" },
        { id: "GEN-18", status: "Maintenance", tone: "gray" },
        { id: "GEN-19", status: "Occupied", patient: "Priya Singh", age: "50y", doctor: "Dr. Iyer", admitted: "3 Days ago", tone: "blue" },
      ]
    }
  ];

  return (
    <section className="page-view ipd-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><BedDouble /> Inpatient & Bed Management (IPD)</h2>
          <p>Real-time occupancy, ward tracking, and patient admissions.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search bed or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Admit Patient</button>
        </div>
      </header>

      <div className="ipd-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        
        <div className="ipd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Total Beds", value: "200", trend: "" },
            { label: "Occupancy Rate", value: "84%", trend: "+2%" },
            { label: "Available Beds", value: "32", trend: "" },
            { label: "Pending Discharges", value: "14", trend: "-3" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)' }}>
               <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>{kpi.value}</h3>
                 {kpi.trend && <span style={{ fontSize: '12px', fontWeight: 600, color: kpi.trend.startsWith('+') ? 'var(--red)' : 'var(--green)' }}>{kpi.trend}</span>}
               </div>
            </div>
          ))}
        </div>

        <div className="wards-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {wards.map(ward => (
            <div key={ward.name} className="ward-section">
              <div className="ward-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(15,23,42,0.1)', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i style={{ width: '12px', height: '12px', borderRadius: '4px', background: ward.type === 'critical' ? 'var(--red)' : 'var(--blue)' }}></i> 
                  {ward.name}
                </h3>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>
                  {ward.beds.filter(b => b.status === 'Occupied').length} / {ward.beds.length} Occupied
                </span>
              </div>
              
              <div className="beds-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {ward.beds.map(bed => (
                  <div key={bed.id} className={`bed-card glass status-${bed.status.toLowerCase()}`} style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="bed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><BedDouble size={16}/> {bed.id}</h4>
                      <span className={`status ${bed.tone}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {bed.status}
                      </span>
                    </div>
                    
                    <div className="bed-divider" style={{ height: '1px', background: 'rgba(15,23,42,0.05)' }} />

                    {bed.status === 'Occupied' ? (
                      <div className="bed-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{bed.patient} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {bed.age}</span></p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {bed.doctor}</p>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock3 size={14}/> Admitted: {bed.admitted}</p>
                      </div>
                    ) : bed.status === 'Cleaning' ? (
                      <div className="bed-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0', gap: '8px', color: 'var(--orange)' }}>
                        <Sparkles size={24} />
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Housekeeping in progress</p>
                      </div>
                    ) : bed.status === 'Maintenance' ? (
                      <div className="bed-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0', gap: '8px', color: 'var(--muted)' }}>
                        <Wrench size={24} />
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Under Maintenance</p>
                      </div>
                    ) : (
                      <div className="bed-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '12px 0', gap: '8px', color: 'var(--green)' }}>
                        <CheckCircle2 size={24} />
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>Ready for Admission</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DoctorsView() {
  const doctors = [
    { id: "DOC-01", name: "Dr. Rajesh Sharma", spec: "Cardiology", role: "Chief Medical Officer", status: "In Surgery", location: "OT 2", shift: "08:00 AM - 04:00 PM", tone: "red" },
    { id: "DOC-02", name: "Dr. Priya Iyer", spec: "Neurology", role: "Senior Consultant", status: "Consulting", location: "OPD Room 4", shift: "09:00 AM - 05:00 PM", tone: "orange" },
    { id: "DOC-03", name: "Dr. Amit Mehta", spec: "Orthopedics", role: "Consultant", status: "Available", location: "Staff Room A", shift: "10:00 AM - 06:00 PM", tone: "green" },
    { id: "DOC-04", name: "Dr. Kavita Nair", spec: "Pediatrics", role: "Attending", status: "Rounding", location: "General Ward A", shift: "07:00 AM - 03:00 PM", tone: "blue" },
    { id: "DOC-05", name: "Dr. Suresh Patil", spec: "Emergency", role: "ER Physician", status: "Busy", location: "Triage", shift: "12:00 PM - 08:00 PM", tone: "red" },
    { id: "DOC-06", name: "Dr. Neha Gupta", spec: "Oncology", role: "Consultant", status: "Off Duty", location: "ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â", shift: "Off Today", tone: "gray" },
    { id: "DOC-07", name: "Dr. Anjali Desai", spec: "Cardiology", role: "Attending", status: "Consulting", location: "OPD Room 1", shift: "09:00 AM - 05:00 PM", tone: "orange" },
    { id: "DOC-08", name: "Dr. Vikram Singh", spec: "Anesthesiology", role: "Consultant", status: "In Surgery", location: "OT 2", shift: "08:00 AM - 04:00 PM", tone: "red" },
  ];

  const getInitials = (name: string) => {
    const parts = name.replace('Dr. ', '').split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  return (
    <section className="page-view doctors-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Stethoscope /> Doctor Roster & Directory</h2>
          <p>Live availability, current physical locations, and shift schedules.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search doctor or dept..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Add Staff</button>
        </div>
      </header>

      <div className="doctors-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Doctors on Shift", value: "42", trend: "" },
            { label: "In Surgery", value: "8", trend: "" },
            { label: "Consulting (OPD)", value: "18", trend: "" },
            { label: "Available / On Call", value: "16", trend: "" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)' }}>
               <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
               <h3 style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>{kpi.value}</h3>
            </div>
          ))}
        </div>

        <div className="doctors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {doctors.map(doc => (
            <div key={doc.id} className="doc-card glass" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, var(--${doc.tone}), transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '18px', flexShrink: 0, border: '2px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                   {getInitials(doc.name)}
                 </div>
                 <div style={{ flex: 1, minWidth: 0 }}>
                   <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</h3>
                   <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.spec} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ {doc.role}</p>
                 </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> Location</span>
                    <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{doc.location}</strong>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock3 size={14}/> Shift</span>
                    <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{doc.shift}</strong>
                 </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                 <span className={`status ${doc.tone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}><i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {doc.status}</span>
                 
                 <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="icon-btn" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.8)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', cursor: 'pointer', transition: 'transform 0.2s' }} aria-label="Message"><MessageSquare size={14}/></button>
                   <button className="icon-btn" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.8)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', cursor: 'pointer', transition: 'transform 0.2s' }} aria-label="Call"><Phone size={14}/></button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NursingView() {
  const nurses = [
    { id: "N-102", name: "Sister Mary", role: "Charge Nurse", ward: "Intensive Care (ICU)", shift: "Morning (07:00 - 15:00)", load: 4, tasks: { done: 12, pending: 3 }, tone: "blue", status: "Active" },
    { id: "N-105", name: "Jacob Thomas", role: "Staff Nurse", ward: "General Ward A", shift: "Morning (07:00 - 15:00)", load: 12, tasks: { done: 18, pending: 7 }, tone: "green", status: "Active" },
    { id: "N-108", name: "Anita Patel", role: "Staff Nurse", ward: "Emergency (ER)", shift: "Morning (07:00 - 15:00)", load: 8, tasks: { done: 22, pending: 1 }, tone: "orange", status: "Busy" },
    { id: "N-112", name: "Sarah Khan", role: "Trainee Nurse", ward: "Pediatrics", shift: "Morning (07:00 - 15:00)", load: 6, tasks: { done: 8, pending: 4 }, tone: "blue", status: "Active" },
    { id: "N-101", name: "Mercy John", role: "Head Nurse", ward: "Floor Supervisor", shift: "Morning (07:00 - 15:00)", load: 0, tasks: { done: 5, pending: 0 }, tone: "gray", status: "On Break" },
    { id: "N-115", name: "David Chen", role: "Staff Nurse", ward: "General Ward B", shift: "Morning (07:00 - 15:00)", load: 10, tasks: { done: 14, pending: 5 }, tone: "green", status: "Active" },
  ];

  const alerts = [
    { time: "Just now", type: "Urgent", msg: "Call Bell Ringing", loc: "ICU - Bed 02", tone: "red" },
    { time: "5m ago", type: "Task", msg: "Administer Medication (IV)", loc: "Gen A - Bed 14", tone: "orange" },
    { time: "12m ago", type: "Alert", msg: "IV Fluid < 10%", loc: "ER - Bed 04", tone: "red" },
    { time: "28m ago", type: "Task", msg: "Record Vitals", loc: "Gen A - Bed 15", tone: "blue" },
    { time: "45m ago", type: "Task", msg: "Post-Op Wound Check", loc: "Gen B - Bed 01", tone: "blue" },
    { time: "1h ago", type: "Handover", msg: "Night shift handover complete", loc: "Nursing Station", tone: "green" },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  return (
    <section className="page-view nursing-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><ClipboardList /> Nursing Station</h2>
          <p>Shift handovers, ward assignments, and live task tracking.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search nurse or ward..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Assign Shift</button>
        </div>
      </header>

      <div className="nursing-layout" style={{ display: 'flex', gap: '24px', padding: '24px', height: 'calc(100% - 70px)', overflow: 'hidden' }}>
        
        <div className="nurses-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flexShrink: 0 }}>
            {[
              { label: "Active Nurses", value: "34", trend: "" },
              { label: "Critical Alerts", value: "2", trend: "+1", isRed: true },
              { label: "Pending Tasks", value: "48", trend: "" }
            ].map(kpi => (
              <div key={kpi.label} className={`kpi-card glass ${kpi.isRed ? 'alert-card' : ''}`} style={{ padding: '16px', borderRadius: '12px', background: kpi.isRed ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.4)', border: kpi.isRed ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.5)' }}>
                 <p style={{ margin: 0, fontSize: '13px', color: kpi.isRed ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                   <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--ink)' }}>{kpi.value}</h3>
                   {kpi.trend && <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--red)' }}>{kpi.trend}</span>}
                 </div>
              </div>
            ))}
          </div>

          <div className="nurses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
            {nurses.map(nurse => {
              const totalTasks = nurse.tasks.done + nurse.tasks.pending;
              const pct = totalTasks === 0 ? 100 : (nurse.tasks.done / totalTasks) * 100;

              return (
                <div key={nurse.id} className="nurse-card glass" style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.5)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                       <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, var(--${nurse.tone}), transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>
                         {getInitials(nurse.name)}
                       </div>
                       <div>
                         <h3 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{nurse.name}</h3>
                         <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{nurse.role}</p>
                       </div>
                    </div>
                    <span className={`status ${nurse.status === 'Busy' ? 'red' : nurse.status === 'Active' ? 'green' : 'gray'}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {nurse.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> Ward</span>
                        <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{nurse.ward}</strong>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><BedDouble size={14}/> Load</span>
                        <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>{nurse.load} Patients</strong>
                     </div>
                  </div>

                  <div className="task-progress" style={{ marginTop: 'auto' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600, color: 'var(--muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckSquare size={14}/> Tasks Completed</span>
                        <span>{nurse.tasks.done} / {totalTasks}</span>
                     </div>
                     <div style={{ height: '6px', background: 'rgba(15,23,42,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: nurse.tasks.pending > 0 ? 'var(--blue)' : 'var(--green)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="alerts-sidebar glass" style={{ width: '320px', borderRadius: '16px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.5)', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(15,23,42,0.1)', background: 'rgba(255,255,255,0.5)' }}>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18}/> Live Feed & Alerts</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', flex: 1 }}>
             {alerts.map((alert, i) => (
                <div key={i} className="alert-item" style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                   {i !== alerts.length - 1 && <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '-24px', width: '2px', background: 'rgba(15,23,42,0.05)' }} />}
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `var(--${alert.tone})`, opacity: 0.1, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, top: 0, color: `var(--${alert.tone})` }}>
                      {alert.type === 'Urgent' ? <AlertTriangle size={16} /> : alert.type === 'Task' ? <Syringe size={16} /> : alert.type === 'Handover' ? <ClipboardList size={16} /> : <Bell size={16} />}
                   </div>
                   <div style={{ paddingTop: '6px' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{alert.msg}</p>
                      <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ background: 'rgba(15,23,42,0.05)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{alert.loc}</span>
                         <span>ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¢</span>
                         <span style={{ fontWeight: 500 }}>{alert.time}</span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        </aside>

      </div>
    </section>
  );
}

export function LaboratoryView() {
  const labTests = [
    { id: "LAB-8901", patient: "Ananya Rao", age: "32y", test: "Complete Blood Count (CBC)", category: "Hematology", priority: "Routine", status: "Processing", sample: "Collected", time: "09:15 AM", tone: "blue" },
    { id: "LAB-8902", patient: "Rajesh Kumar", age: "54y", test: "Lipid Profile", category: "Biochemistry", priority: "Routine", status: "Awaiting Sample", sample: "Pending", time: "09:45 AM", tone: "orange" },
    { id: "LAB-8903", patient: "Vikram Malhotra", age: "58y", test: "Troponin-I High Sensitivity", category: "Immunology", priority: "STAT", status: "Critical Value", sample: "Tested", time: "10:10 AM", tone: "red" },
    { id: "LAB-8904", patient: "Kavita Nair", age: "28y", test: "Thyroid Panel (T3, T4, TSH)", category: "Endocrinology", priority: "Routine", status: "Verified", sample: "Tested", time: "08:30 AM", tone: "green" },
    { id: "LAB-8905", patient: "Ramesh Das", age: "62y", test: "HbA1c & Fasting Glucose", category: "Pathology", priority: "Routine", status: "Processing", sample: "Collected", time: "11:00 AM", tone: "blue" },
    { id: "LAB-8906", patient: "Priya Singh", age: "50y", test: "Liver Function Test (LFT)", category: "Biochemistry", priority: "Routine", status: "Awaiting Sample", sample: "Pending", time: "11:30 AM", tone: "orange" },
    { id: "LAB-8907", patient: "Sunita Verma", age: "45y", test: "Coagulation Profile (PT/INR)", category: "Hematology", priority: "STAT", status: "Processing", sample: "Collected", time: "11:45 AM", tone: "blue" },
  ];

  return (
    <section className="page-view lab-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><FlaskConical /> Laboratory & Diagnostics</h2>
          <p>Process pathology requests, manage samples, and verify results.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search barcode or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> New Request</button>
        </div>
      </header>

      <div className="lab-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        
        <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Pending Samples", value: "24", trend: "" },
            { label: "In Processing", value: "86", trend: "" },
            { label: "Results Ready", value: "112", trend: "" },
            { label: "Critical Values", value: "3", trend: "URGENT", isRed: true }
          ].map(kpi => (
            <div key={kpi.label} className={`kpi-card glass ${kpi.isRed ? 'alert-card' : ''}`} style={{ padding: '16px', borderRadius: '12px', background: kpi.isRed ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.4)', border: kpi.isRed ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.5)' }}>
               <p style={{ margin: 0, fontSize: '13px', color: kpi.isRed ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--ink)' }}>{kpi.value}</h3>
                 {kpi.trend && <span style={{ fontSize: '12px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--green)' }}>{kpi.trend}</span>}
               </div>
            </div>
          ))}
        </div>

        <div className="lab-queue" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', padding: '0 24px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <div style={{ width: '100px' }}>Request</div>
            <div style={{ width: '220px' }}>Patient Details</div>
            <div style={{ flex: 1 }}>Test Description</div>
            <div style={{ width: '140px' }}>Status</div>
            <div style={{ width: '120px', textAlign: 'right' }}>Actions</div>
          </div>
          
          {labTests.map(test => (
             <div key={test.id} className="lab-card glass" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px', borderRadius: '16px', border: test.priority === 'STAT' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.6)', background: test.priority === 'STAT' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.5)' }}>
                
                <div style={{ width: '100px', flexShrink: 0 }}>
                  <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)' }}>{test.id}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{test.time}</span>
                </div>
                
                <div style={{ width: '2px', height: '40px', background: 'rgba(15,23,42,0.1)', borderRadius: '2px' }} />
                
                <div style={{ width: '200px', flexShrink: 0 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--ink)' }}>{test.patient} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ {test.age}</span></h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><TestTube size={14}/> {test.category}</p>
                </div>
                
                <div style={{ flex: 1 }}>
                   <strong style={{ display: 'block', fontSize: '14px', marginBottom: '6px', color: 'var(--ink)' }}>{test.test}</strong>
                   {test.priority === 'STAT' 
                      ? <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(239,68,68,0.1)', color: 'var(--red)', borderRadius: '6px', fontWeight: 700, letterSpacing: '0.5px' }}>STAT / URGENT</span>
                      : <span style={{ fontSize: '10px', padding: '2px 8px', background: 'rgba(15,23,42,0.05)', color: 'var(--muted)', borderRadius: '6px', fontWeight: 700, letterSpacing: '0.5px' }}>ROUTINE</span>
                   }
                </div>
                
                <div style={{ width: '140px', flexShrink: 0 }}>
                  <span className={`status ${test.tone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}><i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {test.status}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', width: '120px', justifyContent: 'flex-end', flexShrink: 0 }}>
                  {test.status === 'Awaiting Sample' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Printer size={14}/> Label</button>}
                  {test.status === 'Processing' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Microscope size={14}/> Results</button>}
                  {test.status === 'Verified' && <button className="row-action" style={{ background: 'var(--green)', color: '#fff', borderColor: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileCheck size={14}/> Report</button>}
                  {test.status === 'Critical Value' && <button className="row-action" style={{ background: 'var(--red)', color: '#fff', borderColor: 'var(--red)', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14}/> Alert Dr.</button>}
                </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RadiologyView() {
  const scans = [
    { id: "RAD-402", patient: "Sunita Verma", age: "45y", scan: "Chest X-Ray (PA View)", modality: "X-Ray", refDr: "Dr. Iyer", time: "09:30 AM", status: "Ready for Review", tone: "blue", icon: ScanLine },
    { id: "RAD-403", patient: "Kavita Nair", age: "28y", scan: "MRI Brain with Contrast", modality: "MRI", refDr: "Dr. Sharma", time: "10:15 AM", status: "In Progress", tone: "orange", icon: Brain },
    { id: "RAD-404", patient: "Ramesh Das", age: "62y", scan: "CT Abdomen & Pelvis", modality: "CT Scan", refDr: "Dr. Patel", time: "11:00 AM", status: "Scheduled", tone: "gray", icon: Disc },
    { id: "RAD-405", patient: "Vikram Singh", age: "35y", scan: "USG Whole Abdomen", modality: "Ultrasound", refDr: "Dr. Mehta", time: "08:45 AM", status: "Reported", tone: "green", icon: Activity },
    { id: "RAD-406", patient: "Ananya Rao", age: "32y", scan: "MRI Cervical Spine", modality: "MRI", refDr: "Dr. Iyer", time: "11:30 AM", status: "Scheduled", tone: "gray", icon: Aperture },
    { id: "RAD-407", patient: "David Chen", age: "41y", scan: "CT Thorax High Res", modality: "CT Scan", refDr: "Dr. Sharma", time: "12:15 PM", status: "Scheduled", tone: "gray", icon: Disc },
  ];

  return (
    <section className="page-view rad-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><ScanLine /> Radiology & Imaging</h2>
          <p>Manage X-Ray, MRI, CT Scans, and Ultrasound queues.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search scan ID or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Schedule Scan</button>
        </div>
      </header>

      <div className="rad-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        
        <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Scans Today", value: "48", trend: "" },
            { label: "MRI Queue", value: "6", trend: "30m wait" },
            { label: "CT Queue", value: "4", trend: "15m wait" },
            { label: "Pending Reports", value: "12", trend: "Dr. Zarro to review", isRed: true }
          ].map(kpi => (
            <div key={kpi.label} className={`kpi-card glass ${kpi.isRed ? 'alert-card' : ''}`} style={{ padding: '16px', borderRadius: '12px', background: kpi.isRed ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.4)', border: kpi.isRed ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.5)' }}>
               <p style={{ margin: 0, fontSize: '13px', color: kpi.isRed ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                 <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--ink)' }}>{kpi.value}</h3>
                 {kpi.trend && <span style={{ fontSize: '12px', fontWeight: 600, color: kpi.isRed ? 'var(--red)' : 'var(--muted)' }}>{kpi.trend}</span>}
               </div>
            </div>
          ))}
        </div>

        <div className="rad-queue" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
          {scans.map(scan => {
            const Icon = scan.icon;
            return (
               <div key={scan.id} className="rad-card glass" style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.5)' }}>
                  
                  <div className="modality-block" style={{ width: '80px', height: '80px', borderRadius: '12px', background: `rgba(var(--${scan.tone}-rgb, 15,23,42), 0.08)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: `var(--${scan.tone})`, flexShrink: 0 }}>
                    <Icon size={32} strokeWidth={1.5} />
                    <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{scan.modality}</span>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--ink)' }}>{scan.scan}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>{scan.patient} Ã¢â‚¬Â¢ {scan.age}</p>
                      </div>
                      <span className={`status ${scan.tone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '8px' }}>
                        <i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {scan.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>REF. DOCTOR</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Stethoscope size={12}/> {scan.refDr}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {scan.status === 'Scheduled' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={14}/> Start</button>}
                        {scan.status === 'In Progress' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><UploadCloud size={14}/> Upload DICOM</button>}
                        {scan.status === 'Ready for Review' && <button className="row-action" style={{ background: 'var(--blue)', color: '#fff', borderColor: 'var(--blue)', display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14}/> Review</button>}
                        {scan.status === 'Reported' && <button className="row-action" style={{ background: 'var(--green)', color: '#fff', borderColor: 'var(--green)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileImage size={14}/> Report</button>}
                      </div>
                    </div>
                  </div>
               </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PharmacyView() {
  const prescriptions = [
    { id: "RX-9921", patient: "Ananya Rao", age: "32y", doctor: "Dr. Sharma", items: ["Amoxicillin 500mg (15)", "Paracetamol 500mg (10)"], status: "Ready to Dispense", payment: "Cleared", time: "10:15 AM", tone: "green" },
    { id: "RX-9922", patient: "Ramesh Das", age: "62y", doctor: "Dr. Patel", items: ["Metformin 500mg (30)", "Atorvastatin 10mg (30)", "Aspirin 75mg (30)"], status: "Processing", payment: "Pending", time: "10:45 AM", tone: "orange" },
    { id: "RX-9923", patient: "Vikram Malhotra", age: "58y", doctor: "Dr. Iyer", items: ["Clopidogrel 75mg (15)"], status: "Awaiting Stock", payment: "Cleared", time: "11:10 AM", tone: "red" },
    { id: "RX-9924", patient: "Sunita Verma", age: "45y", doctor: "Dr. Sharma", items: ["Ibuprofen 400mg (10)", "Pantoprazole 40mg (10)"], status: "Dispensed", payment: "Cleared", time: "09:30 AM", tone: "blue" },
    { id: "RX-9925", patient: "David Chen", age: "41y", doctor: "Dr. Mehta", items: ["Omeprazole 20mg (14)"], status: "Processing", payment: "Pending", time: "11:45 AM", tone: "orange" },
  ];

  const lowStock = [
    { name: "Amoxicillin 500mg", current: "12 Strips", threshold: "20", tone: "red" },
    { name: "Pantoprazole 40mg", current: "18 Strips", threshold: "30", tone: "orange" },
    { name: "Insulin Glargine", current: "5 Vials", threshold: "15", tone: "red" },
    { name: "Azithromycin 250mg", current: "22 Strips", threshold: "25", tone: "orange" },
  ];

  return (
    <section className="page-view pharmacy-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Pill /> Pharmacy & Dispensary</h2>
          <p>Prescription fulfillment, point-of-sale, and stock alerts.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search RX or Patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><ShoppingCart size={18} /> OTC / POS Sale</button>
        </div>
      </header>

      <div className="pharmacy-layout" style={{ display: 'flex', gap: '24px', padding: '24px', height: 'calc(100% - 70px)', overflow: 'hidden' }}>
        
        <div className="rx-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          
          <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', flexShrink: 0 }}>
            {[
              { label: "Prescriptions Today", value: "128", trend: "" },
              { label: "Pending Dispense", value: "14", trend: "" },
              { label: "Low Stock Items", value: "8", trend: "Action Required", isRed: true }
            ].map(kpi => (
              <div key={kpi.label} className={`kpi-card glass ${kpi.isRed ? 'alert-card' : ''}`} style={{ padding: '16px', borderRadius: '12px', background: kpi.isRed ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.4)', border: kpi.isRed ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.5)' }}>
                 <p style={{ margin: 0, fontSize: '13px', color: kpi.isRed ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                   <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--ink)' }}>{kpi.value}</h3>
                   {kpi.trend && <span style={{ fontSize: '12px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--green)' }}>{kpi.trend}</span>}
                 </div>
              </div>
            ))}
          </div>

          <div className="rx-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
            {prescriptions.map(rx => (
               <div key={rx.id} className="rx-card glass" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '24px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.5)' }}>
                  
                  <div style={{ width: '100px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <strong style={{ display: 'block', fontSize: '16px', color: 'var(--ink)' }}>{rx.id}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{rx.time}</span>
                    <span className={`status ${rx.tone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '8px', marginTop: '8px' }}>
                      <i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {rx.status}
                    </span>
                  </div>
                  
                  <div style={{ width: '2px', alignSelf: 'stretch', background: 'rgba(15,23,42,0.1)', borderRadius: '2px' }} />
                  
                  <div style={{ width: '180px', flexShrink: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--ink)' }}>{rx.patient} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>â€¢ {rx.age}</span></h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {rx.doctor}</p>
                    
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: rx.payment === 'Cleared' ? 'var(--green)' : 'var(--orange)' }}>
                       {rx.payment === 'Cleared' ? <ShieldCheck size={14} /> : <CreditCard size={14} />}
                       Payment: {rx.payment}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                     <strong style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prescribed Items</strong>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {rx.items.map((item, i) => (
                           <span key={i} style={{ fontSize: '12px', padding: '4px 10px', background: 'rgba(15,23,42,0.05)', color: 'var(--ink)', borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Pill size={12} color="var(--blue)"/> {item}
                           </span>
                        ))}
                     </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px', justifyContent: 'center', flexShrink: 0 }}>
                    {rx.status === 'Ready to Dispense' && <button className="row-action" style={{ background: 'var(--green)', color: '#fff', borderColor: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}><PackageOpen size={14}/> Dispense</button>}
                    {rx.status === 'Processing' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}><ShoppingCart size={14}/> Invoice</button>}
                    {rx.status === 'Awaiting Stock' && <button className="row-action" style={{ background: '#fff', color: 'var(--red)', borderColor: 'rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>Order Stock</button>}
                    {rx.status === 'Dispensed' && <button className="row-action" style={{ background: 'transparent', color: 'var(--muted)', borderColor: 'rgba(15,23,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }} disabled>Completed</button>}
                  </div>
               </div>
            ))}
          </div>
        </div>

        <aside className="inventory-sidebar glass" style={{ width: '300px', borderRadius: '16px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.5)', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(15,23,42,0.1)', background: 'rgba(255,255,255,0.5)' }}>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}><PackageOpen size={18}/> Low Stock Alerts</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
             {lowStock.map((item, i) => (
                <div key={i} className="stock-alert-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', border: `1px solid var(--${item.tone})`, borderLeft: `4px solid var(--${item.tone})` }}>
                   <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--ink)' }}>{item.name}</h4>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
                      <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Stock: <strong style={{ color: `var(--${item.tone})` }}>{item.current}</strong></span>
                      <span style={{ color: 'var(--muted)', fontWeight: 600 }}>Min: {item.threshold}</span>
                   </div>
                   <button className="row-action" style={{ width: '100%', padding: '6px', background: '#fff', fontSize: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}><ShoppingCart size={14}/> Reorder Now</button>
                </div>
             ))}
          </div>
        </aside>

      </div>
    </section>
  );
}

export function BillingView() {
  const invoices = [
    { id: "INV-2901", patient: "Sunita Verma", type: "IPD Final Bill", amount: "₹ 45,200", status: "Pending Insurance", insurer: "Star Health", time: "10:30 AM", tone: "orange" },
    { id: "INV-2902", patient: "Rajesh Kumar", type: "Pharmacy & Labs", amount: "₹ 3,450", status: "Paid", insurer: "Cash", time: "11:15 AM", tone: "green" },
    { id: "INV-2903", patient: "Ananya Rao", type: "OPD Consultation", amount: "₹ 800", status: "Paid", insurer: "UPI", time: "09:45 AM", tone: "green" },
    { id: "INV-2904", patient: "Vikram Malhotra", type: "Surgery (Appendectomy)", amount: "₹ 85,000", status: "Overdue", insurer: "HDFC Ergo", time: "Yesterday", tone: "red" },
    { id: "INV-2905", patient: "Kavita Nair", type: "IPD Advance", amount: "₹ 20,000", status: "Draft", insurer: "Self Pay", time: "12:00 PM", tone: "gray" },
    { id: "INV-2906", patient: "David Chen", type: "Radiology Scan", amount: "₹ 6,500", status: "Paid", insurer: "Credit Card", time: "12:30 PM", tone: "green" },
  ];

  const claims = [
    { id: "CLM-812", provider: "Star Health", amount: "₹ 45,200", status: "In Review", tone: "blue" },
    { id: "CLM-810", provider: "HDFC Ergo", amount: "₹ 85,000", status: "Action Needed", tone: "red" },
    { id: "CLM-809", provider: "ICICI Lombard", amount: "₹ 12,500", status: "Approved", tone: "green" },
    { id: "CLM-805", provider: "Max Bupa", amount: "₹ 32,000", status: "Disbursed", tone: "gray" },
  ];

  return (
    <section className="page-view billing-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Receipt /> Billing & Insurance</h2>
          <p>Invoices, claims, and revenue cycle management.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.5)' }}>
            <Search size={16} /><input placeholder="Search invoice or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', cursor: 'pointer' }}><Plus size={18} /> Create Invoice</button>
        </div>
      </header>

      <div className="billing-layout" style={{ display: 'flex', gap: '24px', padding: '24px', height: 'calc(100% - 70px)', overflow: 'hidden' }}>
        
        <div className="billing-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          
          <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
            {[
              { label: "Today's Revenue", value: "₹ 1.42L", trend: "+12%", isRed: false },
              { label: "Pending Claims", value: "₹ 8.5L", trend: "14 Claims", isRed: false },
              { label: "Overdue Payments", value: "₹ 2.1L", trend: "Action Required", isRed: true },
              { label: "Cash Collections", value: "₹ 48K", trend: "34% of total", isRed: false }
            ].map(kpi => (
              <div key={kpi.label} className={`kpi-card glass ${kpi.isRed ? 'alert-card' : ''}`} style={{ padding: '16px', borderRadius: '12px', background: kpi.isRed ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.4)', border: kpi.isRed ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.5)' }}>
                 <p style={{ margin: 0, fontSize: '13px', color: kpi.isRed ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</p>
                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '4px' }}>
                   <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--ink)' }}>{kpi.value}</h3>
                   {kpi.trend && <span style={{ fontSize: '12px', fontWeight: 700, color: kpi.isRed ? 'var(--red)' : 'var(--green)' }}>{kpi.trend}</span>}
                 </div>
              </div>
            ))}
          </div>

          <div className="invoice-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
            <div style={{ display: 'flex', padding: '0 24px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div style={{ width: '120px' }}>Invoice</div>
              <div style={{ width: '220px' }}>Patient Details</div>
              <div style={{ flex: 1 }}>Amount & Payer</div>
              <div style={{ width: '160px' }}>Status</div>
              <div style={{ width: '120px', textAlign: 'right' }}>Actions</div>
            </div>
            
            {invoices.map(inv => (
               <div key={inv.id} className="invoice-card glass" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px', borderRadius: '16px', border: inv.status === 'Overdue' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.6)', background: inv.status === 'Overdue' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.5)' }}>
                  
                  <div style={{ width: '120px', flexShrink: 0 }}>
                    <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)' }}>{inv.id}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{inv.time}</span>
                  </div>
                  
                  <div style={{ width: '2px', height: '40px', background: 'rgba(15,23,42,0.1)', borderRadius: '2px' }} />
                  
                  <div style={{ width: '200px', flexShrink: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--ink)' }}>{inv.patient}</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Stethoscope size={12}/> {inv.type}</p>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                     <strong style={{ display: 'block', fontSize: '18px', marginBottom: '4px', color: 'var(--ink)', fontFamily: 'monospace' }}>{inv.amount}</strong>
                     <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(15,23,42,0.05)', color: 'var(--muted)', borderRadius: '6px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Wallet size={12}/> {inv.insurer}
                     </span>
                  </div>
                  
                  <div style={{ width: '160px', flexShrink: 0 }}>
                    <span className={`status ${inv.tone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '12px' }}><i style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}/> {inv.status}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', width: '120px', justifyContent: 'flex-end', flexShrink: 0 }}>
                    {inv.status === 'Draft' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Banknote size={14}/> Collect</button>}
                    {inv.status === 'Pending Insurance' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Landmark size={14}/> Claim</button>}
                    {inv.status === 'Paid' && <button className="row-action" style={{ background: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={14}/> Receipt</button>}
                    {inv.status === 'Overdue' && <button className="row-action" style={{ background: 'var(--red)', color: '#fff', borderColor: 'var(--red)', display: 'flex', alignItems: 'center', gap: '6px' }}><Send size={14}/> Remind</button>}
                  </div>
               </div>
            ))}
          </div>
        </div>

        <aside className="claims-sidebar glass" style={{ width: '320px', borderRadius: '16px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.5)', flexShrink: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(15,23,42,0.1)', background: 'rgba(255,255,255,0.5)' }}>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}><Landmark size={18}/> Insurance Claims</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
             {claims.map((claim, i) => (
                <div key={i} className="claim-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.6)', border: `1px solid rgba(15,23,42,0.1)` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                         <h4 style={{ margin: '0 0 4px', fontSize: '13px', color: 'var(--ink)' }}>{claim.provider}</h4>
                         <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{claim.id}</span>
                      </div>
                      <strong style={{ fontSize: '14px', fontFamily: 'monospace' }}>{claim.amount}</strong>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span className={`status ${claim.tone}`} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>{claim.status}</span>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--blue)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View</button>
                   </div>
                </div>
             ))}
          </div>
        </aside>

      </div>
    </section>
  );
}

export function GenericModuleView({ active }: { active: string }) {
  const config: Record<string, any> = {
    "Inventory": {
      title: "Inventory & Supply Chain", desc: "Monitor stock levels for medical and surgical supplies.",
      cols: ["Item Code", "Category", "Item Name", "Stock Level", "Status"],
      rows: [
        ["SUP-01", "Surgical", "Latex Gloves (M)", "4,500 Box", "Optimal"],
        ["MED-44", "Medicine", "Paracetamol 500mg", "120 Strips", "Low Stock"],
        ["EQP-12", "Equipment", "Syringes 5ml", "10 Box", "Critical"],
      ]
    },
    "Reports": {
      title: "Analytics & Reports", desc: "Generate clinical, operational, and financial reports.",
      cols: ["Report Name", "Category", "Generated By", "Date", "Status"],
      rows: [
        ["Daily Revenue Summary", "Financial", "System", "Today, 08:00 AM", "Ready"],
        ["ICU Mortality Rate Q3", "Clinical", "Dr. Zarro", "Yesterday", "Ready"],
      ]
    }
  };

  const data = config[active];
  if (!data) return null;

  return (
    <section className="page-view glass">
      <header className="page-header">
        <div>
          <h2>{data.title}</h2>
          <p>{data.desc}</p>
        </div>
        <button className="primary" type="button"><Plus size={18} /> New Entry</button>
      </header>
      <div className="table-wrap full-height">
        <table>
          <thead>
            <tr>
              {data.cols.map((c: string) => <th key={c}>{c}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: string[], i: number) => (
              <tr key={i}>
                {row.map((cell: string, j: number) => (
                  <td key={j} className={cell === "Critical" || cell === "Low Stock" ? "red" : ""}>
                    {j === 1 || j === 0 ? <strong>{cell}</strong> : cell}
                  </td>
                ))}
                <td>
                  <div className="action-buttons">
                    <button className="row-action" type="button">View</button>
                    <button className="row-action" type="button">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
