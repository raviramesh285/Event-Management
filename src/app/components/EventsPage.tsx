import { useState } from "react";
import { motion } from "motion/react";
import { Search, Filter, MapPin, Calendar, Users, ChevronRight, Grid, List, Clock, Star, Ticket } from "lucide-react";

const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";
const MUSIC_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/music_festival_1784569201522.png";
const WEDDING_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/wedding_event_1784569225097.png";
const HACK_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hackathon_event_1784569241165.png";
const NET_IMG  = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/networking_event_1784569258791.png";

const EVENTS = [
  { id: 1, img: CONF_IMG,    title: "Global Tech Summit 2026",     date: "Aug 15, 2026", time: "9:00 AM", location: "Mumbai",    category: "Conference", price: "₹1,999",  attendees: 2400, capacity: 3000, format: "In-Person", rating: 4.9 },
  { id: 2, img: MUSIC_IMG,   title: "Sunset Music Carnival",       date: "Sep 3, 2026",  time: "6:00 PM", location: "Goa",       category: "Music",      price: "₹3,500",  attendees: 8000, capacity: 10000, format: "In-Person", rating: 4.8 },
  { id: 3, img: WEDDING_IMG, title: "Royal Wedding Planning Expo", date: "Oct 12, 2026", time: "11:00 AM",location: "Udaipur",   category: "Wedding",    price: "Free",     attendees: 650,  capacity: 800,   format: "In-Person", rating: 4.7 },
  { id: 4, img: HACK_IMG,    title: "HackIndia National '26",      date: "Nov 7, 2026",  time: "10:00 AM",location: "Bangalore", category: "Hackathon",  price: "₹499",    attendees: 1200, capacity: 1500,  format: "Hybrid",    rating: 4.9 },
  { id: 5, img: NET_IMG,     title: "Leaders Networking Gala",     date: "Dec 1, 2026",  time: "7:00 PM", location: "Delhi",     category: "Networking", price: "₹5,000",  attendees: 300,  capacity: 350,   format: "In-Person", rating: 5.0 },
  { id: 6, img: CONF_IMG,    title: "AI & Future Symposium",       date: "Jan 22, 2027", time: "9:30 AM", location: "Hyderabad", category: "Conference", price: "₹2,499",  attendees: 1800, capacity: 2000,  format: "Hybrid",    rating: 4.8 },
  { id: 7, img: MUSIC_IMG,   title: "EDM Night Blast",             date: "Feb 14, 2027", time: "9:00 PM", location: "Pune",      category: "Music",      price: "₹1,500",  attendees: 5000, capacity: 6000,  format: "In-Person", rating: 4.6 },
  { id: 8, img: HACK_IMG,    title: "CodeFest Junior 2027",        date: "Mar 5, 2027",  time: "8:00 AM", location: "Chennai",   category: "Hackathon",  price: "Free",     attendees: 800,  capacity: 1000,  format: "Online",    rating: 4.7 },
];

const CATEGORIES = ["All", "Conference", "Music", "Wedding", "Hackathon", "Networking", "Corporate", "Education"];
const CITIES     = ["All Cities", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Goa", "Pune", "Chennai", "Udaipur"];
const FORMATS    = ["All Formats", "In-Person", "Online", "Hybrid"];

export default function EventsPage({ setPage }: { setPage: (p: string) => void }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState("All");
  const [city, setCity] = useState("All Cities");
  const [format, setFormat] = useState("All Formats");
  const [search, setSearch] = useState("");

  const filtered = EVENTS.filter(ev => {
    const matchCat  = category === "All" || ev.category === category;
    const matchCity = city === "All Cities" || ev.location === city;
    const matchFmt  = format === "All Formats" || ev.format === format;
    const matchSrch = ev.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCity && matchFmt && matchSrch;
  });

  const cardStyle = { background: "rgba(17,17,17,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.25rem", backdropFilter: "blur(20px)" };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Discover <span className="gradient-text">Events</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Browse {EVENTS.length} upcoming events across India</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-64 shrink-0 space-y-4"
        >
          {/* Search */}
          <div style={cardStyle} className="p-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search size={14} style={{ color: "#FFFFFF" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search events..."
                className="flex-1 bg-transparent outline-none text-xs"
                style={{ color: "#FFFFFF" }} />
            </div>
          </div>

          {/* Category Filter */}
          <div style={cardStyle} className="p-4">
            <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: "#FFFFFF" }}>
              <Filter size={10} className="inline mr-1" />Category
            </div>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: category === cat ? "rgba(255,255,255,0.15)" : "transparent",
                    color: category === cat ? "#FFFFFF" : "rgba(229,229,229,0.6)",
                    border: category === cat ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent"
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* City Filter */}
          <div style={cardStyle} className="p-4">
            <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: "#FFFFFF" }}>
              <MapPin size={10} className="inline mr-1" />City
            </div>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs outline-none"
              style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.08)" }}>
              {CITIES.map(c => <option key={c} value={c} style={{ background: "#0A0A0A" }}>{c}</option>)}
            </select>
          </div>

          {/* Format Filter */}
          <div style={cardStyle} className="p-4">
            <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: "#FFFFFF" }}>Format</div>
            <div className="space-y-1">
              {FORMATS.map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: format === f ? "rgba(255,255,255,0.15)" : "transparent",
                    color: format === f ? "#FFFFFF" : "rgba(229,229,229,0.6)",
                    border: format === f ? "1px solid rgba(255,255,255,0.25)" : "1px solid transparent"
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs" style={{ color: "rgba(229,229,229,0.55)" }}>
              Showing {filtered.length} events
            </span>
            <div className="flex items-center gap-1.5">
              {(["grid", "list"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className="p-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: view === v ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                    color: view === v ? "#FFFFFF" : "rgba(229,229,229,0.5)",
                    border: `1px solid ${view === v ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`
                  }}>
                  {v === "grid" ? <Grid size={14} /> : <List size={14} />}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: "rgba(229,229,229,0.4)" }}>
              <Search size={40} className="mx-auto mb-4 opacity-30" />
              <div className="text-sm font-semibold">No events found</div>
              <div className="text-xs mt-1">Try adjusting your filters</div>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" : "space-y-4"}>
              {filtered.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setPage("event-detail")}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
                  style={view === "list" ? { display: "flex", gap: 0 } : {}}
                >
                  <div className={`img-zoom relative ${view === "list" ? "w-48 shrink-0" : "h-44"}`}>
                    <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 60%)" }} />
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{ background: "rgba(255,255,255,0.9)", color: "#000000" }}>{ev.category}</span>
                    </div>
                    <div className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-lg"
                      style={{ background: ev.format === "Online" ? "rgba(76,175,80,0.8)" : ev.format === "Hybrid" ? "rgba(255,193,7,0.8)" : "rgba(255,255,255,0.8)", color: "#000000" }}>
                      {ev.format}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-bold text-sm mb-2 group-hover:text-[#FFFFFF] transition-colors" style={{ color: "#FFFFFF" }}>{ev.title}</h3>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(229,229,229,0.6)" }}>
                          <Calendar size={10} style={{ color: "#FFFFFF" }} />{ev.date} · {ev.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(229,229,229,0.6)" }}>
                          <MapPin size={10} style={{ color: "#FFFFFF" }} />{ev.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(229,229,229,0.6)" }}>
                          <Star size={10} fill="#FFFFFF" style={{ color: "#FFFFFF" }} />{ev.rating} · {ev.attendees.toLocaleString()} attending
                        </div>
                      </div>
                      {/* Capacity bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-[9px] mb-1" style={{ color: "rgba(229,229,229,0.5)" }}>
                          <span>Capacity</span>
                          <span>{Math.round((ev.attendees / ev.capacity) * 100)}% filled</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${(ev.attendees / ev.capacity) * 100}%`, background: "linear-gradient(to right, #FFFFFF, #CCCCCC)" }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black" style={{ color: "#FFFFFF" }}>{ev.price}</span>
                      <button className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                        style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                        <Ticket size={10} /> Register
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
