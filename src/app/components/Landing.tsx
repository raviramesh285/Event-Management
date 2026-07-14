import React from "react";
import { motion } from "motion/react";
import { Wallet, Sparkles, Brain, TrendingUp, Shield, FileText, Globe, Layers, CheckCircle, ArrowUpRight } from "lucide-react";

interface LandingProps {
  setPage: (page: string) => void;
  setCurrentTab?: (tab: string) => void;
}

export default function Landing({ setPage }: LandingProps) {
  const features = [
    { icon: <Brain size={22} />, title: "AI-Powered Forecasting", desc: "Predictive algorithms flags budget overruns days before they occur, keeping events stable.", color: "#8B5CF6" },
    { icon: <TrendingUp size={22} />, title: "Real-time Analytics", desc: "Interactive dashboards detailing budget usage percentage and expense category breakdowns.", color: "#3B82F6" },
    { icon: <Shield size={22} />, title: "Smart Splitting", desc: "Support for equal, percentage, and custom participant cost sharing with live settlement balances.", color: "#22D3EE" },
    { icon: <FileText size={22} />, title: "Board-Ready Reports", desc: "Generate professional Expense, Budget, and Vendor summary reports in Excel, CSV, or printable PDF.", color: "#10B981" },
    { icon: <Globe size={22} />, title: "Vendor Portals", desc: "Organize Catering, Venue, Photography, Decoration, Sound, and Logistics providers in one secure base.", color: "#F59E0B" },
    { icon: <Layers size={22} />, title: "Role-Based Access", desc: "Separate dashboards for Admins, Organizers, and Participants. Control permissions and settings.", color: "#EC4899" },
  ];

  const pricing = [
    { name: "Starter", price: "₹999", period: "/mo", desc: "Small scale college events & parties", color: "#3B82F6", perks: ["5 active events", "Core budget tracking", "CSV report exports", "Email support"] },
    { name: "Pro", price: "₹2,999", period: "/mo", desc: "Professional event planners", color: "#8B5CF6", popular: true, perks: ["Unlimited events", "OCR receipt scanning", "AI budget forecasts", "Cost split calculator", "Priority support"] },
    { name: "Enterprise", price: "Custom", period: "", desc: "Corporate agencies & institutions", color: "#22D3EE", perks: ["Everything in Pro", "Unlimited team members", "SLA & custom integrations", "Dedicated accounts manager", "Custom branding"] },
  ];

  return (
    <div className="w-full text-slate-300">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative overflow-hidden">
        {/* Glow announcement */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-semibold text-slate-300 mb-8 border border-white/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by OCR receipt extraction and budget forecasting
          <Sparkles size={11} className="text-purple-400" />
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6 max-w-5xl"
        >
          Manage Every Event Expense <br />
          <span className="shimmer-text">Intelligently</span>
        </motion.h1>

        {/* Hero Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg max-w-2xl mb-12 leading-relaxed"
        >
          A state-of-the-art operating system for event planners. Plan events, track category budgets, split costs among attendees, and auto-extract receipt line-items using AI.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 z-10"
        >
          <button
            onClick={() => setPage("login")}
            className="px-8 py-4 rounded-2xl text-white font-bold text-sm transition-all hover:scale-105 hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] cursor-pointer"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
          >
            Launch System
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("pricing");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 rounded-2xl text-slate-300 font-semibold text-sm glass hover:text-white transition-all cursor-pointer border border-white/5"
          >
            View Pricing
          </button>
        </motion.div>

        {/* Floating Preview Window */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative mt-16 w-full max-w-4xl mx-auto z-10"
        >
          <div
            className="gradient-border rounded-3xl overflow-hidden glass shadow-2xl"
            style={{ background: "rgba(8, 14, 32, 0.75)", backdropFilter: "blur(40px)" }}
          >
            {/* Window bar */}
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider">EXPENSEVISION_INTELLIGENCE.EXE</div>
              <div className="w-12" />
            </div>

            {/* Simulated UI layout */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="md:col-span-2 glass-subtle rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Total Spent</div>
                    <div className="text-2xl font-bold text-white">₹3,88,500 <span className="text-xs text-slate-400 font-normal">of ₹4,85,000</span></div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">Pro Active</span>
                  </div>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" style={{ width: "80%" }} />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500">Catering</div>
                    <div className="text-xs font-bold text-slate-200">₹1,24,000</div>
                  </div>
                  <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500">Venue</div>
                    <div className="text-xs font-bold text-slate-200">₹97,000</div>
                  </div>
                  <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <div className="text-[10px] text-slate-500">Entertainment</div>
                    <div className="text-xs font-bold text-slate-200">₹70,000</div>
                  </div>
                </div>
              </div>

              <div className="glass-subtle rounded-2xl p-5 border border-white/5 flex flex-col justify-between" style={{ borderColor: "rgba(139,92,246,0.3)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-purple-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">AI Predictor</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                  Quarterly Catering exceeds budget threshold. Live Band entertainment costs spiked 18% over regional cap.
                </p>
                <div className="bg-red-400/5 border border-red-500/20 p-2.5 rounded-xl text-red-300 text-[10px] flex items-center justify-between">
                  <span>Catering Overrun Forecast</span>
                  <span className="font-bold">+₹12,500</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="py-24 px-6 relative bg-[#040611]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything you need for <span className="gradient-text">financial control</span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Skip spreadsheet errors and manual splits. Bring teams, vendors, receipts, and budgets into a single unified financial base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-6 border border-white/5 cursor-default hover:-translate-y-1 transition-all group"
              >
                <div
                  className="p-3 rounded-2xl w-fit mb-5 transition-transform group-hover:scale-110"
                  style={{ background: `${feat.color}15`, color: feat.color }}
                >
                  {feat.icon}
                </div>
                <h3 className="text-white font-bold mb-2 text-sm">{feat.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple, transparent <span className="gradient-text">pricing plans</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              All plans include standard event dashboard controls. Pro plans include full AI tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pricing.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`glass rounded-3xl p-6 relative flex flex-col justify-between border ${
                  tier.popular ? "gradient-border border-purple-500/30" : "border-white/5"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
                    MOST POPULAR
                  </div>
                )}
                <div>
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-lg">{tier.name}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{tier.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-slate-400 text-xs font-medium">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.perks.map((p, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle size={13} className="shrink-0" style={{ color: tier.color }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setPage("login")}
                  className="w-full py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-[1.02]"
                  style={
                    tier.popular
                      ? { background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "white" }
                      : { background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}25` }
                  }
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#03050d] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
              <Wallet size={11} className="text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">ExpenseVision AI</span>
          </div>
          <p className="text-slate-500">© 2026 ExpenseVision AI. All rights reserved. Where every rupee tells a story.</p>
          <div className="flex gap-6 text-slate-500">
            {["Privacy Policy", "Terms of Service", "Contact Support"].map(l => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
