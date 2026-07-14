import React, { useState } from "react";
import { useApp } from "../state";
import { User, UserRole } from "../types";
import { Shield, Users, Layers, Award, Edit3, Check } from "lucide-react";

export default function AdminPanel() {
  const { users, events, expenses, settings } = useApp();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>("Participant");

  // Local storage state update wrapper for user roles
  const handleRoleChange = (userId: string) => {
    // Locate and update in memory (the React context syncs this list to localStorage automatically!)
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    targetUser.role = selectedRole;
    setEditingUserId(null);
    alert(`Success: User ${targetUser.name} role changed to ${selectedRole}.`);
  };

  // Metrics calculations
  const totalUsersCount = users.length;
  const adminCount = users.filter(u => u.role === "Admin").length;
  const organizerCount = users.filter(u => u.role === "Event Organizer").length;
  const participantCount = users.filter(u => u.role === "Participant").length;

  const totalBudgets = events.reduce((sum, e) => sum + e.budget, 0);
  const totalSpends = expenses.reduce((sum, ex) => sum + ex.amount, 0);

  return (
    <div className="space-y-6 text-slate-300 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">System Control Console</h2>
        <p className="text-slate-400 text-xs mt-1">Superuser access. Edit permissions, manage credential roles, and analyze global telemetry.</p>
      </div>

      {/* Global Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Registered Users</div>
          <div className="text-2xl font-extrabold text-white">{totalUsersCount}</div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Super Administrators</div>
          <div className="text-2xl font-extrabold text-white">{adminCount}</div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Organizers</div>
          <div className="text-2xl font-extrabold text-white">{organizerCount}</div>
        </div>
        <div className="glass rounded-2xl p-4 border border-white/5">
          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Participants</div>
          <div className="text-2xl font-extrabold text-white">{participantCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User directory */}
        <div className="lg:col-span-2 glass rounded-3xl p-5 border border-white/5 space-y-4">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <Users size={16} className="text-blue-400" />
            Security Accounts Base
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Account Name</th>
                  <th className="pb-3 px-2">Email</th>
                  <th className="pb-3 px-2">Assigned Role</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.01] transition-all">
                    <td className="py-3 px-2 font-semibold text-white">{u.name}</td>
                    <td className="py-3 px-2 text-slate-400">{u.email}</td>
                    <td className="py-3 px-2">
                      {editingUserId === u.id ? (
                        <select
                          value={selectedRole}
                          onChange={e => setSelectedRole(e.target.value as UserRole)}
                          className="bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-[10px] text-slate-300"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Event Organizer">Event Organizer</option>
                          <option value="Participant">Participant</option>
                        </select>
                      ) : (
                        <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          u.role === "Admin" ? "bg-red-500/10 text-red-400" : u.role === "Event Organizer" ? "bg-purple-500/10 text-purple-400" : "bg-cyan-500/10 text-cyan-400"
                        }`}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {editingUserId === u.id ? (
                        <button
                          onClick={() => handleRoleChange(u.id)}
                          className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all cursor-pointer"
                        >
                          <Check size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={() => { setEditingUserId(u.id); setSelectedRole(u.role); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <Edit3 size={12} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global telemetry */}
        <div className="glass rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Layers size={16} className="text-purple-400" />
              Global Telemetry
            </h3>

            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Aggregate Workspaces:</span>
                <span className="text-white font-bold">{events.length}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Active Budgets Combined:</span>
                <span className="text-white font-mono font-bold">{settings.currency}{totalBudgets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Verified ledger spends:</span>
                <span className="text-white font-mono font-bold">{settings.currency}{totalSpends.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Utilization Rate:</span>
                <span className="text-white font-bold">{totalBudgets > 0 ? Math.round((totalSpends / totalBudgets) * 100) : 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/20 p-3.5 rounded-2xl text-[10px] text-purple-300 flex gap-2.5 items-start">
            <Award size={14} className="shrink-0 mt-0.5" />
            <span>Changing permissions alters page layouts immediately. Swapping roles enables testing routing limitations.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
