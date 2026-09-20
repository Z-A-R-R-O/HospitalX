import { CalendarDays, Clock3, BedDouble, Stethoscope, HeartPulse, FlaskConical, ScanLine, Pill, ReceiptText, Boxes, FileText, Plus, Search, Filter, MoreHorizontal, Video } from "lucide-react";

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
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Stethoscope size={14}/> {apt.doctor} • {apt.dept}</p>
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

export function GenericModuleView({ active }: { active: string }) {
  const config: Record<string, any> = {
    "OPD": {
      title: "Outpatient Department (OPD)", desc: "Live tracking of walk-in and scheduled OPD consultations.",
      cols: ["Token", "Patient", "Vitals", "Assigned Doctor", "Status"],
      rows: [
        ["A-102", "Sunita Verma", "BP: 120/80, HR: 72", "Dr. Iyer", "Consulting"],
        ["A-103", "Vikram Malhotra", "BP: 135/85, HR: 88", "Dr. Iyer", "Waiting"],
        ["B-041", "Neha Gupta", "BP: 118/76, HR: 65", "Dr. Sharma", "Waiting"],
      ]
    },
    "IPD & Beds": {
      title: "Inpatient & Bed Management", desc: "Real-time occupancy, transfers, and bed turnover.",
      cols: ["Bed ID", "Ward", "Patient", "Admitted", "Status"],
      rows: [
        ["ICU-01", "Intensive Care", "Ramesh Das", "2 Days ago", "Occupied"],
        ["ICU-02", "Intensive Care", "-", "-", "Available"],
        ["GEN-14", "General Ward A", "Kavita Nair", "4 Days ago", "Occupied"],
        ["GEN-15", "General Ward A", "-", "-", "Cleaning"],
      ]
    },
    "Doctors": {
      title: "Doctor Roster", desc: "Live availability and shift management for medical staff.",
      cols: ["Doctor", "Department", "Shift", "Current Location", "Status"],
      rows: [
        ["Dr. Rajesh Sharma", "Cardiology", "Morning", "OPD Room 4", "Consulting"],
        ["Dr. Priya Iyer", "Neurology", "Morning", "ICU", "Rounding"],
        ["Dr. Amit Mehta", "Orthopedics", "Off Duty", "-", "Off"],
      ]
    },
    "Nursing": {
      title: "Nursing Station", desc: "Shift handovers, ward assignments, and critical alerts.",
      cols: ["Nurse", "Ward Assignment", "Shift", "Patients", "Status"],
      rows: [
        ["Sister Mary", "ICU", "Morning", "4", "Active"],
        ["Nurse Jacob", "General Ward A", "Morning", "12", "Active"],
        ["Nurse Anita", "Emergency", "Morning", "8", "Busy"],
      ]
    },
    "Laboratory": {
      title: "Laboratory & Diagnostics", desc: "Process pathology, hematology, and biochemistry requests.",
      cols: ["Req ID", "Patient", "Test Type", "Sample", "Status"],
      rows: [
        ["LAB-8901", "Ananya Rao", "Complete Blood Count", "Collected", "Processing"],
        ["LAB-8902", "Rajesh Kumar", "Lipid Profile", "Pending", "Awaiting Sample"],
        ["LAB-8903", "Vikram Malhotra", "HbA1c", "Collected", "Completed"],
      ]
    },
    "Radiology": {
      title: "Radiology & Imaging", desc: "Manage X-Ray, MRI, CT Scans, and Ultrasound queues.",
      cols: ["Scan ID", "Patient", "Modality", "Referring Dr", "Status"],
      rows: [
        ["RAD-402", "Sunita Verma", "Chest X-Ray", "Dr. Iyer", "Ready for Review"],
        ["RAD-403", "Kavita Nair", "MRI Brain", "Dr. Sharma", "In Progress"],
      ]
    },
    "Pharmacy": {
      title: "Pharmacy & Dispensary", desc: "Prescription fulfillment and stock alerts.",
      cols: ["Prescription", "Patient", "Items", "Payment", "Status"],
      rows: [
        ["RX-9921", "Ananya Rao", "3 Items", "Cleared", "Dispensed"],
        ["RX-9922", "Ramesh Das", "5 Items", "Pending", "Processing"],
      ]
    },
    "Billing": {
      title: "Billing & Insurance", desc: "Invoices, claims, and revenue cycle management.",
      cols: ["Invoice #", "Patient", "Amount", "Insurance", "Status"],
      rows: [
        ["INV-2041", "Ananya Rao", "₹ 1,500", "HDFC ERGO", "Paid"],
        ["INV-2042", "Ramesh Das", "₹ 45,000", "Star Health", "Claim Pending"],
      ]
    },
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
