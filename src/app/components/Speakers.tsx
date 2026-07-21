import { motion } from "motion/react";
import { Mic, Twitter, Linkedin, Globe, Clock } from "lucide-react";

const SPEAKERS_DATA = [
  { name: "Dr. Anika Sharma",      role: "AI Research Lead",     org: "Google India",       topic: "Future of Generative AI",   sessions: 2, avatar: "AS", color: "#FFFFFF" },
  { name: "Rahul Bansal",          role: "Chief Technology Officer", org: "TechStartup India", topic: "Scaling SaaS Platforms",   sessions: 1, avatar: "RB", color: "#CCCCCC" },
  { name: "Priya Krishnamurthy",   role: "VP Product",             org: "Razorpay",           topic: "FinTech Innovation 2026",   sessions: 1, avatar: "PK", color: "#E0E0E0" },
  { name: "Dev Mathur",            role: "Founder & CEO",          org: "EventSphere",        topic: "The Future of Events",      sessions: 3, avatar: "DM", color: "#FFFFFF" },
  { name: "Sneha Iyer",            role: "UX Design Director",     org: "Adobe",              topic: "Designing for Impact",      sessions: 1, avatar: "SI", color: "#CCCCCC" },
  { name: "Arjun Patel",           role: "Cloud Architect",         org: "Microsoft Azure",    topic: "Building Scalable Systems", sessions: 2, avatar: "AP", color: "#E0E0E0" },
];

const SESSIONS = [
  { time: "9:00 AM",  speaker: "Dev Mathur",          title: "Opening Keynote: Vision 2027",            duration: "60 min", stage: "Main Stage" },
  { time: "10:15 AM", speaker: "Dr. Anika Sharma",    title: "Generative AI in Real World Applications",duration: "45 min", stage: "Hall A" },
  { time: "11:00 AM", speaker: "Rahul Bansal",         title: "SaaS at Scale: Our Journey to 10M Users",duration: "45 min", stage: "Hall B" },
  { time: "2:00 PM",  speaker: "Priya Krishnamurthy",  title: "The FinTech Revolution",                  duration: "45 min", stage: "Main Stage" },
  { time: "3:00 PM",  speaker: "Sneha Iyer",           title: "Design Systems for Enterprise Products",  duration: "45 min", stage: "Hall A" },
  { time: "4:00 PM",  speaker: "Arjun Patel",          title: "Cloud-Native Architecture Patterns",      duration: "45 min", stage: "Hall B" },
];

export default function Speakers() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Featured <span className="gradient-text">Speakers</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>World-class thought leaders sharing their expertise</p>
      </motion.div>

      {/* Speaker cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {SPEAKERS_DATA.map((sp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-3xl p-6 text-center group"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4 transition-transform group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${sp.color}, #CCCCCC)`, color: "#000000" }}>
              {sp.avatar}
            </div>
            <h3 className="font-black text-sm mb-0.5" style={{ color: "#FFFFFF" }}>{sp.name}</h3>
            <div className="text-xs mb-0.5" style={{ color: sp.color }}>{sp.role}</div>
            <div className="text-[10px] mb-3" style={{ color: "rgba(229,229,229,0.5)" }}>{sp.org}</div>
            <div className="px-3 py-1.5 rounded-xl text-[10px] inline-block mb-4"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(229,229,229,0.75)" }}>
              <Mic size={9} className="inline mr-1" style={{ color: sp.color }} />
              {sp.topic}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-sm font-black" style={{ color: sp.color }}>{sp.sessions}</div>
                <div className="text-[9px]" style={{ color: "rgba(229,229,229,0.4)" }}>Sessions</div>
              </div>
              <div className="h-8 w-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="flex gap-2">
                {[Twitter, Linkedin].map((Icon, j) => (
                  <button key={j} className="p-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-all"
                    style={{ color: "rgba(229,229,229,0.4)" }}>
                    <Icon size={12} />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sessions */}
      <div>
        <h2 className="text-xl font-black mb-5" style={{ color: "#FFFFFF" }}>
          Upcoming <span className="gradient-text">Sessions</span>
        </h2>
        <div className="space-y-3">
          {SESSIONS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-4 flex items-center gap-5"
            >
              <div className="w-16 text-xs font-bold shrink-0" style={{ color: "#FFFFFF" }}>{s.time}</div>
              <div className="flex-1">
                <div className="text-xs font-bold" style={{ color: "#FFFFFF" }}>{s.title}</div>
                <div className="text-[10px] mt-0.5" style={{ color: "rgba(229,229,229,0.55)" }}>{s.speaker}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(229,229,229,0.45)" }}>
                  <Clock size={9} />{s.duration}
                </div>
                <div className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>{s.stage}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
