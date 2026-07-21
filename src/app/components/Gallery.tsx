import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ZoomIn } from "lucide-react";

const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";
const MUSIC_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/music_festival_1784569201522.png";
const WEDDING_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/wedding_event_1784569225097.png";
const HACK_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hackathon_event_1784569241165.png";
const NET_IMG  = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/networking_event_1784569258791.png";
const HERO_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hero_event_banner_1784569174546.png";

const PHOTOS = [
  { src: HERO_IMG,    category: "Corporate", event: "Annual Gala 2025", span: "col-span-2" },
  { src: CONF_IMG,    category: "Conference", event: "Tech Summit 2026" },
  { src: MUSIC_IMG,   category: "Music",     event: "Sunset Carnival" },
  { src: WEDDING_IMG, category: "Wedding",   event: "Royal Wedding Expo", span: "col-span-2" },
  { src: HACK_IMG,    category: "Hackathon", event: "HackIndia '26" },
  { src: NET_IMG,     category: "Networking",event: "Leaders Gala" },
  { src: CONF_IMG,    category: "Conference", event: "AI Symposium 2027" },
  { src: MUSIC_IMG,   category: "Music",     event: "EDM Night Blast", span: "col-span-2" },
];

const CATS = ["All", "Conference", "Music", "Wedding", "Hackathon", "Networking", "Corporate"];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const [light, setLight] = useState<typeof PHOTOS[0] | null>(null);

  const filtered = PHOTOS.filter(p => active === "All" || p.category === active);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Event <span className="gradient-text">Gallery</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Moments captured from our finest events</p>
      </motion.div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            style={{
              background: active === cat ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
              color: active === cat ? "#FFFFFF" : "rgba(229,229,229,0.55)",
              border: `1px solid ${active === cat ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"}`
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
        {filtered.map((photo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setLight(photo)}
            className={`img-zoom rounded-2xl overflow-hidden cursor-pointer group relative ${photo.span || ""}`}
            style={{ height: photo.span ? "280px" : "200px" }}
          >
            <img src={photo.src} alt={photo.event} className="w-full h-full object-cover" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              style={{ background: "rgba(10,10,10,0.6)" }}>
              <div className="flex flex-col items-center gap-2">
                <ZoomIn size={24} style={{ color: "#FFFFFF" }} />
                <div className="text-xs font-bold" style={{ color: "#FFFFFF" }}>{photo.event}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.8)", color: "#000000" }}>{photo.category}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {light && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLight(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.95)" }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden"
            >
              <img src={light.src} alt={light.event} className="w-full object-contain max-h-[75vh]" />
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 100%)" }}>
                <div className="font-bold" style={{ color: "#FFFFFF" }}>{light.event}</div>
                <div className="text-xs" style={{ color: "rgba(229,229,229,0.6)" }}>{light.category}</div>
              </div>
              <button onClick={() => setLight(null)}
                className="absolute top-4 right-4 p-2 rounded-xl glass cursor-pointer"
                style={{ color: "rgba(229,229,229,0.8)" }}>
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
