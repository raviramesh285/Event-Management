import React, { useState } from "react";
import { useApp } from "../state";
import { Users, DollarSign, Split, CheckCircle2, AlertCircle } from "lucide-react";

export default function SplittingModule() {
  const { expenses, events, users, participants, payments, splitExpense, markPaymentStatus, settings } = useApp();
  
  // Selection States
  const [selectedEventId, setSelectedEventId] = useState(() => events[0]?.id || "");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "percentage" | "custom">("equal");

  const activeEvents = events.filter(e => e.status === "active");
  const eventExpenses = expenses.filter(ex => ex.event_id === selectedEventId);
  const selectedExpense = expenses.find(ex => ex.id === selectedExpenseId);

  // Participants bound to this event
  const eventParticipantLinks = participants.filter(p => p.event_id === selectedEventId);
  const eventParticipants = eventParticipantLinks
    .map(p => users.find(u => u.id === p.user_id))
    .filter(Boolean) as any[];

  // Share values inputted by user
  const [shares, setShares] = useState<{ [userId: string]: string }>({});

  const handleShareChange = (userId: string, val: string) => {
    setShares(prev => ({ ...prev, [userId]: val }));
  };

  const handleSplitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpenseId || eventParticipants.length === 0) return;

    const numericSplits: { [userId: string]: number } = {};
    let totalInput = 0;

    eventParticipants.forEach(p => {
      const shareVal = parseFloat(shares[p.id] || "0");
      numericSplits[p.id] = shareVal;
      totalInput += shareVal;
    });

    // Validate totals for percentage and custom splits
    if (splitType === "percentage" && Math.abs(totalInput - 100) > 0.1) {
      alert("Error: Total percentages must equal exactly 100%. Current sum: " + totalInput + "%");
      return;
    }

    if (splitType === "custom" && Math.abs(totalInput - selectedExpense.amount) > 1) {
      alert(`Error: Total custom shares must equal the expense amount (${settings.currency}${selectedExpense.amount}). Current sum: ${settings.currency}${totalInput}`);
      return;
    }

    // If Equal split, auto assign placeholder splits in state
    if (splitType === "equal") {
      eventParticipants.forEach(p => {
        numericSplits[p.id] = selectedExpense.amount / eventParticipants.length;
      });
    }

    splitExpense(selectedExpenseId, splitType, numericSplits);
    setShares({});
    alert("Split payments allocated successfully!");
  };

  // Filter payments matching this event
  const currentPayments = payments.filter(p => p.event_id === selectedEventId);

  return (
    <div className="space-y-6 text-slate-300 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Expense Splitting Board</h2>
        <p className="text-slate-400 text-xs mt-1">Split event bills among participants equally, by percentage, or custom sums.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Split calculator */}
        <div className="lg:col-span-5 glass rounded-3xl p-6 border border-white/5 space-y-4">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Split size={16} className="text-blue-400" />
            Config Calculator
          </h3>
          <p className="text-[10px] text-slate-400">Select an event expense and distribute cost shares.</p>

          <div className="space-y-3">
            {/* Event selector */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Event Workspace</label>
              <select
                value={selectedEventId}
                onChange={e => { setSelectedEventId(e.target.value); setSelectedExpenseId(""); }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 cursor-pointer"
              >
                {activeEvents.map(e => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
            </div>

            {/* Expense selector */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Linked Expense Bill</label>
              <select
                value={selectedExpenseId}
                onChange={e => setSelectedExpenseId(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 cursor-pointer"
              >
                <option value="">Select transaction...</option>
                {eventExpenses.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.description} ({settings.currency}{ex.amount.toLocaleString("en-IN")})</option>
                ))}
              </select>
            </div>

            {selectedExpense && (
              <form onSubmit={handleSplitSubmit} className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex gap-2">
                  {["equal", "percentage", "custom"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => { setSplitType(mode as any); setShares({}); }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                        splitType === mode ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "border-white/5 text-slate-400"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Shares entry */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Participant Allocations</label>
                  {eventParticipants.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-[10px]">
                      No participants linked to this event. Invite members in Event Workspace first.
                    </div>
                  ) : (
                    eventParticipants.map(p => (
                      <div key={p.id} className="flex items-center justify-between gap-3 p-2 bg-white/[0.01] rounded-xl border border-white/5">
                        <span className="text-xs text-slate-300 font-medium truncate">{p.name}</span>
                        {splitType === "equal" ? (
                          <span className="text-[10px] text-slate-500">
                            {settings.currency}{(selectedExpense.amount / eventParticipants.length).toFixed(2)}
                          </span>
                        ) : (
                          <div className="relative w-28">
                            <span className="absolute left-2.5 top-2 text-[10px] text-slate-500">
                              {splitType === "percentage" ? "%" : settings.currency}
                            </span>
                            <input
                              type="number"
                              required
                              placeholder="0"
                              value={shares[p.id] || ""}
                              onChange={e => handleShareChange(p.id, e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-1.5 pl-6 pr-2 text-xs text-white text-right focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="submit"
                  disabled={eventParticipants.length === 0}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 cursor-pointer disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
                >
                  Allocate Cost Splits
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right column: Settlement Ledger */}
        <div className="lg:col-span-7 glass rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Users size={16} className="text-purple-400" />
              Outstanding Settlement Ledger
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {currentPayments.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-xs">
                  No cost sharing items allocated to this event.
                </div>
              ) : (
                currentPayments.map(p => {
                  const part = users.find(u => u.id === p.participant_id);
                  const exp = expenses.find(e => e.id === p.expense_id);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div>
                        <div className="text-xs font-semibold text-white">{part ? part.name : "Unknown"}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Owes share for: <strong className="text-slate-400">{exp ? exp.description : "Bill Split"}</strong>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-white">{settings.currency}{p.amount.toLocaleString("en-IN")}</div>
                          <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase mt-0.5 ${
                            p.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        {p.status === "unpaid" ? (
                          <button
                            onClick={() => markPaymentStatus(p.id, "paid")}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-[10px] font-bold text-blue-400 transition-all cursor-pointer"
                          >
                            Mark Settled
                          </button>
                        ) : (
                          <div className="w-[72px] text-center text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 size={15} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4 text-[10px] text-slate-500 flex items-center gap-1.5">
            <AlertCircle size={12} className="text-slate-400 shrink-0" />
            <span>Marking a participant as settled updates their balances and triggers notifications.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
