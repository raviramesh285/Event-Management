import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppProvider, useApp } from "./state";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import EventManagement from "./components/EventManagement";
import ExpenseManagement from "./components/ExpenseManagement";
import VendorManagement from "./components/VendorManagement";
import ReportsModule from "./components/ReportsModule";
import AIInsights from "./components/AIInsights";
import AIAssistant from "./components/AIAssistant";
import AdminPanel from "./components/AdminPanel";
import SettingsProfile from "./components/SettingsProfile";
import EventsPage from "./components/EventsPage";
import EventDetail from "./components/EventDetail";
import TicketBooking from "./components/TicketBooking";
import MyTickets from "./components/MyTickets";
import Gallery from "./components/Gallery";
import Speakers from "./components/Speakers";
import Schedule from "./components/Schedule";
import Sponsors from "./components/Sponsors";
import Volunteers from "./components/Volunteers";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Blog from "./components/Blog";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Notifications from "./components/Notifications";
import HelpCenter from "./components/HelpCenter";
import Legal from "./components/Legal";

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
  History, UserCog, Key,
  Bell, Sparkles, Users, FileText, BarChart2,
  Ticket, Images, Mic, Clock, Star, HeartHandshake,
  BookOpen, MessageSquare, HelpCircle,
  ChevronRight, Briefcase
} from "lucide-react";

// ──────────────── Global CSS ────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

  * { 
    box-sizing: border-box; 
    user-select: none;
    -webkit-user-select: none;
  }

  /* ── Keyframes ── */
  @keyframes aurora-warm-1 {
    0%,100% { transform: translate(0%,0%) scale(1); opacity: 0.5; }
    50%      { transform: translate(5%,-8%) scale(1.1); opacity: 0.7; }
  }
  @keyframes aurora-warm-2 {
    0%,100% { transform: translate(0%,0%) scale(1); opacity: 0.4; }
    50%      { transform: translate(-6%,6%) scale(0.9); opacity: 0.6; }
  }
  @keyframes aurora-warm-3 {
    0%,100% { transform: translate(0%,0%) scale(1); opacity: 0.3; }
    50%      { transform: translate(4%,7%) scale(1.15); opacity: 0.5; }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-14px) rotate(1.5deg); }
  }
  @keyframes float2 {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(-1deg); }
  }
  @keyframes pulse-warm {
    0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(255,255,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
  }
  @keyframes shimmer-warm {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes gradient-shift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes glow-pulse {
    0%,100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }
  @keyframes ripple {
    0%   { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
  }

  .aurora-1  { animation: aurora-warm-1 14s ease-in-out infinite; }
  .aurora-2  { animation: aurora-warm-2 17s ease-in-out infinite; }
  .aurora-3  { animation: aurora-warm-3 11s ease-in-out infinite; }
  .pulse-ring { animation: pulse-ring 2.5s ease-out infinite; }
  .float     { animation: float  7s ease-in-out infinite; }
  .float2    { animation: float2 9s ease-in-out infinite 1.5s; }
  .pulse-warm { animation: pulse-warm 2.5s ease-out infinite; }
  .spin-slow  { animation: spin-slow 12s linear infinite; }

  /* ── Glass Utilities ── */
  .glass {
    background: rgba(71, 51, 46, 0.35);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
    transform: translateZ(0);
  }
  .glass-strong {
    background: rgba(37, 25, 24, 0.88);
    backdrop-filter: blur(48px);
    -webkit-backdrop-filter: blur(48px);
    border: 1px solid rgba(255,255,255,0.07);
    transform: translateZ(0);
  }
  .glass-subtle {
    background: rgba(255,255,255,0.03);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.06);
    transform: translateZ(0);
  }
  .glass-card {
    background: rgba(61, 41, 37, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    transform: translateZ(0);
    transition: all 0.3s ease;
  }
  .glass-card:hover {
    background: rgba(71, 51, 46, 0.8);
    border-color: rgba(255,255,255,0.25);
    transform: translateY(-2px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.1);
  }

  /* ── Text Gradients ── */
  .gradient-text {
    background: linear-gradient(135deg, #FFFFFF 0%, #E0E0E0 50%, #CCCCCC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .gradient-text-cream {
    background: linear-gradient(135deg, #FFFFFF 0%, #E5E5E5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .shimmer-text-mono {
    background: linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 25%, #E0E0E0 50%, #E5E5E5 75%, #FFFFFF 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-warm 4s linear infinite;
  }

  /* ── Gradient Borders ── */
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
    background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(204,204,204,0.4), rgba(255,255,255,0.2));
    z-index: -1;
  }

  /* ── Background Grid ── */
  .grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 72px 72px;
  }
  /* ── Glows ── */
  .glow-gold  { box-shadow: 0 0 28px rgba(255,255,255,0.35); }
  .glow-amber { box-shadow: 0 0 28px rgba(204,204,204,0.3); }
  .glow-cream { box-shadow: 0 0 24px rgba(255,255,255,0.2); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.25); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }

  /* ── Body ── */
  body { 
    font-family: 'Outfit', 'Inter', sans-serif;
    cursor: default;
    background: #0A0A0A;
  }

  /* ── Button Ripple ── */
  .btn-ripple {
    position: relative;
    overflow: hidden;
  }
  .btn-ripple::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
    top: 50%;
    left: 50%;
    animation: ripple 0.6s linear;
    opacity: 0;
  }
  .btn-ripple:active::after {
    animation: ripple 0.6s linear;
  }

  /* ── Mouse Glow ── */
  .mouse-glow {
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
    z-index: 1;
  }

  /* ── Image Hover Zoom ── */
  .img-zoom {
    overflow: hidden;
    border-radius: inherit;
  }
  .img-zoom img {
    transition: transform 0.5s ease;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img-zoom:hover img {
    transform: scale(1.08);
  }

  /* ── Gradient Button ── */
  .btn-mono {
    background: linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%);
    color: #000000;
    font-weight: 700;
    border: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-mono:hover {
    background: linear-gradient(135deg, #E0E0E0 0%, #FFFFFF 100%);
    box-shadow: 0 8px 30px rgba(255,255,255,0.4);
    transform: translateY(-1px);
  }

  /* ── Animated Counter ── */
  @keyframes count-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .count-up { animation: count-up 0.6s ease-out forwards; }

  /* ── Sidebar Active Indicator ── */
  .nav-active {
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(204,204,204,0.1) 100%);
    border: 1px solid rgba(255,255,255,0.25) !important;
    color: #FFFFFF;
  }
  .nav-active .nav-icon { color: #FFFFFF; }
`;

// ──────────────── Aurora Background ────────────────
function AuroraBg() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + "px";
        glowRef.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <div ref={glowRef} className="mouse-glow" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="grid-bg absolute inset-0 opacity-100" />
        <div className="aurora-1 absolute -top-48 -left-32 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 68%)", filter: "blur(80px)" }} />
        <div className="aurora-2 absolute top-16 -right-48 w-[750px] h-[750px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(204,204,204,0.25) 0%, transparent 68%)", filter: "blur(90px)" }} />
        <div className="aurora-3 absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 68%)", filter: "blur(100px)" }} />
      </div>
    </>
  );
}

// ──────────────── Sidebar Items ────────────────
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
  if (role === "Participant" || role === "Event Organizer") {
    return [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard",     page: "dashboard" },
      { icon: <Calendar       size={15} />, label: "Events",         page: "events-page" },
      { icon: <Clock          size={15} />, label: "Schedule",       page: "schedule" },
      { icon: <Mic            size={15} />, label: "Speakers",       page: "speakers" },
      { icon: <Ticket         size={15} />, label: "My Tickets",     page: "my-tickets" },
      { icon: <Images         size={15} />, label: "Gallery",        page: "gallery" },
      { icon: <Star           size={15} />, label: "Sponsors",       page: "sponsors" },
      { icon: <HeartHandshake size={15} />, label: "Volunteers",     page: "volunteers" },
      { icon: <BarChart2      size={15} />, label: "Analytics",      page: "analytics" },
      { icon: <FileText       size={15} />, label: "Reports",        page: "reports" },
      { icon: <Sparkles       size={15} />, label: "AI Assistant",   page: "assistant" },
      { icon: <Settings       size={15} />, label: "Settings",       page: "settings" }
    ];
  }
  return [];
}

// ──────────────── Main App Shell ────────────────
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group border cursor-pointer ${
                page === it.page ? "nav-active" : "border-transparent hover:bg-white/[0.04]"
              } ${!sidebarOpen ? "justify-center" : ""}`}
              style={{ color: page === it.page ? "#FFFFFF" : "rgba(229,229,229,0.55)" }}
            >
            </button>
          ))}
        </div>

              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => { logout(); setPage("landing"); }}
              className="w-full mt-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-center"
              style={{ background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.2)", color: "#F44336" }}
            >
              Sign Out
            </button>
          )}
        </div>
      </motion.aside>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ──────────────── Global Navbar ────────────────
function GlobalNavbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 print:hidden ${
      scrolled ? "glass-strong shadow-xl" : "bg-transparent"
    }`} style={{ borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
              {currentUser.name.substr(0, 2).toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage("login")}
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                style={{ color: "rgba(229,229,229,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Sign In
              </button>
              <button
                onClick={() => setPage("login")}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-mono cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

// ──────────────── Root App ────────────────
function MainApp({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser } = useApp();

    return <Auth setPage={setPage} />;
  }

  return (
    <div className="min-h-screen relative" style={{ background: "#0A0A0A" }}>
      <style>{STYLES}</style>
      <AuroraBg />
      <div className="relative z-10">
        <GlobalNavbar page={page} setPage={setPage} />
        {currentUser && !["landing", "login"].includes(page) ? (
          <MainAppShell page={page} setPage={setPage} />
        ) : page === "login" ? (
          <div className="pt-16"><Auth setPage={setPage} /></div>
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
