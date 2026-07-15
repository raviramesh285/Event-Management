import React, { useState } from "react";
import { useApp } from "../state";
import { Event, User } from "../types";
import { Plus, Trash, Archive, ArchiveRestore, Calendar, MapPin, Tag, Edit3, Users, X, Check, Copy } from "lucide-react";
import EventDetails from "./EventDetails";

export default function EventManagement() {
  const { events, users, participants, createEvent, updateEvent, deleteEvent, archiveEvent, unarchiveEvent, addParticipantToEvent, removeParticipantFromEvent, settings } = useApp();
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Dialog controls
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState<Event["category"]>("Corporate Event");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  // Participant section controls
  const [managingEventId, setManagingEventId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredEvents = events.filter(e => e.status === activeTab);

  const resetForm = () => {
    setTitle("");
    setBudget("");
    setCategory("Corporate Event");
    setLocation("");
    setDate("");
    setDescription("");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget || !date || !location) return;
    createEvent({
      title,
      description,
      budget: parseFloat(budget),
      location,
      event_date: date,
      category,
      status: "active"
    });
    resetForm();
    setShowAddDialog(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !title || !budget || !date) return;
    updateEvent({
      ...editingEvent,
      title,
      description,
      budget: parseFloat(budget),
      location,
      event_date: date,
      category
    });
    setEditingEvent(null);
    resetForm();
  };

  const triggerEdit = (ev: Event) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setBudget(ev.budget.toString());
    setCategory(ev.category);
    setLocation(ev.location);
    setDate(ev.event_date);
    setDescription(ev.description);
  };

  const handleCopyCode = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getEventParticipants = (eventId: string) => {
    const pLinks = participants.filter(p => p.event_id === eventId);
    return pLinks.map(p => users.find(u => u.id === p.user_id)).filter(Boolean) as User[];
  };

  const nonParticipants = users.filter(u => {
    if (u.role !== "Participant") return false;
    const isAdded = participants.some(p => p.event_id === managingEventId && p.user_id === u.id);
    return !isAdded;
  });

  const handleAddParticipant = () => {
    if (!managingEventId || !selectedUserId) return;
    addParticipantToEvent(managingEventId, selectedUserId);
    setSelectedUserId("");
  };

  if (selectedEventId) {
    return <EventDetails eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />;
  }

  return (
    <div className="space-y-6 text-slate-300">
      
      {/* Header section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Event Workspaces</h2>
          <p className="text-slate-400 text-xs mt-1">Configure active client files, budgets, and participant teams.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddDialog(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white font-bold transition-all hover:opacity-90 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] cursor-pointer"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <Plus size={14} /> New Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-1.5 pb-px">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "active" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Active Projects ({events.filter(e => e.status === "active").length})
        </button>
        <button
          onClick={() => setActiveTab("archived")}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === "archived" ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Archives ({events.filter(e => e.status === "archived").length})
        </button>
      </div>

      {/* Event List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl text-slate-500 text-xs">
            No events found in this category. Initialize one above.
          </div>
        ) : (
          filteredEvents.map(ev => {
            const parts = getEventParticipants(ev.id);
            return (
              <div key={ev.id} onClick={() => setSelectedEventId(ev.id)} className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between group relative hover:border-white/10 hover:shadow-xl transition-all cursor-pointer">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20">
                      {ev.category}
                    </span>
                    <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); triggerEdit(ev); }} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                        <Edit3 size={12} />
                      </button>
                      {ev.status === "active" && (
                        <button onClick={(e) => { e.stopPropagation(); archiveEvent(ev.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/5 transition-all cursor-pointer" title="Archive">
                          <Archive size={12} />
                        </button>
                      )}
                      {ev.status === "archived" && (
                        <button onClick={(e) => { e.stopPropagation(); unarchiveEvent(ev.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/5 transition-all cursor-pointer" title="Restore to Active">
                          <ArchiveRestore size={12} />
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer" title="Delete">
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-sm mb-1">{ev.title}</h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4 line-clamp-2">{ev.description}</p>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Calendar size={12} className="text-slate-500" />
                      <span>{ev.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <MapPin size={12} className="text-slate-500" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Tag size={12} className="text-slate-500" />
                      <span>Budget cap: <strong className="text-white">{settings.currency}{ev.budget.toLocaleString("en-IN")}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); setManagingEventId(ev.id); }}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <Users size={12} />
                    <span>{parts.length} Participants</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopyCode(ev.id); }}
                    className="flex items-center gap-1 text-[9px] font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {copiedCode === ev.id ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    <span>{copiedCode === ev.id ? "Copied" : "Join Code"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Dialog overlay */}
      {(showAddDialog || editingEvent) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 border border-white/10 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => { setShowAddDialog(false); setEditingEvent(null); resetForm(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={15} />
            </button>
            <h3 className="text-base font-bold text-white mb-4">
              {editingEvent ? `Edit Event: ${editingEvent.title}` : "Create New Event Workspace"}
            </h3>

            <form onSubmit={editingEvent ? handleUpdate : handleCreate} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera's Dream Wedding"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Budget limit ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 500000"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="College Event">College Event</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Trip">Trip</option>
                    <option value="Festival">Festival</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Target Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Location / Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="Udaipur, Palace"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Workspace Description</label>
                <textarea
                  placeholder="Notes about client specifications..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 mt-2 cursor-pointer shadow-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                {editingEvent ? "Commit Edits" : "Launch Project Files"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Participants Manager Slide Drawer overlay */}
      {managingEventId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 border border-white/10 w-full max-w-md shadow-2xl relative text-left">
            <button
              onClick={() => setManagingEventId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={15} />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Participant Teams</h3>
            <p className="text-[11px] text-slate-400 mb-4">Add or withdraw team accounts from split calculations.</p>

            {/* Added list */}
            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Assigned Members</label>
              {getEventParticipants(managingEventId).length === 0 ? (
                <div className="text-center py-6 bg-white/[0.01] rounded-xl text-slate-500 text-[10px]">
                  No participants assigned yet. Invite someone below.
                </div>
              ) : (
                getEventParticipants(managingEventId).map(p => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <div className="text-xs font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.email}</div>
                    </div>
                    <button
                      onClick={() => removeParticipantFromEvent(managingEventId, p.id)}
                      className="p-1 rounded-lg text-red-400/75 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add section */}
            <div className="space-y-3 border-t border-white/5 pt-4">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Invite Participant</label>
              {nonParticipants.length === 0 ? (
                <p className="text-[10px] text-slate-500">No other registered participant accounts available to invite.</p>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={selectedUserId}
                    onChange={e => setSelectedUserId(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="">Select participant...</option>
                    {nonParticipants.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddParticipant}
                    disabled={!selectedUserId}
                    className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-xs disabled:opacity-50 cursor-pointer"
                  >
                    Invite
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
