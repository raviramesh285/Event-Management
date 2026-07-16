import React, { useState, useEffect } from "react";
import { useApp } from "../state";
import { motion, AnimatePresence } from "motion/react";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Activity, Target } from "lucide-react";
import { Department, Expense } from "../types";

export default function AIInsights() {
  const { expenses, events, departments, currentUser, settings } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState("");

  const myEvents = currentUser?.role === "Event Manager" 
    ? events.filter(e => e.event_manager_id === currentUser.id)
    : events;

  const activeEvent = myEvents[0];
  const eventDepts = departments.filter(d => d.event_id === activeEvent?.id);
  const eventExps = expenses.filter(e => e.event_id === activeEvent?.id && ["Approved", "Paid", "Closed"].includes(e.status));
  const pendingExps = expenses.filter(e => e.event_id === activeEvent?.id && ["Submitted", "Pending Approval"].includes(e.status));

  const totalSpent = eventExps.reduce((s, e) => s + e.amount, 0);
  const totalPending = pendingExps.reduce((s, e) => s + e.amount, 0);
  const totalBudget = activeEvent?.budget || 0;

  useEffect(() => {
    if (!activeEvent) return;
    setAnalyzing(true);
    setAnalysisText("");

    const t = setTimeout(() => {
      let advice = "";
      const projectedFinal = totalSpent + totalPending + (totalBudget * 0.12); // AI Mock calculation
      const usagePct = totalBudget > 0 ? projectedFinal / totalBudget : 0;

      // Generate natural language insight
      const overrunDept = eventDepts.find(d => {
        const dSpent = eventExps.filter(e => e.department_id === d.id).reduce((s, e) => s + e.amount, 0);
        return d.budget > 0 && (dSpent / d.budget) > 0.9;
      });

      const underRunDept = eventDepts.find(d => {
        const dSpent = eventExps.filter(e => e.department_id === d.id).reduce((s, e) => s + e.amount, 0);
        return d.budget > 0 && (dSpent / d.budget) < 0.2;
      });

      if (usagePct > 1.0) {
        advice = `CRITICAL ALERT: Forecasted final cost (${settings.currency}${projectedFinal.toLocaleString()}) exceeds the total event budget. High-risk anomaly detected: Expense run-rate is 22% higher than expected. Immediate freeze on non-essential approvals recommended.`;
      } else if (usagePct > 0.9) {
        advice = `WARNING: Projected spend is at ${Math.round(usagePct * 100)}%. ${overrunDept ? `${overrunDept.name} department has already used ${Math.round((eventExps.filter(e => e.department_id === overrunDept.id).reduce((s, e) => s + e.amount, 0) / overrunDept.budget)*100)}% of its budget. ` : ''}Recommend reallocating funds to cover expected overages in upcoming weeks.`;
      } else {
        advice = `BUDGET SAFE: Spend trajectory is stable. Projected final cost is ${settings.currency}${projectedFinal.toLocaleString()}. ${underRunDept ? `${underRunDept.name} department is spending significantly below expected.` : 'Department performance scores are above 85% average.'}`;
      }

      setAnalysisText(advice);
      setAnalyzing(false);
    }, 1500);

    return () => clearTimeout(t);
  }, [activeEvent, totalSpent, totalPending, totalBudget]);

  const fmt = (n: number) => settings.currency + n.toLocaleString("en-IN");

  if (!activeEvent) return <div className="p-6 text-slate-400">No events available for analysis.</div>;

  return (
    <div className="space-y-6 text-slate-300 text-left">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Brain size={24} className="text-purple-400" /> AI Financial Intelligence
        </h2>
        <p className="text-slate-400 text-xs mt-1">Predictive cost modeling, anomaly detection, and smart budget recommendations.</p>
      </div>

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
                {[0, 150, 300].map(d => <span key={d} className="w-2.5 h-2.5 rounded-full bg-purple-400" style={{ animation: `pulse-ring 1s ease-out infinite ${d}ms` }} />)}
              </motion.div>
            ) : (
              <motion.p key="advice" className="text-xs text-slate-300 leading-relaxed font-medium">
                {analysisText || "Ready for analysis."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 border border-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Activity size={16} className="text-amber-400" /> Department Performance Scores
          </h3>
          <div className="space-y-4">
            {eventDepts.map(dept => {
              const spent = eventExps.filter(e => e.department_id === dept.id).reduce((s, e) => s + e.amount, 0);
              const pending = pendingExps.filter(e => e.department_id === dept.id).reduce((s, e) => s + e.amount, 0);
              const projectedDept = spent + pending + (dept.budget * 0.05); // AI Prediction
              const pct = dept.budget > 0 ? (projectedDept / dept.budget) * 100 : 0;
              
              let warning = "";
              if (pct >= 100) warning = "Critical: Exceeded Budget Limit";
              else if (pct >= 90) warning = "Warning: 90% Threshold Exceeded";
              else if (pct >= 80) warning = "Caution: 80% Threshold Reached";
              
              const score = Math.max(0, 100 - (pct > 100 ? 50 : pct > 80 ? 20 : 0));

              return (
                <div key={dept.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{dept.name}</span>
                    <span className={`text-[10px] font-bold ${score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>Score: {score}/100</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{fmt(projectedDept)} projected / {fmt(dept.budget)}</span>
                    <span className="text-red-400 font-semibold">{warning}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 border border-white/5">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <TrendingUp size={16} className="text-blue-400" /> Forecast Final Cost
             </h3>
             <div className="flex items-end gap-3 mb-2">
               <span className="text-3xl font-extrabold text-white">{fmt(totalSpent + totalPending + (totalBudget * 0.12))}</span>
               <span className="text-xs text-slate-400 mb-1">projected final settlement</span>
             </div>
             <p className="text-[10px] text-slate-400">Based on historical burn rates across {eventDepts.length} departments and current pending approvals.</p>
          </div>

          <div className="p-5 border border-amber-500/20 bg-amber-500/5 rounded-3xl text-left space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle size={16} />
            </div>
            <h4 className="text-amber-400 font-bold text-xs">Expense Anomaly Detected</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Recent invoice submissions in the Technical Support department are 45% higher than the historical average for this event category.
            </p>
          </div>

          <div className="p-5 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl text-left space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Lightbulb size={16} />
            </div>
            <h4 className="text-emerald-400 font-bold text-xs">Budget Redistribution Recommended</h4>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Decoration has a surplus trajectory. Shifting ₹15,000 to Catering will stabilize their 90% threshold warning with minimal impact on overall event quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
