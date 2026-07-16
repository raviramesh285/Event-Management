import React, { useState } from "react";
import { useApp } from "../state";
import { CheckSquare, CheckCircle, XCircle, AlertCircle, RefreshCw, CreditCard, Lock } from "lucide-react";
import { Expense } from "../types";

export default function ExpenseApprovals() {
  const { expenses, events, departments, currentUser, updateExpenseStatus } = useApp();

  if (currentUser?.role !== "Admin" && currentUser?.role !== "Event Manager") {
    return <div className="p-6 text-red-400">Access Denied.</div>;
  }

  // Filter events they can manage
  const myEvents = currentUser.role === "Event Manager" 
    ? events.filter(e => e.event_manager_id === currentUser.id)
    : events;

  // Only show expenses for those events
  const viewableExpenses = expenses.filter(ex => myEvents.some(e => e.id === ex.event_id));

  // Pending for review
  const pendingExps = viewableExpenses.filter(e => e.status === "Pending Approval");
  const approvedExps = viewableExpenses.filter(e => e.status === "Approved");
  const paidExps = viewableExpenses.filter(e => e.status === "Paid");

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "paid">("pending");

  const renderTable = (list: Expense[]) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-white/5 text-slate-500 uppercase">
            <th className="py-3 px-4">Event</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4 text-right">Amount</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {list.map(ex => {
            const ev = events.find(e => e.id === ex.event_id);
            const dept = departments.find(d => d.id === ex.department_id);
            return (
              <tr key={ex.id} className="hover:bg-white/[0.01]">
                <td className="py-3 px-4 font-semibold text-white">{ev?.title}</td>
                <td className="py-3 px-4 text-slate-300">{dept?.name}</td>
                <td className="py-3 px-4 text-slate-400">{ex.description}</td>
                <td className="py-3 px-4 text-right font-bold text-white">₹{ex.amount.toLocaleString()}</td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  {ex.status === "Pending Approval" && (
                    <>
                      <button onClick={() => updateExpenseStatus(ex.id, "Draft")} className="p-1.5 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 cursor-pointer transition-all" title="Reject back to Draft">
                        <XCircle size={14} />
                      </button>
                      <button onClick={() => updateExpenseStatus(ex.id, "Approved")} className="p-1.5 text-emerald-400 bg-emerald-500/10 rounded-lg hover:bg-emerald-500/20 cursor-pointer transition-all" title="Approve">
                        <CheckCircle size={14} />
                      </button>
                    </>
                  )}
                  {ex.status === "Approved" && (
                    <button onClick={() => updateExpenseStatus(ex.id, "Paid")} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-500/30 cursor-pointer transition-all flex items-center gap-1">
                      <CreditCard size={12} /> Mark Paid
                    </button>
                  )}
                  {ex.status === "Paid" && (
                    <button onClick={() => updateExpenseStatus(ex.id, "Closed")} className="px-3 py-1 bg-slate-500/20 text-slate-300 rounded-lg text-[10px] font-bold hover:bg-slate-500/30 cursor-pointer transition-all flex items-center gap-1">
                      <Lock size={12} /> Close
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {list.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">No expenses in this queue.</div>}
    </div>
  );

  return (
    <div className="space-y-6 text-slate-300">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Expense Approvals & Payments</h2>
        <p className="text-slate-400 text-xs mt-1">Review requests, process payments, and close settled accounts.</p>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="flex border-b border-white/5 gap-1.5 pb-px mb-4">
          <button onClick={() => setActiveTab("pending")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === "pending" ? "border-amber-500 text-amber-400" : "border-transparent text-slate-400 hover:text-white"}`}>
            <AlertCircle size={14} /> Requires Approval ({pendingExps.length})
          </button>
          <button onClick={() => setActiveTab("approved")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === "approved" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-400 hover:text-white"}`}>
            <CheckCircle size={14} /> Approved, Awaiting Payment ({approvedExps.length})
          </button>
          <button onClick={() => setActiveTab("paid")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${activeTab === "paid" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400 hover:text-white"}`}>
            <CreditCard size={14} /> Paid, Needs Closing ({paidExps.length})
          </button>
        </div>

        {activeTab === "pending" && renderTable(pendingExps)}
        {activeTab === "approved" && renderTable(approvedExps)}
        {activeTab === "paid" && renderTable(paidExps)}
      </div>
    </div>
  );
}
