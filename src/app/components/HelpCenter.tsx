import { motion } from "motion/react";
import { Book, LifeBuoy, FileText, MessageCircle, PlayCircle, Settings, Users, CreditCard } from "lucide-react";

export default function HelpCenter({ setPage }: { setPage: (p: string) => void }) {
  const CATEGORIES = [
    { title: "Getting Started", icon: PlayCircle, desc: "Quick start guides and platform basics.", articles: 12, color: "#FFFFFF" },
    { title: "Account & Settings", icon: Settings, desc: "Manage your profile, team, and security.", articles: 8, color: "#CCCCCC" },
    { title: "Event Management", icon: Calendar, desc: "Creating events, ticketing, and scheduling.", articles: 24, color: "#E0E0E0" },
    { title: "Billing & Payouts", icon: CreditCard, desc: "Stripe, Razorpay, and withdrawal FAQs.", articles: 15, color: "#4CAF50" },
    { title: "Attendee Tools", icon: Users, desc: "QR check-ins, engagement, and CRM.", articles: 10, color: "#FFFFFF" },
    { title: "API & Integrations", icon: FileText, desc: "Webhooks, Zapier, and custom code.", articles: 6, color: "#CCCCCC" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>
          <LifeBuoy size={32} />
        </div>
        <h1 className="text-3xl font-black mb-3" style={{ color: "#FFFFFF" }}>
          How can we <span className="gradient-text">help you?</span>
        </h1>
        <div className="max-w-md mx-auto">
          <input type="text" placeholder="Search documentation, tutorials, FAQs..."
            className="w-full px-5 py-4 rounded-2xl text-sm outline-none shadow-xl"
            style={{ background: "rgba(17,17,17,0.8)", border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF" }} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-6 cursor-pointer group transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${cat.color}15`, color: cat.color }}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-sm mb-1.5 group-hover:text-[#FFFFFF] transition-colors" style={{ color: "#FFFFFF" }}>{cat.title}</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(229,229,229,0.55)" }}>{cat.desc}</p>
              <div className="flex items-center justify-between text-[10px]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                <span style={{ color: "rgba(229,229,229,0.4)" }}>{cat.articles} articles</span>
                <span className="font-bold flex items-center gap-1" style={{ color: cat.color }}>
                  Browse <Book size={10} />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#FFFFFF" }}>Still need assistance?</h2>
          <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Our support team is available 24/7 to help you out.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={() => setPage("contact")} className="px-6 py-3 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.06)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.12)" }}>
            <MessageCircle size={14} /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

// Just importing Calendar here for the categories
import { Calendar } from "lucide-react";
