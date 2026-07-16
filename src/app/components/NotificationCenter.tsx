import React from "react";
import { useApp } from "../state";
import { Bell, Check } from "lucide-react";

export default function NotificationCenter() {
  const { notifications, currentUser, markNotificationRead } = useApp();
  
  if (!currentUser) return null;

  const myNotifications = notifications.filter(n => n.user_id === currentUser.id);

  return (
    <div className="space-y-6 text-slate-300">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Bell size={24} className="text-blue-400" /> Notification Center
        </h2>
        <p className="text-slate-400 text-xs mt-1">System alerts and workflow updates.</p>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="space-y-3">
          {myNotifications.map(n => (
            <div key={n.id} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${n.read ? 'bg-white/[0.01] border-white/5 opacity-60' : 'bg-blue-500/5 border-blue-500/20'}`}>
              <div className="flex gap-4 items-center">
                <div className={`w-2 h-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-blue-500'}`} />
                <div>
                  <div className="text-sm font-semibold text-white">{n.message}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{new Date(n.timestamp).toLocaleString()}</div>
                </div>
              </div>
              {!n.read && (
                <button onClick={() => markNotificationRead(n.id)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                  <Check size={16} />
                </button>
              )}
            </div>
          ))}
          {myNotifications.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">You have no notifications.</div>}
        </div>
      </div>
    </div>
  );
}
