import { motion } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Users, Ticket, DollarSign, BarChart2, CheckCircle } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const registrationData = months.map((m, i) => ({
  month: m,
  registrations: Math.round(800 + Math.sin(i * 0.8) * 300 + i * 120),
  revenue: Math.round(120000 + i * 35000 + Math.cos(i * 0.6) * 20000),
}));

const attendanceData = months.map((m, i) => ({
  month: m,
  rate: Math.min(98, 72 + i * 2 + Math.round(Math.sin(i) * 5)),
  checkIns: Math.round(600 + i * 100),
}));

const categoryData = [
  { name: "Conference", value: 35, color: "#FFFFFF" },
  { name: "Music",      value: 22, color: "#CCCCCC" },
  { name: "Wedding",    value: 18, color: "#E0E0E0" },
  { name: "Hackathon",  value: 12, color: "#4CAF50" },
  { name: "Corporate",  value: 8,  color: "#FFC107" },
  { name: "Other",      value: 5,  color: "#999999" },
];

const tooltipStyle = {
  backgroundColor: "rgba(10,10,10,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  color: "#FFFFFF",
  fontSize: "11px",
};

function KPICard({ icon, label, value, change, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl" style={{ background: `${color}18`, color }}>{icon}</div>
        <div className="text-xs font-bold" style={{ color: change >= 0 ? "#4CAF50" : "#F44336" }}>
          {change >= 0 ? "+" : ""}{change}%
        </div>
      </div>
      <div className="text-2xl font-black mb-0.5" style={{ color: "#FFFFFF" }}>{value}</div>
      <div className="text-[11px]" style={{ color: "rgba(229,229,229,0.55)" }}>{label}</div>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black mb-1" style={{ color: "#FFFFFF" }}>
          Analytics <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-sm" style={{ color: "rgba(229,229,229,0.6)" }}>Platform-wide insights and performance metrics</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={<Ticket size={18} />}    label="Total Registrations" value="48,290"  change={28}  color="#FFFFFF" />
        <KPICard icon={<DollarSign size={18} />} label="Total Revenue"       value="₹1.24Cr" change={34}  color="#CCCCCC" />
        <KPICard icon={<Users size={18} />}      label="Unique Attendees"    value="32,450"  change={19}  color="#E0E0E0" />
        <KPICard icon={<CheckCircle size={18}/>} label="Avg. Attendance"     value="94.2%"   change={5}   color="#4CAF50" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Registration trend */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-bold text-sm" style={{ color: "#FFFFFF" }}>Registration Trend</div>
              <div className="text-[10px]" style={{ color: "rgba(229,229,229,0.5)" }}>Monthly registrations across all events</div>
            </div>
            <TrendingUp size={16} style={{ color: "#FFFFFF" }} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={registrationData}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} />
              <YAxis tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="registrations" stroke="#FFFFFF" fill="url(#regGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-bold text-sm" style={{ color: "#FFFFFF" }}>Revenue Overview</div>
              <div className="text-[10px]" style={{ color: "rgba(229,229,229,0.5)" }}>Monthly ticket revenue in ₹</div>
            </div>
            <DollarSign size={16} style={{ color: "#CCCCCC" }} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} />
              <YAxis tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`₹${(v/1000).toFixed(1)}K`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#CCCCCC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Category pie */}
        <div className="glass-card rounded-2xl p-5">
          <div className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>Events by Category</div>
          <div className="text-[10px] mb-4" style={{ color: "rgba(229,229,229,0.5)" }}>Distribution across event types</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryData} innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: any) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[9px]" style={{ color: "rgba(229,229,229,0.6)" }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                {cat.name} ({cat.value}%)
              </div>
            ))}
          </div>
        </div>

        {/* Attendance rate */}
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="font-bold text-sm mb-1" style={{ color: "#FFFFFF" }}>Attendance Rate & Check-ins</div>
          <div className="text-[10px] mb-4" style={{ color: "rgba(229,229,229,0.5)" }}>Monthly attendance performance</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(229,229,229,0.4)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#FFFFFF" strokeWidth={2} dot={false} name="Attendance %" />
              <Line yAxisId="right" type="monotone" dataKey="checkIns" stroke="#4CAF50" strokeWidth={2} dot={false} name="Check-ins" />
              <Legend wrapperStyle={{ color: "rgba(229,229,229,0.6)", fontSize: "10px" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Events Table */}
      <div className="glass-card rounded-2xl p-5">
        <div className="font-bold text-sm mb-4" style={{ color: "#FFFFFF" }}>Top Performing Events</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Event", "Category", "Registrations", "Revenue", "Attendance", "Rating"].map(h => (
                  <th key={h} className="pb-3 text-left font-bold" style={{ color: "rgba(255,255,255,0.8)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[
                { name: "Global Tech Summit",  cat: "Conference", reg: 2400, rev: "₹4.8L", att: "96%", rating: 4.9 },
                { name: "Sunset Music Carnival", cat: "Music",     reg: 8000, rev: "₹28L",  att: "99%", rating: 4.8 },
                { name: "HackIndia '26",        cat: "Hackathon", reg: 1200, rev: "₹6L",   att: "92%", rating: 4.9 },
                { name: "Leaders Gala",          cat: "Networking", reg: 300, rev: "₹15L",  att: "88%", rating: 5.0 },
              ].map((ev, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="py-3 font-semibold" style={{ color: "#FFFFFF" }}>{ev.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[9px]"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#FFFFFF" }}>{ev.cat}</span>
                  </td>
                  <td className="py-3" style={{ color: "rgba(229,229,229,0.7)" }}>{ev.reg.toLocaleString()}</td>
                  <td className="py-3" style={{ color: "rgba(229,229,229,0.7)" }}>{ev.rev}</td>
                  <td className="py-3" style={{ color: "#4CAF50" }}>{ev.att}</td>
                  <td className="py-3 font-bold" style={{ color: "#FFFFFF" }}>⭐ {ev.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
