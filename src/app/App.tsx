import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, TrendingUp, Brain, Bell, Settings,
  ArrowUpRight, ArrowDownRight, Wallet, Target, Download,
  Plus, BarChart2, Sparkles, Menu, ChevronRight, DollarSign,
  CheckCircle, Filter, FileText, Shield, Globe, Layers,
} from "lucide-react";

// ─── Global CSS ──────────────────────────────────────────────────────────────

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const timelineData = [
  { month: "Jan", actual: 42000, budget: 50000, forecast: 45000 },
  { month: "Feb", actual: 38000, budget: 50000, forecast: 42000 },
  { month: "Mar", actual: 55000, budget: 60000, forecast: 52000 },
  { month: "Apr", actual: 48000, budget: 55000, forecast: 50000 },
  { month: "May", actual: 62000, budget: 65000, forecast: 58000 },
  { month: "Jun", actual: 71000, budget: 70000, forecast: 68000 },
  { month: "Jul", actual: 58000, budget: 75000, forecast: 65000 },
];

const categoryData = [
  { name: "Catering",       value: 32, color: "#3B82F6", amount: 124000 },
  { name: "Venue",          value: 25, color: "#8B5CF6", amount: 97000  },
  { name: "Entertainment",  value: 18, color: "#22D3EE", amount: 70000  },
  { name: "Logistics",      value: 15, color: "#10B981", amount: 58000  },
  { name: "Marketing",      value: 10, color: "#F59E0B", amount: 39000  },
];

const barData = [
  { cat: "Catering",      spent: 124000, budget: 150000 },
  { cat: "Venue",         spent: 97000,  budget: 100000 },
  { cat: "Entertainment", spent: 70000,  budget: 80000  },
  { cat: "Logistics",     spent: 58000,  budget: 65000  },
  { cat: "Marketing",     spent: 39000,  budget: 50000  },
];

const recentExpenses = [
  { id: 1, title: "Grand Ballroom Booking",    cat: "Venue",          amount: 45000, status: "paid",    date: "Jul 8",  emoji: "🏛️" },
  { id: 2, title: "Premium Catering Package",  cat: "Catering",       amount: 28500, status: "pending", date: "Jul 7",  emoji: "🍽️" },
  { id: 3, title: "Live Band Performance",     cat: "Entertainment",  amount: 18000, status: "paid",    date: "Jul 6",  emoji: "🎵" },
  { id: 4, title: "Event Photography",         cat: "Media",          amount: 12000, status: "paid",    date: "Jul 5",  emoji: "📸" },
  { id: 5, title: "Transport & Logistics",     cat: "Logistics",      amount: 8500,  status: "overdue", date: "Jul 4",  emoji: "🚌" },
];

const aiInsights = [
  { type: "warning", emoji: "⚡", title: "Catering budget exceeded by ₹12,500", sub: "Consider renegotiating with vendors" },
  { type: "info",    emoji: "📈", title: "Entertainment costs up 18% vs last month", sub: "Q3 trend analysis available" },
  { type: "success", emoji: "🎯", title: "Budget utilization at 83%", sub: "On track for Q3 targets" },
  { type: "warning", emoji: "💡", title: "3 payments pending in 5 days", sub: "₹38,500 total due soon" },
];

const forecasts = [
  { cat: "Catering",      current: 124000, predicted: 158000, risk: "high"   },
  { cat: "Venue",         current: 97000,  predicted: 101000, risk: "low"    },
  { cat: "Entertainment", current: 70000,  predicted: 88000,  risk: "medium" },
  { cat: "Logistics",     current: 58000,  predicted: 62000,  risk: "low"    },
];

const features = [
  { icon: <Brain size={22} />,       title: "AI-Powered Insights",   desc: "Predictive analytics flag overruns before they happen — days in advance.",         color: "#8B5CF6" },
  { icon: <TrendingUp size={22} />,  title: "Real-time Analytics",   desc: "Live expense tracking with interactive dashboards that update instantly.",          color: "#3B82F6" },
  { icon: <Shield size={22} />,      title: "Smart Budgeting",       desc: "Category-level budgets with threshold alerts so you are never caught off guard.",   color: "#22D3EE" },
  { icon: <FileText size={22} />,    title: "Board-ready Reports",   desc: "Generate stunning PDF summaries with one click — no design skills required.",       color: "#10B981" },
  { icon: <Globe size={22} />,       title: "Multi-currency",        desc: "International events covered with real-time FX rates baked into every figure.",     color: "#F59E0B" },
  { icon: <Layers size={22} />,      title: "Team Collaboration",    desc: "Role-based access for organizers, finance leads, and executive stakeholders.",       color: "#EC4899" },
];

const plans = [
  { name: "Starter",    price: "₹999",   period: "/mo",  desc: "College events & small gatherings",      color: "#3B82F6", popular: false,
    perks: ["5 events/month", "Core analytics", "PDF reports", "Email support"] },
  { name: "Pro",        price: "₹2,999", period: "/mo",  desc: "Professional event managers",            color: "#8B5CF6", popular: true,
    perks: ["Unlimited events", "AI insights", "Advanced analytics", "Priority support", "5 team seats"] },
  { name: "Enterprise", price: "Custom", period: "",     desc: "Large orgs & corporate teams",           color: "#22D3EE", popular: false,
    perks: ["Everything in Pro", "Custom integrations", "Dedicated manager", "99.9% SLA", "Unlimited seats"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }
const riskColor = (r: string) => r === "high" ? "#F87171" : r === "medium" ? "#FBBF24" : "#34D399";
const statusStyle = (s: string) =>
  s === "paid"    ? { text: "text-emerald-400", bg: "bg-emerald-400/10" } :
  s === "pending" ? { text: "text-amber-400",   bg: "bg-amber-400/10"  } :
                    { text: "text-red-400",      bg: "bg-red-400/10"    };
const insightStyle = (t: string) =>
  t === "warning" ? { border: "border-amber-400/20",  bg: "bg-amber-400/5",   text: "text-amber-300"   } :
  t === "success" ? { border: "border-emerald-400/20", bg: "bg-emerald-400/5", text: "text-emerald-300" } :
                    { border: "border-blue-400/20",    bg: "bg-blue-400/5",    text: "text-blue-300"    };

// ─── Aurora background ────────────────────────────────────────────────────────

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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Dashboard",   page: "dashboard" },
    { label: "Analytics",   page: "analytics" },
    { label: "AI Insights", page: "insights"  },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg shadow-black/20" : ""}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand */}
        <button onClick={() => setPage("landing")}
          className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center pulse-ring"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            <Wallet size={15} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Expense<span className="gradient-text">Vision</span>
            <span className="text-blue-400 text-xs font-semibold ml-0.5">AI</span>
          </span>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                page === l.page
                  ? "text-white glass"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-[#050816]" />
          </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white glow-blue"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            AK
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const sideItems = [
  { icon: <LayoutDashboard size={16} />, label: "Dashboard",   page: "dashboard" },
  { icon: <BarChart2 size={16} />,       label: "Analytics",   page: "analytics" },
  { icon: <Brain size={16} />,           label: "AI Insights", page: "insights"  },
  { icon: <FileText size={16} />,        label: "Reports",     page: "reports"   },
  { icon: <Bell size={16} />,            label: "Alerts",      page: "alerts"    },
  { icon: <Settings size={16} />,        label: "Settings",    page: "settings"  },
];

function Sidebar({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 216 : 60 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="glass-strong shrink-0 border-r border-white/5 flex flex-col overflow-hidden h-full"
    >
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className={`flex items-center mb-3 px-1 ${open ? "justify-between" : "justify-center"}`}>
          {open && <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Navigation</span>}
          <button onClick={() => setOpen(v => !v)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all">
            <Menu size={13} />
          </button>
        </div>
        {sideItems.map(it => (
          <button key={it.page} onClick={() => setPage(it.page)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
              page === it.page
                ? "text-white"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            } ${!open ? "justify-center" : ""}`}
            style={page === it.page ? {
              background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18))",
              border: "1px solid rgba(59,130,246,0.28)"
            } : {}}
          >
            <span className={page === it.page ? "text-blue-400" : "group-hover:text-slate-300 transition-colors"}>
              {it.icon}
            </span>
            {open && <span className="truncate">{it.label}</span>}
            {open && page === it.page && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />}
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-white/5">
        <div className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all ${!open ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            AK
          </div>
          {open && (
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Ankit Kumar</div>
              <div className="text-[10px] text-slate-400 truncate">Event Manager</div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, delta, up, icon, color }: { label: string; value: string; delta: string; up: boolean; icon: React.ReactNode; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}1a` }}>
          <span style={{ color }}>{icon}</span>
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta}
        </span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </motion.div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function ChartTip({ active, payload, label, accent = "#3B82F6" }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 text-xs shadow-xl" style={{ border: `1px solid ${accent}30` }}>
      <div className="text-slate-300 mb-1.5 font-medium">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-white">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

// ─── Dashboard view ───────────────────────────────────────────────────────────

function DashboardPage({ setPage }: { setPage: (p: string) => void }) {
  const stats = [
    { label: "Total Budget",    value: "₹4,85,000", delta: "+5.2%", up: true,  icon: <Target size={18} />,    color: "#3B82F6" },
    { label: "Total Expenses",  value: "₹3,88,500", delta: "+12.1%", up: false, icon: <DollarSign size={18} />, color: "#8B5CF6" },
    { label: "Remaining",       value: "₹96,500",   delta: "-8.3%",  up: false, icon: <Wallet size={18} />,    color: "#22D3EE" },
    { label: "Savings YTD",     value: "₹21,000",   delta: "+3.4%",  up: true,  icon: <TrendingUp size={18} />, color: "#10B981" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-slate-400 text-xs mt-0.5">Annual Gala 2025 · Updated just now</p>
        </div>
        <div className="flex gap-2">
          <button className="glass px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all">
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-white font-semibold transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            <Plus size={13} /> Add Expense
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-white font-semibold text-sm">Expense Timeline</h3>
              <p className="text-slate-500 text-xs mt-0.5">Actual · Budget · Forecast</p>
            </div>
            <div className="flex gap-4 text-[11px] text-slate-400">
              {[["Actual","#3B82F6"],["Budget","#8B5CF6"],["Forecast","#22D3EE"]].map(([l,c]) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: c as string }} />{l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gBudget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" stroke="#334155" tick={{ fill: "#64748B", fontSize: 11 }} />
              <YAxis stroke="#334155" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={v => `₹${v/1000}K`} width={52} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="budget"   stroke="#8B5CF6" strokeWidth={1.5} fill="url(#gBudget)" strokeDasharray="5 3" />
              <Area type="monotone" dataKey="actual"   stroke="#3B82F6" strokeWidth={2.5} fill="url(#gActual)" />
              <Area type="monotone" dataKey="forecast" stroke="#22D3EE" strokeWidth={1.5} fill="none"          strokeDasharray="6 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-0.5">Categories</h3>
          <p className="text-slate-500 text-xs mb-3">Spend distribution</p>
          <ResponsiveContainer width="100%" height={148}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={64}
                paddingAngle={3} dataKey="value" strokeWidth={0}>
                {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: "rgba(8,14,32,0.95)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {categoryData.map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                <span className="text-slate-300 flex-1">{c.name}</span>
                <span className="text-slate-400 font-medium font-mono">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recents + AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent expenses */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Recent Expenses</h3>
            <button className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-1.5">
            {recentExpenses.map(exp => {
              const ss = statusStyle(exp.status);
              return (
                <div key={exp.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-base shrink-0">
                    {exp.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate group-hover:text-blue-300 transition-colors">{exp.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{exp.cat} · {exp.date}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-white mb-1">{fmt(exp.amount)}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${ss.text} ${ss.bg}`}>
                      {exp.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI insights mini */}
        <div className="glass rounded-2xl p-5" style={{ border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(139,92,246,0.2)" }}>
              <Brain size={15} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Insights</h3>
              <p className="text-[10px] text-purple-400">4 active signals</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {aiInsights.map((ins, i) => {
              const s = insightStyle(ins.type);
              return (
                <div key={i} className={`p-3 rounded-xl ${s.bg} border ${s.border}`}>
                  <div className="flex gap-2 items-start">
                    <span className="text-base shrink-0">{ins.emoji}</span>
                    <div>
                      <div className={`text-xs font-semibold ${s.text}`}>{ins.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{ins.sub}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => setPage("insights")}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.35))", border: "1px solid rgba(139,92,246,0.3)" }}>
            Full AI Analysis →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics view ───────────────────────────────────────────────────────────

function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 text-xs mt-0.5">Spending patterns · Annual Gala 2025</p>
        </div>
        <button className="glass px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all">
          <Download size={13} /> Export Report
        </button>
      </div>

      {/* Horizontal bar */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-0.5">Budget Utilization by Category</h3>
        <p className="text-slate-500 text-xs mb-5">Actual spend vs allocated budget</p>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={barData} layout="vertical" barSize={7} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
            <XAxis type="number" stroke="#334155" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={v => `₹${v/1000}K`} />
            <YAxis type="category" dataKey="cat" stroke="#334155" tick={{ fill: "#94A3B8", fontSize: 11 }} width={90} />
            <Tooltip content={<ChartTip accent="#8B5CF6" />} />
            <Bar dataKey="budget" fill="rgba(139,92,246,0.18)" radius={[0,5,5,0]} />
            <Bar dataKey="spent"  fill="#3B82F6"               radius={[0,5,5,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category rings */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categoryData.map((c, i) => {
          const pct = Math.round((c.amount / (c.value * 5200)) * 100);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-4 text-center">
              <div className="text-xs text-slate-400 mb-2">{c.name}</div>
              <div className="text-lg font-bold text-white mb-1">{fmt(c.amount)}</div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 1.1, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                />
              </div>
              <div className="text-[10px] text-slate-500">{c.value}% of total</div>
            </motion.div>
          );
        })}
      </div>

      {/* Trend line */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-0.5">7-Month Expense Trend</h3>
        <p className="text-slate-500 text-xs mb-5">Jan → Jul 2025</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timelineData}>
            <defs>
              <linearGradient id="gCyan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22D3EE" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" stroke="#334155" tick={{ fill: "#64748B", fontSize: 11 }} />
            <YAxis stroke="#334155" tick={{ fill: "#64748B", fontSize: 11 }} tickFormatter={v => `₹${v/1000}K`} width={52} />
            <Tooltip content={<ChartTip accent="#22D3EE" />} />
            <Area type="monotone" dataKey="actual" stroke="#22D3EE" strokeWidth={2.5} fill="url(#gCyan)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── AI Insights view ─────────────────────────────────────────────────────────

function AIInsightsPage() {
  const [ready, setReady] = useState(false);
  const msg = "Based on 7 months of data, I predict a 23% overrun in Catering by Q3 end. Venue is stable. Entertainment spend spiked 18%—renegotiate contracts now to save an estimated ₹14,000.";

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Insights</h1>
        <p className="text-slate-400 text-xs mt-0.5">Powered by ExpenseVision Intelligence Engine</p>
      </div>

      {/* AI message */}
      <div className="glass rounded-2xl p-6" style={{ border: "1px solid rgba(139,92,246,0.25)" }}>
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 glow-purple"
            style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}>
            <Brain size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-white font-semibold text-sm">ExpenseVision AI</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full text-purple-300 bg-purple-500/15 border border-purple-500/25 font-medium">
                GPT-4 powered
              </span>
            </div>
            <AnimatePresence mode="wait">
              {!ready ? (
                <motion.span key="dots" className="flex items-center gap-1"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-2 h-2 rounded-full bg-purple-400"
                      style={{ animation: `pulse-ring 1s ease-out infinite ${d}ms` }} />
                  ))}
                </motion.span>
              ) : (
                <motion.p key="msg" className="text-slate-300 text-sm leading-relaxed"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                  {msg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Alert grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {aiInsights.map((ins, i) => {
          const s = insightStyle(ins.type);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl ${s.bg} border ${s.border}`}>
              <div className="text-2xl mb-3">{ins.emoji}</div>
              <div className={`text-sm font-semibold mb-1 ${s.text}`}>{ins.title}</div>
              <div className="text-xs text-slate-400">{ins.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Forecast table */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-0.5">End-of-Quarter Forecast</h3>
        <p className="text-slate-500 text-xs mb-5">AI-predicted spend by category</p>
        <div className="space-y-3">
          {forecasts.map((f, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-all">
              <div className="w-28 text-sm text-slate-200 font-medium shrink-0">{f.cat}</div>
              <div className="flex-1">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((f.current / f.predicted) * 100, 100)}%` }}
                    transition={{ duration: 1.1, delay: i * 0.12 }}
                    className="h-full rounded-full"
                    style={{ background: riskColor(f.risk) }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400 font-mono">{fmt(f.current)} / {fmt(f.predicted)}</div>
                <span className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: riskColor(f.risk) }}>{f.risk} risk</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

function LandingPage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 relative overflow-hidden">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-semibold text-slate-300 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now with AI-powered expense forecasting
          <Sparkles size={11} className="text-purple-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6 max-w-4xl">
          Manage Every<br />
          <span className="shimmer-text">Event Expense</span>
          <br />Intelligently
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
          Track budgets, predict overruns, analyze trends, and generate board-ready reports.
          Where every rupee tells a story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32 }}
          className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => setPage("dashboard")}
            className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:scale-105 glow-blue"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            Start Managing →
          </button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="relative mt-16 w-full max-w-4xl mx-auto">

          {/* Floating card left */}
          <div className="float glass rounded-2xl p-4 absolute -top-5 left-4 md:left-0 w-44 hidden md:block z-10">
            <div className="text-[10px] text-slate-400 mb-1.5">Total Budget</div>
            <div className="text-xl font-bold text-white">₹4,85,000</div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-emerald-400 font-medium">
              <ArrowUpRight size={11} /> +5.2% vs last event
            </div>
          </div>

          {/* Main preview frame */}
          <div className="gradient-border rounded-3xl overflow-hidden"
            style={{ background: "rgba(8,14,32,0.8)", backdropFilter: "blur(40px)" }}>
            {/* Toolbar */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="flex-1 mx-4">
                <div className="glass-subtle h-6 rounded-lg w-48 mx-auto" />
              </div>
            </div>
            {/* Content */}
            <div className="p-5">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  ["Total Budget","₹4,85,000","#3B82F6",72],
                  ["Expenses","₹3,88,500","#8B5CF6",80],
                  ["Remaining","₹96,500","#22D3EE",20],
                  ["Savings","₹21,000","#10B981",44],
                ].map(([lbl,val,col,pct],i) => (
                  <div key={i} className="glass-subtle rounded-xl p-3">
                    <div className="text-[10px] text-slate-400 mb-1.5">{lbl}</div>
                    <div className="text-sm font-bold text-white mb-2">{val}</div>
                    <div className="h-1 rounded-full" style={{ background: `${col}20` }}>
                      <div className="h-full rounded-full" style={{ width:`${pct}%`, background: col as string }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Mini chart */}
              <div className="glass-subtle rounded-xl p-3 h-28 flex items-end gap-1.5 overflow-hidden">
                {timelineData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t"
                      style={{
                        height: `${(d.actual / 75000) * 80}px`,
                        background: `linear-gradient(to top, #3B82F6, #8B5CF6)`,
                        opacity: 0.75
                      }} />
                    <span className="text-[9px] text-slate-500">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating card right */}
          <div className="float2 glass rounded-2xl p-3.5 absolute -bottom-5 right-4 md:right-0 w-44 hidden md:block z-10">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Brain size={11} className="text-purple-400" />
              <span className="text-[10px] text-purple-400 font-semibold">AI Alert</span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed">
              Catering overrun predicted +₹12,500
            </div>
            <div className="mt-2 h-1 bg-red-400/10 rounded-full">
              <div className="h-full w-4/5 bg-red-400 rounded-full" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ["500+", "Events Tracked"],
              ["₹2.4Cr+", "Managed"],
              ["98.2%", "Accuracy"],
              ["4.9 ★", "User Rating"],
            ].map(([v, l], i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{v}</div>
                <div className="text-xs text-slate-400">{l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">Platform Features</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Built for{" "}
              <span className="gradient-text">serious event managers</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              A complete financial operating system — from first venue booking to final report.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass rounded-2xl p-6 cursor-default group">
                <div className="p-3 rounded-xl w-fit mb-5 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}18` }}>
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h3 className="text-white font-bold mb-2 text-sm">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Transparent{" "}
              <span className="gradient-text">pricing</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-6 relative ${p.popular ? "gradient-border" : ""}`}>
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-white font-bold text-lg">{p.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{p.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-white">{p.price}</span>
                  <span className="text-slate-400 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {p.perks.map((pk, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle size={13} style={{ color: p.color }} className="shrink-0" />
                      {pk}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setPage("dashboard")}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={p.popular
                    ? { background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "white" }
                    : { background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}28` }
                  }>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 relative overflow-hidden"
            style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
            <div className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.4), transparent 60%)" }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to take control?</h2>
              <p className="text-slate-400 text-sm mb-8">Join 500+ event managers who run smarter with ExpenseVision AI.</p>
              <button onClick={() => setPage("dashboard")}
                className="px-10 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:scale-105 glow-blue"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
                Launch Dashboard →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <Wallet size={11} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white">ExpenseVision AI</span>
          </div>
          <p className="text-slate-500 text-xs">© 2025 ExpenseVision AI · Where every rupee tells a story.</p>
          <div className="flex gap-5 text-xs text-slate-500">
            {["Privacy","Terms","Contact"].map(l => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Inner app shell (sidebar + content) ─────────────────────────────────────

function AppShell({ page, setPage }: { page: string; setPage: (p: string) => void }) {
  return (
    <div className="flex pt-16 min-h-screen">
      <div className="sticky top-16 h-[calc(100vh-4rem)] shrink-0 z-40">
        <Sidebar page={page} setPage={setPage} />
      </div>
      <main className="flex-1 p-6 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}>
            {page === "dashboard" && <DashboardPage setPage={setPage} />}
            {page === "analytics" && <AnalyticsPage />}
            {page === "insights"  && <AIInsightsPage />}
            {["reports","alerts","settings"].includes(page) && (
              <div className="flex items-center justify-center h-64 text-slate-500 text-sm">
                <div className="text-center">
                  <div className="text-4xl mb-3">🚧</div>
                  <div>This section is coming soon.</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("landing");
  const isApp = page !== "landing";

  return (
    <div className="min-h-screen relative" style={{ background: "#050816" }}>
      <style>{STYLES}</style>
      <AuroraBg />
      <div className="relative z-10">
        <Navbar page={page} setPage={setPage} />
        {isApp
          ? <AppShell page={page} setPage={setPage} />
          : <LandingPage setPage={setPage} />
        }
      </div>
    </div>
  );
}
