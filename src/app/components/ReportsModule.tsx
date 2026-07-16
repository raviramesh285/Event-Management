import React, { useState } from "react";
import { useApp } from "../state";
import { Download, FileText, PieChart as PieChartIcon } from "lucide-react";

export default function ReportsModule() {
  const { events, departments, expenses, currentUser, settings } = useApp();
  const [reportType, setReportType] = useState<string>("summary");

  const fmt = (n: number) => settings.currency + n.toLocaleString("en-IN");

  const getRoleBasedData = () => {
    if (currentUser?.role === "Admin") {
      return {
        scope: "Organization",
        exps: expenses,
        depts: departments,
        evts: events
      };
    }
    if (currentUser?.role === "Event Manager") {
      const myEvents = events.filter(e => e.event_manager_id === currentUser.id);
      return {
        scope: "Event",
        exps: expenses.filter(ex => myEvents.some(e => e.id === ex.event_id)),
        depts: departments.filter(d => myEvents.some(e => e.id === d.event_id)),
        evts: myEvents
      };
    }
    if (currentUser?.role === "Department Manager") {
      const myDepts = departments.filter(d => d.manager_id === currentUser.id);
      return {
        scope: "Department",
        exps: expenses.filter(ex => myDepts.some(d => d.id === ex.department_id)),
        depts: myDepts,
        evts: [] // Not needed for dept manager reports
      };
    }
    return { scope: "None", exps: [], depts: [], evts: [] };
  };

  const { scope, exps, depts, evts } = getRoleBasedData();

  const handleExport = (format: "csv" | "pdf") => {
    alert(`Exporting ${scope} Report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Reporting</h2>
          <p className="text-slate-400 text-xs mt-1">Generate and export {scope.toLowerCase()} financial data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport("csv")} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => handleExport("pdf")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer">
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="flex border-b border-white/5 gap-1.5 pb-px mb-6">
          <button onClick={() => setReportType("summary")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${reportType === "summary" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>
            Financial Summary
          </button>
          {scope !== "Department" && (
            <button onClick={() => setReportType("departments")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${reportType === "departments" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>
              Department Analysis
            </button>
          )}
          <button onClick={() => setReportType("expenses")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${reportType === "expenses" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>
            Expense Ledger
          </button>
        </div>

        {reportType === "summary" && (
          <div className="space-y-4">
            <h3 className="text-white font-bold">Scope: {scope} Wide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="text-[10px] text-slate-400">Total Budget</div>
                <div className="text-xl font-bold text-white">{fmt(depts.reduce((s,d)=>s+d.budget,0) || evts.reduce((s,e)=>s+e.budget,0))}</div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="text-[10px] text-slate-400">Total Expenses (Approved)</div>
                <div className="text-xl font-bold text-blue-400">{fmt(exps.filter(e=>["Approved","Paid","Closed"].includes(e.status)).reduce((s,e)=>s+e.amount,0))}</div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="text-[10px] text-slate-400">Pending Approvals</div>
                <div className="text-xl font-bold text-amber-400">{exps.filter(e=>e.status==="Pending Approval").length}</div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <div className="text-[10px] text-slate-400">Total Transactions</div>
                <div className="text-xl font-bold text-white">{exps.length}</div>
              </div>
            </div>
          </div>
        )}

        {reportType === "departments" && scope !== "Department" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 uppercase">
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4 text-right">Allocated Budget</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4 text-right">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {depts.map(d => {
                  const spent = exps.filter(e => e.department_id === d.id && ["Approved","Paid","Closed"].includes(e.status)).reduce((s,e)=>s+e.amount,0);
                  const util = d.budget > 0 ? (spent / d.budget) * 100 : 0;
                  return (
                    <tr key={d.id} className="hover:bg-white/[0.01]">
                      <td className="py-3 px-4 text-white font-semibold">{d.name}</td>
                      <td className="py-3 px-4 text-right">{fmt(d.budget)}</td>
                      <td className="py-3 px-4 text-right">{fmt(spent)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={util >= 100 ? 'text-red-400' : util >= 80 ? 'text-amber-400' : 'text-emerald-400'}>
                          {Math.round(util)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {reportType === "expenses" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {exps.map(e => (
                  <tr key={e.id} className="hover:bg-white/[0.01]">
                    <td className="py-3 px-4">{e.date}</td>
                    <td className="py-3 px-4 text-white">{depts.find(d=>d.id===e.department_id)?.name || "Unknown"}</td>
                    <td className="py-3 px-4">{e.category}</td>
                    <td className="py-3 px-4 text-right font-bold text-white">{fmt(e.amount)}</td>
                    <td className="py-3 px-4 text-right">{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
