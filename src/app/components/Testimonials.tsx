import { motion } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  { name: "Priya Shankar",    role: "Event Director, TechFest", text: "EventSphere transformed how we run our annual conference. The AI scheduling alone saved us 40+ hours of planning.", rating: 5, avatar: "PS" },
  { name: "Rohan Mehta",      role: "Wedding Planner",           text: "The most beautiful platform I've used. Clients love the digital invites and QR ticketing. Absolutely premium experience!", rating: 5, avatar: "RM" },
  { name: "Ananya Krishnan",  role: "Corporate HR Manager",       text: "Managing 50+ internal events a year was chaos before EventSphere. Now everything is seamless and automated.", rating: 5, avatar: "AK" },
  { name: "Dev Mathur",       role: "Hackathon Organizer",        text: "From registrations to check-ins to certificates – EventSphere handles it all. Incredible product for technical events.", rating: 5, avatar: "DM" },
  { name: "Sneha Iyer",       role: "Festival Director",          text: "We scaled our music festival to 10,000 attendees effortlessly. The analytics dashboard is a game-changer.", rating: 5, avatar: "SI" },
  { name: "Arjun Patel",      role: "Community Manager",          text: "The best ROI for our community meetups. The networking features are unmatched in the industry.", rating: 5, avatar: "AP" },
];

export default function Testimonials() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          What <span className="gradient-text">People Say</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Thousands of organizers trust EventSphere</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-6 relative"
          >
            <Quote size={40} className="absolute top-4 right-4 opacity-10" style={{ color: "#FFFFFF" }} />
            <div className="flex items-center gap-1 mb-4">
              {Array(t.rating).fill(0).map((_, j) => (
                <Star key={j} size={14} fill="#FFFFFF" style={{ color: "#FFFFFF" }} />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "rgba(229,229,229,0.8)" }}>"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                {t.avatar}
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: "#FFFFFF" }}>{t.name}</div>
                <div className="text-[10px]" style={{ color: "rgba(229,229,229,0.5)" }}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
