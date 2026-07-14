import React, { useState } from "react";
import { useApp } from "../state";
import { Brain, Send, Sparkles, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
  plan?: {
    title: string;
    budget: number;
    category: any;
    location: string;
    categories: { name: string; amount: number; color: string }[];
  };
}

export default function AIAssistant({ setPage }: { setPage: (page: string) => void }) {
  const { seedAISuggestedPlan, settings } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your ExpenseVision AI Event Planning Assistant. Give me a budget size and event category, and I will generate a optimized category-cap draft plan with corresponding vendor targets that you can load directly into your workspace."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim()) return;

    // Add user message
    const userMsg: Message = { sender: "user", text: promptText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response based on keyword inputs
    setTimeout(() => {
      let aiText = "";
      let simulatedPlan: Message["plan"] = undefined;
      const lower = promptText.toLowerCase();

      if (lower.includes("wedding")) {
        const budgetVal = lower.includes("10") ? 1000000 : lower.includes("15") ? 1500000 : 800000;
        simulatedPlan = {
          title: "AI Draft: Royal Wedding Ceremony",
          budget: budgetVal,
          category: "Wedding",
          location: "Royal Banquet Resorts",
          categories: [
            { name: "Venue", amount: Math.round(budgetVal * 0.35), color: "#8B5CF6" },
            { name: "Food", amount: Math.round(budgetVal * 0.3), color: "#3B82F6" },
            { name: "Decoration", amount: Math.round(budgetVal * 0.18), color: "#22D3EE" },
            { name: "Photography", amount: Math.round(budgetVal * 0.12), color: "#10B981" },
            { name: "Miscellaneous", amount: Math.round(budgetVal * 0.05), color: "#64748B" }
          ]
        };
        aiText = `Here is a custom budget breakdown for a Wedding Ceremony with a total budget limit of ${settings.currency}${budgetVal.toLocaleString("en-IN")}. I have allocated shares to Venue (35%), Catering Food (30%), Decor (18%), and Photography (12%). Review details below:`;
      } else if (lower.includes("college") || lower.includes("fest")) {
        const budgetVal = 300000;
        simulatedPlan = {
          title: "AI Draft: Collegiate TechFest 2026",
          budget: budgetVal,
          category: "College Event",
          location: "Campus Main Auditorium",
          categories: [
            { name: "Entertainment", amount: Math.round(budgetVal * 0.4), color: "#EC4899" },
            { name: "Food", amount: Math.round(budgetVal * 0.25), color: "#3B82F6" },
            { name: "Decoration", amount: Math.round(budgetVal * 0.15), color: "#22D3EE" },
            { name: "Travel", amount: Math.round(budgetVal * 0.12), color: "#8B5CF6" },
            { name: "Miscellaneous", amount: Math.round(budgetVal * 0.08), color: "#64748B" }
          ]
        };
        aiText = `For a College Technical Festival with a cap of ${settings.currency}3,00,000, I have prioritised Guest Speakers & Sound Entertainment (40%) and catering items. Review allocations:`;
      } else {
        // Fallback default corporate gala
        const budgetVal = 500000;
        simulatedPlan = {
          title: "AI Draft: Corporate Spring Gala",
          budget: budgetVal,
          category: "Corporate Event",
          location: "Grand Marriott Ballrooms",
          categories: [
            { name: "Venue", amount: Math.round(budgetVal * 0.4), color: "#8B5CF6" },
            { name: "Food", amount: Math.round(budgetVal * 0.3), color: "#3B82F6" },
            { name: "Entertainment", amount: Math.round(budgetVal * 0.15), color: "#EC4899" },
            { name: "Decoration", amount: Math.round(budgetVal * 0.1), color: "#22D3EE" },
            { name: "Miscellaneous", amount: Math.round(budgetVal * 0.05), color: "#64748B" }
          ]
        };
        aiText = `Generated a Corporate Event framework based on standard regional caps (${settings.currency}5,00,000 budget):`;
      }

      setMessages(prev => [...prev, { sender: "ai", text: aiText, plan: simulatedPlan }]);
      setLoading(false);
    }, 1500);
  };

  const handleApplyPlan = (plan: Exclude<Message["plan"], undefined>) => {
    seedAISuggestedPlan(plan.title, plan.budget, plan.category, plan.location, plan);
    alert(`Success: Plan "${plan.title}" has been loaded into your active events, categories set, and vendors drafts seeded!`);
    setPage("dashboard");
  };

  return (
    <div className="space-y-6 text-slate-300 text-left">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">AI Planning Assistant</h2>
        <p className="text-slate-400 text-xs mt-1">Prompt the Copilot to auto-generate event budget templates and seed provider logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Chat Feed Panel */}
        <div className="lg:col-span-8 glass rounded-3xl p-5 border border-white/5 flex flex-col h-[520px] justify-between">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs ${
                  m.sender === "user" ? "bg-blue-500 text-white" : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
                }`}>
                  {m.sender === "user" ? "U" : <Brain size={13} />}
                </div>

                <div className="space-y-3">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>

                  {/* If response has active generated plan builder */}
                  {m.plan && (
                    <div className="glass-subtle border border-purple-500/20 rounded-2xl p-4 space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white">{m.plan.title}</span>
                        <span className="text-[10px] text-purple-400 font-mono font-bold">Limit: {settings.currency}{m.plan.budget.toLocaleString()}</span>
                      </div>

                      {/* Allocations breakdown */}
                      <div className="space-y-1.5">
                        {m.plan.categories.map((c, cIdx) => (
                          <div key={cIdx} className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                              <span className="text-slate-400">{c.name}</span>
                            </div>
                            <span className="text-white font-mono">{settings.currency}{c.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action trigger */}
                      <button
                        onClick={() => handleApplyPlan(m.plan!)}
                        className="w-full mt-2 py-2 rounded-xl text-white font-bold text-[10px] transition-all hover:opacity-90 flex items-center justify-center gap-1 cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
                      >
                        Apply Plan to Workspace <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center animate-spin">
                  <Brain size={13} />
                </div>
                <div className="text-[10px] text-slate-500 animate-pulse">Assistant is formulating splits...</div>
              </div>
            )}
          </div>

          {/* Form input */}
          <div className="flex gap-2 border-t border-white/5 pt-4">
            <input
              type="text"
              placeholder="e.g. Wedding budget layout for 15 lakhs..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="p-3 rounded-xl text-white flex items-center justify-center cursor-pointer transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
            >
              <Send size={13} />
            </button>
          </div>
        </div>

        {/* Right column: Copilot Presets */}
        <div className="lg:col-span-4 glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
              <Sparkles size={15} className="text-purple-400" />
              Quick Templates
            </h3>
            <p className="text-slate-400 text-[10px]">Single-click preset commands to seed draft budgets.</p>

            <div className="space-y-2">
              {[
                { title: "Wedding Budget Plan", prompt: "Wedding budget template for 10 lakhs" },
                { title: "College Tech Fest Template", prompt: "Help me budget a college festival with 3,00,000 rupees" },
                { title: "Corporate Gala Sheet", prompt: "Suggest vendor allocations for a corporate gala with 5 lakh budget" }
              ].map((pst, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(pst.prompt)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                >
                  <div className="text-[10px] text-purple-400 mb-0.5">Preset Template</div>
                  <div>{pst.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/20 p-3.5 rounded-2xl text-[10px] text-blue-300 flex gap-2.5 mt-4 items-start">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>AI drafts automatically configure categories and create temporary vendor placeholders for quick planning.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
