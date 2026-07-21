import { useState } from "react";
import { motion } from "motion/react";
import { Clock, Calendar, Plus, Coffee } from "lucide-react";

const DAYS = ["Day 1 – Aug 15", "Day 2 – Aug 16", "Day 3 – Aug 17"];

const SCHEDULE: Record<string, any[]> = {
  "Day 1 – Aug 15": [
    { time: "8:00 AM",  title: "Registrations & Welcome Coffee",  speaker: "",              type: "break",    stage: "Lobby",        duration: "60 min" },
    { time: "9:00 AM",  title: "Opening Keynote",                  speaker: "Dev Mathur",    type: "keynote",  stage: "Main Stage",    duration: "60 min" },
    { time: "10:15 AM", title: "AI in Modern Applications",        speaker: "Dr. A. Sharma", type: "talk",     stage: "Hall A",        duration: "45 min" },
    { time: "10:15 AM", title: "Startup Pitch Workshop",           speaker: "Panel",         type: "workshop", stage: "Hall B",        duration: "45 min" },
    { time: "11:30 AM", title: "Networking Break",                  speaker: "",              type: "break",    stage: "Lobby",        duration: "30 min" },
    { time: "12:00 PM", title: "Scaling SaaS Platforms",           speaker: "Rahul Bansal",  type: "talk",     stage: "Main Stage",    duration: "45 min" },
    { time: "1:00 PM",  title: "Lunch",                             speaker: "",              type: "break",    stage: "Dining Hall",   duration: "60 min" },
    { time: "2:00 PM",  title: "FinTech Revolution Panel",          speaker: "Priya K.",      type: "panel",    stage: "Main Stage",    duration: "45 min" },
    { time: "3:00 PM",  title: "Design Systems Workshop",          speaker: "Sneha Iyer",    type: "workshop", stage: "Hall A",        duration: "45 min" },
    { time: "4:00 PM",  title: "Awards & Closing Ceremony",        speaker: "All Speakers",  type: "keynote",  stage: "Main Stage",    duration: "60 min" },
  ],
  "Day 2 – Aug 16": [
    { time: "9:00 AM",  title: "Morning Keynote: Cloud 2027",      speaker: "Arjun Patel",   type: "keynote",  stage: "Main Stage",    duration: "60 min" },
    { time: "10:30 AM", title: "DevOps Best Practices",             speaker: "Rahul B.",      type: "talk",     stage: "Hall B",        duration: "45 min" },
    { time: "12:00 PM", title: "Lunch Break",                        speaker: "",              type: "break",    stage: "Dining Hall",   duration: "60 min" },
    { time: "2:00 PM",  title: "Hackathon Kickoff",                  speaker: "Panel",         type: "workshop", stage: "Innovation Lab", duration: "180 min" },
  ],
  "Day 3 – Aug 17": [
    { time: "9:00 AM",  title: "Hackathon Judging",                  speaker: "Judges Panel",  type: "panel",    stage: "Innovation Lab", duration: "120 min" },
    { time: "12:00 PM", title: "Final Presentations",                 speaker: "Teams",         type: "keynote",  stage: "Main Stage",    duration: "90 min" },
    { time: "2:00 PM",  title: "Closing Ceremony & Prize Distribution", speaker: "Dev Mathur", type: "keynote",  stage: "Main Stage",    duration: "60 min" },
  ],
};

const TYPE_COLORS: Record<string, string> = {
  keynote:  "#FFFFFF",
  talk:     "#CCCCCC",
  workshop: "#E0E0E0",
  panel:    "#4CAF50",
  break:    "rgba(229,229,229,0.3)",
};

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Event <span className="gradient-text">Schedule</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Global Tech Summit 2026 – 3-Day Programme</p>
      </motion.div>

      {/* Day tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)}
            className="px-5 py-3 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap transition-all"
            style={{
              background: activeDay === day ? "linear-gradient(135deg, #FFFFFF, #CCCCCC)" : "rgba(255,255,255,0.04)",
              color: activeDay === day ? "#000000" : "rgba(229,229,229,0.55)",
              border: activeDay === day ? "none" : "1px solid rgba(255,255,255,0.07)"
            }}>
            {day}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(229,229,229,0.6)" }}>
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>

      {/* Schedule list */}
      <div className="relative">
        <div className="absolute left-[68px] top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)" }} />

        <div className="space-y-3">
          {(SCHEDULE[activeDay] || []).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex gap-5 items-start ${item.type === "break" ? "opacity-60" : ""}`}
            >
              {/* Time */}
              <div className="w-16 text-right shrink-0 pt-3">
                <div className="text-[10px] font-bold" style={{ color: "#FFFFFF" }}>{item.time}</div>
              </div>

              {/* Dot */}
              <div className="w-3 h-3 rounded-full mt-3.5 shrink-0 relative z-10"
                style={{ background: TYPE_COLORS[item.type] || "#FFFFFF", boxShadow: `0 0 8px ${TYPE_COLORS[item.type]}60` }} />

              {/* Card */}
              <div className="flex-1 glass-card rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold" style={{ color: "#FFFFFF" }}>{item.title}</div>
                    {item.speaker && (
                      <div className="text-[10px] mt-0.5" style={{ color: "rgba(229,229,229,0.55)" }}>{item.speaker}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(229,229,229,0.4)" }}>
                      <Clock size={9} />{item.duration}
                    </div>
                    <div className="text-[9px] px-2 py-0.5 rounded-full"
                      style={{ background: `${TYPE_COLORS[item.type]}20`, color: TYPE_COLORS[item.type] }}>
                      {item.stage}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold capitalize"
                    style={{ background: `${TYPE_COLORS[item.type]}18`, color: TYPE_COLORS[item.type] }}>
                    {item.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add to Calendar CTA */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 rounded-xl text-sm font-bold cursor-pointer flex items-center gap-2 mx-auto"
          style={{ background: "rgba(255,255,255,0.12)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.25)" }}>
          <Calendar size={14} /> Add to Calendar
        </button>
      </div>
    </div>
  );
}
