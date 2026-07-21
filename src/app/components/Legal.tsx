import { motion } from "motion/react";
import { Shield, FileText, Lock, Cookie } from "lucide-react";

export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl font-black mb-2" style={{ color: "#FFFFFF" }}>
          Legal & <span className="gradient-text">Policies</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Last updated: July 20, 2026</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Terms of Service", icon: FileText, desc: "Rules and guidelines for using our platform." },
          { title: "Privacy Policy", icon: Lock, desc: "How we collect, use, and protect your data." },
          { title: "Cookie Policy", icon: Cookie, desc: "Information about how we use cookies." },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer hover:bg-white/5 transition-colors">
              <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>
                <Icon size={20} />
              </div>
              <div className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>{item.title}</div>
              <div className="text-xs" style={{ color: "rgba(229,229,229,0.5)" }}>{item.desc}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-10 space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "#FFFFFF" }}>
            <Shield size={18} style={{ color: "#FFFFFF" }} /> Platform Security
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(229,229,229,0.65)" }}>
            At EventSphere, we take your privacy and security seriously. We employ industry-standard security measures including end-to-end encryption, regular penetration testing, and continuous monitoring to ensure that your data remains safe.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(229,229,229,0.65)" }}>
            We are fully compliant with GDPR, CCPA, and standard global data protection regulations. Your data belongs to you, and we will never sell it to third parties.
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px" }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: "#FFFFFF" }}>1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(229,229,229,0.65)" }}>
            By accessing or using the EventSphere platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3" style={{ color: "#FFFFFF" }}>2. Organizer Responsibilities</h2>
          <ul className="list-disc pl-5 text-sm space-y-2" style={{ color: "rgba(229,229,229,0.65)" }}>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must ensure all event information provided is accurate and lawful.</li>
            <li>You agree to handle attendee data in accordance with our Privacy Policy and local laws.</li>
            <li>You are solely responsible for processing refunds according to your stated policies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
