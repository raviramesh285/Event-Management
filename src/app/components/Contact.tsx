import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>We'd love to hear from you. Our friendly team is always here to chat.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {[
            { icon: <Mail size={20} />, title: "Chat to sales", text: "Speak to our friendly team.", detail: "sales@eventsphere.in" },
            { icon: <Mail size={20} />, title: "Chat to support", text: "We're here to help.", detail: "support@eventsphere.in" },
            { icon: <MapPin size={20} />, title: "Visit us", text: "Visit our office HQ.", detail: "100 Tech Park, Bangalore, IN" },
            { icon: <Phone size={20} />, title: "Call us", text: "Mon-Fri from 9am to 6pm.", detail: "+91 98765 43210" },
          ].map((info, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 flex gap-4">
              <div className="p-3 rounded-xl shrink-0 h-fit" style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>
                {info.icon}
              </div>
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>{info.title}</div>
                <div className="text-xs mb-2" style={{ color: "rgba(229,229,229,0.6)" }}>{info.text}</div>
                <div className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{info.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-8">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(76,175,80,0.15)", color: "#4CAF50" }}>
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>Message Sent!</h2>
              <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Thanks for reaching out. We'll get back to you shortly.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-6 px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF" }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>First Name</label>
                  <input placeholder="First name" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>Last Name</label>
                  <input placeholder="Last name" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>Email</label>
                <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>Subject</label>
                <input placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>Message</label>
                <textarea rows={4} placeholder="Leave us a message..." className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
              <button onClick={() => setSubmitted(true)}
                className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                <Send size={16} /> Send Message
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
