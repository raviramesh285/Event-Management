import React, { useState } from "react";
import { useApp } from "../state";
import { Event, SubEvent } from "../types";
import { ArrowLeft, Edit3, Trash, Plus, Calendar, MapPin, Tag, CheckCircle, Circle, Clock, DollarSign, ExternalLink, Download, FileText } from "lucide-react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface EventDetailsProps {
  eventId: string;
  onBack: () => void;
}

export default function EventDetails({ eventId, onBack }: EventDetailsProps) {
  const { events, subEvents, expenses, updateEvent, addSubEvent, updateSubEvent, deleteSubEvent, addExpense, deleteExpense, editExpense, settings } = useApp();
  const event = events.find((e) => e.id === eventId);
  const eventSubEvents = subEvents.filter((se) => se.event_id === eventId);
  const eventExpenses = expenses.filter((ex) => ex.event_id === eventId);

  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [eventForm, setEventForm] = useState<Partial<Event>>({});

  const [showAddSubEvent, setShowAddSubEvent] = useState(false);
  const [editingSubEventId, setEditingSubEventId] = useState<string | null>(null);
  const [subEventForm, setSubEventForm] = useState({ title: "", description: "", date: "", time: "" });

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "Miscellaneous", description: "", date: "" });

  if (!event) {
    return (
      <div className="text-slate-400">
        <button onClick={onBack} className="flex items-center gap-2 mb-4 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Events
        </button>
        Event not found.
      </div>
    );
  }

  const handleEditEventStart = () => {
    setEventForm(event);
    setIsEditingEvent(true);
  };

  const handleEditEventSave = () => {
    if (eventForm.title && eventForm.budget && eventForm.event_date) {
      updateEvent(eventForm as Event);
      setIsEditingEvent(false);
    }
  };

  const handleAddSubEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEventForm.title || !subEventForm.date || !subEventForm.time) return;
    
    if (editingSubEventId) {
      const existingSe = subEvents.find(se => se.id === editingSubEventId);
      if (existingSe) {
        updateSubEvent({
          ...existingSe,
          title: subEventForm.title,
          description: subEventForm.description,
          date: subEventForm.date,
          time: subEventForm.time
        });
      }
    } else {
      addSubEvent({
        event_id: eventId,
        title: subEventForm.title,
        description: subEventForm.description,
        date: subEventForm.date,
        time: subEventForm.time,
        status: "pending"
      });
    }
    
    setShowAddSubEvent(false);
    setEditingSubEventId(null);
    setSubEventForm({ title: "", description: "", date: "", time: "" });
  };

  const handleEditSubEventStart = (se: SubEvent) => {
    setEditingSubEventId(se.id);
    setSubEventForm({ 
      title: se.title, 
      description: se.description || "", 
      date: se.date, 
      time: se.time 
    });
    setShowAddSubEvent(true);
  };

  const toggleSubEventStatus = (se: SubEvent) => {
    updateSubEvent({
      ...se,
      status: se.status === "pending" ? "completed" : "pending"
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.category || !expenseForm.date) return;
    
    if (editingExpenseId) {
      const existingEx = expenses.find(ex => ex.id === editingExpenseId);
      if (existingEx) {
        editExpense({
          ...existingEx,
          amount: parseFloat(expenseForm.amount),
          category: expenseForm.category as any,
          description: expenseForm.description,
          date: expenseForm.date,
        });
      }
    } else {
      addExpense({
        event_id: eventId,
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category as any,
        description: expenseForm.description,
        date: expenseForm.date,
      });
    }
    
    setShowAddExpense(false);
    setEditingExpenseId(null);
    setExpenseForm({ amount: "", category: "Miscellaneous", description: "", date: "" });
  };

  const handleEditExpenseStart = (ex: any) => {
    setEditingExpenseId(ex.id);
    setExpenseForm({ 
      amount: ex.amount.toString(), 
      category: ex.category, 
      description: ex.description || "", 
      date: ex.date 
    });
    setShowAddExpense(true);
  };

  const totalUsed = eventExpenses.reduce((sum, ex) => sum + ex.amount, 0);
  const remainingBudget = event.budget - totalUsed;

  const handleDownloadCSV = () => {
    if (eventExpenses.length === 0) return;
    
    const headers = ["Date", "Category", "Description", "Amount"];
    const rows = eventExpenses.map(ex => [
      ex.date,
      ex.category,
      `"${(ex.description || "Uncategorized").replace(/"/g, '""')}"`,
      ex.amount
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${event.title.replace(/\s+/g, '_')}_Expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (eventExpenses.length === 0) return;
    
    const doc = new jsPDF();
    // Default jsPDF fonts don't support the ₹ symbol, so we fall back to Rs. to prevent rendering bugs
    const currency = settings.currency === '₹' ? 'Rs. ' : settings.currency;
    
    // 1. Header Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185); // Professional Corporate Blue
    doc.text("Financial Report", 14, 22);
    
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80); // Dark Grey
    doc.text(`Event: ${event.title}`, 14, 30);
    
    // 2. Metadata Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    doc.text(`Generated on: ${today}`, 14, 36);

    // 3. Separator Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 40, 196, 40);

    // 4. Financial Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Budget Summary", 14, 48);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Total Budget:`, 14, 56);
    doc.text(`${currency}${event.budget.toLocaleString("en-IN")}`, 45, 56);
    
    doc.text(`Total Spent:`, 14, 63);
    doc.text(`${currency}${totalUsed.toLocaleString("en-IN")}`, 45, 63);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Remaining:`, 14, 70);
    const remText = `${currency}${remainingBudget.toLocaleString("en-IN")}`;
    if (remainingBudget < 0) {
      doc.setTextColor(231, 76, 60); // Red
    } else {
      doc.setTextColor(39, 174, 96); // Green
    }
    doc.text(remText, 45, 70);

    // 5. Expense Table
    // Sort expenses chronologically
    const sortedExpenses = [...eventExpenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const tableColumn = ["Date", "Category", "Description", "Amount"];
    const tableRows = sortedExpenses.map(ex => [
      ex.date,
      ex.category,
      ex.description || "Uncategorized",
      `${currency}${ex.amount.toLocaleString("en-IN")}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 78,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185], // Matches the corporate blue
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        3: { halign: 'right' } // Align amounts to the right for a clean financial look
      },
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 5,
        lineColor: [210, 215, 219],
        lineWidth: 0.1,
      },
      margin: { top: 20 },
      didDrawPage: function (data) {
        // Footer with page numbers
        const str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      }
    });

    doc.save(`${event.title.replace(/\s+/g, '_')}_Financial_Report.pdf`);
  };

  return (
    <div className="space-y-6 text-slate-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> Back to Event Workspaces
      </button>

      {/* Main Event Details */}
      <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl relative">
        {isEditingEvent ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Edit Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Category</label>
                <select
                  value={eventForm.category}
                  onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as Event["category"] })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Trip">Trip</option>
                  <option value="Festival">Festival</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Date</label>
                <input
                  type="date"
                  value={eventForm.event_date}
                  onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Budget</label>
                <input
                  type="number"
                  value={eventForm.budget}
                  onChange={(e) => setEventForm({ ...eventForm, budget: parseFloat(e.target.value) })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 px-3 text-xs text-white resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsEditingEvent(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditEventSave}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20">
                  {event.category}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${event.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{event.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">{event.description}</p>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Date</div>
                    <div className="text-white font-semibold">{event.event_date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-400">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Location</div>
                    <div className="text-white font-semibold">{event.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-400">
                    <Tag size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Total Budget</div>
                    <div className="text-white font-semibold">{settings.currency}<AnimatedNumber value={event.budget} /></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-rose-400">
                    <DollarSign size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Used Money</div>
                    <div className="text-white font-semibold">{settings.currency}<AnimatedNumber value={totalUsed} /></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-blue-400">
                    <DollarSign size={14} />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-bold text-slate-500">Remaining Money</div>
                    <div className={`font-semibold ${remainingBudget < 0 ? 'text-red-400' : 'text-white'}`}>
                      {settings.currency}<AnimatedNumber value={remainingBudget} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-start">
              <button
                onClick={handleEditEventStart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer border border-white/10"
              >
                <Edit3 size={14} /> Edit Details
              </button>
            </div>
          </div>
        )}
      </div>



      {/* Event Expenses */}
      <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Event Expenses</h3>
            <p className="text-xs text-slate-400 mt-1">Track and add expenses specific to this workspace.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-slate-300 font-bold transition-all hover:text-white hover:bg-rose-500/10 hover:border-rose-500/30 border border-white/10 cursor-pointer"
            >
              <FileText size={14} className="text-rose-400" /> Export PDF
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-slate-300 font-bold transition-all hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/10 cursor-pointer"
            >
              <Download size={14} className="text-emerald-400" /> Export CSV
            </button>
            <button
              onClick={() => {
                setEditingExpenseId(null);
                setExpenseForm({ amount: "", category: "Miscellaneous", description: "", date: "" });
                setShowAddExpense(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs text-white font-bold transition-all hover:opacity-90 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #10B981, #3B82F6)" }}
            >
              <Plus size={14} /> Add Expense
            </button>
          </div>
        </div>

        {showAddExpense && (
          <form onSubmit={handleAddExpense} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Amount ({settings.currency})</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                >
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Venue">Venue</option>
                  <option value="Photography">Photography</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Flight tickets"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddExpense(false);
                  setEditingExpenseId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all cursor-pointer"
              >
                {editingExpenseId ? "Save Changes" : "Add Expense"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {eventExpenses.length === 0 ? (
            <div className="text-center py-10 bg-white/[0.01] border border-white/5 rounded-2xl text-slate-500 text-xs">
              No expenses recorded yet.
            </div>
          ) : (
            eventExpenses.map((ex) => (
              <div key={ex.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{ex.description || "Uncategorized"}</div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span className="text-blue-400 font-semibold">{ex.category}</span>
                      <div className="flex items-center gap-1"><Calendar size={10} /> {ex.date}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <div className="font-bold text-white">{settings.currency}{ex.amount.toLocaleString("en-IN")}</div>
                    {ex.receipt_url && (
                      <a href={ex.receipt_url} className="text-[9px] text-blue-400 hover:underline flex items-center gap-1 justify-end mt-0.5">
                        <ExternalLink size={10} /> Receipt
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditExpenseStart(ex)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                      title="Edit Expense"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteExpense(ex.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                      title="Delete Expense"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 600; // ms
    const startValue = displayValue;
    const endValue = value;
    
    if (startValue === endValue) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutExpo for a smooth "slow down" effect at the end
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(startValue + (endValue - startValue) * easeOut);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value]);

  return <>{Math.round(displayValue).toLocaleString("en-IN")}</>;
};
