import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, CheckCircle, Clock, Calendar, Ticket, AlertCircle, X, Check } from "lucide-react";

const NOTIFICATIONS_DATA = [
  { id: 1, type: "registration", title: "New Registration", message: "Rahul Kumar just registered for Global Tech Summit 2026.", time: "10 mins ago", read: false, icon: Ticket, color: "#4CAF50" },
  { id: 2, type: "system",       title: "Payment Processed", message: "Payout of ₹48,000 for Sunset Carnival has been processed to your bank.", time: "2 hours ago", read: false, icon: CheckCircle, color: "#FFFFFF" },
  { id: 3, type: "event",        title: "Event Approaching", message: "HackIndia '26 starts in exactly 3 days. Review your checklist.", time: "5 hours ago", read: false, icon: Calendar, color: "#CCCCCC" },
  { id: 4, type: "alert",        title: "Capacity Warning",  message: "VIP tickets for Tech Summit are 95% sold out.", time: "1 day ago", read: true, icon: AlertCircle, color: "#F44336" },
  { id: 5, type: "registration", title: "Bulk Booking",      message: "Acme Corp booked 20 passes for Leaders Networking Gala.", time: "2 days ago", read: true, icon: Ticket, color: "#4CAF50" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const [tab, setTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filtered = notifications.filter(n => {
    if (tab === "unread") return !n.read;
    return true;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3" style={{ color: "#FFFFFF" }}>
            Notifications 
            {unreadCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF", verticalAlign: "middle" }}>
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Stay updated with your latest event activities</p>
        </div>
        <div className="flex gap-2">
          {["all", "unread"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-all"
              style={{
                background: tab === t ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                color: tab === t ? "#FFFFFF" : "rgba(229,229,229,0.5)",
                border: `1px solid ${tab === t ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`
              }}>
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-sm font-bold" style={{ color: "#FFFFFF" }}>Recent Activity</div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              style={{ color: "#FFFFFF" }}>
              <Check size={14} /> Mark all as read
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="mx-auto mb-4 opacity-20" style={{ color: "#FFFFFF" }} />
            <div className="text-sm font-semibold" style={{ color: "rgba(229,229,229,0.5)" }}>You're all caught up!</div>
            <div className="text-xs mt-1" style={{ color: "rgba(229,229,229,0.4)" }}>No {tab === "unread" ? "unread " : ""}notifications to show.</div>
          </div>
        ) : (
          <div className="divide-y divide-[rgba(255,255,255,0.04)]">
            <AnimatePresence>
              {filtered.map((n) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    className={`flex items-start gap-4 p-5 transition-colors relative group ${!n.read ? "bg-[rgba(255,255,255,0.04)]" : "hover:bg-[rgba(255,255,255,0.02)]"}`}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md"
                        style={{ background: "#FFFFFF" }} />
                    )}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${n.color}15`, color: n.color }}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 pr-8">
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-sm font-bold" style={{ color: !n.read ? "#FFFFFF" : "rgba(229,229,229,0.8)" }}>{n.title}</div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(229,229,229,0.4)" }}>
                          <Clock size={10} /> {n.time}
                        </div>
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: "rgba(229,229,229,0.6)" }}>{n.message}</div>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-red-500/10 hover:text-red-500"
                      style={{ color: "rgba(229,229,229,0.3)" }}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
