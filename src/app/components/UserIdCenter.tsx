import React, { useState } from "react";
import { useApp } from "../state";
import { Key, UserPlus, Shield, Check } from "lucide-react";
import { UserRole } from "../types";

export default function UserIdCenter() {
  const { users, currentUser, createUser } = useApp();
  
  const [newUserId, setNewUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Department Manager");
  const [showSuccess, setShowSuccess] = useState(false);

  if (currentUser?.role !== "Admin") {
    return <div className="p-6 text-red-400">Access Denied. Admin privileges required.</div>;
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserId || !newName || !newPassword) return;

    // Check if ID already exists
    if (users.some(u => u.id === newUserId)) {
      alert("User ID already exists. Please choose a unique ID.");
      return;
    }

    createUser({
      id: newUserId,
      name: newName,
      email: `${newUserId}@expensevision.ai`, // Auto-generate an email for backend compatibility
      password: newPassword,
      role: newRole,
      status: "active"
    });

    setNewUserId("");
    setNewName("");
    setNewPassword("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-300 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Key className="text-purple-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">User ID Center</h2>
          <p className="text-slate-400 text-xs mt-1">Create explicit User IDs and Passwords for platform access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create User Form */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={16} className="text-blue-400" />
            <h3 className="text-base font-bold text-white">Provision New Account</h3>
          </div>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Custom User ID</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. dm-catering"
                value={newUserId} 
                onChange={e => setNewUserId(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
              <p className="text-[9px] text-slate-500">Must be unique. No spaces allowed.</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account Password</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. password123"
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Sarah Connor"
                value={newName} 
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-purple-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Access Role</label>
              <select 
                value={newRole} 
                onChange={e => setNewRole(e.target.value as UserRole)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="Admin">Admin</option>
                <option value="Event Manager">Event Manager</option>
                <option value="Department Manager">Department Manager</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 mt-2 rounded-xl text-white font-bold text-xs transition-all shadow-lg hover:shadow-purple-500/20"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #3B82F6)" }}
            >
              Create Account Credentials
            </button>
            
            {showSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
                <Check size={14} /> Account Created Successfully!
              </div>
            )}
          </form>
        </div>

        {/* List of Existing User IDs */}
        <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">Active User IDs</h3>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {users.map(u => (
              <div key={u.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-purple-400 font-bold mb-0.5">{u.id}</div>
                  <div className="text-xs text-white font-semibold">{u.name}</div>
                </div>
                <div className="text-[10px] px-2 py-1 bg-slate-800 rounded-md text-slate-400 border border-white/10">
                  {u.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
