import { useState, useEffect, useRef } from "react";
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

import {
  LayoutDashboard, Calendar, Bell, Settings,
  Sparkles, Menu, Shield, Users, FileText, BarChart2,
  Ticket, Images, Mic, Clock, Star, HeartHandshake,
  BookOpen, DollarSign, MessageSquare, HelpCircle, X,
  ChevronRight, Briefcase
} from "lucide-react";

// ──────────────── Global CSS ────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; }

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
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.55); }

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
  const items = [
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
    { icon: <Briefcase      size={15} />, label: "Manage Events",  page: "events" },
  ];

  if (role === "Admin") {
    items.push({ icon: <Shield size={15} />, label: "Admin Panel", page: "admin" });
  }
  items.push({ icon: <Settings size={15} />, label: "Settings", page: "settings" });
  return items;
}

// ──────────────── Main App Shell ────────────────
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
        animate={{ width: sidebarOpen ? 220 : 64 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="glass-strong shrink-0 border-r border-[rgba(255,255,255,0.07)] flex flex-col overflow-hidden h-[calc(100vh-4rem)] sticky top-16 z-30 print:hidden"
      >
        <div className="p-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
          <div className={`flex items-center mb-3 px-1.5 ${sidebarOpen ? "justify-between" : "justify-center"}`}>
            {sidebarOpen && <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>NAVIGATION</span>}
            <button onClick={() => setSidebarOpen(v => !v)}
              className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.4)" }}>
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
              <span className={`nav-icon transition-colors ${page === it.page ? "" : "group-hover:text-[#FFFFFF]"}`}
                style={{ color: page === it.page ? "#FFFFFF" : "inherit" }}>
                {it.icon}
              </span>
              {sidebarOpen && <span className="truncate">{it.label}</span>}
              {sidebarOpen && page === it.page && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#FFFFFF" }} />
              )}
            </button>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div
            onClick={() => setPage("settings")}
            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
              style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
              {currentUser?.name ? currentUser.name.substr(0, 2).toUpperCase() : "EV"}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 text-left">
                <div className="text-xs font-bold truncate" style={{ color: "#FFFFFF" }}>{currentUser?.name}</div>
                <div className="text-[9px] truncate" style={{ color: "rgba(229,229,229,0.5)" }}>{currentUser?.role}</div>
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

      {/* Main Content */}
      <main className="flex-1 p-6 min-w-0 relative z-10 print:p-0 print:m-0">
        
        {/* Notifications Panel */}
        {notificationsOpen && (
          <div className="fixed right-6 top-16 w-80 glass shadow-2xl rounded-3xl p-4 z-40 space-y-3"
            style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="flex items-center justify-between pb-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>Notifications</span>
              <button onClick={() => setNotificationsOpen(false)} style={{ color: "rgba(229,229,229,0.5)" }}>
                <X size={13} />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-[10px]" style={{ color: "rgba(229,229,229,0.4)" }}>No notifications</div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-2.5 rounded-xl border transition-all cursor-pointer"
                    style={{
                      background: notif.read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                      borderColor: notif.read ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2)"
                    }}
                  >
                    <div className="text-[10px] font-bold flex justify-between" style={{ color: "#FFFFFF" }}>
                      <span>{notif.title}</span>
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: "#FFFFFF" }} />}
                    </div>
                    <div className="text-[9px] mt-1 leading-normal" style={{ color: "rgba(229,229,229,0.55)" }}>{notif.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {page === "dashboard"   && <Dashboard setPage={setPage} />}
            {page === "events-page" && <EventsPage setPage={setPage} />}
            {page === "event-detail"&& <EventDetail setPage={setPage} />}
            {page === "schedule"    && <Schedule />}
            {page === "speakers"    && <Speakers />}
            {page === "ticket-book" && <TicketBooking setPage={setPage} />}
            {page === "my-tickets"  && <MyTickets setPage={setPage} />}
            {page === "gallery"     && <Gallery />}
            {page === "sponsors"    && <Sponsors />}
            {page === "volunteers"  && <Volunteers />}
            {page === "analytics"   && <AnalyticsDashboard />}
            {page === "reports"     && <ReportsModule />}
            {page === "insights"    && <AIInsights />}
            {page === "assistant"   && <AIAssistant setPage={setPage} />}
            {page === "events"      && <EventManagement />}
            {page === "expenses"    && <ExpenseManagement />}
            {page === "vendors"     && <VendorManagement />}
            {page === "admin"       && <AdminPanel />}
            {page === "settings"    && <SettingsProfile />}
            {page === "blog"        && <Blog />}
            {page === "pricing"     && <Pricing setPage={setPage} />}
            {page === "testimonials"&& <Testimonials />}
            {page === "faq"         && <FAQ />}
            {page === "contact"     && <Contact />}
            {page === "notifications"&&<Notifications />}
            {page === "help"        && <HelpCenter />}
            {page === "legal"       && <Legal />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ──────────────── Global Navbar ────────────────
function GlobalNavbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const { currentUser, notifications } = useApp();
  const unreadNotifs = notifications.filter(n => !n.read);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const publicLinks = [
    { label: "Events",      page: "events-page" },
    { label: "Speakers",    page: "speakers" },
    { label: "Gallery",     page: "gallery" },
    { label: "Pricing",     page: "pricing" },
    { label: "Blog",        page: "blog" },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 print:hidden ${
      scrolled ? "glass-strong shadow-xl" : "bg-transparent"
    }`} style={{ borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <button onClick={() => setPage(currentUser ? "dashboard" : "landing")}
          className="flex items-center gap-2.5 group shrink-0 cursor-pointer">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center pulse-warm"
            style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)" }}>
            <Calendar size={16} className="text-white" />
          </div>
          <span className="text-sm font-black tracking-tight" style={{ color: "#FFFFFF" }}>
            Event<span className="gradient-text">Sphere</span>
          </span>
        </button>

        {/* Public Nav Links */}
        {!currentUser && (
          <div className="hidden md:flex items-center gap-0.5">
            {publicLinks.map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  page === l.page ? "text-[#FFFFFF] bg-white/5" : "hover:text-[#FFFFFF]"
                }`}
                style={{ color: page === l.page ? "#FFFFFF" : "rgba(229,229,229,0.6)" }}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Auth user quick nav */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-0.5">
            {[
              { label: "Dashboard",  page: "dashboard" },
              { label: "Events",     page: "events-page" },
              { label: "Analytics",  page: "analytics" },
              { label: "AI Assistant", page: "assistant" },
            ].map(l => (
              <button
                key={l.page}
                onClick={() => setPage(l.page)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  page === l.page ? "bg-white/5" : "hover:bg-white/5"
                }`}
                style={{ color: page === l.page ? "#FFFFFF" : "rgba(229,229,229,0.6)" }}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => { const ev = new CustomEvent("toggle-notif"); window.dispatchEvent(ev); }}
              className="relative p-2 rounded-xl transition-all cursor-pointer hover:bg-white/5"
              style={{ color: "rgba(229,229,229,0.6)" }}
            >
              <Bell size={17} />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full flex items-center justify-center text-[5px] font-bold text-white"
                  style={{ background: "#FFFFFF", border: "2px solid #0A0A0A" }}>
                  {unreadNotifs.length}
                </span>
              )}
            </button>
          )}

          {currentUser ? (
            <div
              onClick={() => setPage("settings")}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer"
              style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}
            >
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

  const publicPages = ["landing", "login", "events-page", "event-detail", "speakers",
    "gallery", "pricing", "blog", "testimonials", "faq", "contact", "help", "legal"];

  if (!currentUser && !publicPages.includes(page)) {
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
