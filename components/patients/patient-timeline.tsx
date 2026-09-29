"use client";

import React, { useEffect, useState } from "react";
import { Clock, User, Activity, AlertCircle, ArrowRight } from "lucide-react";

export interface TimelineEvent {
  id: string;
  type: string;
  actor: string;
  source: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed' | 'in_progress';
  owner?: string;
  nextAction?: string;
  details?: string;
}

export function PatientTimeline({ patientId }: { patientId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        // In the full vertical slice, we will query persisted events from Agent 1 API
        // or local offline store. For now, fetch from a generalized /api/patients/[id]/events route.
        const res = await fetch(`/api/patients/${patientId}/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        } else {
          // Fallback demo data if route doesn't exist yet
          setEvents([
            {
              id: "evt-1",
              type: "Registration",
              actor: "Health Worker A",
              source: "Offline App",
              timestamp: Date.now() - 86400000 * 2, // 2 days ago
              status: "completed",
            },
            {
              id: "evt-2",
              type: "Screening",
              actor: "Health Worker A",
              source: "Offline App",
              timestamp: Date.now() - 86400000,
              status: "completed",
              details: "High risk identified.",
              owner: "Specialist Queue",
              nextAction: "Review required"
            },
            {
              id: "evt-3",
              type: "Referral",
              actor: "System Sync",
              source: "Server",
              timestamp: Date.now() - 3600000,
              status: "pending",
              owner: "Dr. Smith",
              nextAction: "Book appointment"
            }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, [patientId]);

  if (loading) {
    return <div style={{ padding: "20px", color: "var(--muted)" }}>Loading timeline...</div>;
  }

  if (events.length === 0) {
    return <div style={{ padding: "20px", color: "var(--muted)" }}>No events recorded.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "16px" }}>
      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
        <Activity size={18} color="var(--blue)" /> Patient Timeline
      </h3>
      
      <div style={{ position: "relative", paddingLeft: "16px", borderLeft: "2px solid var(--c-glass-20)" }}>
        {events.map((evt, idx) => (
          <div key={evt.id} style={{ position: "relative", marginBottom: idx === events.length - 1 ? 0 : "24px" }}>
            <div style={{ 
              position: "absolute", left: "-25px", top: "0px", 
              width: "16px", height: "16px", borderRadius: "50%", 
              background: evt.status === 'completed' ? "var(--green)" : evt.status === 'pending' ? "var(--orange)" : "var(--blue)",
              border: "3px solid white", boxShadow: "0 0 0 1px var(--c-glass-20)"
            }} />
            
            <div style={{ background: "white", padding: "16px", borderRadius: "8px", border: "1px solid var(--c-glass-20)", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "var(--ink)" }}>
                    {evt.type}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", color: "var(--muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><User size={12} /> {evt.actor} ({evt.source})</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={12} /> {new Date(evt.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <span style={{ 
                  fontSize: "11px", fontWeight: "bold", textTransform: "uppercase",
                  padding: "2px 8px", borderRadius: "12px",
                  background: evt.status === 'completed' ? "rgba(16, 185, 129, 0.1)" : evt.status === 'pending' ? "rgba(245, 158, 11, 0.1)" : "rgba(59, 130, 246, 0.1)",
                  color: evt.status === 'completed' ? "var(--green)" : evt.status === 'pending' ? "var(--orange)" : "var(--blue)"
                }}>
                  {evt.status}
                </span>
              </div>
              
              {evt.details && (
                <div style={{ fontSize: "13px", color: "var(--ink)", marginTop: "8px", padding: "8px", background: "var(--c-glass-5)", borderRadius: "4px" }}>
                  {evt.details}
                </div>
              )}
              
              {(evt.owner || evt.nextAction) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed var(--c-glass-20)", fontSize: "12px" }}>
                  {evt.owner && (
                    <span style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <strong>Owner:</strong> {evt.owner}
                    </span>
                  )}
                  {evt.owner && evt.nextAction && <ArrowRight size={12} color="var(--c-glass-50)" />}
                  {evt.nextAction && (
                    <span style={{ color: "var(--blue)", fontWeight: "500", display: "flex", alignItems: "center", gap: "4px" }}>
                      <AlertCircle size={12} /> {evt.nextAction}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
