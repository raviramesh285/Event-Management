import React, { useState } from "react";
import { useApp } from "../state";
import { AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts";
import { Target, DollarSign, Wallet, AlertCircle, Plus, Brain, Filter, ChevronRight, Activity, Users, ShieldAlert, ArrowUpRight, TrendingUp } from "lucide-react";
import { Event } from "../types";

export default function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const { events, expenses, payments, currentUser, settings, addExpense } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    return events[0]?.id || "";
  });

  const activeEvents = events.filter(e => e.status === "active");
  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  // Organizer/Participant scope data
  const currentExpenses = expenses.filter(ex => ex.event_id === currentEvent?.id);
  const totalBudget = currentEvent ? currentEvent.budget : 0;
  const totalSpent = currentExpenses.reduce((sum, ex) => sum + ex.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const utilizationPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Split payments due
  const userPayments = payments.filter(p => p.participant_id === currentUser?.id);
  const totalOwed = userPayments.filter(p => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0);

  // System Wide Metrics for ADMIN
  const totalSystemEvents = events.length;
  const totalSystemBudget = events.reduce((sum, e) => sum + e.budget, 0);
  const totalSystemExpenses = expenses.reduce((sum, ex) => sum + ex.amount, 0);
  const totalSystemVendors = useApp().vendors.length;

  // Chart data matching timeline
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const timelineData = months.map((month, idx) => {
    // Generate some smooth curves based on active expenses
    const monthExpenses = expenses
      .filter(ex => {
        if (currentUser?.role !== "Admin" && ex.event_id !== currentEvent?.id) return false;
        const d = new Date(ex.date);
        return d.getMonth() === idx && d.getFullYear() === 2026;
      })
      .reduce((sum, ex) => sum + ex.amount, 0);

    const baseBudget = currentUser?.role === "Admin" ? totalSystemBudget / 12 : totalBudget / 6;
    return {
      month,
      spent: monthExpenses || (idx < 7 ? Math.round(baseBudget * (0.4 + idx * 0.08)) : 0),
      budget: baseBudget,
      forecast: idx >= 7 ? Math.round(baseBudget * (0.6 + (idx - 7) * 0.05)) : 0
    };
  });

  // Category distributions
  const categoriesList = ["Food", "Travel", "Decoration", "Venue", "Photography", "Entertainment", "Miscellaneous"];
  const categoryColors = ["#3B82F6", "#8B5CF6", "#22D3EE", "#10B981", "#F59E0B", "#EC4899", "#64748B"];
  const categoryData = categoriesList.map((cat, idx) => {
    const amt = currentExpenses.filter(ex => ex.category === cat).reduce((sum, ex) => sum + ex.amount, 0);
    return {
      name: cat,
      value: amt || 0,
      color: categoryColors[idx]
    };
  }).filter(c => c.value > 0);

  const finalCategoryData = categoryData.length > 0 ? categoryData : [
    { name: "Catering", value: 45000, color: "#3B82F6" },
    { name: "Venue", value: 35000, color: "#8B5CF6" },
    { name: "Misc", value: 15000, color: "#64748B" }
  ];

  // Helper formatting
  const fmt = (n: number) => settings.currency + n.toLocaleString("en-IN");

  const [quickTitle, setQuickTitle] = useState("");
  const [quickAmount, setQuickAmount] = useState("");
  const [quickCategory, setQuickCategory] = useState<any>("Food");

  const handleQuickExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle || !quickAmount || !currentEvent) return;
    addExpense({
      event_id: currentEvent.id,
      amount: parseFloat(quickAmount),
      category: quickCategory,
      description: quickTitle,
      date: new Date().toISOString().split("T")[0]
    });
    setQuickTitle("");
    setQuickAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Financial Command Center</h2>
          <p className="text-slate-400 text-xs mt-1">
            Logged in as <span className="text-blue-400 font-semibold">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>

        {/* Event selector (Hidden for Admin/Participant if they want global view, but shown for Organizer) */}
        {currentUser?.role !== "Admin" && activeEvents.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-500" />
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {activeEvents.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ADMIN METRICS VIEW */}
      {currentUser?.role === "Admin" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Target size={18} />
              </div>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">SYSTEM</span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{totalSystemEvents}</div>
            <div className="text-xs text-slate-400">Total Registered Events</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <DollarSign size={18} />
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">SYSTEM</span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{fmt(totalSystemBudget)}</div>
            <div className="text-xs text-slate-400">Total Allocated Budget</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Wallet size={18} />
              </div>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-bold">SYSTEM</span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{fmt(totalSystemExpenses)}</div>
            <div className="text-xs text-slate-400">Aggregate System Spend</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users size={18} />
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">SYSTEM</span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{totalSystemVendors}</div>
            <div className="text-xs text-slate-400">Hired Vendor Accounts</div>
          </div>
        </div>
      )}

      {/* ORGANIZER & PARTICIPANT METRICS VIEW */}
      {currentUser?.role !== "Admin" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Target size={18} />
              </div>
              <span className="text-emerald-400 flex items-center gap-0.5 text-xs font-semibold">
                <ArrowUpRight size={13} /> Active
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{fmt(totalBudget)}</div>
            <div className="text-xs text-slate-400">Event Budget Limit</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <DollarSign size={18} />
              </div>
              <span className="text-slate-400 text-xs font-mono">{Math.round(utilizationPct)}% used</span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{fmt(totalSpent)}</div>
            <div className="text-xs text-slate-400">Current Spent</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Wallet size={18} />
              </div>
              <span className={remainingBudget < 0 ? "text-red-400 text-xs font-semibold" : "text-emerald-400 text-xs font-semibold"}>
                {remainingBudget < 0 ? "Exceeded" : "Safe"}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{fmt(remainingBudget)}</div>
            <div className="text-xs text-slate-400">Remaining Budget</div>
          </div>

          <div className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <Users size={18} />
              </div>
              <span className="text-amber-400 text-xs font-bold">DUE</span>
            </div>
            <div className="text-2xl font-extrabold text-white mb-1">{fmt(totalOwed)}</div>
            <div className="text-xs text-slate-400">Your Pending Cost Shares</div>
          </div>
        </div>
      )}

      {/* Warnings & Alerts Strip */}
      {currentUser?.role !== "Participant" && remainingBudget < 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-300 text-xs flex items-center gap-3">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <div>
            <span className="font-bold">Budget threshold breach:</span> Spending for <strong>{currentEvent?.title}</strong> exceeds limits by <strong>{fmt(Math.abs(remainingBudget))}</strong>. Consider adjusting vendors or shifting custom splits.
          </div>
        </div>
      )}

      {/* Main Analytics Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-sm">Fiscal Timeline Trends</h3>
              <p className="text-slate-400 text-xs mt-0.5">Budget caps vs active spent allocations (2026)</p>
            </div>
            <div className="flex gap-4 text-[10px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Spent</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Allocated Budget</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> AI Forecast</span>
            </div>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" stroke="#334155" tick={{ fill: "#64748B", fontSize: 10 }} />
                <YAxis stroke="#334155" tick={{ fill: "#64748B", fontSize: 10 }} tickFormatter={v => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(11, 16, 35, 0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: "#fff"
                  }}
                  formatter={(val: number) => [fmt(val), ""]}
                />
                <Area type="monotone" dataKey="budget" stroke="#8B5CF6" strokeWidth={1.5} fill="url(#colorBudget)" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="spent" stroke="#3B82F6" strokeWidth={2.5} fill="url(#colorSpent)" />
                <Area type="monotone" dataKey="forecast" stroke="#22D3EE" strokeWidth={1.5} fill="none" strokeDasharray="6 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown (Pie chart) */}
        <div className="glass rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-bold text-sm mb-1">Spend Category Spread</h3>
          <p className="text-slate-400 text-xs mb-4">Distribution by service sectors</p>
          <div className="w-full h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {finalCategoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(11, 16, 35, 0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: "#fff"
                  }}
                  formatter={(val: number) => [fmt(val), ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 max-h-36 overflow-y-auto pr-1">
            {finalCategoryData.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-slate-300 font-medium">{c.name}</span>
                </div>
                <span className="text-white font-semibold font-mono">{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recents and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities list */}
        <div className="lg:col-span-2 glass rounded-2xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Activity size={15} className="text-blue-400" />
              Recent Spending Ledger
            </h3>
            <button
              onClick={() => setPage("expenses")}
              className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              Ledger Sheets <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {currentExpenses.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No expense entries listed for this event. Click Add Expense to start tracking.
              </div>
            ) : (
              currentExpenses.slice(0, 5).map(exp => (
                <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center font-bold text-xs text-white">
                      {exp.category[0]}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{exp.description}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{exp.category} · {exp.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">{fmt(exp.amount)}</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">by {currentUser?.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Add Expense / Action Board */}
        <div className="glass rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-1.5">
              <Plus size={15} className="text-purple-400" />
              Quick Ledger Input
            </h3>
            <p className="text-slate-400 text-[10px] mb-4">Record immediate expenses to current work events.</p>

            <form onSubmit={handleQuickExpenseSubmit} className="space-y-3">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Expense Title (e.g. Stage Flowers)"
                  value={quickTitle}
                  onChange={e => setQuickTitle(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  value={quickAmount}
                  onChange={e => setQuickAmount(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={quickCategory}
                  onChange={e => setQuickCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {categoriesList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!currentEvent}
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 cursor-pointer disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                Log Transaction
              </button>
            </form>
          </div>

          {/* Quick AI Quote helper */}
          <div className="mt-6 border-t border-white/5 pt-4">
            <button
              onClick={() => setPage("insights")}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/5 hover:bg-white/[0.02] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Brain size={13} className="text-purple-400" />
              Check AI Budget Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
