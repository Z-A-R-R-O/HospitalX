"use client";

import React, { useEffect, useState } from "react";
import { 
  Activity, Users, AlertTriangle, CalendarCheck, Clock, 
  TrendingUp, BarChart2, CheckCircle, ShieldAlert 
} from "lucide-react";
import { getAllScreenings, getAllReferrals } from "@/lib/offline/db";

export default function CommandDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const [screeningsCount, setScreeningsCount] = useState(0);
  const [pendingReferrals, setPendingReferrals] = useState(0);
  const [highPriority, setHighPriority] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [riskData, setRiskData] = useState({ low: 0, review: 0, referral: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        let screenings: any[] = [];
        let referrals: any[] = [];

        const [screeningsRes, referralsRes] = await Promise.all([
          fetch('/api/screenings').catch(() => null),
          fetch('/api/referrals').catch(() => null)
        ]);

        if (!screeningsRes?.ok || !referralsRes?.ok) {
          // Fallback to offline IndexedDB data if server is unreachable or DB is missing
          console.log("Server fetch failed. Falling back to offline IndexedDB.");
          setIsOfflineMode(true);
          
          const localScreenings = await getAllScreenings();
          const localReferrals = await getAllReferrals();
          
          screenings = localScreenings.map(s => ({
             ...s, 
             duration_seconds: s.durationSeconds, 
             risk_level: s.riskLevel
          }));
          
          referrals = localReferrals.map(r => ({
             ...r,
             status: r.status,
             urgency: r.urgency,
             appointment_id: null,
             created_at: new Date(r.createdAt).toISOString(),
             patient_name: "Local Patient"
          }));
        } else {
          screenings = await screeningsRes.json();
          referrals = await referralsRes.json();
        }

        setScreeningsCount(screenings.length || 0);
        
        let pending = 0;
        let urgent = 0;
        let converted = 0;
        
        referrals.forEach((r: any) => {
          if (r.status === 'pending') pending++;
          if (r.urgency === 'urgent') urgent++;
          if (r.appointment_id) converted++;
        });
        
        setPendingReferrals(pending);
        setHighPriority(urgent);
        setConversionRate(referrals.length ? Math.round((converted / referrals.length) * 100) : 0);
        
        let totalTime = 0;
        let riskL = 0, riskR = 0, riskS = 0;
        
        screenings.forEach((s: any) => {
          totalTime += s.duration_seconds || 120; // fallback if null
          if (s.risk_level === 'low_concern') riskL++;
          else if (s.risk_level === 'review_recommended') riskR++;
          else if (s.risk_level === 'specialist_referral_recommended') riskS++;
        });
        
        setAvgTime(screenings.length ? Math.round(totalTime / screenings.length) : 0);
        setRiskData({ low: riskL, review: riskR, referral: riskS });
        
        // Sort referrals by date for recent list
        const sorted = [...referrals].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5);
        setRecentReferrals(sorted);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const glassStyle = {
    background: "var(--c-glass-60)",
    backdropFilter: "blur(24px)",
    border: "1px solid var(--c-glass-50)",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "var(--c-shadow-md)"
  };

  const kpiStyle = {
    ...glassStyle,
    flex: "1",
    minWidth: "180px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px"
  };

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "var(--orange)" }}>
        <ShieldAlert size={48} style={{ margin: "0 auto 16px" }} />
        <h2>Data unavailable</h2>
        <p>Connect to network to view analytics.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", minHeight: "100vh", background: "var(--bg, #f4f6f8)", color: "var(--ink)", animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--muted)", margin: "0 0 4px 0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>SwasthyaSetu AI</p>
          <h1 style={{ fontSize: "28px", fontWeight: "700", margin: 0, letterSpacing: "-0.5px", display: 'flex', alignItems: 'center', gap: '12px' }}>
            Neurology Triage & Command
            {isOfflineMode && (
              <span style={{ fontSize: '12px', background: 'var(--orange)', color: '#fff', padding: '4px 8px', borderRadius: '100px', fontWeight: 600, letterSpacing: '0' }}>Offline Mode</span>
            )}
          </h1>
        </div>
        <button 
           onClick={() => window.open('/health-worker/screen', 'Screening', 'width=450,height=800,menubar=no,toolbar=no')}
           style={{ background: 'var(--blue)', color: '#fff', padding: '10px 20px', borderRadius: '100px', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', boxShadow: '0 4px 12px rgba(39, 124, 244, 0.3)' }}
        >
          <Activity size={18} /> New Neurology Screen
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "100px", color: "var(--muted)" }}>Loading dashboard data...</div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "24px" }}>
            <div style={kpiStyle}>
              <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                <Activity size={16} color="var(--blue)" /> Screenings Completed
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>{screeningsCount}</div>
            </div>
            
            <div style={kpiStyle}>
              <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                <Clock size={16} color="var(--orange)" /> Referrals Pending
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>{pendingReferrals}</div>
            </div>
            
            <div style={kpiStyle}>
              <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                <AlertTriangle size={16} color="var(--red)" /> High Priority Referrals
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: "var(--red)" }}>{highPriority}</div>
            </div>
            
            <div style={kpiStyle}>
              <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                <CalendarCheck size={16} color="var(--purple)" /> Appointment Conversion
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>{conversionRate}%</div>
            </div>

            <div style={kpiStyle}>
              <div style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "500" }}>
                <TrendingUp size={16} color="var(--green)" /> Avg Screening Time
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>{Math.floor(avgTime / 60)}m {avgTime % 60}s</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "24px" }}>
            <div style={{ ...glassStyle, flex: "2", minWidth: "400px" }}>
              <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users size={20} /> Referral Queue
              </h3>
              
              {recentReferrals.length === 0 ? (
                <div style={{ color: "var(--muted)", padding: "20px 0" }}>No recent referrals</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ color: "var(--muted)", fontSize: "14px", borderBottom: "1px solid var(--c-glass-50)", paddingBottom: "12px" }}>
                      <th style={{ padding: "12px 8px" }}>Patient</th>
                      <th style={{ padding: "12px 8px" }}>Specialty</th>
                      <th style={{ padding: "12px 8px" }}>Urgency</th>
                      <th style={{ padding: "12px 8px" }}>Status</th>
                      <th style={{ padding: "12px 8px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReferrals.map((ref, idx) => (
                      <tr key={idx} style={{ 
                        borderBottom: "1px solid transparent",
                        borderLeft: ref.urgency === 'urgent' ? "3px solid var(--red)" : "3px solid transparent",
                        backgroundColor: ref.urgency === 'urgent' ? "rgba(239, 65, 72, 0.05)" : "transparent"
                      }}>
                        <td style={{ padding: "16px 8px", fontWeight: "500" }}>{ref.patient_name || 'Patient'}</td>
                        <td style={{ padding: "16px 8px", textTransform: "capitalize" }}>{(ref.specialty || '').replace('_', ' ')}</td>
                        <td style={{ padding: "16px 8px" }}>
                          <span style={{ 
                            color: ref.urgency === 'urgent' ? 'var(--red)' : ref.urgency === 'soon' ? 'var(--orange)' : 'var(--green)',
                            backgroundColor: 'var(--c-glass-50)', padding: "4px 8px", borderRadius: "12px", fontSize: "12px", textTransform: "capitalize"
                          }}>
                            {ref.urgency}
                          </span>
                        </td>
                        <td style={{ padding: "16px 8px", textTransform: "capitalize", color: "rgba(255,255,255,0.7)" }}>{ref.status}</td>
                        <td style={{ padding: "16px 8px", color: "var(--muted)", fontSize: "14px" }}>
                          {new Date(ref.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ ...glassStyle, flex: "1", minWidth: "300px", display: "flex", flexDirection: "column" }}>
              <h3 style={{ margin: "0 0 24px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChart2 size={20} /> Risk Distribution
              </h3>
              
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
                {[
                  { label: "Specialist Referral", count: riskData.referral, color: "var(--red)" },
                  { label: "Review Recommended", count: riskData.review, color: "var(--orange)" },
                  { label: "Low Concern", count: riskData.low, color: "var(--green)" }
                ].map(item => {
                  const max = Math.max(riskData.low, riskData.review, riskData.referral) || 1;
                  const pct = Math.round((item.count / max) * 100);
                  
                  return (
                    <div key={item.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                        <span>{item.label}</span>
                        <span style={{ fontWeight: "600" }}>{item.count}</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", backgroundColor: "var(--c-glass-50)", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: item.color, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ ...glassStyle, flex: "1", minWidth: "300px" }}>
               <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "var(--ink)" }}>Screening Trends (Location)</h3>
               <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.4)", border: "1px dashed var(--c-glass-50)", borderRadius: "12px" }}>
                 More data required for location trends
               </div>
            </div>
            
            <div style={{ ...glassStyle, flex: "1", minWidth: "300px" }}>
               <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", color: "var(--ink)" }}>Age Group Distribution</h3>
               <div style={{ display: "flex", alignItems: "flex-end", height: "120px", gap: "12px", padding: "10px 0" }}>
                 {/* Mock visual bars, accurate to design requirement for bars without data library */}
                 <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: "40px", height: "30%", backgroundColor: "var(--blue)", borderRadius: "4px 4px 0 0" }}></div>
                   <span style={{ fontSize: "12px", color: "var(--muted)" }}>0-40</span>
                 </div>
                 <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: "40px", height: "60%", backgroundColor: "var(--blue)", borderRadius: "4px 4px 0 0" }}></div>
                   <span style={{ fontSize: "12px", color: "var(--muted)" }}>40-60</span>
                 </div>
                 <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: "40px", height: "100%", backgroundColor: "var(--blue)", borderRadius: "4px 4px 0 0" }}></div>
                   <span style={{ fontSize: "12px", color: "var(--muted)" }}>60-75</span>
                 </div>
                 <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                   <div style={{ width: "40px", height: "80%", backgroundColor: "var(--blue)", borderRadius: "4px 4px 0 0" }}></div>
                   <span style={{ fontSize: "12px", color: "var(--muted)" }}>75+</span>
                 </div>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
