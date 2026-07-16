import React, { useState } from "react";
import { useApp } from "../state";
import { Plus, Edit3, Trash2, CheckCircle, Upload, FileText, ChevronRight, Check } from "lucide-react";
import { Expense, Department } from "../types";

export default function ExpenseManagement() {
  const { expenses, departments, events, currentUser, addExpense, deleteExpense, updateExpenseStatus } = useApp();
  
  const [showAdd, setShowAdd] = useState(false);
  const [newExpense, setNewExpense] = useState({ event_id: "", department_id: "", amount: "", category: "", description: "", date: new Date().toISOString().split("T")[0] });

  // Get active departments for this user
  let activeDepts: Department[] = [];
  if (currentUser?.role === "Department Manager") {
    activeDepts = departments.filter(d => d.manager_id === currentUser.id);
  }

  const myExpenses = currentUser?.role === "Department Manager" 
    ? expenses.filter(e => activeDepts.map(d=>d.id).includes(e.department_id))
    : expenses;

  const handleAdd = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    if (!newExpense.department_id) return alert("Select a department.");
    const dept = departments.find(d => d.id === newExpense.department_id);
    addExpense({
      ...newExpense,
      event_id: dept?.event_id || "",
      amount: parseFloat(newExpense.amount),
      status: isDraft ? "Draft" : "Submitted",
      receipt_url: ""
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Expense Operations</h2>
          <p className="text-slate-400 text-xs mt-1">Manage departmental bills and invoices.</p>
        </div>
        {currentUser?.role === "Department Manager" && (
          <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
            <Plus size={14} className="inline mr-1" /> Log Expense
          </button>
        )}
      </div>

      {showAdd && currentUser?.role === "Department Manager" && (
        <form className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={newExpense.department_id} onChange={e=>setNewExpense({...newExpense, department_id: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" required>
              <option value="">Select Department</option>
              {activeDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <input type="text" placeholder="Category (e.g. Food Materials)" required value={newExpense.category} onChange={e=>setNewExpense({...newExpense, category: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="number" placeholder="Amount" required value={newExpense.amount} onChange={e=>setNewExpense({...newExpense, amount: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="date" required value={newExpense.date} onChange={e=>setNewExpense({...newExpense, date: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <div className="md:col-span-2">
              <input type="text" placeholder="Description / Notes" required value={newExpense.description} onChange={e=>setNewExpense({...newExpense, description: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={(e) => handleAdd(e, true)} className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-xs transition-all cursor-pointer">Save Draft</button>
            <button type="button" onClick={(e) => handleAdd(e, false)} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-blue-500/20">Submit for Review</button>
          </div>
        </form>
      )}

      <div className="glass rounded-3xl p-6 border border-white/5">
        <h3 className="text-white font-bold mb-4">Expense Register</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {myExpenses.map(ex => {
                const dept = departments.find(d => d.id === ex.department_id);
                return (
                  <tr key={ex.id} className="hover:bg-white/[0.01]">
                    <td className="py-3 px-4 text-slate-400">{ex.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-300">{dept?.name || "Unknown"}</td>
                    <td className="py-3 px-4 text-slate-300">{ex.category}</td>
                    <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate">{ex.description}</td>
                    <td className="py-3 px-4 text-right font-bold text-white">₹{ex.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border 
                        ${ex.status === 'Draft' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                        ${ex.status === 'Submitted' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                        ${ex.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                        ${ex.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                        ${ex.status === 'Paid' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                        ${ex.status === 'Closed' ? 'bg-slate-800 text-slate-300 border-slate-700' : ''}
                      `}>
                        {ex.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ex.status === "Draft" && currentUser?.role === "Department Manager" && (
                        <button onClick={() => updateExpenseStatus(ex.id, "Submitted")} className="text-[10px] text-blue-400 hover:text-blue-300 mr-3 cursor-pointer">Submit</button>
                      )}
                      {ex.status === "Submitted" && currentUser?.role === "Department Manager" && (
                        <button onClick={() => updateExpenseStatus(ex.id, "Pending Approval")} className="text-[10px] text-amber-400 hover:text-amber-300 mr-3 cursor-pointer">Req Approval</button>
                      )}
                      {["Draft", "Submitted"].includes(ex.status) && currentUser?.role === "Department Manager" && (
                        <button onClick={() => deleteExpense(ex.id)} className="text-slate-500 hover:text-red-400 cursor-pointer"><Trash2 size={14} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {myExpenses.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">No expenses found.</div>}
        </div>
      </div>
    </div>
  );
}
