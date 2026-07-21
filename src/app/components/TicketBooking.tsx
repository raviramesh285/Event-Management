import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, QrCode, Download, Share2, Ticket, Calendar, MapPin, ChevronLeft, Tag } from "lucide-react";
import confetti from "canvas-confetti";

const CONF_IMG = "/Users/sathishkumar/.gemini/antigravity-ide/brain/55a91f74-4554-4de9-8839-8852b8563c82/conference_event_1784569188520.png";

export default function TicketBooking({ setPage }: { setPage: (p: string) => void }) {
  const [step, setStep] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [booked, setBooked] = useState(false);

  const ticket = { name: "General Admission", price: 1999, event: "Global Tech Summit 2026", date: "Aug 15, 2026", venue: "Mumbai, India" };
  const discount = couponApplied ? 0.2 : 0;
  const total = Math.round(ticket.price * qty * (1 - discount));

  const handleBook = () => {
    setBooked(true);
    // Confetti!
    const fire = (particleRatio: number, opts: any) => {
      confetti({
        origin: { y: 0.7 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
        colors: ["#FFFFFF", "#CCCCCC", "#FFFFFF", "#E5E5E5", "#ffffff"],
      });
    };
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  if (booked) return (
    <div className="max-w-lg mx-auto text-center py-16">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)" }}>
          <CheckCircle size={36} className="text-white" />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-black mb-2" style={{ color: "#FFFFFF" }}>Booking Confirmed! 🎉</h2>
        <p className="text-sm mb-8" style={{ color: "rgba(229,229,229,0.65)" }}>
          Your ticket has been sent to {form.email}. See you at the event!
        </p>

        {/* Digital Pass */}
        <div className="glass-card rounded-3xl overflow-hidden mb-6">
          <div className="h-24 relative img-zoom">
            <img src={CONF_IMG} alt="Event" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.9)", color: "#000000" }}>DIGITAL PASS</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-lg font-black" style={{ color: "#FFFFFF" }}>{ticket.event}</div>
              <div className="text-xs" style={{ color: "rgba(229,229,229,0.55)" }}>{ticket.date} · {ticket.venue}</div>
            </div>
            {/* QR Placeholder */}
            <div className="w-28 h-28 mx-auto rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <QrCode size={60} style={{ color: "#FFFFFF", opacity: 0.7 }} />
            </div>
            <div className="text-center">
              <div className="font-mono text-xs font-bold tracking-widest" style={{ color: "rgba(229,229,229,0.5)" }}>
                EVS-2026-{Math.floor(Math.random() * 90000 + 10000)}
              </div>
            </div>
            <div className="flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-xs" style={{ color: "rgba(229,229,229,0.55)" }}>
                {form.name} · {qty} ticket{qty > 1 ? "s" : ""}
              </div>
              <div className="font-black text-sm" style={{ color: "#FFFFFF" }}>₹{total.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
            <Download size={14} /> Download Pass
          </button>
          <button className="py-3 px-4 rounded-xl cursor-pointer glass"
            style={{ color: "rgba(229,229,229,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Share2 size={14} />
          </button>
        </div>
        <button onClick={() => setPage("my-tickets")} className="w-full mt-3 py-3 rounded-xl text-sm font-semibold cursor-pointer"
          style={{ color: "rgba(229,229,229,0.6)" }}>
          View My Tickets
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={() => setPage("event-detail")}
        className="flex items-center gap-1.5 text-xs mb-6 cursor-pointer"
        style={{ color: "rgba(229,229,229,0.6)" }}>
        <ChevronLeft size={14} /> Back to Event
      </button>

      <h1 className="text-2xl font-black mb-6" style={{ color: "#FFFFFF" }}>
        Book Your <span className="gradient-text">Ticket</span>
      </h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {["Choose Ticket", "Your Details", "Payment"].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "" : ""}`}
              style={{
                background: step === i + 1 ? "linear-gradient(135deg, #FFFFFF, #CCCCCC)" : step > i + 1 ? "rgba(76,175,80,0.8)" : "rgba(255,255,255,0.08)",
                color: step >= i + 1 ? "#000000" : "rgba(229,229,229,0.4)"
              }}>
              {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className="text-xs font-semibold hidden md:block" style={{ color: step === i + 1 ? "#FFFFFF" : "rgba(229,229,229,0.4)" }}>{s}</span>
            {i < 2 && <div className="w-8 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 1: Ticket Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h2 className="font-bold mb-4" style={{ color: "#FFFFFF" }}>Select Ticket Type</h2>
                {[
                  { name: "General", price: 1999, desc: "Full day access to all sessions", color: "#FFFFFF" },
                  { name: "VIP", price: 4999, desc: "Front row + networking dinner + swag bag", color: "#CCCCCC" },
                  { name: "Workshop Only", price: 799, desc: "Access to afternoon workshops only", color: "#E0E0E0" },
                ].map((t, i) => (
                  <div key={i} className="p-4 rounded-xl cursor-pointer transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm" style={{ color: "#FFFFFF" }}>{t.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: "rgba(229,229,229,0.55)" }}>{t.desc}</div>
                      </div>
                      <div className="font-black text-lg" style={{ color: t.color }}>₹{t.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}

                {/* Quantity */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg cursor-pointer font-bold flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}>−</button>
                    <span className="text-sm font-bold" style={{ color: "#FFFFFF" }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(10, q + 1))}
                      className="w-8 h-8 rounded-lg cursor-pointer font-bold flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.2)" }}>+</button>
                  </div>
                </div>

                {/* Coupon */}
                <div className="flex gap-2 pt-2">
                  <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Tag size={13} style={{ color: "#FFFFFF" }} />
                    <input value={coupon} onChange={e => setCoupon(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 bg-transparent outline-none text-xs"
                      style={{ color: "#FFFFFF" }} />
                  </div>
                  <button
                    onClick={() => { if (coupon === "EVS20") setCouponApplied(true); }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    style={{ background: couponApplied ? "rgba(76,175,80,0.2)" : "rgba(255,255,255,0.15)", color: couponApplied ? "#4CAF50" : "#FFFFFF", border: `1px solid ${couponApplied ? "rgba(76,175,80,0.3)" : "rgba(255,255,255,0.25)"}` }}>
                    {couponApplied ? "Applied!" : "Apply"}
                  </button>
                </div>
                {couponApplied && <div className="text-xs font-semibold" style={{ color: "#4CAF50" }}>✓ 20% discount applied with code EVS20</div>}

                <button onClick={() => setStep(2)}
                  className="w-full py-3.5 rounded-xl font-bold text-sm cursor-pointer mt-2"
                  style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                  Continue to Details
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0}}>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h2 className="font-bold mb-4" style={{ color: "#FFFFFF" }}>Attendee Details</h2>
                {[
                  { key: "name", label: "Full Name", placeholder: "Your full name", type: "text" },
                  { key: "email", label: "Email Address", placeholder: "ticket@email.com", type: "email" },
                  { key: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer glass"
                    style={{ color: "rgba(229,229,229,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>Continue to Payment</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h2 className="font-bold mb-4" style={{ color: "#FFFFFF" }}>Payment Details</h2>
                {[
                  { label: "Card Number", placeholder: "4242 4242 4242 4242" },
                  { label: "Cardholder Name", placeholder: "Your name on card" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>Expiry</label>
                    <input placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(229,229,229,0.7)" }}>CVV</label>
                    <input placeholder="•••" className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.1)" }} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer glass"
                    style={{ color: "rgba(229,229,229,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>Back</button>
                  <button onClick={handleBook} className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #FFFFFF, #CCCCCC)", color: "#000000" }}>
                    Pay ₹{total.toLocaleString()}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass-card rounded-2xl p-5 h-fit">
          <h3 className="font-bold text-sm mb-4" style={{ color: "#FFFFFF" }}>Order Summary</h3>
          <div className="img-zoom rounded-xl overflow-hidden h-28 mb-4">
            <img src={CONF_IMG} alt="Event" className="w-full h-full object-cover" />
          </div>
          <div className="text-sm font-bold mb-1" style={{ color: "#FFFFFF" }}>{ticket.event}</div>
          <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "rgba(229,229,229,0.55)" }}>
            <Calendar size={10} style={{ color: "#FFFFFF" }} />{ticket.date}
          </div>
          <div className="flex items-center gap-1.5 text-xs mb-5" style={{ color: "rgba(229,229,229,0.55)" }}>
            <MapPin size={10} style={{ color: "#FFFFFF" }} />{ticket.venue}
          </div>
          <div className="space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-between text-xs" style={{ color: "rgba(229,229,229,0.65)" }}>
              <span>General × {qty}</span><span>₹{(ticket.price * qty).toLocaleString()}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-xs" style={{ color: "#4CAF50" }}>
                <span>Discount (20%)</span><span>−₹{Math.round(ticket.price * qty * 0.2).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", color: "#FFFFFF" }}>
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
