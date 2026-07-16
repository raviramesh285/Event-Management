import React, { useState, useEffect } from "react";
import { useApp } from "../state";
import { DollarSign, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function BudgetAllocation() {
  const { departments, events, currentUser, updateDepartment, settings } = useApp();

  if (currentUser?.role !== "Admin" && currentUser?.role !== "Event Manager") {
    return <div className="p-6 text-red-400">Access Denied.</div>;
  }

  const myEvents = currentUser.role === "Event Manager" 
    ? events.filter(e => e.event_manager_id === currentUser.id)
    : events;
  
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  useEffect(() => {
    if (!selectedEventId && myEvents.length > 0) {
      setSelectedEventId(myEvents[0].id);
    }
  }, [myEvents, selectedEventId]);

  const activeEvent = myEvents.find(e => e.id === selectedEventId) || myEvents[0];
  const eventDepts = departments.filter(d => d.event_id === activeEvent?.id);

  const totalEventBudget = activeEvent?.budget || 0;
  const totalAllocated = eventDepts.reduce((sum, d) => sum + d.budget, 0);
  const unallocated = totalEventBudget - totalAllocated;

  const chartData = eventDepts.map(d => ({
    name: d.name,
    value: d.budget
  }));

  if (unallocated > 0) {
    chartData.push({ name: "Unallocated", value: unallocated });
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];

  const handleUpdateBudget = (deptId: string, newBudget: string) => {
    const dept = departments.find(d => d.id === deptId);
    if (dept) {
      updateDepartment({ ...dept, budget: parseFloat(newBudget) || 0 });
    }
  };

  if (!activeEvent) {
    return <div className="p-6 text-slate-400">No event assigned.</div>;
  }

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <DollarSign size={24} className="text-blue-400" /> Budget Allocation
          </h2>
          <p className="text-slate-400 text-xs mt-1">Distribute the total event budget across departments.</p>
        </div>
        <select 
          value={selectedEventId} 
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white font-semibold cursor-pointer outline-none focus:border-blue-500"
        >
          {myEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[300px]">
          {eventDepts.length === 0 ? (
            <div className="text-xs text-slate-500">No departments to allocate budget to.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "Unallocated" ? "#1e293b" : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => settings.currency + value.toLocaleString("en-IN")}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <div>
              <div className="text-[10px] text-slate-400">Total Event Budget</div>
              <div className="text-xl font-bold text-white">₹{totalEventBudget.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Unallocated Funds</div>
              <div className={`text-xl font-bold ${unallocated < 0 ? 'text-red-400' : 'text-emerald-400'}`}>₹{unallocated.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-3">
            {eventDepts.map((dept, idx) => (
              <div key={dept.id} className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white">{dept.name}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs">₹</span>
                  <input 
                    type="number"
                    value={dept.budget}
                    onChange={(e) => handleUpdateBudget(dept.id, e.target.value)}
                    className="w-24 bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-xs text-right text-white focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
