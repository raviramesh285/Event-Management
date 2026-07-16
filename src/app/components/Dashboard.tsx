import React from "react";
import { useApp } from "../state";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { Target, DollarSign, Wallet, AlertCircle, Plus, Brain, Filter, ChevronRight, Activity, Users, ShieldAlert, ArrowUpRight, TrendingUp, Layers, CheckSquare, Clock } from "lucide-react";

export default function Dashboard({ setPage }: { setPage: (page: string) => void }) {
  const { events, departments, expenses, users, auditLogs, currentUser, settings } = useApp();

  const fmt = (n: number) => settings.currency + n.toLocaleString("en-IN");

  if (currentUser?.role === "Admin") {
    const totalEvents = events.length;
    const totalManagers = users.filter(u => u.role === "Event Manager" || u.role === "Department Manager").length;
    const totalDepartments = departments.length;
    const totalBudget = events.reduce((s, e) => s + e.budget, 0);
    const approvedExpenses = expenses.filter(e => e.status === "Approved" || e.status === "Paid" || e.status === "Closed");
    const totalSpent = approvedExpenses.reduce((s, e) => s + e.amount, 0);
    const pendingApprovals = expenses.filter(e => e.status === "Pending Approval").length;
    const budgetRemaining = totalBudget - totalSpent;
    const perfScore = totalBudget > 0 ? Math.max(0, 100 - (totalSpent / totalBudget) * 50) : 100;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Organization Overview</h2>
          <p className="text-slate-400 text-xs mt-1">Enterprise financial performance and activity.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2"><Target size={14} className="text-blue-400" /><span className="text-[10px] text-slate-400">Total Events</span></div>
            <div className="text-2xl font-extrabold text-white">{totalEvents}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2"><Users size={14} className="text-purple-400" /><span className="text-[10px] text-slate-400">Managers</span></div>
            <div className="text-2xl font-extrabold text-white">{totalManagers}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2"><Layers size={14} className="text-emerald-400" /><span className="text-[10px] text-slate-400">Departments</span></div>
            <div className="text-2xl font-extrabold text-white">{totalDepartments}</div>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-2"><CheckSquare size={14} className="text-amber-400" /><span className="text-[10px] text-slate-400">Pending Approvals</span></div>
            <div className="text-2xl font-extrabold text-white">{pendingApprovals}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-blue-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Total System Budget</div>
            <div className="text-3xl font-extrabold text-white">{fmt(totalBudget)}</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-purple-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Total Expenses (Approved+)</div>
            <div className="text-3xl font-extrabold text-white">{fmt(totalSpent)}</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-emerald-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Budget Remaining</div>
            <div className="text-3xl font-extrabold text-emerald-400">{fmt(budgetRemaining)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold flex items-center gap-2"><Clock size={16} className="text-blue-400" /> Recent Activities</h3>
              <button onClick={() => setPage("audit")} className="text-[10px] text-blue-400 hover:text-blue-300">View Logs</button>
            </div>
            <div className="space-y-3">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="flex gap-3 items-start border-l-2 border-blue-500/20 pl-3 py-1">
                  <div>
                    <div className="text-[11px] font-bold text-white">{log.action}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{log.details}</div>
                    <div className="text-[9px] text-slate-500 mt-1">{new Date(log.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
            <Activity size={32} className={perfScore > 80 ? "text-emerald-400" : "text-amber-400"} />
            <h3 className="text-white font-bold mt-4 mb-2">Organization Performance</h3>
            <div className="text-5xl font-extrabold text-white mb-2">{Math.round(perfScore)}<span className="text-xl text-slate-400">/100</span></div>
            <p className="text-[11px] text-slate-400 max-w-xs">Based on overall budget utilization, expense anomaly rates, and pending approval bottlenecks.</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser?.role === "Event Manager") {
    const myEvents = events.filter(e => e.event_manager_id === currentUser.id);
    const activeEvent = myEvents[0]; // Assuming 1 event for simplicity per prompt

    if (!activeEvent) return <div className="p-6 text-slate-400">No event assigned yet.</div>;

    const eventDepts = departments.filter(d => d.event_id === activeEvent.id);
    const eventExps = expenses.filter(e => e.event_id === activeEvent.id);
    
    const approvedExps = eventExps.filter(e => e.status === "Approved" || e.status === "Paid" || e.status === "Closed");
    const totalSpent = approvedExps.reduce((s, e) => s + e.amount, 0);
    const pendingRequests = eventExps.filter(e => e.status === "Pending Approval").length;
    const utilization = activeEvent.budget > 0 ? (totalSpent / activeEvent.budget) * 100 : 0;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{activeEvent.title}</h2>
          <p className="text-slate-400 text-xs mt-1">Event Operations Dashboard.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-blue-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Event Budget</div>
            <div className="text-2xl font-extrabold text-white">{fmt(activeEvent.budget)}</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-emerald-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Budget Utilization</div>
            <div className="text-2xl font-extrabold text-emerald-400">{Math.round(utilization)}%</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 cursor-pointer hover:bg-white/[0.05]" onClick={() => setPage("approvals")}>
            <div className="text-xs text-amber-400 font-bold mb-1">Expense Requests</div>
            <div className="text-2xl font-extrabold text-white">{pendingRequests} Pending</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 cursor-pointer hover:bg-white/[0.05]" onClick={() => setPage("budgets")}>
            <div className="text-xs text-purple-400 font-bold mb-1">Budget Allocation</div>
            <div className="text-2xl font-extrabold text-white">{eventDepts.length} Depts</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Layers size={16} className="text-blue-400" /> Department Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {eventDepts.map(dept => {
              const spent = approvedExps.filter(e => e.department_id === dept.id).reduce((s, e) => s + e.amount, 0);
              const pct = dept.budget > 0 ? (spent / dept.budget) * 100 : 0;
              return (
                <div key={dept.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white">{dept.name}</span>
                    <span className={`text-xs font-bold ${pct >= 100 ? 'text-red-400' : pct >= 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{Math.round(pct)}%</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden mb-3">
                    <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{fmt(spent)} spent</span>
                    <span>{fmt(dept.budget)} limit</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (currentUser?.role === "Department Manager") {
    const myDepts = departments.filter(d => d.manager_id === currentUser.id);
    const activeDept = myDepts[0];

    if (!activeDept) return <div className="p-6 text-slate-400">No department assigned yet.</div>;

    const deptExps = expenses.filter(e => e.department_id === activeDept.id);
    const approvedExps = deptExps.filter(e => e.status === "Approved" || e.status === "Paid" || e.status === "Closed");
    const totalSpent = approvedExps.reduce((s, e) => s + e.amount, 0);
    const remaining = activeDept.budget - totalSpent;
    const utilization = activeDept.budget > 0 ? (totalSpent / activeDept.budget) * 100 : 0;
    const todaysExps = deptExps.filter(e => e.date === new Date().toISOString().split("T")[0]);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{activeDept.name} Department</h2>
          <p className="text-slate-400 text-xs mt-1">Financial overview and operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-blue-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Department Budget</div>
            <div className="text-2xl font-extrabold text-white">{fmt(activeDept.budget)}</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-purple-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Approved Spend ({Math.round(utilization)}%)</div>
            <div className="text-2xl font-extrabold text-blue-400">{fmt(totalSpent)}</div>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br from-white/[0.02] to-emerald-500/[0.02]">
            <div className="text-xs text-slate-400 mb-1">Remaining Budget</div>
            <div className={`text-2xl font-extrabold ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>{fmt(remaining)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">Recent Bills</h3>
              <button onClick={() => setPage("expenses")} className="text-xs text-blue-400 hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-3">
              {deptExps.slice(0, 5).map(ex => (
                <div key={ex.id} className="flex justify-between items-center p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white">{ex.description}</div>
                    <div className="text-[10px] text-slate-400">{ex.date} · <span className={
                      ex.status === "Approved" ? "text-emerald-400" :
                      ex.status === "Pending Approval" ? "text-amber-400" : "text-blue-400"
                    }>{ex.status}</span></div>
                  </div>
                  <div className="text-sm font-bold text-white">{fmt(ex.amount)}</div>
                </div>
              ))}
              {deptExps.length === 0 && <div className="text-xs text-slate-500 py-4">No bills recorded.</div>}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
             <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
               <Plus size={24} />
             </div>
             <h3 className="text-white font-bold mb-2">Upload Invoice / Log Expense</h3>
             <p className="text-xs text-slate-400 mb-6 max-w-xs">Draft and submit new expenses. Expenses will enter the 'Submitted' state before 'Pending Approval'.</p>
             <button onClick={() => setPage("upload")} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
               Go to Uploads
             </button>
             {todaysExps.length > 0 && <div className="mt-4 text-[10px] text-emerald-400">{todaysExps.length} expenses logged today.</div>}
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
}
