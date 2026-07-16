import React, { useState } from "react";
import { useApp } from "../state";
import { Calendar, MapPin, DollarSign, Layers, Users, Plus } from "lucide-react";
import { Event } from "../types";

export default function EventManagement() {
  const { events, users, departments, expenses, currentUser, settings, createEvent } = useApp();

  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id" | "created_at">>({
    title: "",
    description: "",
    event_date: "",
    location: "",
    budget: 0,
    category: "Corporate",
    status: "draft"
  });

  if (currentUser?.role !== "Admin") {
    return <div className="p-6 text-red-400">Access Denied. Admin privileges required.</div>;
  }

  const fmt = (n: number) => settings.currency + n.toLocaleString("en-IN");

  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar size={24} className="text-blue-400" /> Enterprise Events Overview
          </h2>
          <p className="text-slate-400 text-xs mt-1">High-level view of all active organizational events and their budget health.</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 cursor-pointer">
          <Plus size={14} className="inline mr-1" /> New Event
        </button>
      </div>

      {showAdd && (
        <form onSubmit={(e) => {
          e.preventDefault();
          createEvent({ ...newEvent, created_at: new Date().toISOString() } as any);
          setShowAdd(false);
          setNewEvent({ title: "", description: "", event_date: "", location: "", budget: 0, category: "Corporate", status: "draft" });
        }} className="glass rounded-3xl p-6 border border-white/5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Event Title (e.g. Annual Summit 2026)" required value={newEvent.title} onChange={e=>setNewEvent({...newEvent, title: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="date" required value={newEvent.event_date} onChange={e=>setNewEvent({...newEvent, event_date: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-400" />
            <input type="text" placeholder="Location" required value={newEvent.location} onChange={e=>setNewEvent({...newEvent, location: e.target.value})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <input type="number" placeholder="Total Event Budget" required value={newEvent.budget || ""} onChange={e=>setNewEvent({...newEvent, budget: Number(e.target.value)})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white" />
            <select value={newEvent.category} onChange={e=>setNewEvent({...newEvent, category: e.target.value as Event["category"]})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white">
              <option value="Corporate">Corporate</option>
              <option value="Social">Social</option>
              <option value="Education">Education</option>
              <option value="Tech">Tech</option>
            </select>
            <select value={newEvent.status} onChange={e=>setNewEvent({...newEvent, status: e.target.value as Event["status"]})} className="bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <textarea placeholder="Event Description..." required value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white h-20 resize-none" />
          <button type="submit" className="w-full py-2 bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold hover:bg-blue-600/30">Create Event</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl text-slate-500 text-xs">
            No events found. Go to Access Management to create an event.
          </div>
        ) : (
          events.map(ev => {
            const manager = users.find(u => u.id === ev.event_manager_id);
            const evDepts = departments.filter(d => d.event_id === ev.id);
            const evExps = expenses.filter(e => e.event_id === ev.id && ["Approved", "Paid", "Closed"].includes(e.status));
            
            const totalSpent = evExps.reduce((sum, e) => sum + e.amount, 0);
            const pct = ev.budget > 0 ? (totalSpent / ev.budget) * 100 : 0;
            const isOverBudget = pct >= 100;
            const isWarning = pct >= 85;

            return (
              <div key={ev.id} className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between group hover:border-white/10 hover:shadow-xl transition-all">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20">
                      {ev.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${ev.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                      {ev.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-sm mb-1">{ev.title}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4 line-clamp-2">{ev.description}</p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Users size={12} className="text-slate-500" />
                      <span>Manager: <strong className="text-white">{manager?.name || "Unassigned"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Calendar size={12} className="text-slate-500" />
                      <span>{ev.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <MapPin size={12} className="text-slate-500" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] text-slate-400 mb-0.5">Budget Utilization</div>
                      <div className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {fmt(totalSpent)} <span className="text-[10px] text-slate-500 font-normal">/ {fmt(ev.budget)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 mb-0.5">Departments</div>
                      <div className="text-sm font-bold text-white flex items-center justify-end gap-1">
                        <Layers size={12} className="text-blue-400" /> {evDepts.length}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min(pct, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
