import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Search, Clock, Tag, ChevronRight, TrendingUp } from "lucide-react";

const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";
const MUSIC_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/music_festival_1784569201522.png";
const HACK_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hackathon_event_1784569241165.png";

const ARTICLES = [
  { title: "10 Must-Know Tips for Organizing a Successful Tech Conference",        category: "Conference",  readTime: "6 min", date: "Jul 12, 2026", img: CONF_IMG,  featured: true },
  { title: "How AI Is Transforming Event Management in 2026",                       category: "Technology",  readTime: "4 min", date: "Jul 8, 2026",  img: HACK_IMG  },
  { title: "The Ultimate Guide to Music Festival Planning",                          category: "Music",       readTime: "8 min", date: "Jul 5, 2026",  img: MUSIC_IMG },
  { title: "QR Code Check-in: Revolutionizing Attendee Experience",                 category: "Tips",        readTime: "3 min", date: "Jul 2, 2026",  img: CONF_IMG  },
  { title: "Hybrid Events 101: Bridging Physical and Digital Audiences",            category: "Strategy",    readTime: "5 min", date: "Jun 28, 2026", img: HACK_IMG  },
  { title: "Maximizing Sponsor ROI at Your Next Corporate Event",                   category: "Business",    readTime: "7 min", date: "Jun 22, 2026", img: MUSIC_IMG },
];

const CATS = ["All", "Conference", "Technology", "Music", "Tips", "Strategy", "Business"];

export default function Blog() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = ARTICLES.filter(a =>
    (active === "All" || a.category === active) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Event<span className="gradient-text">Sphere Blog</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Insights, tips, and strategies for event professionals</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={14} style={{ color: "#FFFFFF" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..."
            className="flex-1 bg-transparent outline-none text-sm" style={{ color: "#FFFFFF" }} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATS.map(c => (
            <button key={c} onClick={() => setActive(c)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap"
              style={{
                background: active === c ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                color: active === c ? "#FFFFFF" : "rgba(229,229,229,0.55)",
                border: `1px solid ${active === c ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Article */}
      {featured && active === "All" && !search && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl overflow-hidden mb-8 cursor-pointer group">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="img-zoom h-56 md:h-auto">
              <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={12} style={{ color: "#FFFFFF" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>Featured</span>
                <span className="px-2 py-0.5 rounded-full text-[9px]"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>{featured.category}</span>
              </div>
              <h2 className="text-xl font-black mb-3 group-hover:text-[#FFFFFF] transition-colors" style={{ color: "#FFFFFF" }}>
                {featured.title}
              </h2>
              <div className="flex items-center gap-3 text-[10px] mb-4" style={{ color: "rgba(229,229,229,0.5)" }}>
                <span className="flex items-center gap-1"><Clock size={9} />{featured.readTime} read</span>
                <span>{featured.date}</span>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold cursor-pointer" style={{ color: "#FFFFFF" }}>
                Read Article <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(active === "All" && !search ? rest : filtered).map((article, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card rounded-2xl overflow-hidden cursor-pointer group">
            <div className="img-zoom h-40">
              <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>{article.category}</span>
                <span className="text-[9px]" style={{ color: "rgba(229,229,229,0.4)" }}>{article.date}</span>
              </div>
              <h3 className="text-xs font-bold mb-3 leading-snug group-hover:text-[#FFFFFF] transition-colors"
                style={{ color: "#FFFFFF" }}>{article.title}</h3>
              <div className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(229,229,229,0.45)" }}>
                <Clock size={9} />{article.readTime} read
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
