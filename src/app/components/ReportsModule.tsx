import React, { useState } from "react";
import { useApp } from "../state";
import { FileText, Download, Printer, Filter, DollarSign, Wallet, Users, LayoutGrid } from "lucide-react";

export default function ReportsModule() {
  const { events, expenses, vendors, payments, users, settings } = useApp();
  const [selectedEventId, setSelectedEventId] = useState(() => events[0]?.id || "");
  const [reportType, setReportType] = useState<"expense" | "budget" | "vendor" | "participant">("expense");

  const currentEvent = events.find(e => e.id === selectedEventId);
  const activeEvents = events.filter(e => e.status === "active");

  const currentExpenses = expenses.filter(ex => ex.event_id === selectedEventId);
  const currentVendors = vendors.filter(v => v.event_id === selectedEventId);
  const currentPayments = payments.filter(p => p.event_id === selectedEventId);

  const totalSpent = currentExpenses.reduce((sum, ex) => sum + ex.amount, 0);
  const totalBudget = currentEvent ? currentEvent.budget : 0;
  const remainingBudget = totalBudget - totalSpent;
  const avgExpense = currentExpenses.length > 0 ? totalSpent / currentExpenses.length : 0;

  // CSV Generator
  const triggerCSVDownload = () => {
    if (!currentEvent) return;
    let csvContent = "";
    let fileName = `${currentEvent.title.replace(/\s+/g, "_")}_`;

    if (reportType === "expense") {
      csvContent = "Expense Title,Category,Amount,Date,Description\n";
      currentExpenses.forEach(ex => {
        csvContent += `"${ex.description}","${ex.category}",${ex.amount},"${ex.date}","${ex.description}"\n`;
      });
      fileName += "Expense_Summary.csv";
    } else if (reportType === "budget") {
      csvContent = "Metric,Amount\n";
      csvContent += `"Total Event Budget",${totalBudget}\n`;
      csvContent += `"Total Event Spent",${totalSpent}\n`;
      csvContent += `"Remaining Balance",${remainingBudget}\n`;
      csvContent += `"Utilization Percentage",${Math.round((totalSpent / totalBudget) * 100)}%\n`;
      fileName += "Budget_Report.csv";
    } else if (reportType === "vendor") {
      csvContent = "Vendor Name,Service Type,Amount,Payment Status,Contact\n";
      currentVendors.forEach(v => {
        csvContent += `"${v.vendor_name}","${v.service_type}",${v.amount},"${v.status}","${v.contact}"\n`;
      });
      fileName += "Vendor_Report.csv";
    } else {
      csvContent = "Participant Name,Share Amount,Payment Status\n";
      currentPayments.forEach(p => {
        const u = users.find(usr => usr.id === p.participant_id);
        csvContent += `"${u ? u.name : "Unknown"}",${p.amount},"${p.status}"\n`;
      });
      fileName += "Participant_Payments.csv";
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-slate-300 text-left print:bg-white print:text-black">
      
      {/* Header (hidden on print) */}
      <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Audit Report Generator</h2>
          <p className="text-slate-400 text-xs mt-1">Export structured spreadsheets or trigger physical PDF printing.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={triggerPrint}
            className="glass px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/5"
          >
            <Printer size={13} /> Print PDF
          </button>
          <button
            onClick={triggerCSVDownload}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white font-bold transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
          >
            <Download size={13} /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Filter panel (hidden on print) */}
      <div className="glass rounded-2xl p-4 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
        {/* Workspace select */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-slate-500" />
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 cursor-pointer"
          >
            {activeEvents.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        {/* Report type select */}
        <div className="flex gap-1.5">
          {[
            { id: "expense", label: "Spend" },
            { id: "budget", label: "Budget" },
            { id: "vendor", label: "Vendors" },
            { id: "participant", label: "Splits" }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setReportType(btn.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                reportType === btn.id ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "border-white/5 text-slate-400"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Canvas (Visible and styled nicely for print too) */}
      {currentEvent ? (
        <div className="bg-slate-950 border border-white/5 rounded-3xl p-6 space-y-6 print:border-none print:bg-white print:text-black">
          {/* Invoice Header */}
          <div className="flex items-start justify-between flex-wrap gap-4 border-b border-white/5 pb-6 print:border-black/10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center print:bg-slate-800">
                  <FileText size={12} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white print:text-black">ExpenseVision AI Operating Statement</span>
              </div>
              <h1 className="text-xl font-bold text-white print:text-black">{currentEvent.title}</h1>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">Venue: {currentEvent.location} · Event Date: {currentEvent.event_date}</p>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <div>Report Reference: EV-{currentEvent.id.toUpperCase()}</div>
              <div>Generated: {new Date().toISOString().split("T")[0]}</div>
              <div>Scope: {reportType.toUpperCase()} STATEMENT</div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-white/5 print:border-black/10">
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Budget Cap</div>
              <div className="text-lg font-extrabold text-white print:text-black">{settings.currency}{totalBudget.toLocaleString("en-IN")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Actual Spends</div>
              <div className="text-lg font-extrabold text-white print:text-black">{settings.currency}{totalSpent.toLocaleString("en-IN")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Remaining</div>
              <div className="text-lg font-extrabold text-white print:text-black">{settings.currency}{remainingBudget.toLocaleString("en-IN")}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Transaction</div>
              <div className="text-lg font-extrabold text-white print:text-black">{settings.currency}{Math.round(avgExpense).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {/* Report Data Sheets */}
          <div className="pt-2">
            {reportType === "expense" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">Expense Ledger Listing</h3>
                <div className="border border-white/5 rounded-2xl overflow-hidden print:border-black/10">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider print:border-black/10 print:text-slate-700">
                        <th className="p-3">Title / Details</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Transaction Date</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black/10">
                      {currentExpenses.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-6 text-slate-500">No logs reported.</td></tr>
                      ) : (
                        currentExpenses.map(ex => (
                          <tr key={ex.id} className="text-slate-300 print:text-slate-800">
                            <td className="p-3">{ex.description}</td>
                            <td className="p-3">{ex.category}</td>
                            <td className="p-3">{ex.date}</td>
                            <td className="p-3 text-right font-bold">{settings.currency}{ex.amount.toLocaleString("en-IN")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === "budget" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">Budget Utilization Audit</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-white/5 p-4 rounded-2xl space-y-3 print:border-black/10 text-slate-300 print:text-slate-800">
                    <div className="flex justify-between text-xs">
                      <span>Spent utilization percentage:</span>
                      <span className="font-bold">{Math.round((totalSpent / totalBudget) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden print:bg-slate-200">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 italic">
                      Recommended threshold limit alert configured at {settings.warningThreshold * 100}%.
                    </p>
                  </div>
                  <div className="border border-white/5 p-4 rounded-2xl space-y-2 print:border-black/10 text-slate-400 print:text-slate-600 text-xs">
                    <div className="flex justify-between">
                      <span>Budget cap allocations:</span>
                      <span className="text-white print:text-black font-semibold">{settings.currency}{totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ledger verified transactions:</span>
                      <span className="text-white print:text-black font-semibold">{settings.currency}{totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surplus margin:</span>
                      <span className="text-white print:text-black font-semibold">{settings.currency}{remainingBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {reportType === "vendor" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">Hired Service Providers</h3>
                <div className="border border-white/5 rounded-2xl overflow-hidden print:border-black/10">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider print:border-black/10 print:text-slate-700">
                        <th className="p-3">Company / Provider</th>
                        <th className="p-3">Service Sector</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Payment Status</th>
                        <th className="p-3 text-right">Contract Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black/10">
                      {currentVendors.length === 0 ? (
                        <tr><td colSpan={5} className="text-center py-6 text-slate-500">No vendor providers bound to event.</td></tr>
                      ) : (
                        currentVendors.map(v => (
                          <tr key={v.id} className="text-slate-300 print:text-slate-800">
                            <td className="p-3 font-semibold">{v.vendor_name}</td>
                            <td className="p-3">{v.service_type}</td>
                            <td className="p-3">{v.contact}</td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold uppercase ${v.status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>
                                {v.status}
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold">{settings.currency}{v.amount.toLocaleString("en-IN")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === "participant" && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black">Participant Split Allocations</h3>
                <div className="border border-white/5 rounded-2xl overflow-hidden print:border-black/10">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01] text-slate-400 font-bold uppercase tracking-wider print:border-black/10 print:text-slate-700">
                        <th className="p-3">Attendee Name</th>
                        <th className="p-3">Linked Email</th>
                        <th className="p-3">Settlement Status</th>
                        <th className="p-3 text-right">Owed Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black/10">
                      {currentPayments.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-6 text-slate-500">No cost splits configured.</td></tr>
                      ) : (
                        currentPayments.map(p => {
                          const part = users.find(u => u.id === p.participant_id);
                          return (
                            <tr key={p.id} className="text-slate-300 print:text-slate-800">
                              <td className="p-3 font-semibold">{part ? part.name : "Attendee"}</td>
                              <td className="p-3">{part ? part.email : "-"}</td>
                              <td className="p-3">
                                <span className={`text-[10px] font-bold uppercase ${p.status === "paid" ? "text-emerald-500" : "text-amber-500"}`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="p-3 text-right font-bold">{settings.currency}{p.amount.toLocaleString("en-IN")}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl text-slate-500 text-xs">
          Select or create an event to generate audit reports.
        </div>
      )}
    </div>
  );
}
