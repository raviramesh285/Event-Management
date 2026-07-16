import React, { useState, useEffect } from "react";
import { useApp } from "../state";
import { Layers, Plus, Trash2 } from "lucide-react";

export default function DepartmentsManagement() {
  const { departments, events, users, currentUser, createDepartment, deleteDepartment, updateDepartment, assignDepartmentManager } = useApp();

  const [showAdd, setShowAdd] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", budget: "", manager_id: "" });

  if (currentUser?.role !== "Admin" && currentUser?.role !== "Event Manager") {
    return <div className="p-6 text-red-400">Access Denied.</div>;
  }

  const myEvents = currentUser.role === "Event Manager" 
    ? events.filter(e => e.event_manager_id === currentUser.id)
    : events;
  
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  // Auto-select first event if none selected
  useEffect(() => {
    if (!selectedEventId && myEvents.length > 0) {
      setSelectedEventId(myEvents[0].id);
    }
  }, [myEvents, selectedEventId]);

  const activeEvent = myEvents.find(e => e.id === selectedEventId) || myEvents[0];
  const eventDepts = departments.filter(d => d.event_id === activeEvent?.id);

  const handleCreateDept = (e: any) => {
    e.preventDefault();
    if (!activeEvent) return;
    createDepartment({ ...newDept, event_id: activeEvent.id, budget: parseFloat(newDept.budget) });
    setNewDept({ name: "", budget: "", manager_id: "" });
    setShowAdd(false);
  };

  if (!activeEvent) {
    return <div className="p-6 text-slate-400">No event assigned.</div>;
  }

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers size={24} className="text-blue-400" /> Departments
          </h2>
          <p className="text-slate-400 text-xs mt-1">Manage departmental divisions for your events.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white font-semibold cursor-pointer outline-none focus:border-blue-500"
          >
            {myEvents.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
            <Plus size={14} className="inline mr-1" /> New Department
          </button>
        </div>
      </div>

      {showAdd && (
        <form onSubmit={handleCreateDept} className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Department Name (e.g. Technical Team)" required value={newDept.name} onChange={e=>setNewDept({...newDept, name: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="number" placeholder="Initial Budget Allocation" required value={newDept.budget} onChange={e=>setNewDept({...newDept, budget: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input 
              type="text" 
              placeholder="Manager ID (e.g. dm-catering)" 
              value={newDept.manager_id} 
              onChange={e=>setNewDept({...newDept, manager_id: e.target.value.toLowerCase().replace(/\s+/g, '')})} 
              className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" 
            />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-600/30">Create Department</button>
        </form>
      )}

      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 uppercase">
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Assigned Manager</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {eventDepts.map(dept => (
                <tr key={dept.id} className="hover:bg-white/[0.01]">
                  <td className="py-3 px-4 font-semibold text-white">{dept.name}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">₹{dept.budget.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <input 
                      type="text" 
                      placeholder="Unassigned"
                      value={dept.manager_id || ""} 
                      onChange={(e) => assignDepartmentManager(dept.id, e.target.value.toLowerCase().replace(/\s+/g, ''))} 
                      className="bg-slate-900 border border-white/10 rounded-md py-1 px-2 text-[10px] text-white w-32 focus:border-blue-500 outline-none" 
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => deleteDepartment(dept.id)} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {eventDepts.length === 0 && <div className="text-center py-10 text-slate-500 text-xs">No departments created yet.</div>}
        </div>
      </div>
    </div>
  );
}
