import React, { useState, useEffect } from "react";
import { useApp } from "../state";
import { motion, AnimatePresence } from "motion/react";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ChevronRight, CheckCircle } from "lucide-react";

export default function AIInsights() {
  const { expenses, events, settings } = useApp();
  const [selectedEventId, setSelectedEventId] = useState(() => events[0]?.id || "");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("");

  const currentEvent = events.find(e => e.id === selectedEventId);
  const activeEvents = events.filter(e => e.status === "active");

  const currentExpenses = expenses.filter(ex => ex.event_id === selectedEventId);
  const totalSpent = currentExpenses.reduce((sum, ex) => sum + ex.amount, 0);
  const totalBudget = currentEvent ? currentEvent.budget : 0;
  const usagePct = totalBudget > 0 ? totalSpent / totalBudget : 0;

  // Run a quick mock AI analysis
  useEffect(() => {
    if (!currentEvent) return;
    setAnalyzing(true);
    setAnalysisText("");

    const t = setTimeout(() => {
      let advice = "";
      if (usagePct > 1.0) {
        advice = `CRITICAL: Your spending is at ${Math.round(usagePct * 100)}% of the budget. Catering is the primary cost driver. I recommend negotiating a custom split with participants or review transportation agreements to reduce overhead by up to 15%.`;
      } else if (usagePct > 0.8) {
        advice = `WARNING: Spends have hit ${Math.round(usagePct * 100)}%. Linear forecasts show Catering will overrun by ₹12,500. Secure venue reservations immediately to freeze rental rates before seasonal fee increases.`;
      } else {
        advice = `BUDGET SAFE: Spend rate is stable at ${Math.round(usagePct * 100)}%. My predictive engine shows low risk of exceeding the limit. Maintain this spend pattern to preserve a 10% surplus margin at closing.`;
      }
      setAnalysisText(advice);
      setAnalyzing(false);
    }, 1200);

    return () => clearTimeout(t);
  }, [selectedEventId, totalSpent]);

  // Generate category specific forecasts
  const categoriesList = ["Food", "Travel", "Decoration", "Venue", "Photography", "Entertainment", "Miscellaneous"];
  const forecasts = categoriesList.map(cat => {
    const allocatedBudget = Math.round(totalBudget * (cat === "Food" ? 0.3 : cat === "Venue" ? 0.25 : cat === "Entertainment" ? 0.15 : 0.06));
    const catSpent = currentExpenses.filter(ex => ex.category === cat).reduce((sum, ex) => sum + ex.amount, 0);
    
    // Extrapolate a predicted cost
    const overrunFactor = catSpent > allocatedBudget ? 1.25 : catSpent > 0.7 * allocatedBudget ? 1.05 : 0.95;
    const predicted = Math.round(catSpent > 0 ? catSpent * overrunFactor : allocatedBudget * 0.9);
    
    let risk: "high" | "medium" | "low" = "low";
    if (catSpent > allocatedBudget) risk = "high";
    else if (catSpent > 0.85 * allocatedBudget) risk = "medium";

    return {
      cat,
      current: catSpent,
      predicted,
      allocated: allocatedBudget,
      risk
    };
  });

  const getRiskColor = (r: string) => {
    if (r === "high") return "text-red-400 border-red-500/25 bg-red-500/5";
    if (r === "medium") return "text-amber-400 border-amber-500/25 bg-amber-500/5";
    return "text-emerald-400 border-emerald-500/25 bg-emerald-500/5";
  };

  const getRiskIndicatorColor = (r: string) => {
    if (r === "high") return "#FF4D6D";
    if (r === "medium") return "#FFC107";
    return "#00E676";
  };

  return (
    <div className="space-y-6 text-slate-300 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Forecasting & Insights</h2>
          <p className="text-slate-400 text-xs mt-1">Predictive budgets, risk analysis, and smart cost-saving suggestions.</p>
        </div>
        
        {/* Event selector */}
        {activeEvents.length > 0 && (
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 cursor-pointer"
          >
            {activeEvents.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Interactive AI Chat Analysis Panel */}
      <div className="glass rounded-3xl p-6 border border-white/5 flex gap-4 relative overflow-hidden" style={{ borderColor: "rgba(139,92,246,0.25)" }}>
        <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
          <Brain size={20} className="text-white" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">ExpenseVision AI Forecast</span>
            <span className="text-[9px] px-2 py-0.5 rounded-full text-purple-300 bg-purple-500/10 border border-purple-500/20 font-bold">GPT-4 PRO</span>
          </div>

          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div key="loader" className="flex items-center gap-1.5 py-2">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2.5 h-2.5 rounded-full bg-purple-400" style={{ animation: `pulse-ring 1s ease-out infinite ${d}ms` }} />
                ))}
              </motion.div>
            ) : (
              <motion.p key="advice" className="text-xs text-slate-300 leading-relaxed font-medium">
                {analysisText || "Ready for analysis."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Forecast list */}
      <div className="glass rounded-3xl p-5 border border-white/5 space-y-4">
        <div>
          <h3 className="text-white font-bold text-sm">Predictive Quarterly Allocations</h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Category-level extrapolation based on current ledger trends.</p>
        </div>

        <div className="space-y-3">
          {forecasts.map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all">
              <div className="w-24 text-xs font-semibold text-white shrink-0">{f.cat}</div>
              <div className="flex-1 hidden md:block">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((f.current / (f.allocated || 1)) * 100, 100)}%`,
                      background: getRiskIndicatorColor(f.risk)
                    }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-slate-400 font-mono">
                  {settings.currency}{f.current.toLocaleString()} / {settings.currency}{f.predicted.toLocaleString()}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider ${getRiskColor(f.risk).split(" ")[0]}`}>
                  {f.risk} RISK
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested optimizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 border border-white/5 bg-white/[0.01] rounded-3xl text-left space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <AlertTriangle size={16} />
          </div>
          <h4 className="text-white font-bold text-xs">Contract Inconsistencies</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Venue reservation is currently logged manually. High risk of rate changes. Secure binding contract to avoid a predicted ₹14,000 hike.
          </p>
        </div>

        <div className="p-5 border border-white/5 bg-white/[0.01] rounded-3xl text-left space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Lightbulb size={16} />
          </div>
          <h4 className="text-white font-bold text-xs">Cost-Saving Recommendations</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Consolidating DJ audio booking and visual lighting into a single Sound System provider reduces total cost by approximately ₹8,500.
          </p>
        </div>
      </div>

    </div>
  );
}
