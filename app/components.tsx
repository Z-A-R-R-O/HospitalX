import { useEffect, useState, useMemo } from "react";
import { Settings, Sun, Moon, LogOut, Aperture, Archive, Banknote, BarChart3, BedDouble, Bell, Boxes, Brain, CalendarDays, CheckCircle2, CheckSquare, ClipboardList, Clock, Clock3, CreditCard, Disc, Download, Eye, FileCheck, FileImage, FileSpreadsheet, FileText, Filter, FlaskConical, HeartPulse, Landmark, MapPin, MessageSquare, Microscope, MoreHorizontal, Package, PackageOpen, Phone, PieChart, Pill, Play, Plus, Printer, Receipt, ReceiptText, ScanLine, Search, Send, ShieldCheck, ShoppingCart, Sparkles, Stethoscope, Syringe, TestTube, TrendingUp, Truck, UploadCloud, User, UserPlus, Users, Video, Wallet, Wrench, Activity, AlertCircle, AlertTriangle, ArrowRight } from "lucide-react";

export function AppointmentsView() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);

  useEffect(() => {
    fetch("/api/appointments")
      .then(res => res.json())
      .then(data => {
        setAppointments(data.appointments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredAppointments = useMemo(() => {
    let result = appointments;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.full_name?.toLowerCase().includes(q) || a.provider_name?.toLowerCase().includes(q));
    }
    if (filterActive) {
      result = result.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
    }
    return result;
  }, [appointments, searchQuery, filterActive]);

  return (
    <section className="page-view appointments-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><CalendarDays /> Appointments & Scheduling</h2>
          <p>Manage upcoming visits, telehealth, and in-person consultations.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search patient or doctor..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" onClick={() => setFilterActive(!filterActive)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: filterActive ? 'var(--c-glass-70)' : 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" onClick={() => window.location.href = '/appointments/new'} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Book</button>
        </div>
      </header>

      <div className="appointments-layout" style={{ display: 'flex', gap: '20px', padding: '24px', height: 'calc(100% - 70px)' }}>
        <aside className="calendar-sidebar glass" style={{ width: '280px', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
           <div className="mini-calendar">
             <h3 style={{ margin: '0 0 16px', fontSize: '15px' }}>September 2026</h3>
             <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
               {['S','M','T','W','T','F','S'].map((d,i) => <span key={i} style={{ color: 'var(--muted)' }}>{d}</span>)}
               {Array.from({length: 30}).map((_, i) => (
                 <span key={i} style={{ 
                   padding: '6px 0', borderRadius: '50%', cursor: 'pointer',
                   background: i+1 === 20 ? 'var(--blue)' : 'transparent', 
                   color: i+1 === 20 ? 'var(--c-white)' : 'inherit',
                   border: [14, 21, 28].includes(i) ? '1px solid var(--red)' : '1px solid transparent'
                 }}>{i + 1}</span>
               ))}
             </div>
           </div>
           <div className="schedule-stats">
             <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: 'var(--muted)' }}>Today's Overview</h4>
             <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontWeight: 500 }}>
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue)' }}></span> {appointments.length} Total Appointments</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange)' }}></span> {appointments.filter(a => a.status === 'scheduled').length} Scheduled</li>
               <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)' }}></span> {appointments.filter(a => a.status === 'completed').length} Completed</li>
             </ul>
           </div>
        </aside>

        <main className="timeline-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
          <div className="timeline-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Sunday, Sep 20</h3>
            <div className="view-toggles" style={{ display: 'flex', background: 'var(--c-glass-40)', borderRadius: '8px', padding: '4px' }}>
              <button style={{ padding: '4px 12px', borderRadius: '9999px', background: 'var(--c-white)', boxShadow: 'var(--c-shadow-sm)', border: 'none', fontWeight: 600, fontSize: '12px', color: 'var(--c-dark-text)', cursor: 'pointer' }}>List</button>
              <button style={{ padding: '4px 12px', borderRadius: '9999px', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Timeline</button>
            </div>
          </div>

          <div className="appointment-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
            {loading ? <p>Loading live appointments...</p> : filteredAppointments.length === 0 ? <p>No appointments found matching your criteria.</p> : filteredAppointments.map(apt => {
              const timeStr = new Date(apt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
              <div key={apt.id} className="apt-card glass" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--c-glass-60)', background: 'var(--c-glass-45)' }}>
                <div className="apt-time" style={{ width: '80px', flexShrink: 0 }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>{timeStr}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>30m</span>
                </div>
                <div className="apt-details" style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px' }}>{apt.full_name}</h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: 'var(--muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {apt.provider_name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><HeartPulse size={14} /> {apt.appointment_type}</span>
                  </div>
                </div>
                <div className="apt-status" style={{ padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: 'var(--c-glass-50)', textTransform: 'capitalize' }}>
                  {apt.status}
                </div>
                <button className="row-action" title="More options"><MoreHorizontal /></button>
              </div>
            )})}
          </div>
        </main>
      </div>
    </section>
  );
}

export function OPDView() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/appointments")
      .then(res => res.json())
      .then(data => {
        // Map database statuses to Kanban board columns
        const mapped = (data.appointments || []).map((apt: any) => {
           let boardStatus = "Waiting";
           if (apt.status === "scheduled") boardStatus = "Triage";
           if (apt.status === "arrived") boardStatus = "Waiting";
           if (apt.status === "in_consultation") boardStatus = "Consultation";
           if (apt.status === "completed") boardStatus = "Post-Consult";
           
           return {
             id: apt.id.substring(0,6).toUpperCase(),
             patient: apt.full_name,
             age: "?",
             doctor: apt.provider_name,
             vitals: "Pending Triage",
             status: boardStatus,
             waitTime: new Date(apt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             priority: "normal"
           };
        });
        setQueue(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCol = (status: string) => queue.filter(q => q.status === status);

  const renderCard = (apt: any) => (
    <div key={apt.id} className="opd-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'var(--c-glass-60)', border: apt.priority === 'high' ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--c-glass-50)', position: 'relative', boxShadow: 'var(--c-shadow-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>{apt.id}</span>
           {apt.priority === 'high' && <AlertCircle size={16} color="var(--red)" />}
         </div>
         <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock3 size={12}/> {apt.waitTime}</span>
      </div>
      <div style={{ marginBottom: '12px' }}>
         <h4 style={{ margin: '0 0 2px', fontSize: '15px' }}>{apt.patient} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>• {apt.age}</span></h4>
         <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {apt.doctor}</p>
      </div>
      <div style={{ padding: '8px', background: 'var(--c-black-03)', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink)', fontWeight: 500 }}>
        <Activity size={14} color="var(--blue)" /> {apt.vitals}
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button className="row-action" style={{ flex: 1, padding: '6px 14px', fontSize: '12px', background: 'var(--c-white)', borderRadius: '9999px', border: '1px solid var(--c-glass-80)', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>Move <ArrowRight size={14}/></button>
        <button className="row-action" onClick={() => window.open('/health-worker/screen', 'Screening', 'width=450,height=800')} style={{ flex: 1, padding: '6px 14px', fontSize: '12px', background: 'var(--blue)', color: '#fff', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>Triage</button>
      </div>
    </div>
  );

  return (
    <section className="page-view opd-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Users /> OPD Queue Management</h2>
          <p>Live tracking of walk-in patients, triaging, and active consultations.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Walk-in</button>
        </div>
      </header>

      <div className="opd-board" style={{ display: 'flex', gap: '20px', padding: '24px', height: 'calc(100% - 70px)', overflowX: 'auto' }}>
        {loading ? <p>Loading live queue...</p> : [
          { title: "Triage", count: getCol('Triage').length, color: "var(--orange)" },
          { title: "Waiting", count: getCol('Waiting').length, color: "var(--blue)" },
          { title: "Consultation", count: getCol('Consultation').length, color: "var(--red)" },
          { title: "Post-Consult", count: getCol('Post-Consult').length, color: "var(--green)" }
        ].map(col => (
          <div key={col.title} className="opd-column glass" style={{ flexShrink: 0, width: '320px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--c-glass-30)', borderRadius: '16px', padding: '16px', border: '1px solid var(--c-glass-50)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--c-glass-40)' }}>
               <h3 style={{ margin: 0, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                 {col.title}
               </h3>
               <span style={{ padding: '2px 10px', borderRadius: '9999px', background: 'var(--c-glass-60)', fontSize: '12px', fontWeight: 700 }}>{col.count}</span>
            </div>
            <div className="opd-column-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              {getCol(col.title).map(renderCard)}
              {getCol(col.title).length === 0 && (
                 <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--muted)', fontSize: '13px', border: '1px dashed var(--c-glass-60)', borderRadius: '12px' }}>
                   No patients in {col.title}
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export function IPDView() {
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch live patients and distribute them into wards
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        const patients = data.patients || [];
        
        const templateWards = [
          {
            name: "Intensive Care Unit (ICU)",
            type: "critical",
            beds: [
              { id: "ICU-01", status: "Occupied", tone: "red" },
              { id: "ICU-02", status: "Occupied", tone: "red" },
              { id: "ICU-03", status: "Available", tone: "green" },
              { id: "ICU-04", status: "Cleaning", tone: "orange" },
              { id: "ICU-05", status: "Available", tone: "green" },
            ]
          },
          {
            name: "General Ward A",
            type: "general",
            beds: [
              { id: "GEN-14", status: "Occupied", tone: "blue" },
              { id: "GEN-15", status: "Occupied", tone: "blue" },
              { id: "GEN-16", status: "Available", tone: "green" },
              { id: "GEN-17", status: "Available", tone: "green" },
            ]
          },
          {
            name: "Pediatric Ward",
            type: "specialty",
            beds: [
              { id: "PED-01", status: "Occupied", tone: "orange" },
              { id: "PED-02", status: "Available", tone: "green" },
              { id: "PED-03", status: "Maintenance", tone: "gray" },
            ]
          }
        ];

        let patientIndex = 0;
        const populatedWards = templateWards.map(ward => ({
          ...ward,
          beds: ward.beds.map(bed => {
            if (bed.status === "Occupied" && patientIndex < patients.length) {
              const p = patients[patientIndex++];
              return {
                ...bed,
                patient: p.full_name,
                age: p.age ? `${p.age}y` : "-",
                doctor: p.provider_name || "Assigned Resident",
                admitted: "Just now"
              };
            }
            return bed;
          })
        }));

        setWards(populatedWards);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="page-view ipd-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><BedDouble /> IPD & Bed Management</h2>
          <p>Real-time ward occupancy, admissions, and housekeeping status.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input placeholder="Search bed or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter Wards</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Admit Patient</button>
        </div>
      </header>

      <div className="ipd-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="ward-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Total Beds", value: "124", trend: "" },
            { label: "Occupancy Rate", value: "78%", trend: "up" },
            { label: "Available Beds", value: "24", trend: "" },
            { label: "Pending Cleaning", value: "8", trend: "" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'var(--c-glass-40)', border: '1px solid var(--c-glass-50)' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</span>
              <strong style={{ display: 'block', fontSize: '24px', marginTop: '4px' }}>{kpi.value}</strong>
            </div>
          ))}
        </div>

        <div className="wards-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {loading ? <p>Loading live IPD occupancy...</p> : wards.map(ward => (
            <div key={ward.name} className="ward-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--c-glass-40)' }}>
                 <div>
                   <h3 style={{ margin: '0 0 4px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                     {ward.type === 'critical' ? <Activity color="var(--red)"/> : <BedDouble color="var(--blue)"/>}
                     {ward.name}
                   </h3>
                   <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{ward.beds.filter((b: any) => b.status === 'Occupied').length} / {ward.beds.length} Beds Occupied</span>
                 </div>
                 <button className="row-action" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', fontWeight: 600, cursor: 'pointer' }}>Manage Ward</button>
              </div>
              
              <div className="beds-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {ward.beds.map((bed: any) => (
                  <div key={bed.id} className="bed-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'var(--c-glass-30)', border: `1px solid var(--${bed.tone})`, position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `var(--${bed.tone})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                          <BedDouble size={16} />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)' }}>{bed.id}</span>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: `var(--${bed.tone})`, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {bed.status}
                      </span>
                    </div>

                    {bed.status === 'Occupied' ? (
                      <div className="bed-patient" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ padding: '12px', background: 'var(--c-glass-60)', borderRadius: '8px' }}>
                          <h4 style={{ margin: '0 0 2px', fontSize: '15px' }}>{bed.patient} <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>• {bed.age}</span></h4>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {bed.doctor}</p>
                        </div>
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
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {
        setDoctors(data.doctors || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors;
    const q = searchQuery.toLowerCase();
    return doctors.filter(d => d.full_name?.toLowerCase().includes(q) || d.specialty?.toLowerCase().includes(q));
  }, [doctors, searchQuery]);

  const getInitials = (name: string) => {
    if (!name) return "DR";
    const parts = name.replace('Dr. ', '').trim().split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };
  
  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(':');
    let hInt = parseInt(h);
    const ampm = hInt >= 12 ? 'PM' : 'AM';
    hInt = hInt % 12 || 12;
    return `${hInt}:${m} ${ampm}`;
  };

  return (
    <section className="page-view doctors-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Stethoscope /> Doctor Roster & Directory</h2>
          <p>Live availability, current physical locations, and shift schedules.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search doctor or dept..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" onClick={() => window.location.href = '/doctors/new'} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Add Staff</button>
        </div>
      </header>

      <div className="doctors-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="opd-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Doctors on Shift", value: doctors.length, trend: "" },
            { label: "In Surgery", value: doctors.filter(d => d.location?.toLowerCase().includes('ot') || d.location?.toLowerCase().includes('surgery')).length, trend: "" },
            { label: "Consulting (OPD)", value: doctors.filter(d => d.location?.toLowerCase().includes('opd')).length, trend: "" },
            { label: "Available / On Call", value: doctors.filter(d => !d.location?.toLowerCase().includes('ot') && !d.location?.toLowerCase().includes('opd')).length, trend: "" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'var(--c-glass-40)', border: '1px solid var(--c-glass-50)' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</span>
              <strong style={{ display: 'block', fontSize: '24px', marginTop: '4px' }}>{kpi.value}</strong>
            </div>
          ))}
        </div>

        <div className="doctors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {loading ? <p>Loading roster...</p> : filteredDoctors.length === 0 ? <p>No doctors found.</p> : filteredDoctors.map(doc => (
            <div key={doc.id} className="doc-card glass" style={{ padding: '20px', borderRadius: '16px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--c-glass-60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                  {getInitials(doc.full_name)}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{doc.full_name}</h3>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{doc.specialty}  {doc.role}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--ink)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Status</span>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: doc.location?.toLowerCase().includes('ot') ? 'var(--red)' : doc.location?.toLowerCase().includes('opd') ? 'var(--orange)' : 'var(--green)' }} />
                    {doc.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Location</span>
                  <span style={{ fontWeight: 500 }}><MapPin size={12}/> {doc.location}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Shift</span>
                  <span style={{ fontWeight: 500 }}><Clock3 size={12}/> {formatTime(doc.shift_start)} - {formatTime(doc.shift_end)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--c-glass-50)', borderRadius: '8px', marginTop: '4px' }}>
                  <span style={{ color: 'var(--muted)' }}>Appointments Today</span>
                  <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{doc.today_appointments || 0}</span>
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
  const [nurses, setNurses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/nurses")
      .then(res => res.json())
      .then(data => {
        setNurses(data.nurses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredNurses = useMemo(() => {
    if (!searchQuery.trim()) return nurses;
    const q = searchQuery.toLowerCase();
    return nurses.filter(n => n.full_name?.toLowerCase().includes(q) || n.ward?.toLowerCase().includes(q));
  }, [nurses, searchQuery]);

  const alerts = [
    { time: "Just now", type: "Urgent", msg: "Call Bell Ringing", loc: "ICU - Bed 02", tone: "red" },
    { time: "5m ago", type: "Task", msg: "Administer Medication (IV)", loc: "Gen A - Bed 14", tone: "orange" },
    { time: "12m ago", type: "Alert", msg: "IV Fluid < 10%", loc: "ER - Bed 04", tone: "red" },
    { time: "28m ago", type: "Task", msg: "Record Vitals", loc: "Gen A - Bed 15", tone: "blue" },
    { time: "45m ago", type: "Task", msg: "Post-Op Wound Check", loc: "Gen B - Bed 01", tone: "blue" },
    { time: "1h ago", type: "Handover", msg: "Night shift handover complete", loc: "Nursing Station", tone: "green" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "NR";
    const parts = name.trim().split(' ');
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  };

  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(':');
    let hInt = parseInt(h);
    const ampm = hInt >= 12 ? 'PM' : 'AM';
    hInt = hInt % 12 || 12;
    return `${hInt}:${m} ${ampm}`;
  };
  
  const getTone = (ward: string) => {
    if (ward?.includes("ICU") || ward?.includes("Emergency")) return "red";
    if (ward?.includes("General")) return "blue";
    if (ward?.includes("Pediatrics")) return "orange";
    return "green";
  };

  return (
    <section className="page-view nursing-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><ClipboardList /> Nursing Station</h2>
          <p>Shift handovers, ward assignments, and live task tracking.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search nurse or ward..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="primary" onClick={() => window.location.href = '/nurses/new'} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Assign Shift</button>
        </div>
      </header>

      <div className="nursing-layout" style={{ display: 'flex', gap: '24px', padding: '24px', height: 'calc(100% - 70px)', overflow: 'hidden' }}>
        
        <main className="nursing-roster" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Active Shift Roster ({nurses.length})</h3>
            <div className="view-toggles" style={{ display: 'flex', background: 'var(--c-glass-40)', borderRadius: '8px', padding: '4px' }}>
              <button style={{ padding: '4px 12px', borderRadius: '9999px', background: 'var(--c-white)', boxShadow: 'var(--c-shadow-sm)', border: 'none', fontWeight: 600, fontSize: '12px', color: 'var(--c-dark-text)', cursor: 'pointer' }}>Cards</button>
              <button style={{ padding: '4px 12px', borderRadius: '9999px', background: 'transparent', border: 'none', fontWeight: 600, fontSize: '12px', color: 'var(--muted)', cursor: 'pointer' }}>Table</button>
            </div>
          </div>
          
          <div className="roster-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', paddingRight: '8px' }}>
            {loading ? <p>Loading nursing roster...</p> : filteredNurses.length === 0 ? <p>No nurses assigned.</p> : filteredNurses.map(nurse => (
              <div key={nurse.id} className="nurse-card glass" style={{ padding: '16px', borderRadius: '16px', background: 'var(--c-glass-30)', border: `1px solid var(--${getTone(nurse.ward)})`, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `var(--${getTone(nurse.ward)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                      {getInitials(nurse.full_name)}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 2px', fontSize: '15px' }}>{nurse.full_name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>{nurse.role}</span>
                    </div>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: nurse.status === 'Active' ? 'var(--green)' : 'var(--orange)', color: '#fff' }}>
                    {nurse.status}
                  </span>
                </div>
                
                <div className="nurse-stats" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Assignment</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{nurse.ward}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--muted)' }}>Shift</span>
                    <span style={{ fontWeight: 500 }}>{formatTime(nurse.shift_start)} - {formatTime(nurse.shift_end)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'var(--c-glass-50)', borderRadius: '8px', marginTop: '4px' }}>
                    <span style={{ color: 'var(--muted)' }}>Patient Load</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                       {Array.from({length: Math.max(5, nurse.patient_load || 0)}).map((_, i) => (
                         <span key={i} style={{ width: '6px', height: '16px', borderRadius: '3px', background: i < (nurse.patient_load || 0) ? `var(--${getTone(nurse.ward)})` : 'var(--c-glass-60)' }} />
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="alerts-sidebar glass" style={{ width: '320px', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
          <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} /> Live Alerts & Tasks</h3>
          <div className="alerts-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {alerts.map((alert, i) => (
              <div key={i} className="alert-card glass" style={{ padding: '12px', borderRadius: '10px', background: 'var(--c-glass-40)', borderLeft: `4px solid var(--${alert.tone})` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: `var(--${alert.tone})`, textTransform: 'uppercase' }}>{alert.type}</span>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{alert.time}</span>
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>{alert.msg}</p>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {alert.loc}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
export function LaboratoryView() {
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        const patients = data.patients || [];
        const templates = [
          { test: "Complete Blood Count (CBC)", category: "Hematology", priority: "Routine", status: "Processing", sample: "Collected", tone: "blue" },
          { test: "Lipid Profile", category: "Biochemistry", priority: "Routine", status: "Awaiting Sample", sample: "Pending", tone: "orange" },
          { test: "Troponin-I High Sensitivity", category: "Immunology", priority: "STAT", status: "Critical Value", sample: "Tested", tone: "red" },
          { test: "Thyroid Panel (T3, T4, TSH)", category: "Endocrinology", priority: "Routine", status: "Verified", sample: "Tested", tone: "green" },
          { test: "HbA1c & Fasting Glucose", category: "Pathology", priority: "Routine", status: "Processing", sample: "Collected", tone: "blue" },
          { test: "Liver Function Test (LFT)", category: "Biochemistry", priority: "Routine", status: "Awaiting Sample", sample: "Pending", tone: "orange" },
          { test: "Coagulation Profile (PT/INR)", category: "Hematology", priority: "STAT", status: "Processing", sample: "Collected", tone: "blue" }
        ];

        const mapped = patients.slice(0, templates.length).map((p: any, i: number) => ({
          id: `LAB-${8901 + i}`,
          patient: p.full_name,
          age: p.age ? `${p.age}y` : "-",
          ...templates[i],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setLabTests(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) return labTests;
    const q = searchQuery.toLowerCase();
    return labTests.filter(t => t.patient?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q) || t.test?.toLowerCase().includes(q));
  }, [labTests, searchQuery]);

  return (
    <section className="page-view lab-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><FlaskConical /> Laboratory & Diagnostics</h2>
          <p>Process pathology requests, manage samples, and verify results.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search barcode or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> New Request</button>
        </div>
      </header>

      <div className="lab-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="lab-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Pending Samples", value: "42", trend: "" },
            { label: "Processing", value: "18", trend: "" },
            { label: "Critical Values", value: "3", trend: "up", tone: "red" },
            { label: "Verified Today", value: "156", trend: "" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: kpi.tone === 'red' ? 'rgba(239,68,68,0.1)' : 'var(--c-glass-40)', border: kpi.tone === 'red' ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--c-glass-50)' }}>
              <span style={{ fontSize: '12px', color: kpi.tone === 'red' ? 'var(--red)' : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</span>
              <strong style={{ display: 'block', fontSize: '24px', marginTop: '4px', color: kpi.tone === 'red' ? 'var(--red)' : 'var(--ink)' }}>{kpi.value}</strong>
            </div>
          ))}
        </div>

        <div className="lab-table-container glass" style={{ borderRadius: '16px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', overflow: 'hidden' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-glass-50)', background: 'var(--c-glass-40)' }}>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Barcode ID</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Patient</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Requested Test</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Category</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Priority</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Sample</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center' }}>Loading live requests...</td></tr> : filteredTests.length === 0 ? <tr><td colSpan={8} style={{ padding: '32px', textAlign: 'center' }}>No requests found.</td></tr> : filteredTests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--c-glass-40)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{req.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>{req.patient}</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{req.age}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 500 }}>{req.test}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--muted)' }}>{req.category}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: req.priority === 'STAT' ? 'rgba(239,68,68,0.15)' : 'var(--c-glass-60)', color: req.priority === 'STAT' ? 'var(--red)' : 'var(--muted)' }}>{req.priority}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px' }}>
                     <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                       <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: req.sample === 'Collected' ? 'var(--blue)' : req.sample === 'Tested' ? 'var(--green)' : 'var(--orange)' }}/>
                       {req.sample}
                     </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, background: `var(--${req.tone})`, color: '#fff' }}>{req.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button className="row-action" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', fontWeight: 600, cursor: 'pointer' }}>Results</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
export function RadiologyView() {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        const patients = data.patients || [];
        const templates = [
          { scan: "Chest X-Ray (PA View)", modality: "X-Ray", refDr: "Dr. Iyer", status: "Ready for Review", tone: "blue", icon: ScanLine },
          { scan: "MRI Brain with Contrast", modality: "MRI", refDr: "Dr. Sharma", status: "In Progress", tone: "orange", icon: Brain },
          { scan: "CT Abdomen & Pelvis", modality: "CT Scan", refDr: "Dr. Patel", status: "Scheduled", tone: "gray", icon: Disc },
          { scan: "USG Whole Abdomen", modality: "Ultrasound", refDr: "Dr. Mehta", status: "Reported", tone: "green", icon: Activity },
          { scan: "MRI Cervical Spine", modality: "MRI", refDr: "Dr. Iyer", status: "Scheduled", tone: "gray", icon: Aperture },
          { scan: "CT Thorax High Res", modality: "CT Scan", refDr: "Dr. Sharma", status: "Scheduled", tone: "gray", icon: Disc }
        ];

        const mapped = patients.slice(0, templates.length).map((p: any, i: number) => ({
          id: `RAD-40${2 + i}`,
          patient: p.full_name,
          age: p.age ? `${p.age}y` : "-",
          ...templates[i],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setScans(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredScans = useMemo(() => {
    if (!searchQuery.trim()) return scans;
    const q = searchQuery.toLowerCase();
    return scans.filter(s => s.patient?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q) || s.scan?.toLowerCase().includes(q));
  }, [scans, searchQuery]);

  return (
    <section className="page-view rad-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><ScanLine /> Radiology & Imaging</h2>
          <p>Manage X-Ray, MRI, CT Scans, and Ultrasound queues.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search scan ID or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Schedule Scan</button>
        </div>
      </header>

      <div className="rad-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="rad-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {loading ? <p>Loading radiology queue...</p> : filteredScans.length === 0 ? <p>No scans found.</p> : filteredScans.map(scan => {
            const Icon = scan.icon;
            return (
            <div key={scan.id} className="rad-card glass" style={{ padding: '20px', borderRadius: '16px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `var(--${scan.tone})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '15px' }}>{scan.scan}</h3>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', background: 'var(--c-glass-60)', padding: '2px 8px', borderRadius: '4px' }}>{scan.modality}</span>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}><Clock3 size={12}/> {scan.time}</span>
              </div>
              
              <div style={{ padding: '12px', background: 'var(--c-glass-50)', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Patient</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{scan.patient} ({scan.age})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Ref. Doctor</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><Stethoscope size={12}/> {scan.refDr}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: `var(--${scan.tone})` }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: `var(--${scan.tone})` }}/>
                  {scan.status}
                </span>
                <button className="row-action" style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--c-glass-60)', background: 'var(--c-white)', fontWeight: 600, cursor: 'pointer' }}>View Images</button>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
export function PharmacyView() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        const patients = data.patients || [];
        const templates = [
          { items: ["Amoxicillin 500mg (15)", "Paracetamol 500mg (10)"], status: "Ready to Dispense", payment: "Cleared", tone: "green" },
          { items: ["Metformin 500mg (30)", "Atorvastatin 10mg (30)"], status: "Processing", payment: "Pending", tone: "orange" },
          { items: ["Clopidogrel 75mg (15)"], status: "Awaiting Stock", payment: "Cleared", tone: "red" },
          { items: ["Ibuprofen 400mg (10)", "Pantoprazole 40mg (10)"], status: "Dispensed", payment: "Cleared", tone: "blue" },
          { items: ["Omeprazole 20mg (14)"], status: "Processing", payment: "Pending", tone: "orange" },
          { items: ["Azithromycin 250mg (6)"], status: "Ready to Dispense", payment: "Pending", tone: "green" }
        ];

        const mapped = patients.slice(0, templates.length).map((p: any, i: number) => ({
          id: `RX-992${1 + i}`,
          patient: p.full_name,
          age: p.age ? `${p.age}y` : "-",
          doctor: p.provider_name || "Dr. Sharma",
          ...templates[i],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        
        setPrescriptions(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery.trim()) return prescriptions;
    const q = searchQuery.toLowerCase();
    return prescriptions.filter(p => p.patient?.toLowerCase().includes(q) || p.id?.toLowerCase().includes(q) || p.items?.some((i: string) => i.toLowerCase().includes(q)));
  }, [prescriptions, searchQuery]);

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
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search RX, patient, or drug..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Direct Sale</button>
        </div>
      </header>

      <div className="pharmacy-layout" style={{ display: 'flex', gap: '24px', padding: '24px', height: 'calc(100% - 70px)', overflow: 'hidden' }}>
        
        <main className="rx-queue" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
          <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', justifyContent: 'space-between' }}>
            Active Prescriptions
            <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>{prescriptions.length} Pending</span>
          </h3>
          <div className="rx-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
            {loading ? <p>Loading prescriptions...</p> : filteredPrescriptions.length === 0 ? <p>No prescriptions found.</p> : filteredPrescriptions.map(rx => (
              <div key={rx.id} className="rx-card glass" style={{ padding: '20px', borderRadius: '16px', background: 'var(--c-glass-30)', border: `1px solid var(--${rx.tone})`, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                     <div style={{ padding: '12px', borderRadius: '12px', background: `var(--${rx.tone})`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <FileText size={24} />
                     </div>
                     <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                         <h4 style={{ margin: 0, fontSize: '16px' }}>{rx.id}</h4>
                         <span style={{ fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--c-glass-50)', color: `var(--${rx.tone})` }}>{rx.status}</span>
                         <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${rx.payment === 'Cleared' ? 'var(--green)' : 'var(--orange)'}`, color: rx.payment === 'Cleared' ? 'var(--green)' : 'var(--orange)' }}>{rx.payment}</span>
                       </div>
                       <span style={{ fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock3 size={14}/> Sent at {rx.time}</span>
                     </div>
                  </div>
                  <button className="row-action" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-white)', fontWeight: 600, cursor: 'pointer' }}>Process</button>
                </div>
                
                <div style={{ display: 'flex', gap: '24px', padding: '16px', background: 'var(--c-glass-40)', borderRadius: '12px' }}>
                  <div style={{ flex: 1 }}>
                     <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Patient</span>
                     <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>{rx.patient} ({rx.age})</strong>
                  </div>
                  <div style={{ flex: 1 }}>
                     <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Prescribed By</span>
                     <strong style={{ fontSize: '14px', color: 'var(--ink)' }}><Stethoscope size={12}/> {rx.doctor}</strong>
                  </div>
                  <div style={{ flex: 2 }}>
                     <span style={{ display: 'block', fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Medications</span>
                     <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                       {rx.items.map((item: string, i: number) => <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Pill size={12} color="var(--blue)"/> {item}</li>)}
                     </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <aside className="inventory-sidebar glass" style={{ width: '320px', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
          <div>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} color="var(--orange)" /> Low Stock Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lowStock.map((item, i) => (
                <div key={i} className="stock-card" style={{ padding: '12px', borderRadius: '10px', background: 'var(--c-white)', borderLeft: `4px solid var(--${item.tone})`, boxShadow: 'var(--c-shadow-sm)' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '14px' }}>{item.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
                    <span>Current: <strong style={{ color: `var(--${item.tone})` }}>{item.current}</strong></span>
                    <span>Threshold: {item.threshold}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="row-action" style={{ width: '100%', marginTop: '16px', padding: '8px', fontSize: '13px', borderRadius: '8px', border: '1px solid var(--c-glass-60)', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}>View Full Inventory</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
export function BillingView() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        const patients = data.patients || [];
        const templates = [
          { amount: "₹4,500", type: "OPD Consultation", status: "Paid", date: "Sep 20, 2026", tone: "green" },
          { amount: "₹1,25,000", type: "IPD Surgery", status: "Pending Insurance", date: "Sep 19, 2026", tone: "orange" },
          { amount: "₹1,200", type: "Pharmacy", status: "Paid", date: "Sep 20, 2026", tone: "green" },
          { amount: "₹8,500", type: "Radiology (MRI)", status: "Unpaid", date: "Sep 20, 2026", tone: "red" },
          { amount: "₹3,200", type: "Laboratory", status: "Paid", date: "Sep 18, 2026", tone: "green" },
          { amount: "₹45,000", type: "IPD Admission", status: "Partial", date: "Sep 15, 2026", tone: "blue" }
        ];

        const mapped = patients.slice(0, templates.length).map((p: any, i: number) => ({
          id: `INV-260${901 + i}`,
          patient: p.full_name,
          ...templates[i]
        }));
        
        setInvoices(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(i => i.patient?.toLowerCase().includes(q) || i.id?.toLowerCase().includes(q) || i.status?.toLowerCase().includes(q));
  }, [invoices, searchQuery]);

  return (
    <section className="page-view billing-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><ReceiptText /> Billing & Revenue</h2>
          <p>Manage patient invoices, insurance claims, and payments.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search invoice or patient..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> New Invoice</button>
        </div>
      </header>

      <div className="billing-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="billing-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Today's Revenue", value: "₹3,45,200", trend: "up" },
            { label: "Pending Payments", value: "₹1,12,000", trend: "" },
            { label: "Insurance Claims", value: "₹8,50,000", trend: "" },
            { label: "Active Invoices", value: "142", trend: "" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: 'var(--c-glass-40)', border: '1px solid var(--c-glass-50)' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</span>
              <strong style={{ display: 'block', fontSize: '24px', marginTop: '4px', color: 'var(--ink)' }}>{kpi.value}</strong>
            </div>
          ))}
        </div>

        <div className="billing-table-container glass" style={{ borderRadius: '16px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', overflow: 'hidden' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-glass-50)', background: 'var(--c-glass-40)' }}>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Invoice ID</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Patient</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Category</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Date</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Amount</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center' }}>Loading live invoices...</td></tr> : filteredInvoices.length === 0 ? <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center' }}>No invoices found.</td></tr> : filteredInvoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--c-glass-40)' }}>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 700 }}>{inv.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{inv.patient}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--muted)' }}>{inv.type}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--muted)' }}>{inv.date}</td>
                  <td style={{ padding: '16px', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{inv.amount}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: `var(--${inv.tone})`, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{inv.status}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                     <div style={{ display: 'flex', gap: '8px' }}>
                       <button className="row-action" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', cursor: 'pointer' }}><Eye size={14}/></button>
                       <button className="row-action" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', cursor: 'pointer' }}><Download size={14}/></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
export function InventoryView() {
  const [searchQuery, setSearchQuery] = useState("");

  const items = [
    { id: "INV-1001", item: "N95 Masks", category: "PPE", stock: 1250, unit: "Boxes", status: "Adequate", tone: "green", lastUpdated: "Today, 08:00 AM" },
    { id: "INV-1002", item: "Surgical Gloves (Size 7)", category: "Consumables", stock: 45, unit: "Boxes", status: "Low Stock", tone: "orange", lastUpdated: "Yesterday" },
    { id: "INV-1003", item: "Propofol 10mg/ml", category: "Anesthesia", stock: 12, unit: "Vials", status: "Critical", tone: "red", lastUpdated: "Today, 11:30 AM" },
    { id: "INV-1004", item: "IV Fluids (NS 500ml)", category: "Fluids", stock: 850, unit: "Bottles", status: "Adequate", tone: "green", lastUpdated: "2 Days Ago" },
    { id: "INV-1005", item: "Syringes (5ml)", category: "Consumables", stock: 2400, unit: "Pieces", status: "Adequate", tone: "green", lastUpdated: "Today, 09:15 AM" },
    { id: "INV-1006", item: "Ceftriaxone 1g", category: "Antibiotics", stock: 85, unit: "Vials", status: "Low Stock", tone: "orange", lastUpdated: "Yesterday" },
    { id: "INV-1007", item: "Oxygen Cylinders (Type B)", category: "Gases", stock: 5, unit: "Cylinders", status: "Critical", tone: "red", lastUpdated: "Just Now" },
  ];

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i => i.item.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
  }, [items, searchQuery]);

  return (
    <section className="page-view inventory-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><Boxes /> Medical Inventory</h2>
          <p>Track consumables, PPE, and critical stock alerts.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <label className="search-bar glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)' }}>
            <Search size={16} /><input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search item or barcode..." style={{ border: 'none', background: 'transparent', outline: 'none' }}/>
          </label>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><Filter size={16} /> Filter</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Plus size={18} /> Add Stock</button>
        </div>
      </header>

      <div className="inventory-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="inventory-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', flexShrink: 0 }}>
          {[
            { label: "Total SKUs", value: "4,520", trend: "" },
            { label: "Adequate Stock", value: "4,105", trend: "" },
            { label: "Low Stock Items", value: "382", trend: "", tone: "orange" },
            { label: "Critical Shortages", value: "33", trend: "up", tone: "red" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '16px', borderRadius: '12px', background: kpi.tone ? `rgba(${kpi.tone === 'red' ? '239,68,68' : '249,115,22'},0.1)` : 'var(--c-glass-40)', border: kpi.tone ? `1px solid rgba(${kpi.tone === 'red' ? '239,68,68' : '249,115,22'},0.3)` : '1px solid var(--c-glass-50)' }}>
              <span style={{ fontSize: '12px', color: kpi.tone ? `var(--${kpi.tone})` : 'var(--muted)', fontWeight: 600 }}>{kpi.label}</span>
              <strong style={{ display: 'block', fontSize: '24px', marginTop: '4px', color: kpi.tone ? `var(--${kpi.tone})` : 'var(--ink)' }}>{kpi.value}</strong>
            </div>
          ))}
        </div>

        <div className="inventory-table-container glass" style={{ borderRadius: '16px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', overflow: 'hidden' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--c-glass-50)', background: 'var(--c-glass-40)' }}>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>SKU</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Item Name</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Category</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Stock Level</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Last Updated</th>
                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center' }}>No items found.</td></tr> : filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--c-glass-40)' }}>
                  <td style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>{item.id}</td>
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>{item.item}</td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--muted)' }}>{item.category}</td>
                  <td style={{ padding: '16px', fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>{item.stock} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>{item.unit}</span></td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: `var(--${item.tone})`, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.status}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: 'var(--muted)' }}>{item.lastUpdated}</td>
                  <td style={{ padding: '16px' }}>
                     <div style={{ display: 'flex', gap: '8px' }}>
                       <button className="row-action" style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', fontWeight: 600, cursor: 'pointer' }}>Update</button>
                       <button className="row-action" style={{ padding: '6px', borderRadius: '8px', border: '1px solid var(--c-glass-50)', background: 'var(--c-glass-30)', cursor: 'pointer' }}><MoreHorizontal size={14}/></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
export function ReportsView() {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/patients").then(res => res.json()),
      fetch("/api/appointments").then(res => res.json()),
      fetch("/api/doctors").then(res => res.json())
    ]).then(([p, a, d]) => {
      setStats({
        patients: p.patients?.length || 0,
        appointments: a.appointments?.length || 0,
        doctors: d.doctors?.length || 0
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="page-view reports-view glass" style={{ padding: 0 }}>
      <header className="page-header" style={{ padding: "24px 24px 0" }}>
        <div>
          <h2><BarChart3 /> Analytics & Reports</h2>
          <p>Hospital-wide performance, clinical outcomes, and financial metrics.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="row-action" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', border: '1px solid var(--c-glass-40)', background: 'var(--c-glass-50)', cursor: 'pointer', fontWeight: 600 }}><CalendarDays size={16} /> This Month</button>
          <button className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer' }}><Download size={18} /> Export Report</button>
        </div>
      </header>

      <div className="reports-layout" style={{ padding: '24px', height: 'calc(100% - 70px)', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        <div className="report-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { label: "Total Registered Patients", value: loading ? "..." : stats.patients.toString(), icon: Users, color: "var(--blue)" },
            { label: "Appointments Today", value: loading ? "..." : stats.appointments.toString(), icon: CalendarDays, color: "var(--orange)" },
            { label: "Active Doctors on Roster", value: loading ? "..." : stats.doctors.toString(), icon: Stethoscope, color: "var(--green)" },
            { label: "Revenue This Month", value: "₹42,50,000", icon: Banknote, color: "var(--purple)" }
          ].map(kpi => (
            <div key={kpi.label} className="kpi-card glass" style={{ padding: '20px', borderRadius: '16px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <kpi.icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{kpi.label}</span>
                <strong style={{ display: 'block', fontSize: '28px', marginTop: '4px', color: 'var(--ink)' }}>{kpi.value}</strong>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div className="chart-container glass" style={{ padding: '24px', borderRadius: '16px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
             <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={18}/> Patient Footfall (Last 7 Days)</h3>
             <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0 0' }}>
               {[45, 62, 58, 81, 75, 92, Math.max(30, stats.patients * 10)].map((h, i) => (
                 <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                   <div style={{ width: '100%', height: `${h * 2}px`, background: i === 6 ? 'var(--blue)' : 'var(--c-glass-60)', borderRadius: '6px 6px 0 0', transition: 'height 1s ease' }} />
                   <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="chart-container glass" style={{ padding: '24px', borderRadius: '16px', background: 'var(--c-glass-30)', border: '1px solid var(--c-glass-50)' }}>
             <h3 style={{ margin: '0 0 16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><PieChart size={18}/> Department Load</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
               {[
                 { dept: "Cardiology", pct: 35, color: "var(--red)" },
                 { dept: "Orthopedics", pct: 25, color: "var(--blue)" },
                 { dept: "Neurology", pct: 20, color: "var(--orange)" },
                 { dept: "Pediatrics", pct: 20, color: "var(--green)" }
               ].map(d => (
                 <div key={d.dept}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                     <span>{d.dept}</span>
                     <span>{d.pct}%</span>
                   </div>
                   <div style={{ width: '100%', height: '8px', background: 'var(--c-glass-50)', borderRadius: '9999px', overflow: 'hidden' }}>
                     <div style={{ width: `${d.pct}%`, height: '100%', background: d.color }} />
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
