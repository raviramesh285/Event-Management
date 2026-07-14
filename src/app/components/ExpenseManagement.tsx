import React, { useState } from "react";
import { useApp } from "../state";
import { Expense } from "../types";
import { Plus, Trash, Search, Filter, Camera, Sparkles, UploadCloud, X, Check, Eye } from "lucide-react";

export default function ExpenseManagement() {
  const { expenses, events, addExpense, editExpense, deleteExpense, settings } = useApp();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  // OCR state variables
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const [previewReceipt, setPreviewReceipt] = useState<string | null>(null);

  // Dialog Controls
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Expense["category"]>("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [eventId, setEventId] = useState("");

  const categories: Expense["category"][] = ["Food", "Travel", "Decoration", "Venue", "Photography", "Entertainment", "Miscellaneous"];

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setEventId(events[0]?.id || "");
    setPreviewReceipt(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date || !eventId) return;
    addExpense({
      event_id: eventId,
      amount: parseFloat(amount),
      category,
      description,
      date,
      receipt_url: previewReceipt || undefined
    });
    resetForm();
    setShowAddDialog(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !title || !amount || !date) return;
    editExpense({
      ...editingExpense,
      amount: parseFloat(amount),
      category,
      description,
      date,
      receipt_url: previewReceipt || undefined
    });
    setEditingExpense(null);
    resetForm();
  };

  const triggerEdit = (exp: Expense) => {
    setEditingExpense(exp);
    setTitle(exp.description);
    setAmount(exp.amount.toString());
    setCategory(exp.category);
    setDate(exp.date);
    setDescription(exp.description);
    setEventId(exp.event_id);
    setPreviewReceipt(exp.receipt_url || null);
    setShowAddDialog(true);
  };

  // OCR Mock Scanner Actions
  const runMockOCR = () => {
    setScanning(true);
    setScanStep("Reading raw pixel data...");
    
    setTimeout(() => {
      setScanStep("Identifying monetary tokens...");
    }, 1000);

    setTimeout(() => {
      setScanStep("Applying category heuristics...");
    }, 2000);

    setTimeout(() => {
      // Pick a random receipt profile to populate
      const profiles = [
        { title: "Gourmet Catering Invoice", amount: "124000", category: "Food" as const, desc: "OCR Extract: Buffet dinner invoice from Gourmet Caterers." },
        { title: "Airport Cab Taxi", amount: "1850", category: "Travel" as const, desc: "OCR Extract: Taxi travel transfer slip." },
        { title: "Sound Equipment Booking", amount: "28500", category: "Entertainment" as const, desc: "OCR Extract: DJ & Sound systems rental receipt." }
      ];
      const selected = profiles[Math.floor(Math.random() * profiles.length)];
      
      setTitle(selected.title);
      setAmount(selected.amount);
      setCategory(selected.category);
      setDescription(selected.desc);
      setDate(new Date().toISOString().split("T")[0]);
      setPreviewReceipt("extracted_receipt.png");
      setScanning(false);
      setScanStep("");
    }, 3200);
  };

  // Filter & Sort
  const filtered = expenses
    .filter(e => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "all" ? true : e.category === selectedCategory;
      const matchEvent = selectedEventId === "all" ? true : e.event_id === selectedEventId;
      return matchSearch && matchCat && matchEvent;
    })
    .sort((a, b) => {
      if (sortBy === "amount") return b.amount - a.amount;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <div className="space-y-6 text-slate-300">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Expense Ledger Sheets</h2>
          <p className="text-slate-400 text-xs mt-1">Audit individual line-items, categorise spends, and check receipts.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddDialog(true); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs text-white font-bold transition-all hover:opacity-90 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] cursor-pointer"
          style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
        >
          <Plus size={14} /> Log Spend
        </button>
      </div>

      {/* Filters board */}
      <div className="glass rounded-2xl p-4 border border-white/5 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search ledger..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Event filter */}
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

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Sort by */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-xs text-slate-300 cursor-pointer"
        >
          <option value="date">Sort by: Date</option>
          <option value="amount">Sort by: Amount</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 font-bold uppercase tracking-wider bg-white/[0.01]">
                <th className="py-4 px-5">Expense / Description</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Associated Workspace</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Receipt</th>
                <th className="py-4 px-5 text-right">Amount</th>
                <th className="py-4 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500 text-xs">
                    No matching ledger items found.
                  </td>
                </tr>
              ) : (
                filtered.map(exp => {
                  const ev = events.find(e => e.id === exp.event_id);
                  return (
                    <tr key={exp.id} className="hover:bg-white/[0.01] transition-all group">
                      <td className="py-3.5 px-5">
                        <div className="text-white font-semibold">{exp.description}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Scanned or created via dashboard</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-400">
                        {ev ? ev.title : "Unassigned"}
                      </td>
                      <td className="py-3.5 px-5 text-slate-400">{exp.date}</td>
                      <td className="py-3.5 px-5">
                        {exp.receipt_url ? (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                            <Check size={12} /> Scanned
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-white">
                        {settings.currency}{exp.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex gap-1.5 justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => triggerEdit(exp)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
                            Edit
                          </button>
                          <button onClick={() => deleteExpense(exp.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-3xl p-6 border border-white/10 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => { setShowAddDialog(false); setEditingExpense(null); resetForm(); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={15} />
            </button>
            <h3 className="text-base font-bold text-white mb-2">
              {editingExpense ? `Edit Ledger Entry` : "Log New Spend Item"}
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Input items manually or scan physical receipts with OCR scanner.</p>

            {/* OCR Scanner Panel */}
            {!editingExpense && (
              <div className="mb-4 border border-dashed border-white/10 rounded-2xl p-4 text-center bg-white/[0.01] relative overflow-hidden">
                {scanning ? (
                  <div className="py-4 space-y-3">
                    <Sparkles size={18} className="text-purple-400 animate-spin mx-auto" />
                    <div className="text-xs font-bold text-white">AI OCR scanning in progress...</div>
                    <div className="text-[10px] text-slate-400 animate-pulse">{scanStep}</div>
                  </div>
                ) : (
                  <div className="py-2 space-y-2">
                    <UploadCloud size={20} className="text-slate-500 mx-auto" />
                    <div className="text-xs text-slate-300 font-medium">Have a physical invoice or bill receipt?</div>
                    <button
                      type="button"
                      onClick={runMockOCR}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-[10px] font-bold text-purple-300 cursor-pointer inline-flex items-center gap-1.5 transition-all"
                    >
                      <Camera size={11} /> AI OCR Autofill
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={editingExpense ? handleUpdate : handleCreate} className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Line Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Hall Advance"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Spent Amount ({settings.currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 24000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Transaction Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Link Workspace</label>
                  <select
                    disabled={!!editingExpense}
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
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Description Notes</label>
                <textarea
                  placeholder="Receipt particulars..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 mt-2 cursor-pointer shadow-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                {editingExpense ? "Save Entry" : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
