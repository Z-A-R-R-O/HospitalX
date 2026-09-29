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
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadQueue() {
      try {
        const mutations = await getSyncQueue();
        setQueue(mutations.map(m => ({
          id: m.id,
          action: m.entity,
          status: m.status,
          errorMessage: m.errorMessage || "Unknown conflict",
          date: new Date(m.createdAt).toISOString(),
          payload: m.payload,
          baseVersion: m.baseVersion,
          serverVersion: m.serverVersion
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

  const resolveConflict = async (id: string, resolution: 'keep_local' | 'keep_server') => {
    if (resolution === 'keep_server') {
      // Discard local changes
      await removeSyncMutation(id);
    } else {
      // Keep local: We need to update baseVersion to match serverVersion so it succeeds next time
      const mutation = queue.find(m => m.id === id);
      if (mutation && mutation.serverVersion) {
        await updateSyncMutation(id, { status: 'pending', attempts: 0, baseVersion: mutation.serverVersion, errorMessage: undefined });
      } else {
        await updateSyncMutation(id, { status: 'pending', attempts: 0, errorMessage: undefined });
      }
      triggerSync();
    }
    setResolvingId(null);
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
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Offline Sync Queue</h3>
      </div>
      
      <div style={{ background: "var(--c-glass-10)", border: "1px solid var(--c-glass-20)", borderRadius: "12px", overflow: "hidden" }}>
        {queue.map((mutation, idx) => (
          <div key={mutation.id} style={{ 
            padding: "16px", 
            borderBottom: idx === queue.length - 1 ? "none" : "1px solid var(--c-glass-20)",
            display: "flex", flexDirection: "column", gap: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ 
                    fontSize: "12px", 
                    background: mutation.status === 'conflict' ? 'var(--orange)' : mutation.status === 'failed' ? 'var(--red)' : 'var(--blue)', 
                    color: "white", 
                    padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" 
                  }}>
                    {mutation.status.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px" }}>{mutation.action}</span>
                </div>
                {mutation.errorMessage && (
                  <div style={{ fontSize: "14px", color: "var(--ink)", fontWeight: "500", display: "flex", alignItems: "center", gap: "6px" }}>
                    <AlertTriangle size={14} color={mutation.status === 'conflict' ? 'var(--orange)' : 'var(--red)'} />
                    {mutation.errorMessage}
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>
                  Created: {new Date(mutation.date).toLocaleString()}
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "8px" }}>
                {mutation.status === 'failed' && (
                  <button 
                    onClick={() => retryMutation(mutation.id)}
                    style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--c-glass-50)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    <RotateCcw size={14} /> Retry
                  </button>
                )}
                {mutation.status === 'conflict' && resolvingId !== mutation.id && (
                  <button 
                    onClick={() => setResolvingId(mutation.id)}
                    style={{ background: "var(--orange)", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                  >
                    Resolve Conflict
                  </button>
                )}
                {(mutation.status === 'syncing' || mutation.status === 'pending') && (
                  <span style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic", padding: "6px 12px" }}>
                    {mutation.status === 'syncing' ? 'Syncing...' : 'Pending Sync'}
                  </span>
                )}
              </div>
            </div>

            {resolvingId === mutation.id && (
              <div style={{ marginTop: "12px", padding: "16px", background: "var(--c-glass-10)", borderRadius: "8px", border: "1px solid var(--orange)" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--orange)" }}>Version Conflict Resolution</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div style={{ padding: "12px", background: "white", borderRadius: "6px", border: "1px solid var(--c-glass-20)" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--muted)", marginBottom: "8px" }}>LOCAL VERSION (Base: {mutation.baseVersion || '0'})</div>
                    <pre style={{ fontSize: "11px", margin: 0, whiteSpace: "pre-wrap", color: "var(--ink)", overflowX: "auto" }}>
                      {JSON.stringify(mutation.payload, null, 2)}
                    </pre>
                    <button 
                      onClick={() => resolveConflict(mutation.id, 'keep_local')}
                      style={{ marginTop: "12px", width: "100%", padding: "8px", background: "var(--blue)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                    >
                      Overwrite Server (Keep Local)
                    </button>
                  </div>
                  <div style={{ padding: "12px", background: "white", borderRadius: "6px", border: "1px solid var(--c-glass-20)" }}>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--muted)", marginBottom: "8px" }}>SERVER VERSION (v{mutation.serverVersion || 'Unknown'})</div>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>
                      The server contains newer data. Discarding local changes will revert to the server's state.
                    </div>
                    <button 
                      onClick={() => resolveConflict(mutation.id, 'keep_server')}
                      style={{ marginTop: "auto", width: "100%", padding: "8px", background: "transparent", color: "var(--ink)", border: "1px solid var(--c-glass-50)", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}
                    >
                      Discard Local (Keep Server)
                    </button>
                  </div>
                </div>
                <button onClick={() => setResolvingId(null)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "12px", textDecoration: "underline" }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}