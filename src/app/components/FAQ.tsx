import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Search, MessageCircle } from "lucide-react";

const FAQS = [
  { q: "Is EventSphere free to use?",           a: "We offer a generous free tier with up to 5 active events. Our Pro and Enterprise plans unlock unlimited events, AI features, and advanced analytics." },
  { q: "Can I accept payments through the platform?", a: "Yes! We integrate with Stripe and Razorpay for seamless ticket payments, refunds, and invoice generation." },
  { q: "How does QR check-in work?",             a: "Once registered, attendees receive a digital pass with a unique QR code. Your staff can scan it with any smartphone for instant check-in." },
  { q: "Is my data secure?",                    a: "Absolutely. We use enterprise-grade encryption, JWT authentication, and regular security audits to protect all platform data." },
  { q: "Do you support hybrid and online events?", a: "Yes! EventSphere fully supports in-person, online, and hybrid events with live streaming integration." },
  { q: "Can I customize the event page?",       a: "Yes, Pro and Enterprise plans allow full customization of event pages, including custom domains, branding, and color schemes." },
  { q: "What kind of analytics do you provide?", a: "We provide real-time dashboards for registrations, revenue, attendance rates, demographic data, and sponsor ROI." },
  { q: "Is there a limit on attendees?",        a: "The Starter plan supports up to 500 attendees per event. Pro and Enterprise plans have no limits." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-sm mb-6" style={{ color: "rgba(229,229,229,0.6)" }}>Everything you need to know about EventSphere</p>
        
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl max-w-md mx-auto"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={16} style={{ color: "#FFFFFF" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for answers..."
            className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#FFFFFF" }} />
        </div>
      </motion.div>

      <div className="space-y-3 mb-12">
        {filtered.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
            >
              <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{faq.q}</span>
              <span style={{ color: "#FFFFFF" }}>
                {open === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden px-5 pb-4"
                >
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(229,229,229,0.65)" }}>{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: "rgba(229,229,229,0.5)" }}>
            No questions found matching "{search}".
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 text-center">
        <MessageCircle size={32} className="mx-auto mb-3" style={{ color: "#FFFFFF" }} />
        <h3 className="font-bold mb-2" style={{ color: "#FFFFFF" }}>Still have questions?</h3>
        <p className="text-xs mb-4" style={{ color: "rgba(229,229,229,0.6)" }}>Can't find the answer you're looking for? Please chat to our friendly team.</p>
        <button className="px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
          Get in Touch
        </button>
      </div>
    </div>
  );
}
