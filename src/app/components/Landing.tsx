import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Calendar, Search, MapPin, ChevronRight, Star, Users, TrendingUp,
  Sparkles, ArrowUpRight, Play, CheckCircle, Globe, Shield, Zap,
  Music, Briefcase, Heart, GraduationCap, Award, Coffee, Rocket,
  Clock, Ticket, Bell, Mail, Phone, Instagram, Twitter, Linkedin,
  ChevronDown, ChevronUp, Send
} from "lucide-react";

const HERO_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hero_event_banner_1784569174546.png";
const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";
const MUSIC_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/music_festival_1784569201522.png";
const WEDDING_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/wedding_event_1784569225097.png";
const HACK_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/hackathon_event_1784569241165.png";
const NET_IMG  = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/networking_event_1784569258791.png";

// ── Animated Counter ──
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Floating Orb ──
function FloatingOrb({ x, y, size, color, delay }: any) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y, width: size, height: size,
        background: color, filter: "blur(40px)", opacity: 0.35,
        animation: `float ${6 + delay}s ease-in-out infinite ${delay}s`
      }}
    />
  );
}

// ── Section Header ──
function SectionHeader({ badge, title, highlight, subtitle }: any) {
  return (
    <div className="text-center mb-14">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#FFFFFF" }}
      >
        <Sparkles size={11} />
        {badge}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-black mb-4 leading-tight"
        style={{ color: "#FFFFFF" }}
      >
        {title} <span className="gradient-text">{highlight}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          style={{ color: "rgba(229,229,229,0.65)" }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// ── Event Card ──
function EventCard({ img, title, date, location, category, price, attendees, idx, setPage }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      onClick={() => setPage("event-detail")}
      className="glass-card rounded-3xl overflow-hidden cursor-pointer group"
    >
      <div className="img-zoom h-48 relative">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 60%)" }} />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(255,255,255,0.9)", color: "#000000" }}>{category}</span>
        </div>
        <div className="absolute top-3 right-3 glass rounded-xl px-2.5 py-1 text-[10px] font-bold"
          style={{ color: "#FFFFFF" }}>{price}</div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-sm mb-2 group-hover:text-[#FFFFFF] transition-colors"
          style={{ color: "#FFFFFF" }}>{title}</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(229,229,229,0.6)" }}>
            <Calendar size={11} style={{ color: "#FFFFFF" }} />{date}
          </div>
          <div className="flex items-center gap-2 text-[11px]" style={{ color: "rgba(229,229,229,0.6)" }}>
            <MapPin size={11} style={{ color: "#FFFFFF" }} />{location}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(229,229,229,0.55)" }}>
            <Users size={11} />{attendees} attending
          </div>
          <motion.button
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-[11px] font-bold cursor-pointer"
            style={{ color: "#FFFFFF" }}
          >
            Register <ChevronRight size={12} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Landing({ setPage }: { setPage: (p: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = [
    { label: "All",         icon: <Globe size={18} />,       color: "#FFFFFF" },
    { label: "Conference",  icon: <Briefcase size={18} />,   color: "#CCCCCC" },
    { label: "Music",       icon: <Music size={18} />,        color: "#E0E0E0" },
    { label: "Wedding",     icon: <Heart size={18} />,        color: "#FFFFFF" },
    { label: "Hackathon",   icon: <Rocket size={18} />,      color: "#CCCCCC" },
    { label: "Education",   icon: <GraduationCap size={18}/>, color: "#E0E0E0" },
    { label: "Corporate",   icon: <Award size={18} />,        color: "#FFFFFF" },
    { label: "Networking",  icon: <Coffee size={18} />,       color: "#CCCCCC" },
  ];

  const featuredEvents = [
    { img: CONF_IMG,    title: "Global Tech Summit 2026",       date: "Aug 15, 2026", location: "Mumbai, India",          category: "Conference", price: "₹1,999",  attendees: "2,400" },
    { img: MUSIC_IMG,   title: "Sunset Music Carnival",         date: "Sep 3, 2026",  location: "Goa, India",             category: "Music",      price: "₹3,500",  attendees: "8,000" },
    { img: WEDDING_IMG, title: "Royal Wedding Planning Expo",   date: "Oct 12, 2026", location: "Udaipur, India",         category: "Wedding",    price: "Free",     attendees: "650" },
    { img: HACK_IMG,    title: "HackIndia National '26",        date: "Nov 7, 2026",  location: "Bangalore, India",       category: "Hackathon",  price: "₹499",    attendees: "1,200" },
    { img: NET_IMG,     title: "Leaders Networking Gala",       date: "Dec 1, 2026",  location: "Delhi, India",           category: "Networking", price: "₹5,000",  attendees: "300" },
    { img: CONF_IMG,    title: "AI & Future Symposium",         date: "Jan 22, 2027", location: "Hyderabad, India",       category: "Conference", price: "₹2,499",  attendees: "1,800" },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Events Created",    icon: <Calendar size={22} />,   color: "#FFFFFF" },
    { value: 500,   suffix: "K+", label: "Happy Attendees", icon: <Users size={22} />,       color: "#CCCCCC" },
    { value: 98,    suffix: "%",  label: "Satisfaction Rate",icon: <Star size={22} />,        color: "#E0E0E0" },
    { value: 150,   suffix: "+",  label: "Partner Sponsors", icon: <Globe size={22} />,       color: "#FFFFFF" },
  ];

  const testimonials = [
    { name: "Priya Shankar",    role: "Event Director, TechFest", text: "EventSphere transformed how we run our annual conference. The AI scheduling alone saved us 40+ hours.", rating: 5, avatar: "PS" },
    { name: "Rohan Mehta",      role: "Wedding Planner",           text: "The most beautiful platform I've used. Clients love the digital invites and QR ticketing. Absolutely premium!", rating: 5, avatar: "RM" },
    { name: "Ananya Krishnan",  role: "Corporate HR Manager",       text: "Managing 50+ internal events a year was chaos before EventSphere. Now everything is seamless.", rating: 5, avatar: "AK" },
    { name: "Dev Mathur",       role: "Hackathon Organizer",        text: "From registrations to check-ins to certificates – EventSphere handles it all. Incredible product.", rating: 5, avatar: "DM" },
  ];

  const faqs = [
    { q: "Is EventSphere free to use?",           a: "We offer a generous free tier with up to 5 active events. Our Pro and Enterprise plans unlock unlimited events, AI features, and advanced analytics." },
    { q: "Can I accept payments through the platform?", a: "Yes! We integrate with Stripe and Razorpay for seamless ticket payments, refunds, and invoice generation." },
    { q: "How does QR check-in work?",             a: "Once registered, attendees receive a digital pass with a unique QR code. Your staff can scan it with any smartphone for instant check-in." },
    { q: "Is my data secure?",                    a: "Absolutely. We use enterprise-grade encryption, JWT authentication, and regular security audits to protect all platform data." },
    { q: "Do you support hybrid and online events?", a: "Yes! EventSphere fully supports in-person, online, and hybrid events with live streaming integration." },
  ];

  const features = [
    { icon: <Zap size={22} />,    title: "AI-Powered Planning",  desc: "Smart scheduling, budget prediction, and personalized event recommendations powered by machine learning.",      color: "#FFFFFF" },
    { icon: <Ticket size={22} />, title: "Smart Ticketing",      desc: "Multiple ticket types, seat selection, coupon codes, and one-click QR check-in for all your events.",          color: "#CCCCCC" },
    { icon: <Shield size={22} />, title: "Enterprise Security",  desc: "JWT auth, 2FA, role-based access, and end-to-end encryption protect every event and attendee.",               color: "#E0E0E0" },
    { icon: <TrendingUp size={22}/>,label:"Live Analytics",       desc: "Beautiful real-time dashboards with revenue tracking, attendance metrics, and sponsor performance insights.",  color: "#FFFFFF" },
    { icon: <Globe size={22} />,  title: "Multi-Format Events",  desc: "Seamlessly manage in-person, virtual, and hybrid events with a unified management interface.",                  color: "#CCCCCC" },
    { icon: <Bell size={22} />,   title: "Smart Notifications",  desc: "Automated email, SMS, and push notifications for registrations, reminders, and live announcements.",           color: "#E0E0E0" },
  ];

  const sponsors = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Salesforce", "Adobe"];
  const timeline = [
    { year: "2022", event: "EventSphere founded in Bangalore with a vision for premium event tech" },
    { year: "2023", event: "Launched AI-powered scheduling and hit 1,000 events milestone" },
    { year: "2024", event: "Integrated Stripe & Razorpay, crossed 100K registered attendees" },
    { year: "2025", event: "Launched Organizer & Admin dashboards, expanded to 50+ cities" },
    { year: "2026", event: "Serving 500K+ attendees across India with full AI feature suite" },
  ];

  return (
    <div className="w-full" style={{ color: "#E5E5E5" }}>

      {/* ══════════ HERO ══════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Hero" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, #0A0A0A 0%, rgba(10,10,10,0.6) 50%, #0A0A0A 100%)"
          }} />
        </div>

        {/* Floating orbs */}
        <FloatingOrb x="5%" y="20%" size={300} color="rgba(255,255,255,0.2)" delay={0} />
        <FloatingOrb x="80%" y="10%" size={250} color="rgba(204,204,204,0.15)" delay={2} />
        <FloatingOrb x="60%" y="75%" size={200} color="rgba(255,255,255,0.1)" delay={4} />

        {/* Announcement pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold mb-8"
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)", color: "#FFFFFF" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4CAF50" }} />
          New: AI Event Recommendations & Smart QR Check-in Now Live
          <Sparkles size={11} />
        </motion.div>

        {/* Hero title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="relative z-10 text-4xl md:text-7xl font-black leading-tight tracking-tight mb-6 max-w-5xl"
          style={{ color: "#FFFFFF" }}
        >
          Create Events That
          <br />
          <span className="shimmer-text-mono">Inspire The World</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 max-w-2xl mb-10 text-base md:text-lg leading-relaxed"
          style={{ color: "rgba(229,229,229,0.7)" }}
        >
          The world's most intelligent event management platform. Plan, execute, and analyze every event with AI-powered tools, seamless ticketing, and stunning real-time dashboards.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <button
            onClick={() => setPage("login")}
            className="px-8 py-4 rounded-2xl font-bold text-sm btn-mono btn-ripple cursor-pointer"
          >
            Start For Free
          </button>
          <button
            onClick={() => setPage("events-page")}
            className="px-8 py-4 rounded-2xl font-semibold text-sm glass cursor-pointer hover:bg-white/5 transition-all flex items-center gap-2"
            style={{ color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Play size={14} style={{ color: "#FFFFFF" }} />
            Browse Events
          </button>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 w-full max-w-3xl glass rounded-2xl p-2 flex items-center gap-2"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <Search size={18} className="ml-3 shrink-0" style={{ color: "#FFFFFF" }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search events, conferences, workshops..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#FFFFFF", "::placeholder": { color: "rgba(229,229,229,0.4)" } } as any}
          />
          <div className="flex items-center gap-2">
            <div className="h-6 w-px" style={{ background: "rgba(255,255,255,0.12)" }} />
            <MapPin size={15} style={{ color: "rgba(229,229,229,0.5)" }} />
            <span className="text-xs" style={{ color: "rgba(229,229,229,0.5)" }}>India</span>
          </div>
          <button
            onClick={() => setPage("events-page")}
            className="px-5 py-2.5 rounded-xl text-sm font-bold btn-mono cursor-pointer"
          >
            Search
          </button>
        </motion.div>

        {/* Preview window */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative z-10 mt-16 w-full max-w-5xl mx-auto"
        >
          <div className="gradient-border rounded-3xl overflow-hidden glass shadow-2xl"
            style={{ background: "rgba(10,10,10,0.8)" }}>
            {/* Window chrome */}
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="text-[10px] font-mono tracking-wider" style={{ color: "rgba(229,229,229,0.4)" }}>
                EVENTSPHERE_PLATFORM.EXE
              </div>
              <div className="w-16" />
            </div>

            {/* Mock dashboard */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total Events", value: "48", change: "+12%", color: "#FFFFFF" },
                { label: "Registrations", value: "6,840", change: "+28%", color: "#CCCCCC" },
                { label: "Revenue", value: "₹12.4L", change: "+34%", color: "#E0E0E0" },
                { label: "Attendance", value: "94%", change: "+5%", color: "#4CAF50" },
              ].map((kpi, i) => (
                <div key={i} className="glass-subtle rounded-2xl p-4"
                  style={{ border: `1px solid rgba(${i === 0 ? "212,169,106" : i === 1 ? "201,123,75" : i === 2 ? "232,201,154" : "76,175,80"},0.2)` }}>
                  <div className="text-[10px] mb-1" style={{ color: "rgba(229,229,229,0.55)" }}>{kpi.label}</div>
                  <div className="text-xl font-black" style={{ color: "#FFFFFF" }}>{kpi.value}</div>
                  <div className="text-[10px] font-semibold mt-1" style={{ color: kpi.color }}>{kpi.change} this month</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════ EVENT CATEGORIES ══════════ */}
      <section className="py-20 px-6" style={{ background: "rgba(10,10,10,0.5)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Browse by Category" title="Find Your" highlight="Perfect Event" subtitle="Explore thousands of events across every category imaginable." />

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCategory(cat.label)}
                whileHover={{ y: -3 }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: activeCategory === cat.label ? `rgba(${cat.color === "#FFFFFF" ? "212,169,106" : cat.color === "#CCCCCC" ? "201,123,75" : "232,201,154"},0.2)` : "rgba(26,26,26,0.4)",
                  border: activeCategory === cat.label ? `1px solid ${cat.color}60` : "1px solid rgba(255,255,255,0.08)",
                  color: activeCategory === cat.label ? cat.color : "rgba(229,229,229,0.6)"
                }}
              >
                <span style={{ color: cat.color }}>{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED EVENTS ══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Handpicked for You" title="Featured" highlight="Events 2026" subtitle="Don't miss these extraordinary experiences happening across India." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((ev, i) => (
              <EventCard key={i} {...ev} idx={i} setPage={setPage} />
            ))}
          </div>
          <div className="text-center mt-10">
            <motion.button
              onClick={() => setPage("events-page")}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 rounded-2xl text-sm font-bold btn-mono cursor-pointer"
            >
              View All Events <ArrowUpRight size={14} className="inline ml-1" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* ══════════ STATISTICS ══════════ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{ background: "rgba(10,10,10,0.7)" }}>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(204,204,204,0.05) 100%)"
        }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <SectionHeader badge="Our Impact" title="Numbers That" highlight="Tell The Story" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-6 text-center"
              >
                <div className="p-3 rounded-2xl w-fit mx-auto mb-4"
                  style={{ background: `rgba(255,255,255,0.12)`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs" style={{ color: "rgba(229,229,229,0.55)" }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="Platform Features" title="Everything You Need" highlight="In One Place" subtitle="A complete toolkit for event organizers, from planning to post-event analytics." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-3xl p-6 group"
              >
                <div className="p-3 rounded-2xl w-fit mb-5 transition-transform group-hover:scale-110"
                  style={{ background: `rgba(255,255,255,0.1)`, color: feat.color }}>
                  {feat.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#FFFFFF" }}>{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(229,229,229,0.6)" }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TIMELINE ══════════ */}
      <section className="py-20 px-6" style={{ background: "rgba(10,10,10,0.5)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader badge="Our Journey" title="Building The" highlight="Future of Events" />
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)" }} />
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
              >
                <div className={`hidden md:block flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <div className="text-2xl font-black gradient-text">{item.year}</div>
                </div>
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: "#FFFFFF", boxShadow: "0 0 12px rgba(255,255,255,0.5)" }} />
                <div className="ml-10 md:ml-0 md:flex-1 glass-card rounded-2xl p-4">
                  <div className="text-xl font-black gradient-text md:hidden mb-1">{item.year}</div>
                  <p className="text-sm" style={{ color: "rgba(229,229,229,0.75)" }}>{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader badge="What They Say" title="Loved by" highlight="Event Professionals" subtitle="Thousands of organizers trust EventSphere to create unforgettable experiences." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-3xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={13} fill="#FFFFFF" style={{ color: "#FFFFFF" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic"
                  style={{ color: "rgba(229,229,229,0.8)" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
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
      </section>

      {/* ══════════ SPONSORS ══════════ */}
      <section className="py-16 px-6" style={{ background: "rgba(10,10,10,0.5)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-xs mb-10 uppercase tracking-widest font-bold"
            style={{ color: "rgba(255,255,255,0.6)" }}>Trusted by world-class brands</div>
          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.map((sp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card px-6 py-3 rounded-xl text-sm font-bold cursor-pointer"
                style={{ color: "rgba(229,229,229,0.45)" }}
              >
                {sp}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <SectionHeader badge="Transparent Pricing" title="Simple Plans," highlight="Premium Results" subtitle="Start free, scale as you grow. No hidden fees, no surprises." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[
              { name: "Starter", price: "₹999", period: "/mo",   color: "#FFFFFF", perks: ["5 active events", "Basic analytics", "Email support", "QR check-in"] },
              { name: "Pro",     price: "₹2,999", period: "/mo", color: "#CCCCCC", popular: true, perks: ["Unlimited events", "AI recommendations", "Advanced analytics", "Stripe & Razorpay", "Priority support"] },
              { name: "Enterprise", price: "Custom", period: "", color: "#E0E0E0", perks: ["Everything in Pro", "Unlimited team members", "White-label branding", "Dedicated support", "Custom integrations"] },
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-3xl p-6 flex flex-col justify-between relative ${tier.popular ? "gradient-border" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                    MOST POPULAR
                  </div>
                )}
                <div>
                  <h3 className="font-black text-lg mb-1" style={{ color: "#FFFFFF" }}>{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-black" style={{ color: tier.color }}>{tier.price}</span>
                    <span className="text-xs" style={{ color: "rgba(229,229,229,0.5)" }}>{tier.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-7">
                    {tier.perks.map((p, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs" style={{ color: "rgba(229,229,229,0.8)" }}>
                        <CheckCircle size={12} style={{ color: tier.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setPage("login")}
                  className="w-full py-3 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-[1.02]"
                  style={
                    tier.popular
                      ? { background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }
                      : { background: `rgba(255,255,255,0.1)`, color: tier.color, border: `1px solid ${tier.color}30` }
                  }
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-20 px-6" style={{ background: "rgba(10,10,10,0.5)" }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader badge="FAQ" title="Got" highlight="Questions?" subtitle="Everything you need to know about EventSphere." />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                >
                  <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{faq.q}</span>
                  <span style={{ color: "#FFFFFF" }}>
                    {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
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
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(204,204,204,0.05) 50%, rgba(255,255,255,0.06) 100%)"
        }} />
        <FloatingOrb x="10%" y="20%" size={300} color="rgba(255,255,255,0.15)" delay={1} />
        <FloatingOrb x="75%" y="60%" size={250} color="rgba(204,204,204,0.1)" delay={3} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: "#FFFFFF" }}>
              Ready to Create Your<br /><span className="shimmer-text-mono">Next Great Event?</span>
            </h2>
            <p className="mb-8 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(229,229,229,0.65)" }}>
              Join 10,000+ organizers who trust EventSphere to deliver unforgettable experiences. Start free, no credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setPage("login")}
                className="px-8 py-4 rounded-2xl font-bold text-sm btn-mono btn-ripple cursor-pointer"
              >
                Create Your First Event
              </button>
              <button
                onClick={() => setPage("contact")}
                className="px-8 py-4 rounded-2xl font-semibold text-sm glass cursor-pointer hover:bg-white/5 transition-all"
                style={{ color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                Talk to Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ NEWSLETTER ══════════ */}
      <section className="py-16 px-6" style={{ background: "rgba(10,10,10,0.7)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-2xl font-black mb-2" style={{ color: "#FFFFFF" }}>Stay in the Loop</div>
            <p className="text-sm mb-6" style={{ color: "rgba(229,229,229,0.6)" }}>
              Get the latest events, organizer tips, and platform updates delivered to your inbox.
            </p>
            {!subscribed ? (
              <div className="flex gap-2">
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 glass rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                <button
                  onClick={() => { if (email) { setSubscribed(true); setEmail(""); } }}
                  className="px-5 py-3 rounded-xl font-bold text-sm btn-mono cursor-pointer flex items-center gap-2"
                >
                  <Send size={14} /> Subscribe
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 py-3"
                style={{ color: "#4CAF50" }}
              >
                <CheckCircle size={18} />
                <span className="font-bold text-sm">You're subscribed! Welcome to EventSphere.</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#050505" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)" }}>
                  <Calendar size={15} className="text-white" />
                </div>
                <span className="text-sm font-black" style={{ color: "#FFFFFF" }}>
                  Event<span className="gradient-text">Sphere</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(229,229,229,0.5)" }}>
                The world's most intelligent event management platform. Empowering organizers to create extraordinary experiences.
              </p>
              <div className="flex gap-3">
                {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <button key={i} className="p-2 rounded-xl transition-all hover:bg-white/5 cursor-pointer"
                    style={{ color: "rgba(229,229,229,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {[
              { title: "Platform", links: ["Events", "Pricing", "Gallery", "Speakers", "Blog"] },
              { title: "Company",  links: ["About", "Contact", "Careers", "Press", "Partners"] },
              { title: "Legal",    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"] },
            ].map((col, i) => (
              <div key={i}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ color: "#FFFFFF" }}>{col.title}</div>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" onClick={(e) => { e.preventDefault(); }}
                        className="text-xs transition-colors hover:text-[#FFFFFF]"
                        style={{ color: "rgba(229,229,229,0.5)" }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-[11px]" style={{ color: "rgba(229,229,229,0.35)" }}>
              © 2026 EventSphere. All rights reserved. Made with ♥ in India.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(229,229,229,0.35)" }}>
                <Phone size={10} /> +91 98765 43210
              </div>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(229,229,229,0.35)" }}>
                <Mail size={10} /> hello@eventsphere.in
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
