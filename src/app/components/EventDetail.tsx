import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Users, Clock, Star, Ticket, Share2, Heart, ChevronLeft, Mic, Globe } from "lucide-react";

const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";

function Countdown({ target }: { target: Date }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex gap-3">
      {[{ v: time.d, l: "Days" }, { v: time.h, l: "Hours" }, { v: time.m, l: "Mins" }, { v: time.s, l: "Secs" }].map(({ v, l }) => (
        <div key={l} className="text-center glass-card px-3 py-2 rounded-xl min-w-[52px]">
          <div className="text-xl font-black" style={{ color: "#FFFFFF" }}>{String(v).padStart(2, "0")}</div>
          <div className="text-[9px]" style={{ color: "rgba(229,229,229,0.5)" }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

export default function EventDetail({ setPage }: { setPage: (p: string) => void }) {
  const [tab, setTab] = useState("overview");
  const [liked, setLiked] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(0);

  const tickets = [
    { name: "General", price: "₹1,999", desc: "Standard access to all sessions", available: 500, color: "#FFFFFF" },
    { name: "VIP", price: "₹4,999", desc: "Front row seats + networking dinner", available: 50, color: "#CCCCCC" },
    { name: "Early Bird", price: "₹999", desc: "Limited time offer – ends Aug 1", available: 20, color: "#E0E0E0" },
  ];

  const speakers = [
    { name: "Dr. Anika Sharma",  role: "AI Research Lead, Google",     topic: "Future of Generative AI" },
    { name: "Rahul Bansal",      role: "CTO, TechStartup India",        topic: "Scaling SaaS in India" },
    { name: "Priya Krishnamurthy", role: "VP Product, Razorpay",        topic: "FinTech Innovation" },
  ];

  const agenda = [
    { time: "9:00 AM",  title: "Opening Keynote", speaker: "Dr. Anika Sharma",   duration: "60 min" },
    { time: "10:15 AM", title: "Panel: AI in Business", speaker: "All Speakers", duration: "45 min" },
    { time: "11:15 AM", title: "Networking Coffee Break",speaker: "",              duration: "30 min" },
    { time: "12:00 PM", title: "Scaling SaaS in India", speaker: "Rahul Bansal",  duration: "45 min" },
    { time: "1:00 PM",  title: "Lunch Break",             speaker: "",              duration: "60 min" },
    { time: "2:00 PM",  title: "FinTech Innovation",      speaker: "Priya Krishnamurthy", duration: "45 min" },
    { time: "3:00 PM",  title: "Awards & Closing",        speaker: "All Speakers", duration: "60 min" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <button onClick={() => setPage("events-page")}
        className="flex items-center gap-1.5 text-xs mb-6 cursor-pointer transition-colors hover:text-[#FFFFFF]"
        style={{ color: "rgba(229,229,229,0.6)" }}>
        <ChevronLeft size={14} /> Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="img-zoom rounded-3xl overflow-hidden h-72 relative">
            <img src={CONF_IMG} alt="Event" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)" }} />
            <div className="absolute bottom-5 left-5">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(255,255,255,0.9)", color: "#000000" }}>Conference</span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => setLiked(l => !l)}
                className="p-2.5 rounded-xl glass cursor-pointer transition-all"
                style={{ color: liked ? "#F44336" : "rgba(229,229,229,0.8)" }}>
                <Heart size={16} fill={liked ? "#F44336" : "none"} />
              </button>
              <button className="p-2.5 rounded-xl glass cursor-pointer"
                style={{ color: "rgba(229,229,229,0.8)" }}>
                <Share2 size={16} />
              </button>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl font-black mb-4" style={{ color: "#FFFFFF" }}>Global Tech Summit 2026</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Calendar size={14} />, label: "Aug 15, 2026" },
                { icon: <Clock size={14} />, label: "9:00 AM IST" },
                { icon: <MapPin size={14} />, label: "Mumbai, India" },
                { icon: <Users size={14} />, label: "2,400 attending" },
              ].map((info, i) => (
                <div key={i} className="flex items-center gap-2 text-xs glass-card px-3 py-2.5 rounded-xl"
                  style={{ color: "rgba(229,229,229,0.7)" }}>
                  <span style={{ color: "#FFFFFF" }}>{info.icon}</span>
                  {info.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["overview", "speakers", "agenda"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-2.5 text-xs font-semibold capitalize transition-all cursor-pointer"
                style={{
                  color: tab === t ? "#FFFFFF" : "rgba(229,229,229,0.5)",
                  borderBottom: tab === t ? "2px solid #FFFFFF" : "2px solid transparent"
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "overview" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: "rgba(229,229,229,0.75)" }}>
                Join India's premier technology conference bringing together 2,400+ industry leaders, innovators, and entrepreneurs for a full day of insights, networking, and inspiration. Featuring world-class speakers from Google, Razorpay, and leading startups.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["AI & Machine Learning", "Product Strategy", "FinTech Innovation", "Startup Ecosystem"].map(tag => (
                  <div key={tag} className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-xs"
                    style={{ color: "rgba(229,229,229,0.7)" }}>
                    <Globe size={12} style={{ color: "#FFFFFF" }} />{tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "speakers" && (
            <div className="space-y-4">
              {speakers.map((sp, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                    style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                    {sp.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#FFFFFF" }}>{sp.name}</div>
                    <div className="text-xs mb-1" style={{ color: "rgba(229,229,229,0.55)" }}>{sp.role}</div>
                    <div className="text-xs px-2 py-0.5 rounded-full inline-block"
                      style={{ background: "rgba(255,255,255,0.12)", color: "#FFFFFF" }}>
                      <Mic size={9} className="inline mr-1" />{sp.topic}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {tab === "agenda" && (
            <div className="space-y-2">
              {agenda.map((ag, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-4 flex items-center gap-4">
                  <div className="text-xs font-bold shrink-0 w-20" style={{ color: "#FFFFFF" }}>{ag.time}</div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold" style={{ color: "#FFFFFF" }}>{ag.title}</div>
                    {ag.speaker && <div className="text-[10px] mt-0.5" style={{ color: "rgba(229,229,229,0.5)" }}>{ag.speaker}</div>}
                  </div>
                  <div className="text-[10px] shrink-0" style={{ color: "rgba(229,229,229,0.4)" }}>{ag.duration}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Countdown */}
          <div className="glass-card rounded-2xl p-5">
            <div className="text-xs font-bold mb-3" style={{ color: "#FFFFFF" }}>Event Starts In</div>
            <Countdown target={new Date("2026-08-15T09:00:00")} />
          </div>

          {/* Tickets */}
          <div className="glass-card rounded-2xl p-5">
            <div className="text-sm font-bold mb-4" style={{ color: "#FFFFFF" }}>Select Ticket</div>
            <div className="space-y-3 mb-5">
              {tickets.map((t, i) => (
                <button key={i} onClick={() => setSelectedTicket(i)}
                  className="w-full text-left p-3.5 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: selectedTicket === i ? `rgba(255,255,255,0.12)` : "rgba(255,255,255,0.03)",
                    border: selectedTicket === i ? `1px solid ${t.color}50` : "1px solid rgba(255,255,255,0.07)"
                  }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold" style={{ color: selectedTicket === i ? t.color : "#FFFFFF" }}>{t.name}</span>
                    <span className="text-sm font-black" style={{ color: t.color }}>{t.price}</span>
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(229,229,229,0.5)" }}>{t.desc}</div>
                  <div className="text-[9px] mt-1" style={{ color: "rgba(229,229,229,0.4)" }}>{t.available} left</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage("ticket-book")}
              className="w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer"
              style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
              <Ticket size={14} className="inline mr-2" />Book Ticket
            </button>
          </div>

          {/* Stats */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            {[
              { icon: <Star size={14} />, label: "Rating", value: "4.9/5" },
              { icon: <Users size={14} />, label: "Attending", value: "2,400" },
              { icon: <Globe size={14} />, label: "Format", value: "In-Person" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(229,229,229,0.6)" }}>
                  <span style={{ color: "#FFFFFF" }}>{stat.icon}</span>{stat.label}
                </div>
                <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
