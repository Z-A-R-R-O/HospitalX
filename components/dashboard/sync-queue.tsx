"use client";
/*
 * Copyright (c) 2026 Veyminore. All rights reserved.
 * 
 * This software is the confidential and proprietary information of Veyminore.
 * You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with Veyminore.
 */

import React, { useEffect, useState } from "react";
import { ServerCrash, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";
import { getSyncQueue, updateSyncMutation, removeSyncMutation } from "@/lib/offline/db";
import { triggerSync } from "@/lib/offline/sync-engine";
export function SyncQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadQueue() {
      try {
        const mutations = await getSyncQueue();
        setQueue(mutations.map(m => ({
          id: m.id,
          action: m.entity,
          status: m.status,
          errorMessage: m.errorMessage || "Unknown conflict",
          date: new Date(m.createdAt).toISOString()
        })));
      } catch (e) {
        console.error("Failed to load sync queue", e);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
    // Optional: poll every 5s
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);
  const retryMutation = async (id: string) => {
    await updateSyncMutation(id, { status: 'pending', attempts: 0, errorMessage: undefined });
    setQueue(q => q.map(m => m.id === id ? { ...m, status: 'pending', errorMessage: undefined } : m));
    triggerSync();
  };
  const resolveConflict = async (id: string) => {
    // In a real app, open a modal. For now, just discard the failed mutation.
    await removeSyncMutation(id);
    setQueue(q => q.filter(m => m.id !== id));
  };
  if (loading) return null;
  if (queue.length === 0) {
    return (
      <div style={{ padding: "24px", color: "var(--muted)", display: "flex", gap: "8px", alignItems: "center" }}>
        <CheckCircle2 size={16} color="var(--green)" /> No offline sync conflicts detected. System healthy.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--orange)" }}>
        <ServerCrash size={18} />
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Offline Sync Conflicts</h3>
      </div>
      
      <div style={{ background: "rgba(255,100,0,0.05)", border: "1px solid var(--orange)", borderRadius: "12px", overflow: "hidden" }}>
        {queue.map((mutation, idx) => (
          <div key={mutation.id} style={{ 
            padding: "16px", 
            borderBottom: idx === queue.length - 1 ? "none" : "1px solid rgba(255,100,0,0.2)",
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap"
          }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ 
                  fontSize: "12px", background: "var(--red)", color: "white", 
                  padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" 
                }}>
                  {mutation.status.toUpperCase()}
                </span>
                <span style={{ fontFamily: "monospace", fontSize: "13px" }}>{mutation.action}</span>
              </div>
              <div style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertTriangle size={14} color="var(--red)" />
                {mutation.errorMessage}
              </div>
              <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                {new Date(mutation.date).toLocaleString()}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "8px" }}>
              {mutation.status === 'failed' && (
                <>
                  <button 
                    onClick={() => retryMutation(mutation.id)}
                    style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--c-glass-50)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <RotateCcw size={14} /> Retry
                  </button>
                  <button 
                    onClick={() => resolveConflict(mutation.id)}
                    style={{ background: "var(--orange)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                  >
                    Resolve Manually
                  </button>
                </>
              )}
              {mutation.status === 'syncing' && (
                <span style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>Syncing...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
