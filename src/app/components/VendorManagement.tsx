import React, { useState } from "react";
import { useApp } from "../state";
import { Vendor } from "../types";
import { Plus, Trash, Search, Mail, Phone, Tag, Edit3, X, User } from "lucide-react";

export default function VendorManagement() {
  const { vendors, events, addVendor, editVendor, deleteVendor, updateVendorPayment, settings } = useApp();
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState("all");

  // Dialog Controls
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceType, setServiceType] = useState<Vendor["service_type"]>("Catering");
  const [status, setStatus] = useState<Vendor["status"]>("pending");
  const [notes, setNotes] = useState("");
  const [eventId, setEventId] = useState("");

  const serviceTypes: Vendor["service_type"][] = ["Catering", "Decoration", "Photography", "Sound System", "Transportation", "Venue Provider"];

  const resetForm = () => {
    setName("");
    setContact("");
    setEmail("");
    setAmount("");
    setServiceType("Catering");
    setStatus("pending");
    setNotes("");
    setEventId(events[0]?.id || "");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !amount || !eventId) return;
    addVendor({
      event_id: eventId,
      vendor_name: name,
      contact,
      email: email || undefined,
      amount: parseFloat(amount),
      service_type: serviceType,
      status,
      notes: notes || undefined
    });
    resetForm();
    setShowAddDialog(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendor || !name || !contact || !amount) return;
    editVendor({
      ...editingVendor,
      vendor_name: name,
      contact,
      email: email || undefined,
      amount: parseFloat(amount),
      service_type: serviceType,
      status,
      notes: notes || undefined
    });
    setEditingVendor(null);
    resetForm();
  };

  const triggerEdit = (v: Vendor) => {
    setEditingVendor(v);
    setName(v.vendor_name);
    setContact(v.contact);
    setEmail(v.email || "");
    setAmount(v.amount.toString());
    setServiceType(v.service_type);
    setStatus(v.status);
    setNotes(v.notes || "");
    setEventId(v.event_id);
    setShowAddDialog(true);
  };

  const filtered = vendors.filter(v => {
    const matchSearch = v.vendor_name.toLowerCase().includes(search.toLowerCase()) || v.service_type.toLowerCase().includes(search.toLowerCase());
    const matchService = selectedService === "all" ? true : v.service_type === selectedService;
    const matchEvent = selectedEventId === "all" ? true : v.event_id === selectedEventId;
    return matchSearch && matchService && matchEvent;
  });

  return (
    <div className="space-y-6 text-slate-300 text-left">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Vendor Management Base</h2>
          <p className="text-slate-400 text-xs mt-1">Catalog contract amounts, provider details, service categories, and payment updates.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddDialog(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white font-bold transition-all hover:opacity-90 cursor-pointer"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <Plus size={14} /> Hire Vendor
        </button>
      </div>

      {/* Filter panel */}
      <div className="glass rounded-2xl p-4 border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(e.target.value)}
          className="bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 cursor-pointer"
        >
          <option value="all">All Events</option>
          {events.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>

        <select
          value={selectedService}
          onChange={e => setSelectedService(e.target.value)}
          className="bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 cursor-pointer"
        >
          <option value="all">All Service Types</option>
          {serviceTypes.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl text-slate-500 text-xs">
            No vendors registered in this scope.
          </div>
        ) : (
          filtered.map(v => {
            const ev = events.find(e => e.id === v.event_id);
            return (
              <div key={v.id} className="glass rounded-3xl p-5 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group relative">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20">
                      {v.service_type}
                    </span>
                    <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => triggerEdit(v)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer">
                        <Edit3 size={12} />
                      </button>
                      <button onClick={() => deleteVendor(v.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/5 cursor-pointer">
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-sm mb-1 flex items-center gap-1.5">
                    <User size={13} className="text-slate-500" />
                    {v.vendor_name}
                  </h3>
                  {ev && (
                    <div className="text-[10px] text-slate-500 font-medium mb-4">Contract for: {ev.title}</div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Phone size={12} className="text-slate-500" />
                      <span>{v.contact}</span>
                    </div>
                    {v.email && (
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <Mail size={12} className="text-slate-500" />
                        <span className="truncate">{v.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Tag size={12} className="text-slate-500" />
                      <span>Value: <strong className="text-white">{settings.currency}{v.amount.toLocaleString("en-IN")}</strong></span>
                    </div>
                  </div>

                  {v.notes && (
                    <div className="bg-white/[0.01] border border-white/5 p-2 rounded-xl text-[10px] text-slate-400 leading-relaxed italic mb-4">
                      {v.notes}
                    </div>
                  )}
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    v.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                  }`}>
                    {v.status}
                  </span>
                  <button
                    onClick={() => updateVendorPayment(v.id, v.status === "paid" ? "pending" : "paid")}
                    className="px-2.5 py-1 text-[10px] rounded-lg border border-white/5 hover:bg-white/5 font-semibold transition-all cursor-pointer"
                  >
                    Toggle Paid
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Vendor Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 border border-white/10 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => { setShowAddDialog(false); setEditingVendor(null); resetForm(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={15} />
            </button>
            <h3 className="text-base font-bold text-white mb-4">
              {editingVendor ? `Edit Vendor File` : "Hire Service Provider"}
            </h3>

            <form onSubmit={editingVendor ? handleUpdate : handleCreate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Company / Provider Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gourmet Banquet Catering"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Contract Value ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={e => setServiceType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none"
                  >
                    {serviceTypes.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Contact Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9876543210"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="provider@service.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Payment Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Link Workspace</label>
                  <select
                    disabled={!!editingVendor}
                    value={eventId}
                    onChange={e => setEventId(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none disabled:opacity-50"
                  >
                    {events.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Contract Deliverables Notes</label>
                <textarea
                  placeholder="e.g. Catering terms, advance schedules..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 mt-2 cursor-pointer shadow-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                {editingVendor ? "Commit Vendor Details" : "Register Hire Agreement"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
