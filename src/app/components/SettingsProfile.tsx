import React, { useState } from "react";
import { useApp } from "../state";
import { User, Settings, Database, Sliders, Play, Terminal, Shield, Award, Sparkles, Check } from "lucide-react";

export default function SettingsProfile() {
  const { currentUser, settings, updateSettings, events, expenses, vendors, payments, users } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "settings" | "schema" | "api">("profile");

  // Profile fields
  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");

  // Settings values
  const [threshold, setThreshold] = useState(settings.warningThreshold * 100);
  const [currency, setCurrency] = useState(settings.currency);
  const [theme, setTheme] = useState(settings.theme);

  // Schema selected table
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<"users" | "events" | "expenses" | "vendors" | "payments">("users");

  // API testing states
  const [selectedEndpoint, setSelectedEndpoint] = useState("GET /api/v1/events");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      currency,
      warningThreshold: threshold / 100,
      theme
    });
    alert("Settings saved successfully!");
  };

  // Live tables content getter
  const getLiveJSONData = () => {
    if (selectedSchemaTable === "users") return users;
    if (selectedSchemaTable === "events") return events;
    if (selectedSchemaTable === "expenses") return expenses;
    if (selectedSchemaTable === "vendors") return vendors;
    return payments;
  };

  // SQL schema definitions
  const sqlSchemas = {
    users: `CREATE TABLE Users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'Participant',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    events: `CREATE TABLE Events (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  budget NUMERIC(15, 2) NOT NULL,
  location VARCHAR(200) NOT NULL,
  event_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  organizer_id VARCHAR(50) REFERENCES Users(id) ON DELETE CASCADE
);`,
    expenses: `CREATE TABLE Expenses (
  id VARCHAR(50) PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES Events(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description VARCHAR(250) NOT NULL,
  receipt_url VARCHAR(255),
  created_by VARCHAR(50) REFERENCES Users(id),
  date DATE NOT NULL
);`,
    vendors: `CREATE TABLE Vendors (
  id VARCHAR(50) PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES Events(id) ON DELETE CASCADE,
  vendor_name VARCHAR(150) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  email VARCHAR(100),
  amount NUMERIC(12, 2) NOT NULL,
  service_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT
);`,
    payments: `CREATE TABLE Payments (
  id VARCHAR(50) PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES Events(id) ON DELETE CASCADE,
  participant_id VARCHAR(50) REFERENCES Users(id) ON DELETE CASCADE,
  expense_id VARCHAR(50) REFERENCES Expenses(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'unpaid'
);`
  };

  // API sandbox endpoint executions
  const executeSandboxRequest = () => {
    setApiLoading(true);
    setApiResponse(null);

    setTimeout(() => {
      let data: any = {};
      if (selectedEndpoint === "GET /api/v1/events") {
        data = { status: "success", count: events.length, data: events };
      } else if (selectedEndpoint === "POST /api/v1/events") {
        data = {
          status: "created",
          message: "Event schema created",
          data: { id: "e-temp-123", title: "Sandbox Event Mock", budget: 100000, organizer_id: currentUser?.id }
        };
      } else if (selectedEndpoint === "GET /api/v1/expenses") {
        data = { status: "success", count: expenses.length, data: expenses };
      } else if (selectedEndpoint === "POST /api/v1/ocr/scan") {
        data = {
          status: "success",
          ocr_engine: "Tesseract-AI-v4",
          extracted_fields: { merchant: "Gourmet Catering", total: 124000, tax: 8200, category: "Food" }
        };
      } else {
        data = { status: "success", session_active: true, user: currentUser };
      }

      setApiResponse(data);
      setApiLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-300 text-left">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Profile & System Configuration</h2>
        <p className="text-slate-400 text-xs mt-1">Audit personal details, system currency modes, and inspect raw database structures.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-1.5 pb-px">
        {[
          { id: "profile", label: "User Profile", icon: <User size={13} /> },
          { id: "settings", label: "App Settings", icon: <Sliders size={13} /> },
          { id: "schema", label: "Database Schema", icon: <Database size={13} /> },
          { id: "api", label: "REST API Client", icon: <Terminal size={13} /> }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveSubTab(tb.id as any)}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === tb.id ? "border-blue-500 text-white" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {tb.icon}
            <span>{tb.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeSubTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Profile view */}
            <div className="md:col-span-2 glass rounded-3xl p-6 border border-white/5 space-y-4">
              <h3 className="text-white font-bold text-sm">Security Profile Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Profile Name</label>
                  <input
                    type="text"
                    disabled
                    value={profileName}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white opacity-70"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={profileEmail}
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 px-3.5 text-xs text-white opacity-70"
                  />
                </div>
              </div>
            </div>

            {/* Achievements/Badges */}
            <div className="glass rounded-3xl p-6 border border-white/5 space-y-4">
              <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                <Award size={15} className="text-purple-400" />
                Auditor Achievements
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">Badges achieved based on transaction actions.</p>
              
              <div className="space-y-3">
                {[
                  { name: "Budget Shield", desc: "Keep event spent under cap limit.", color: "text-emerald-400 bg-emerald-500/10" },
                  { name: "OCR Extractor", desc: "Automate entries via scans.", color: "text-purple-400 bg-purple-500/10" },
                  { name: "Clear Settlements", desc: "Verify and mark splits paid.", color: "text-blue-400 bg-blue-500/10" }
                ].map((bdg, i) => (
                  <div key={i} className="flex gap-3 items-start p-2.5 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className={`p-1.5 rounded-lg font-bold text-[9px] shrink-0 uppercase tracking-wider ${bdg.color}`}>
                      Passed
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{bdg.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{bdg.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "settings" && (
          <div className="glass rounded-3xl p-6 border border-white/5 max-w-xl">
            <h3 className="text-white font-bold text-sm mb-4">Workspace Preferences</h3>
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              {/* Currency select */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Currency Mode</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300"
                >
                  <option value="₹">INR (₹)</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                </select>
              </div>

              {/* Theme select */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Display Theme</label>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-slate-300"
                >
                  <option value="dark">Dark Theme (Glassmorphism)</option>
                  <option value="light">Light Theme (Finance Clean)</option>
                </select>
              </div>

              {/* Threshold sliders */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Warning Trigger Threshold</label>
                  <span className="font-bold text-white">{threshold}% spent</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={threshold}
                  onChange={e => setThreshold(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg cursor-pointer appearance-none accent-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 mt-2 cursor-pointer shadow-lg"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                Commit Changes
              </button>
            </form>
          </div>
        )}

        {activeSubTab === "schema" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Table schema definition */}
            <div className="glass rounded-3xl p-5 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm">PostgreSQL DDL Tables</h3>
                <select
                  value={selectedSchemaTable}
                  onChange={e => setSelectedSchemaTable(e.target.value as any)}
                  className="bg-slate-900 border border-white/10 rounded-lg py-1 px-2 text-[10px] text-slate-300 cursor-pointer"
                >
                  <option value="users">Users Table</option>
                  <option value="events">Events Table</option>
                  <option value="expenses">Expenses Table</option>
                  <option value="vendors">Vendors Table</option>
                  <option value="payments">Payments Table</option>
                </select>
              </div>
              <pre className="w-full overflow-x-auto p-4 bg-black/60 border border-white/5 rounded-2xl text-[10px] text-blue-300 font-mono leading-relaxed select-text">
                {sqlSchemas[selectedSchemaTable]}
              </pre>
            </div>

            {/* Live table data viewer */}
            <div className="glass rounded-3xl p-5 border border-white/5 space-y-4">
              <h3 className="text-white font-bold text-sm">Live Simulated Local Database JSON</h3>
              <pre className="w-full h-64 overflow-y-auto p-4 bg-black/60 border border-white/5 rounded-2xl text-[10px] text-emerald-400 font-mono leading-relaxed select-text">
                {JSON.stringify(getLiveJSONData(), null, 2)}
              </pre>
            </div>
          </div>
        )}

        {activeSubTab === "api" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* REST Client request */}
            <div className="glass rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-sm mb-1">REST API Route Playground</h3>
                <p className="text-[10px] text-slate-400 mb-4">Select a backend routing endpoint and verify simulated responses.</p>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Routes</label>
                    <select
                      value={selectedEndpoint}
                      onChange={e => { setSelectedEndpoint(e.target.value); setApiResponse(null); }}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-300 cursor-pointer"
                    >
                      <option value="GET /api/v1/events">GET /api/v1/events</option>
                      <option value="POST /api/v1/events">POST /api/v1/events</option>
                      <option value="GET /api/v1/expenses">GET /api/v1/expenses</option>
                      <option value="POST /api/v1/ocr/scan">POST /api/v1/ocr/scan</option>
                      <option value="GET /api/v1/auth/session">GET /api/v1/auth/session</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={executeSandboxRequest}
                disabled={apiLoading}
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-4"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                <Play size={12} /> Execute HTTP Request
              </button>
            </div>

            {/* REST Client response */}
            <div className="glass rounded-3xl p-5 border border-white/5 space-y-4">
              <h3 className="text-white font-bold text-sm">HTTP response status</h3>
              {apiResponse ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-[10px] text-emerald-400 font-bold">
                    <span>STATUS: 200 OK</span>
                    <span>TYPE: application/json</span>
                  </div>
                  <pre className="w-full h-52 overflow-y-auto p-4 bg-black/60 border border-white/5 rounded-2xl text-[9px] text-slate-300 font-mono leading-relaxed select-text">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-60 border border-dashed border-white/5 rounded-2xl flex items-center justify-center text-slate-500 text-xs italic">
                  {apiLoading ? "Fetching endpoint responses..." : "No requests fired yet. Execute mock requests on the left."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
