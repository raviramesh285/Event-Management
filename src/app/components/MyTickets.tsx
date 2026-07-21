import { useState } from "react";
import { motion } from "motion/react";
import { QrCode, Download, Share2, Calendar, MapPin, Clock, Ticket, ChevronRight } from "lucide-react";

const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";
const MUSIC_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/music_festival_1784569201522.png";
const HACK_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hackathon_event_1784569241165.png";

const MY_TICKETS = [
  { id: "EVS-2026-48291", event: "Global Tech Summit 2026", date: "Aug 15, 2026", time: "9:00 AM", venue: "Mumbai, India", type: "General", price: "₹1,999", status: "upcoming", img: CONF_IMG },
  { id: "EVS-2026-31820", event: "Sunset Music Carnival",   date: "Sep 3, 2026",  time: "6:00 PM", venue: "Goa, India",    type: "VIP",     price: "₹3,500", status: "upcoming", img: MUSIC_IMG },
  { id: "EVS-2025-90041", event: "HackIndia National '25",  date: "Nov 7, 2025",  time: "10:00 AM",venue: "Bangalore",     type: "Standard",price: "₹499",   status: "attended", img: HACK_IMG },
];

export default function MyTickets({ setPage }: { setPage: (p: string) => void }) {
  const [tab, setTab] = useState<"upcoming" | "attended">("upcoming");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = MY_TICKETS.filter(t => t.status === tab);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          My <span className="gradient-text">Tickets</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Manage all your event tickets and digital passes</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {(["upcoming", "attended"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold capitalize cursor-pointer transition-all"
            style={{
              background: tab === t ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
              color: tab === t ? "#FFFFFF" : "rgba(229,229,229,0.5)",
              border: `1px solid ${tab === t ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`
            }}>
            {t} ({MY_TICKETS.filter(x => x.status === t).length})
          </button>
        ))}
        <div className="ml-auto">
          <button onClick={() => setPage("events-page")}
            className="px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
            style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
            <Ticket size={12} /> Find Events
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Ticket size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#FFFFFF" }} />
          <div className="text-sm font-semibold" style={{ color: "rgba(229,229,229,0.5)" }}>No {tab} tickets</div>
          <button onClick={() => setPage("events-page")} className="mt-4 text-xs" style={{ color: "#FFFFFF" }}>
            Browse upcoming events →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ticket, i) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              {/* Ticket main */}
              <div className="flex gap-0">
                <div className="w-32 shrink-0 img-zoom">
                  <img src={ticket.img} alt={ticket.event} className="w-full h-full object-cover" style={{ minHeight: "120px" }} />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>{ticket.event}</div>
                      <div className="flex items-center gap-3 text-[10px]" style={{ color: "rgba(229,229,229,0.55)" }}>
                        <span className="flex items-center gap-1"><Calendar size={9} style={{ color: "#FFFFFF" }} />{ticket.date}</span>
                        <span className="flex items-center gap-1"><Clock size={9} style={{ color: "#FFFFFF" }} />{ticket.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={9} style={{ color: "#FFFFFF" }} />{ticket.venue}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{
                          background: ticket.status === "upcoming" ? "rgba(76,175,80,0.12)" : "rgba(255,255,255,0.12)",
                          color: ticket.status === "upcoming" ? "#4CAF50" : "#FFFFFF"
                        }}>
                        {ticket.status === "upcoming" ? "• Upcoming" : "✓ Attended"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>{ticket.type}</span>
                      <span className="text-xs font-bold" style={{ color: "#FFFFFF" }}>{ticket.price}</span>
                    </div>
                    <button onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
                      className="flex items-center gap-1 text-[10px] cursor-pointer transition-colors hover:text-[#FFFFFF]"
                      style={{ color: "rgba(229,229,229,0.5)" }}>
                      {expanded === ticket.id ? "Hide Pass" : "View Pass"} <ChevronRight size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable QR */}
              {expanded === ticket.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ borderTop: "1px dashed rgba(255,255,255,0.1)" }}
                >
                  <div className="p-5 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-28 h-28 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <QrCode size={56} style={{ color: "#FFFFFF", opacity: 0.7 }} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="font-mono text-sm font-bold tracking-widest mb-1" style={{ color: "#FFFFFF" }}>{ticket.id}</div>
                      <div className="text-xs mb-4" style={{ color: "rgba(229,229,229,0.5)" }}>Scan this QR code at the entrance</div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                          style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                          <Download size={12} /> Download
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer glass"
                          style={{ color: "rgba(229,229,229,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <Share2 size={12} /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
