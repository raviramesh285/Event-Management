import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function Pricing({ setPage }: { setPage: (p: string) => void }) {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tiers = [
    {
      name: "Starter",
      monthlyPrice: 999,
      desc: "Perfect for small events and beginners",
      color: "#FFFFFF",
      features: [
        "5 active events",
        "Up to 500 attendees per event",
        "Basic analytics dashboard",
        "QR code check-in",
        "Email support",
        "EventSphere branding",
      ],
    },
    {
      name: "Pro",
      monthlyPrice: 2999,
      desc: "For professional event planners",
      color: "#CCCCCC",
      popular: true,
      features: [
        "Unlimited active events",
        "Unlimited attendees",
        "AI event recommendations",
        "Advanced analytics",
        "Stripe & Razorpay integration",
        "Custom branding",
        "Speaker & volunteer management",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      monthlyPrice: null,
      desc: "For large organizations & agencies",
      color: "#E0E0E0",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "White-label platform",
        "Dedicated account manager",
        "SLA guarantee",
        "Custom integrations",
        "SSO & advanced security",
        "On-site support",
      ],
    },
  ];

  const faqs = [
    { q: "Can I change plans later?",           a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on the next billing cycle." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay and Stripe." },
    { q: "Is there a free trial?",               a: "Yes! Start with our Starter plan for free with no credit card required. Upgrade when you need more features." },
    { q: "Can I cancel anytime?",               a: "Absolutely. There are no long-term commitments. Cancel your subscription anytime from your settings." },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl font-black mb-3" style={{ color: "#FFFFFF" }}>
          Simple, Transparent <span className="gradient-text">Pricing</span>
        </h1>
        <p className="text-sm mb-6" style={{ color: "rgba(229,229,229,0.6)" }}>Start free, scale as you grow. No hidden fees.</p>
        {/* Toggle */}
        <div className="inline-flex items-center gap-3 glass px-4 py-2.5 rounded-2xl"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
          <span className="text-xs font-semibold" style={{ color: !annual ? "#FFFFFF" : "rgba(229,229,229,0.5)" }}>Monthly</span>
          <button onClick={() => setAnnual(a => !a)}
            className="w-10 h-5 rounded-full relative transition-all cursor-pointer"
            style={{ background: annual ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)" }}>
            <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
              style={{ background: annual ? "#FFFFFF" : "rgba(229,229,229,0.4)", left: annual ? "calc(100% - 1.125rem)" : "2px" }} />
          </button>
          <span className="text-xs font-semibold" style={{ color: annual ? "#FFFFFF" : "rgba(229,229,229,0.5)" }}>
            Annual <span className="text-[10px]" style={{ color: "#4CAF50" }}>Save 20%</span>
          </span>
        </div>
      </motion.div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {tiers.map((tier, i) => {
          const price = tier.monthlyPrice ? (annual ? Math.round(tier.monthlyPrice * 0.8) : tier.monthlyPrice) : null;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card rounded-3xl p-6 flex flex-col relative ${tier.popular ? "gradient-border" : ""}`}
              style={tier.popular ? { transform: "scale(1.02)" } : {}}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                  MOST POPULAR
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-black mb-1" style={{ color: tier.color }}>{tier.name}</h3>
                <p className="text-[11px]" style={{ color: "rgba(229,229,229,0.55)" }}>{tier.desc}</p>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                {price ? (
                  <>
                    <span className="text-3xl font-black" style={{ color: "#FFFFFF" }}>₹{price.toLocaleString()}</span>
                    <span className="text-xs" style={{ color: "rgba(229,229,229,0.5)" }}>/mo</span>
                  </>
                ) : (
                  <span className="text-2xl font-black" style={{ color: tier.color }}>Custom</span>
                )}
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "rgba(229,229,229,0.75)" }}>
                    <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: tier.color }} />{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => setPage("login")}
                className="w-full py-3.5 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
                style={tier.popular
                  ? { background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }
                  : { background: `${tier.color}18`, color: tier.color, border: `1px solid ${tier.color}30` }
                }>
                {tier.monthlyPrice ? "Get Started" : "Contact Sales"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Feature comparison table */}
      <div className="glass-card rounded-2xl overflow-hidden mb-12">
        <div className="p-5 font-bold text-sm" style={{ color: "#FFFFFF", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          Feature Comparison
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="p-4 text-left" style={{ color: "rgba(229,229,229,0.5)" }}>Feature</th>
                {tiers.map(t => <th key={t.name} className="p-4 text-center" style={{ color: t.color }}>{t.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Active Events", "5", "Unlimited", "Unlimited"],
                ["Max Attendees", "500", "Unlimited", "Unlimited"],
                ["AI Recommendations", "✗", "✓", "✓"],
                ["Custom Branding", "✗", "✓", "✓"],
                ["API Access", "✗", "✗", "✓"],
                ["Dedicated Support", "✗", "✗", "✓"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {row.map((cell, j) => (
                    <td key={j} className="p-4" style={{
                      color: j === 0 ? "rgba(229,229,229,0.7)" : cell === "✓" ? "#4CAF50" : cell === "✗" ? "rgba(229,229,229,0.25)" : "#FFFFFF",
                      textAlign: j === 0 ? "left" : "center"
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-black mb-5 text-center" style={{ color: "#FFFFFF" }}>Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer">
                <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{faq.q}</span>
                <span style={{ color: "#FFFFFF" }}>{openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden px-5 pb-4">
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(229,229,229,0.65)" }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
