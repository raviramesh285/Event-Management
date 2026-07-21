import { useState } from "react";
import { motion } from "motion/react";
import { HeartHandshake, CheckCircle, Users, Clock, MapPin } from "lucide-react";

const ROLES = [
  { title: "Event Coordinator", dept: "Operations", shifts: "2 shifts available", skills: ["Organization", "Communication"], volunteers: 12, needed: 15 },
  { title: "Registration Desk", dept: "Welcome Team", shifts: "All day", skills: ["Customer service", "Tech savvy"], volunteers: 8, needed: 10 },
  { title: "Technical Support", dept: "AV & Tech", shifts: "Morning shift", skills: ["AV equipment", "Troubleshooting"], volunteers: 4, needed: 6 },
  { title: "Social Media Live", dept: "Marketing", shifts: "Flexible", skills: ["Photography", "Instagram/Twitter"], volunteers: 3, needed: 4 },
  { title: "Crowd Management", dept: "Security", shifts: "Evening shift", skills: ["First aid", "Calm under pressure"], volunteers: 7, needed: 12 },
];

export default function Volunteers() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", experience: "" });

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Volunteer <span className="gradient-text">Programme</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Make a difference – join our team of passionate event volunteers</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-base mb-3" style={{ color: "#FFFFFF" }}>Open Volunteer Roles</h2>
          {ROLES.map((role, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-sm" style={{ color: "#FFFFFF" }}>{role.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#FFFFFF" }}>{role.dept}</div>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(76,175,80,0.12)", color: "#4CAF50" }}>
                  {role.volunteers}/{role.needed} filled
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {role.skills.map(sk => (
                  <span key={sk} className="text-[9px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>{sk}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(229,229,229,0.5)" }}>
                  <Clock size={10} />{role.shifts}
                </div>
                <div className="w-32">
                  <div className="flex justify-between text-[9px] mb-1" style={{ color: "rgba(229,229,229,0.4)" }}>
                    <span>Slots</span>
                    <span>{Math.round((role.volunteers / role.needed) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${(role.volunteers / role.needed) * 100}%`, background: "linear-gradient(to right, #FFFFFF, #CCCCCC)" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sign-up Form */}
        <div className="glass-card rounded-2xl p-5 h-fit">
          {submitted ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(76,175,80,0.2)", color: "#4CAF50" }}>
                <CheckCircle size={22} />
              </div>
              <div className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>Application Submitted!</div>
              <div className="text-xs" style={{ color: "rgba(229,229,229,0.55)" }}>We'll contact you within 48 hours.</div>
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-5">
                <HeartHandshake size={18} style={{ color: "#FFFFFF" }} />
                <h3 className="font-bold text-sm" style={{ color: "#FFFFFF" }}>Apply to Volunteer</h3>
              </div>
              <div className="space-y-3">
                {[
                  { key: "name", label: "Full Name", placeholder: "Your name" },
                  { key: "email", label: "Email", placeholder: "email@example.com" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.6)" }}>{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.08)" }} />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.6)" }}>Preferred Role</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <option value="" style={{ background: "#0A0A0A" }}>Select a role...</option>
                    {ROLES.map(r => <option key={r.title} value={r.title} style={{ background: "#0A0A0A" }}>{r.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.6)" }}>Experience</label>
                  <textarea value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                    placeholder="Brief description of relevant experience..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-xs outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
                <button onClick={() => setSubmitted(true)}
                  className="w-full py-3 rounded-xl text-xs font-bold cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                  Submit Application
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
