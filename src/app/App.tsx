import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./state";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import EventManagement from "./components/EventManagement";
import ExpenseManagement from "./components/ExpenseManagement";
import ReportsModule from "./components/ReportsModule";
import AIInsights from "./components/AIInsights";

// New components
import AccessManagement from "./components/AccessManagement";
import AuditLogs from "./components/AuditLogs";
import UserIdCenter from "./components/UserIdCenter";
import DepartmentsManagement from "./components/DepartmentsManagement";
import BudgetAllocation from "./components/BudgetAllocation";
import ExpenseApprovals from "./components/ExpenseApprovals";

import {
  LayoutDashboard, Brain, Settings,
  Wallet, Menu, Shield, Calendar, DollarSign,
  Layers, CheckSquare, PieChart, Activity, X,
  History, UserCog, Key
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
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  .aurora-1  { animation: aurora-1 14s ease-in-out infinite; }
  .aurora-2  { animation: aurora-2 17s ease-in-out infinite; }
  .aurora-3  { animation: aurora-3 11s ease-in-out infinite; }
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
  .gradient-text {
    background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #22D3EE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 64px 64px;
  }
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

function getSidebarItems(role: string) {
  if (role === "Admin") {
    return [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard", page: "dashboard" },
      { icon: <Shield size={15} />, label: "Access Management", page: "access" },
      { icon: <Calendar size={15} />, label: "Events", page: "events" },
      { icon: <Layers size={15} />, label: "Departments", page: "departments" },
      { icon: <DollarSign size={15} />, label: "Budgets", page: "budgets" },
      { icon: <CheckSquare size={15} />, label: "Expense Approvals", page: "approvals" },
      { icon: <PieChart size={15} />, label: "Reports", page: "reports" },
      { icon: <Activity size={15} />, label: "Analytics", page: "analytics" },
      { icon: <Brain size={15} />, label: "AI Financial Intelligence", page: "insights" },
      { icon: <Key size={15} />, label: "User ID Center", page: "useridcenter" },
      { icon: <History size={15} />, label: "Audit Logs", page: "audit" },
      { icon: <Settings size={15} />, label: "Settings", page: "settings" }
    ];
  }
  if (role === "Event Manager") {
    return [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard", page: "dashboard" },
      { icon: <Layers size={15} />, label: "Departments", page: "departments" },
      { icon: <DollarSign size={15} />, label: "Budget Allocation", page: "budgets" },
      { icon: <CheckSquare size={15} />, label: "Expense Requests", page: "approvals" },
      { icon: <PieChart size={15} />, label: "Reports", page: "reports" },
      { icon: <Activity size={15} />, label: "Analytics", page: "analytics" },
      { icon: <Brain size={15} />, label: "AI Insights", page: "insights" }
    ];
  }
  if (role === "Department Manager") {
    return [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard", page: "dashboard" },
      { icon: <DollarSign size={15} />, label: "Expenses", page: "expenses" },
      { icon: <PieChart size={15} />, label: "Cost Breakdown", page: "analytics" },
      { icon: <UserCog size={15} />, label: "Upload Bills", page: "upload" },
      { icon: <PieChart size={15} />, label: "Reports", page: "reports" }
    ];
  }
  return [];
}

function MainAppShell({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = getSidebarItems(currentUser?.role || "");

  return (
    <div className="flex pt-16 min-h-screen relative z-10 print:pt-0">
      
      <motion.aside
        animate={{ width: sidebarOpen ? 230 : 64 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="glass-strong shrink-0 border-r border-white/5 flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-30 print:hidden"
      >
        <div className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
          <div className={`flex items-center mb-3 px-1.5 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
            {sidebarOpen && <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">NAVIGATION</span>}
            <button onClick={() => setSidebarOpen(v => !v)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
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
              <span className={page === it.page ? "text-blue-400" : "group-hover:text-slate-300 transition-colors relative"}>
                {it.icon}
              </span>
              {sidebarOpen && <span className="truncate flex-1 text-left">{it.label}</span>}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-white/5 bg-black/10">
          <div className={`flex items-center gap-2.5 p-2 rounded-xl ${!sidebarOpen ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-tr from-blue-500 to-purple-500">
              {currentUser?.name ? currentUser.name.substr(0, 2).toUpperCase() : "US"}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 text-left flex-1">
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

      <main className="flex-1 p-6 min-w-0 relative z-10 print:p-0 print:m-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {page === "dashboard" && <Dashboard setPage={setPage} />}
            {page === "access" && <AccessManagement />}
            {page === "events" && <EventManagement />}
            {page === "departments" && <DepartmentsManagement />}
            {page === "budgets" && <BudgetAllocation />}
            {page === "approvals" && <ExpenseApprovals />}
            {page === "expenses" && <ExpenseManagement />}
            {page === "upload" && <ExpenseManagement />}
            {page === "reports" && <ReportsModule />}
            {page === "analytics" && <Dashboard setPage={setPage} />} 
            {page === "insights" && <AIInsights />}
            {page === "audit" && <AuditLogs />}
            {page === "useridcenter" && <UserIdCenter />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function GlobalNavbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser } = useApp();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300 glass-strong border-b border-white/5 print:hidden">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        <button onClick={() => setPage(currentUser ? "dashboard" : "landing")} className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 pulse-ring">
            <Wallet size={15} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Expense<span className="gradient-text">Vision</span>
            <span className="text-blue-400 text-xs font-semibold ml-0.5">ERP</span>
          </span>
        </button>

        {currentUser && (
          <div className="hidden md:flex items-center gap-0.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{currentUser.role} CONSOLE</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-tr from-blue-500 to-purple-500 cursor-pointer">
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
