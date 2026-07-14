import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./state";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import EventManagement from "./components/EventManagement";
import ExpenseManagement from "./components/ExpenseManagement";
import SplittingModule from "./components/SplittingModule";
import VendorManagement from "./components/VendorManagement";
import ReportsModule from "./components/ReportsModule";
import AIInsights from "./components/AIInsights";
import AIAssistant from "./components/AIAssistant";
import AdminPanel from "./components/AdminPanel";
import SettingsProfile from "./components/SettingsProfile";

import {
  LayoutDashboard, Brain, Bell, Settings,
  Wallet, Sparkles, Menu, ChevronRight,
  Shield, Calendar, DollarSign, Users, Briefcase, FileSpreadsheet, X
} from "lucide-react";

// Global CSS styles
const STYLES = `
  * { 
    box-sizing: border-box; 
    user-select: none;
    -webkit-user-select: none;
  }

  @keyframes aurora-1 {
    0%, 100% { transform: translate(0%,0%) scale(1); opacity: 0.65; }
    50%       { transform: translate(6%,-9%) scale(1.12); opacity: 0.85; }
  }
  @keyframes aurora-2 {
    0%, 100% { transform: translate(0%,0%) scale(1); opacity: 0.5; }
    50%       { transform: translate(-7%,5%) scale(0.88); opacity: 0.7; }
  }
  @keyframes aurora-3 {
    0%, 100% { transform: translate(0%,0%) scale(1); opacity: 0.4; }
    50%       { transform: translate(5%,7%) scale(1.2); opacity: 0.6; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-14px) rotate(1.5deg); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-10px) rotate(-1deg); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .aurora-1  { animation: aurora-1 14s ease-in-out infinite; }
  .aurora-2  { animation: aurora-2 17s ease-in-out infinite; }
  .aurora-3  { animation: aurora-3 11s ease-in-out infinite; }
  .float     { animation: float  7s ease-in-out infinite; }
  .float2    { animation: float2 9s ease-in-out infinite 1.5s; }
  .pulse-ring { animation: pulse-ring 2.5s ease-out infinite; }

  .glass {
    background: rgba(11, 16, 35, 0.45);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.07);
    transform: translateZ(0);
  }
  .glass-strong {
    background: rgba(8, 14, 32, 0.82);
    backdrop-filter: blur(48px);
    -webkit-backdrop-filter: blur(48px);
    border: 1px solid rgba(255,255,255,0.09);
    transform: translateZ(0);
  }
  .glass-subtle {
    background: rgba(255,255,255,0.028);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.05);
    transform: translateZ(0);
  }
  .gradient-text {
    background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #22D3EE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .gradient-border {
    border: 1px solid transparent !important;
    background-clip: padding-box;
    position: relative;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(34,211,238,0.3));
    z-index: -1;
  }
  .grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 64px 64px;
  }
  .shimmer-text {
    background: linear-gradient(90deg, #60A5FA 0%, #A78BFA 25%, #22D3EE 50%, #A78BFA 75%, #60A5FA 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .glow-blue { box-shadow: 0 0 28px rgba(59,130,246,0.35); }
  .glow-purple { box-shadow: 0 0 28px rgba(139,92,246,0.3); }
  .glow-cyan { box-shadow: 0 0 24px rgba(34,211,238,0.25); }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.25); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }

  body { 
    font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; 
    cursor: default;
  }
`;

function AuroraBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="grid-bg absolute inset-0 opacity-100" />
      <div className="aurora-1 absolute -top-48 -left-32 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.42) 0%, transparent 68%)", filter: "blur(72px)" }} />
      <div className="aurora-2 absolute top-16 -right-48 w-[800px] h-[800px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.36) 0%, transparent 68%)", filter: "blur(80px)" }} />
      <div className="aurora-3 absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, transparent 68%)", filter: "blur(88px)" }} />
    </div>
  );
}

// Sidebar links definition matching role permissions
function getSidebarItems(role: string) {
  const items = [
    { icon: <LayoutDashboard size={15} />, label: "Dashboard", page: "dashboard" },
    { icon: <Calendar size={15} />, label: "Event Workspaces", page: "events" },
    { icon: <DollarSign size={15} />, label: "Ledger Sheets", page: "expenses" },
    { icon: <Briefcase size={15} />, label: "Service Providers", page: "vendors" },
    { icon: <Users size={15} />, label: "Cost Splitting", page: "splits" },
    { icon: <FileSpreadsheet size={15} />, label: "Reports Module", page: "reports" },
    { icon: <Brain size={15} />, label: "AI Forecasts", page: "insights" },
    { icon: <Sparkles size={15} />, label: "AI Assistant", page: "assistant" },
  ];

  if (role === "Admin") {
    items.push({ icon: <Shield size={15} />, label: "Admin Console", page: "admin" });
  }

  items.push({ icon: <Settings size={15} />, label: "System Config", page: "settings" });
  return items;
}

function MainAppShell({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser, logout, notifications, markNotificationRead } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setNotificationsOpen(v => !v);
    window.addEventListener("toggle-notif", handleToggle);
    return () => window.removeEventListener("toggle-notif", handleToggle);
  }, []);

  const sidebarItems = getSidebarItems(currentUser?.role || "Participant");
  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <div className="flex pt-16 min-h-screen relative z-10 print:pt-0">
      
      {/* Collapsible Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 216 : 64 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="glass-strong shrink-0 border-r border-white/5 flex flex-col overflow-hidden h-[calc(100vh-4rem)] sticky top-16 z-30 print:hidden"
      >
        <div className="p-3 flex flex-col gap-1 flex-1">
          <div className={`flex items-center mb-3 px-1.5 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
            {sidebarOpen && <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">OPERATIONS</span>}
            <button onClick={() => setSidebarOpen(v => !v)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
              <Menu size={13} />
            </button>
          </div>

          {sidebarItems.map(it => (
            <button
              key={it.page}
              onClick={() => setPage(it.page)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                page === it.page
                  ? "text-white bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              } ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <span className={page === it.page ? "text-blue-400" : "group-hover:text-slate-300 transition-colors"}>
                {it.icon}
              </span>
              {sidebarOpen && <span className="truncate">{it.label}</span>}
              {sidebarOpen && page === it.page && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
            </button>
          ))}
        </div>

        {/* Sidebar Footer details */}
        <div className="p-3 border-t border-white/5 bg-black/10">
          <div
            onClick={() => setPage("settings")}
            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-tr from-blue-500 to-purple-500">
              {currentUser?.name ? currentUser.name.substr(0, 2).toUpperCase() : "US"}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold text-white truncate">{currentUser?.name}</div>
                <div className="text-[9px] text-slate-500 truncate">{currentUser?.role}</div>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => { logout(); setPage("landing"); }}
              className="w-full mt-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-[10px] font-bold text-red-300 transition-all cursor-pointer text-center"
            >
              Sign Out
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 min-w-0 relative z-10 print:p-0 print:m-0">
        
        {/* Navigation Dropdown Alert Banner (Print Hidden) */}
        {notificationsOpen && (
          <div className="fixed right-6 top-16 w-80 glass shadow-2xl rounded-3xl border border-white/10 p-4 z-40 space-y-3 print:hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-white">System Signal Notifications</span>
              <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-white p-0.5">
                <X size={13} />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-[10px]">No logs or warnings.</div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      notif.read ? "bg-white/[0.01] border-white/5 opacity-60" : "bg-blue-500/5 border-blue-500/25"
                    }`}
                  >
                    <div className="text-[10px] font-bold text-white flex justify-between">
                      <span>{notif.title}</span>
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 leading-normal">{notif.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Dynamic page switches */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {page === "dashboard" && <Dashboard setPage={setPage} />}
            {page === "events" && <EventManagement />}
            {page === "expenses" && <ExpenseManagement />}
            {page === "splits" && <SplittingModule />}
            {page === "vendors" && <VendorManagement />}
            {page === "reports" && <ReportsModule />}
            {page === "insights" && <AIInsights />}
            {page === "assistant" && <AIAssistant setPage={setPage} />}
            {page === "admin" && <AdminPanel />}
            {page === "settings" && <SettingsProfile />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function GlobalNavbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser, notifications } = useApp();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 glass-strong border-b border-white/5 print:hidden">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <button onClick={() => setPage(currentUser ? "dashboard" : "landing")} className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 pulse-ring">
            <Wallet size={15} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Expense<span className="gradient-text">Vision</span>
            <span className="text-blue-400 text-xs font-semibold ml-0.5">AI</span>
          </span>
        </button>

        {/* Global links */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-0.5">
            {[
              { label: "Dashboard", page: "dashboard" },
              { label: "AI Forecasts", page: "insights" },
              { label: "AI Planning Assistant", page: "assistant" }
            ].map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  page === l.page ? "text-white bg-white/5" : "text-slate-400 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => {
                // Find notifications panel and toggle it
                const ev = new CustomEvent("toggle-notif");
                window.dispatchEvent(ev);
              }}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <Bell size={17} />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#050816] flex items-center justify-center text-[5px] font-bold text-white">
                  {unreadNotifs.length}
                </span>
              )}
            </button>
          )}

          {currentUser ? (
            <div
              onClick={() => setPage("settings")}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-tr from-blue-500 to-purple-500 cursor-pointer"
            >
              {currentUser.name.substr(0, 2).toUpperCase()}
            </div>
          ) : (
            <button
              onClick={() => setPage("login")}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function MainApp({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser } = useApp();

  // Route guarding based on login
  if (!currentUser && page !== "landing" && page !== "login") {
    return <Auth setPage={setPage} />;
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#050816" }}>
      <style>{STYLES}</style>
      <AuroraBg />
      <div className="relative z-10">
        <GlobalNavbar page={page} setPage={setPage} />
        {currentUser && page !== "landing" ? (
          <MainAppShell page={page} setPage={setPage} />
        ) : page === "login" ? (
          <Auth setPage={setPage} />
        ) : (
          <Landing setPage={setPage} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <AppProvider>
      <MainApp page={page} setPage={setPage} />
    </AppProvider>
  );
}
