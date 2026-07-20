import { motion } from "motion/react";
import { Star, TrendingUp, Globe, Award, BarChart2 } from "lucide-react";

const TIERS = [
  { name: "Platinum", color: "#E0E0E0", companies: ["Google", "Microsoft", "Amazon"], perks: ["Logo on all materials", "VIP booth", "Keynote slot", "10 delegate passes", "Dedicated landing page"] },
  { name: "Gold",     color: "#FFFFFF", companies: ["Razorpay", "Adobe", "Salesforce"], perks: ["Logo on banners", "Exhibition booth", "Panel speaking slot", "5 delegate passes"] },
  { name: "Silver",   color: "#CCCCCC", companies: ["Meta", "Netflix", "Zoom"],        perks: ["Logo on website", "Exhibition table", "3 delegate passes"] },
  { name: "Bronze",   color: "#999999", companies: ["Slack", "Notion", "Figma"],       perks: ["Logo on website", "1 delegate pass"] },
];

const STATS = [
  { label: "Reach", value: "500K+", icon: <Globe size={20} />, color: "#FFFFFF" },
  { label: "Events", value: "250+", icon: <BarChart2 size={20} />, color: "#CCCCCC" },
  { label: "ROI",    value: "340%", icon: <TrendingUp size={20} />, color: "#E0E0E0" },
  { label: "Awards", value: "12",   icon: <Award size={20} />, color: "#FFFFFF" },
];

export default function Sponsors() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Our <span className="gradient-text">Sponsors</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Powering world-class events with visionary brands</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {STATS.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-2xl p-4 text-center">
            <div className="p-2 rounded-xl w-fit mx-auto mb-2" style={{ background: "rgba(255,255,255,0.1)", color: s.color }}>{s.icon}</div>
            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px]" style={{ color: "rgba(229,229,229,0.5)" }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="space-y-6 mb-12">
        {TIERS.map((tier, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: `${tier.color}20`, border: `2px solid ${tier.color}40` }}>
                <Star size={14} fill={tier.color} style={{ color: tier.color }} />
              </div>
              <div className="text-lg font-black" style={{ color: tier.color }}>{tier.name} Sponsors</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company logos */}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Companies</div>
                <div className="flex flex-wrap gap-2">
                  {tier.companies.map(co => (
                    <div key={co} className="px-4 py-2 rounded-xl text-xs font-bold"
                      style={{ background: `${tier.color}12`, color: tier.color, border: `1px solid ${tier.color}25` }}>
                      {co}
                    </div>
                  ))}
                </div>
              </div>
              {/* Perks */}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Included Benefits</div>
                <ul className="space-y-1.5">
                  {tier.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-xs" style={{ color: "rgba(229,229,229,0.7)" }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: tier.color }} />{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Become a Sponsor CTA */}
      <div className="glass-card rounded-3xl p-8 text-center"
        style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
        <div className="text-xl font-black mb-2" style={{ color: "#FFFFFF" }}>Become a Sponsor</div>
        <p className="text-sm mb-6" style={{ color: "rgba(229,229,229,0.6)" }}>
          Reach 500K+ event-goers across India. Partner with EventSphere to amplify your brand.
        </p>
        <button className="px-8 py-3.5 rounded-2xl font-bold text-sm cursor-pointer"
          style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
          Get Sponsorship Package
        </button>
      </div>
    </div>
  );
}
