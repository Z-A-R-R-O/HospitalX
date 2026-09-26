"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertTriangle, Activity, Stethoscope, Save, Clock } from "lucide-react";
import {
  getScreening,
  getPatient,
  saveReferral,
} from "@/lib/offline/db";
import { queueReferralSync } from "@/lib/offline/sync-queue";
import { OfflinePatient, OfflineScreening, Specialty, Urgency } from "@/lib/offline/types";

const RISK_LABELS: Record<string, string> = { 
  low_concern: 'Low Concern', 
  review_recommended: 'Review Recommended', 
  specialist_referral_recommended: 'Specialist Referral Recommended' 
};

const RISK_COLORS: Record<string, string> = { 
  low_concern: '#0a9c6d', 
  review_recommended: '#ef9519', 
  specialist_referral_recommended: '#ef4148' 
};

function CreateReferralForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const screeningLocalId = searchParams.get("screening");

  const [screening, setScreening] = useState<OfflineScreening | null>(null);
  const [patient, setPatient] = useState<OfflinePatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [specialty, setSpecialty] = useState<Specialty>("general_medicine");
  const [urgency, setUrgency] = useState<Urgency>("routine");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!screeningLocalId) {
        setError("No screening ID provided");
        setLoading(false);
        return;
      }
      try {
        const s = await getScreening(screeningLocalId);
        if (!s) {
          setError("Screening not found");
          return;
        }
        setScreening(s);

        const p = await getPatient(s.patientLocalId);
        if (p) setPatient(p);

        // Auto-suggestions
        if (s.riskLevel === "specialist_referral_recommended") {
          setUrgency("urgent");
        } else if (s.riskLevel === "review_recommended") {
          setUrgency("soon");
        }

        const obsString = (s.observations || []).join(", ");
        if (obsString.toLowerCase().includes("tremor") || obsString.toLowerCase().includes("motor")) {
          setSpecialty("neurology");
        } else if (obsString.toLowerCase().includes("memory")) {
          setSpecialty("geriatrics");
        }

        if (s.observations && s.observations.length > 0) {
          setReason(`Referred due to screening observations: ${s.observations[0]}`);
        }

      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [screeningLocalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screening || !patient) return;
    
    setSaving(true);
    try {
      const localId = crypto.randomUUID();
      const idempotencyKey = crypto.randomUUID();
      
      const referral = {
        localId,
        idempotencyKey,
        screeningLocalId: screening.localId,
        patientLocalId: patient.localId,
        workerId: "worker-1", // Would normally come from auth context
        specialty,
        urgency,
        reason,
        workerNotes: notes,
        status: "pending" as const,
        createdAt: Date.now()
      };

      await saveReferral(referral);
      
      try {
        await queueReferralSync(referral);
      } catch (e) {
        console.warn("Failed to queue sync, will retry later", e);
      }

      alert("Referral created! Will sync and book appointment when online.");
      router.push("/health-worker/referral");
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create referral");
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "rgba(255,255,255,0.92)",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box" as const,
    marginTop: "6px"
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "4px",
    fontWeight: "500"
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center", color: "white" }}>Loading...</div>;
  if (error) return <div style={{ padding: "40px", color: "var(--red)" }}>{error}</div>;
  if (!screening || !patient) return null;

  const riskColor = screening.riskLevel ? RISK_COLORS[screening.riskLevel] || "var(--blue)" : "var(--blue)";
  const riskLabel = screening.riskLevel ? RISK_LABELS[screening.riskLevel] || "Unknown Risk" : "Unknown Risk";

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", color: "rgba(255,255,255,0.92)" }}>
      <div style={{ marginBottom: "24px" }}>
        <button 
          onClick={() => router.back()} 
          style={{ 
            background: "none", border: "none", color: "rgba(255,255,255,0.55)", 
            display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
            padding: 0, marginBottom: "16px"
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ fontSize: "28px", fontWeight: "600", margin: 0 }}>Create Referral</h1>
        <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "8px" }}>For {patient.fullName}</p>
      </div>

      <div style={{ 
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(30px) saturate(160%)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "24px"
      }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={18} color="var(--blue)" /> Screening Summary
        </h3>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", display: "block", marginBottom: "4px" }}>Risk Level</span>
            <div style={{ color: riskColor, fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertTriangle size={16} /> {riskLabel}
            </div>
          </div>
          <div style={{ flex: "1", minWidth: "100px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", display: "block", marginBottom: "4px" }}>Score</span>
            <div style={{ fontSize: "18px", fontWeight: "600" }}>
              {screening.totalScore !== undefined ? `${screening.totalScore} / ${screening.maxScore || '?'}` : 'N/A'}
            </div>
          </div>
        </div>

        {screening.observations && screening.observations.length > 0 && (
          <div>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", display: "block", marginBottom: "4px" }}>Key Observations</span>
            <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
              {screening.observations.map((obs, i) => <li key={i}>{obs}</li>)}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label style={labelStyle}>Specialty</label>
            <select 
              value={specialty} 
              onChange={(e) => setSpecialty(e.target.value as Specialty)}
              style={inputStyle}
            >
              <option value="general_medicine">General Medicine</option>
              <option value="neurology">Neurology</option>
              <option value="geriatrics">Geriatrics</option>
            </select>
          </div>
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label style={labelStyle}>Urgency</label>
            <select 
              value={urgency} 
              onChange={(e) => setUrgency(e.target.value as Urgency)}
              style={{
                ...inputStyle,
                color: urgency === "urgent" ? "var(--red)" : urgency === "soon" ? "var(--orange)" : "var(--green)"
              }}
            >
              <option value="routine">Routine</option>
              <option value="soon">Soon</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Reason for Referral</label>
          <input 
            type="text" 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            style={inputStyle}
            required
            placeholder="Main reason for referral..."
          />
        </div>

        <div>
          <label style={labelStyle}>Worker Notes (Optional)</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            placeholder="Add any additional context..."
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          style={{
            backgroundColor: "var(--blue)",
            color: "white",
            padding: "14px 24px",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "12px",
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? <Clock size={20} /> : <Save size={20} />}
          {saving ? "Saving..." : "Create Referral"}
        </button>
      </form>
    </div>
  );
}

export default function NewReferralPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px", color: "white" }}>Loading form...</div>}>
      <CreateReferralForm />
    </Suspense>
  );
}
