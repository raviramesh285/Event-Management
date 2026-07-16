import React from "react";
import { useApp } from "../state";
import { History, ShieldCheck } from "lucide-react";

export default function AuditLogs() {
  const { auditLogs, currentUser } = useApp();

  if (currentUser?.role !== "Admin") {
    return <div className="p-6 text-red-400">Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-6 text-slate-300">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <History size={24} className="text-blue-400" /> Audit Logs
        </h2>
        <p className="text-slate-400 text-xs mt-1">Immutable record of system activities.</p>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="space-y-4">
          {auditLogs.map(log => (
            <div key={log.id} className="flex gap-4 items-start p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                <ShieldCheck size={14} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-bold text-white">{log.action}</div>
                  <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">{log.details}</div>
                <div className="text-[9px] text-slate-500 mt-2 font-mono">User ID: {log.user_id} | Ref: {log.id}</div>
              </div>
            </div>
          ))}
          {auditLogs.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">No audit logs available.</div>}
        </div>
      </div>
    </div>
  );
}
