import React, { useState } from "react";
import { useApp } from "../state";
import { UserRole } from "../types";
import { Shield, Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";

interface AuthProps {
  setPage: (page: string) => void;
}

export default function Auth({ setPage }: AuthProps) {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Event Organizer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      if (isForgot) {
        if (!email) {
          setError("Please enter your email address.");
          return;
        }
        setInfo("Email verification link sent! Please check your inbox (simulated).");
        setTimeout(() => {
          setIsForgot(false);
          setInfo("");
        }, 3000);
      } else if (isLogin) {
        if (!email || !password) {
          setError("Please fill out all fields.");
          return;
        }
        await login(email, password);
        setPage("dashboard");
      } else {
        if (!name || !email || !password) {
          setError("Please fill out all fields.");
          return;
        }
        await register(name, email, password, role);
        setPage("dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoRole: UserRole) => {
    setError("");
    setInfo("");
    try {
      await login(demoEmail, demoRole);
      setPage("dashboard");
    } catch (err: any) {
      setError("Demo authentication failed.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setInfo("");
    try {
      // Mock Google Auth
      await login("google.user@gmail.com", "Participant");
      setPage("dashboard");
    } catch (err: any) {
      setError("Google authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl w-full z-10">
        
        {/* Left Side: Pitch */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left space-y-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}>
            <Shield size={20} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Enterprise Grade <br />
            <span className="shimmer-text-mono">Expense Auditing</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Login to access your roles, view remaining balances, scan receipts, split attendee shares, and generate fiscal audits. Swap roles at any time in the sidebar.
          </p>

          {/* Quick Demo Access Panels */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3 max-w-md">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={13} className="text-purple-400" />
              <span className="text-xs font-semibold text-white">Demo Fast Pass Logins</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin("admin@expensevision.ai", "Admin")}
                className="px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 text-[10px] font-bold text-blue-300 cursor-pointer text-center"
              >
                Log as Admin
              </button>
              <button
                onClick={() => handleDemoLogin("organizer@expensevision.ai", "Event Organizer")}
                className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-[10px] font-bold text-purple-300 cursor-pointer text-center"
              >
                Log as Organizer
              </button>
              <button
                onClick={() => handleDemoLogin("rahul@gmail.com", "Participant")}
                className="px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 text-[10px] font-bold text-cyan-300 cursor-pointer text-center"
              >
                Log as Participant
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="glass rounded-3xl p-8 border border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-1">
              {isForgot ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {isForgot ? "Provide your email to receive a password reset link." : isLogin ? "Access your budget workspace" : "Register to plan your first event budget"}
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
                {error}
              </div>
            )}
            {info && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                {info}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isForgot && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>
              )}

              {!isForgot && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="email"
                      placeholder="e.g. name@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>
              )}

              {isForgot && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Enter Registered Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="email"
                      placeholder="e.g. name@domain.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>
              )}

              {!isForgot && (
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setIsForgot(true)}
                        className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-3.5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>
              )}

              {!isLogin && !isForgot && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assign Platform Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-xs text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Event Organizer">Event Organizer</option>
                    <option value="Participant">Participant</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs transition-all hover:opacity-90 mt-2 cursor-pointer shadow-lg hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
              >
                {isForgot ? "Request Reset Link" : isLogin ? "Sign In" : "Register and Continue"}
              </button>
            </form>

            {!isForgot && (
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="w-full h-px bg-white/5" />
                <span className="text-[10px] text-slate-500 font-medium shrink-0 uppercase tracking-wider">Or OAuth Login</span>
                <span className="w-full h-px bg-white/5" />
              </div>
            )}

            {!isForgot && (
              <button
                onClick={handleGoogleLogin}
                className="w-full mt-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2a6.3 6.3 0 0 1-6.3-6.3c0-3.48 2.82-6.3 6.3-6.3 1.62 0 3.09.613 4.23 1.62l3.076-3.075C19.463 2.83 16.126 1.8 12.24 1.8c-5.79 0-10.44 4.65-10.44 10.44s4.65 10.44 10.44 10.44c6.044 0 10.052-4.247 10.052-10.237 0-.585-.052-1.125-.157-1.658H12.24z"/>
                </svg>
                Sign In with Google
              </button>
            )}

            <div className="mt-6 text-center">
              {isForgot ? (
                <button
                  onClick={() => setIsForgot(false)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              ) : (
                <button
                  onClick={() => setIsLogin(prev => !prev)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                >
                  {isLogin ? "Need an account? Register here" : "Already registered? Sign in instead"}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
