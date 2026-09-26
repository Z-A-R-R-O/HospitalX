"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, User, AlertCircle, Clock, Calendar, CheckCircle, ChevronRight } from "lucide-react";
import {
  getAllReferrals,
  getPatient,
  getScreening,
} from "@/lib/offline/db";
import { OfflineReferral, OfflinePatient, OfflineScreening, Specialty, Urgency } from "@/lib/offline/types";

interface ReferralWithDetails extends OfflineReferral {
  patient?: OfflinePatient;
  screening?: OfflineScreening;
}

export default function ReferralListPage() {
  const [referrals, setReferrals] = useState<ReferralWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const allReferrals = await getAllReferrals();
        
        const enhanced = await Promise.all(
          allReferrals.map(async (ref) => {
            const patient = await getPatient(ref.patientLocalId);
            const screening = await getScreening(ref.screeningLocalId);
            return { ...ref, patient, screening };
          })
        );
        
        // Sort by urgency (urgent -> soon -> routine) then date
        enhanced.sort((a, b) => {
          const urgencyWeight = { urgent: 3, soon: 2, routine: 1 };
          const weightA = urgencyWeight[a.urgency] || 0;
          const weightB = urgencyWeight[b.urgency] || 0;
          
          if (weightA !== weightB) {
            return weightB - weightA;
          }
          return b.createdAt - a.createdAt;
        });
        
        setReferrals(enhanced);
      } catch (err) {
        console.error("Failed to load referrals:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getUrgencyColor = (urgency: Urgency) => {
    switch (urgency) {
      case "urgent": return "var(--red)";
      case "soon": return "var(--orange)";
      case "routine": return "var(--green)";
      default: return "var(--blue)";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "var(--orange)";
      case "synced": return "var(--blue)";
      case "appointment_booked": return "var(--purple)";
      case "completed": return "var(--green)";
      default: return "rgba(255,255,255,0.55)";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", color: "rgba(255,255,255,0.92)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", margin: 0 }}>My Referrals</h1>
        <Link 
          href="/health-worker/referral/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--blue)",
            color: "white",
            padding: "10px 16px",
            borderRadius: "12px",
            textDecoration: "none",
            fontWeight: "500",
            border: "none",
            cursor: "pointer"
          }}
        >
          <Plus size={18} />
          <span>Create Referral</span>
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.55)" }}>Loading referrals...</div>
      ) : referrals.length === 0 ? (
        <div style={{ 
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(30px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          color: "rgba(255,255,255,0.55)"
        }}>
          <AlertCircle size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <h3>No referrals yet</h3>
          <p>Create a referral after completing a patient screening.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {referrals.map(ref => (
            <div 
              key={ref.localId}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(30px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderLeft: `4px solid ${getUrgencyColor(ref.urgency)}`,
                borderRadius: "20px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <User size={18} color="rgba(255,255,255,0.55)" />
                    {ref.patient?.fullName || "Unknown Patient"}
                  </h3>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Calendar size={14} />
                    {new Date(ref.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end", maxWidth: "200px" }}>
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.92)",
                    textTransform: "capitalize"
                  }}>
                    {ref.specialty.replace('_', ' ')}
                  </span>
                  
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    backgroundColor: `${getUrgencyColor(ref.urgency)}33`,
                    color: getUrgencyColor(ref.urgency),
                    textTransform: "capitalize"
                  }}>
                    {ref.urgency}
                  </span>
                  
                  <span style={{ 
                    padding: "4px 10px", 
                    borderRadius: "20px", 
                    fontSize: "12px", 
                    fontWeight: "600",
                    backgroundColor: `${getStatusColor(ref.status)}33`,
                    color: getStatusColor(ref.status),
                    textTransform: "capitalize",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {ref.status === "synced" ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {ref.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {ref.screening?.riskLevel && (
                <div style={{ 
                  marginTop: "8px", 
                  padding: "8px 12px", 
                  backgroundColor: "rgba(0,0,0,0.2)", 
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)"
                }}>
                  <strong>Screening Risk:</strong> {ref.screening.riskLevel.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
