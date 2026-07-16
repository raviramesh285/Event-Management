import React, { useState } from "react";
import { useApp } from "../state";
import { Shield, Plus, Edit3, Trash2, Users, Layers, Activity, Search, X, Check, TreeDeciduous, RefreshCw } from "lucide-react";
import { User, Event, Department } from "../types";

export default function AccessManagement() {
  const { users, events, departments, currentUser, createUser, updateUserStatus, updateUserRole, createEvent, updateEvent, deleteEvent, assignEventManager, createDepartment, updateDepartment, deleteDepartment, assignDepartmentManager } = useApp();
  
  const [activeTab, setActiveTab] = useState<"tree" | "events" | "users">("tree");

  if (currentUser?.role !== "Admin") {
    return <div className="p-6 text-red-400">Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield size={24} className="text-blue-400" /> Access Management
          </h2>
          <p className="text-slate-400 text-xs mt-1">Full organization control, RBAC enforcement, and hierarchical assignments.</p>
        </div>
      </div>

      <div className="flex border-b border-white/5 gap-1.5 pb-px">
        <button onClick={() => setActiveTab("tree")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "tree" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>
          Organization Tree
        </button>
        <button onClick={() => setActiveTab("events")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "events" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>
          Event Management
        </button>
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === "users" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"}`}>
          User Directory
        </button>
      </div>

      {activeTab === "tree" && <OrganizationTree events={events} departments={departments} users={users} />}
      {activeTab === "events" && <EventManagement events={events} users={users} createEvent={createEvent} updateEvent={updateEvent} deleteEvent={deleteEvent} assignEventManager={assignEventManager} createDepartment={createDepartment} updateDepartment={updateDepartment} deleteDepartment={deleteDepartment} assignDepartmentManager={assignDepartmentManager} />}
      {activeTab === "users" && <UserManagement users={users} createUser={createUser} updateUserStatus={updateUserStatus} updateUserRole={updateUserRole} />}
    </div>
  );
}

function OrganizationTree({ events, departments, users }: any) {
  const getUserName = (id: string) => users.find((u: any) => u.id === id)?.name || "Unassigned";

  return (
    <div className="glass rounded-3xl p-6 border border-white/5 overflow-x-auto min-h-[500px]">
      <div className="flex items-center gap-2 mb-6">
        <TreeDeciduous size={16} className="text-emerald-400" />
        <h3 className="text-white font-bold">Visual Organization Chart</h3>
      </div>
      
      <div className="space-y-8 pl-2">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl font-bold text-white text-sm">
            ExpenseVision Enterprise (Organization)
          </div>
        </div>

        <div className="pl-6 border-l-2 border-white/10 space-y-8 ml-4">
          {events.map((ev: any) => (
            <div key={ev.id} className="relative">
              <div className="absolute w-6 h-0.5 bg-white/10 -left-6 top-5"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-xs font-bold text-white">{ev.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Event Manager: <span className="text-blue-400 font-semibold">{getUserName(ev.event_manager_id)}</span></div>
                </div>
              </div>

              <div className="pl-6 border-l-2 border-white/10 space-y-3 ml-4">
                {departments.filter((d: any) => d.event_id === ev.id).length === 0 && (
                  <div className="text-[10px] text-slate-500 italic py-2">No departments assigned.</div>
                )}
                {departments.filter((d: any) => d.event_id === ev.id).map((dept: any) => (
                  <div key={dept.id} className="relative flex items-center gap-3">
                    <div className="absolute w-6 h-0.5 bg-white/10 -left-6 top-4"></div>
                    <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-4">
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{dept.name}</div>
                        <div className="text-[10px] text-slate-400">Manager: <span className="text-purple-400 font-semibold">{getUserName(dept.manager_id)}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventManagement({ events, users, createEvent, updateEvent, deleteEvent, assignEventManager, createDepartment, updateDepartment, deleteDepartment, assignDepartmentManager }: any) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", budget: "", location: "", event_date: "", description: "" });
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const [newDept, setNewDept] = useState({ name: "", budget: "", manager_id: "" });

  const handleCreateEvent = (e: any) => {
    e.preventDefault();
    createEvent({ ...newEvent, budget: parseFloat(newEvent.budget), status: "active", category: "Corporate Event" });
    setShowAddEvent(false);
  };

  const handleCreateDept = (e: any) => {
    e.preventDefault();
    if (!activeEventId) return;
    createDepartment({ ...newDept, event_id: activeEventId, budget: parseFloat(newDept.budget) });
    setNewDept({ name: "", budget: "", manager_id: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass rounded-3xl p-6 border border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold">Event & Assignments</h3>
          <button onClick={() => setShowAddEvent(!showAddEvent)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg cursor-pointer">
            <Plus size={14} className="inline mr-1" /> New Event
          </button>
        </div>

        {showAddEvent && (
          <form onSubmit={handleCreateEvent} className="mb-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-3">
            <input type="text" placeholder="Event Title" required value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Budget" required value={newEvent.budget} onChange={e=>setNewEvent({...newEvent, budget: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
              <input type="date" required value={newEvent.event_date} onChange={e=>setNewEvent({...newEvent, event_date: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 rounded-xl text-white text-xs font-bold">Create Event</button>
          </form>
        )}

        <div className="space-y-2">
          {events.map((ev: any) => (
            <div key={ev.id} onClick={() => setActiveEventId(ev.id)} className={`p-4 rounded-xl border cursor-pointer transition-all ${activeEventId === ev.id ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/[0.01] border-white/5 hover:border-white/10'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white">{ev.title}</span>
                <span className="text-xs text-emerald-400">{ev.budget.toLocaleString()} budget</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Manager:</span>
                <select 
                  value={ev.event_manager_id || ""} 
                  onChange={(e) => assignEventManager(ev.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  className="bg-slate-900 border border-white/10 rounded-md py-1 px-2 text-[10px] text-white"
                >
                  <option value="">Unassigned</option>
                  {users.filter((u:any) => u.role === "Event Manager").map((u:any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 border border-white/5">
        {activeEventId ? (
          <>
            <h3 className="text-white font-bold mb-4">Dynamic Departments ({events.find((e:any)=>e.id === activeEventId)?.title})</h3>
            
            <form onSubmit={handleCreateDept} className="mb-6 p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-3">
              <div className="text-xs font-bold text-slate-300">Add Department</div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Name (e.g. Catering)" required value={newDept.name} onChange={e=>setNewDept({...newDept, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
                <input type="number" placeholder="Budget" required value={newDept.budget} onChange={e=>setNewDept({...newDept, budget: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
              </div>
              <button type="submit" className="w-full py-2 bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold">Create Department</button>
            </form>
          </>
        ) : (
          <div className="text-center py-20 text-slate-500 text-xs">Select an event to manage its departments.</div>
        )}
      </div>
    </div>
  );
}

function UserManagement({ users, createUser, updateUserStatus, updateUserRole }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Department Manager" });
  const [search, setSearch] = useState("");

  const handleCreate = (e: any) => {
    e.preventDefault();
    createUser({ ...newUser, status: "active" });
    setShowAdd(false);
  };

  return (
    <div className="glass rounded-3xl p-6 border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-bold">User Directory & Roles</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-bold cursor-pointer">
          <Plus size={14} className="inline mr-1" /> New User
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-white/[0.02] rounded-xl border border-white/5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input type="text" placeholder="Full Name" required value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="email" placeholder="Email Address" required value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="text" placeholder="Password" required value={newUser.password} onChange={e=>setNewUser({...newUser, password: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <select value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white">
              <option value="Admin">Admin</option>
              <option value="Event Manager">Event Manager</option>
              <option value="Department Manager">Department Manager</option>
            </select>
          </div>
          <button type="submit" className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold">Save User</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-500 uppercase">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u: any) => (
              <tr key={u.id} className="hover:bg-white/[0.01]">
                <td className="py-3 px-4">
                  <div className="text-white font-semibold">{u.name}</div>
                  <div className="text-[10px] text-slate-500">{u.email}</div>
                </td>
                <td className="py-3 px-4">
                  <select value={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)} className="bg-slate-900 border border-white/10 rounded-md py-1 px-2 text-[10px] text-white">
                    <option value="Admin">Admin</option>
                    <option value="Event Manager">Event Manager</option>
                    <option value="Department Manager">Department Manager</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} border`}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => updateUserStatus(u.id, u.status === 'active' ? 'disabled' : 'active')} className="text-[10px] text-blue-400 hover:text-blue-300">
                    {u.status === 'active' ? 'Disable' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
