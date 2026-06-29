 "use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030307] overflow-hidden">
      {/* Massive spider web background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
        {/* Concentric web rings */}
        {[60, 120, 180, 240, 300, 360].map((r, i) => (
          <circle key={`cr${i}`} cx="250" cy="250" r={r} fill="none" stroke="#dc2626" strokeWidth={0.4 - i * 0.05}>
            <animate attributeName="r" values={`${r};${r + 20};${r}`} dur={`${6 + i * 1.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Radial web lines */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`rl${i}`} x1="250" y1="250" x2={250 + 360 * Math.cos(i * Math.PI / 8)} y2={250 + 360 * Math.sin(i * Math.PI / 8)} stroke="#dc2626" strokeWidth="0.25" opacity="0.4">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${4 + i % 3}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>

      {/* Animated web strands shooting from corners */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
        <path d="M0 0 Q120 40 250 60 Q380 40 500 0" fill="none" stroke="#dc2626" strokeWidth="0.4" opacity="0.15" strokeDasharray="20 8">
          <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M0 500 Q120 460 250 440 Q380 460 500 500" fill="none" stroke="#dc2626" strokeWidth="0.4" opacity="0.15" strokeDasharray="20 8">
          <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M250 0 Q250 120 250 250 Q250 380 250 500" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.1" strokeDasharray="15 10">
          <animate attributeName="stroke-dashoffset" from="0" to="-50" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Large spider silhouette top-right */}
      <div className="absolute top-8 right-[10%] animate-swing hidden lg:block z-10">
        <svg width="36" height="50" viewBox="0 0 36 50" className="opacity-20">
          <line x1="18" y1="0" x2="18" y2="22" stroke="#dc2626" strokeWidth="0.8" opacity="0.4" />
          <ellipse cx="18" cy="34" rx="10" ry="13" fill="#dc2626" opacity="0.4" />
          <circle cx="18" cy="28" r="6" fill="#dc2626" opacity="0.5" />
          <circle cx="18" cy="26" r="3" fill="#111" opacity="0.6" />
          <path d="M8 34 Q2 28 4 24 M28 34 Q34 28 32 24" stroke="#dc2626" strokeWidth="1.5" fill="none" opacity="0.35" />
          <path d="M10 40 Q4 46 3 43 M26 40 Q32 46 33 43" stroke="#dc2626" strokeWidth="1.2" fill="none" opacity="0.3" />
          <path d="M12 36 Q6 40 5 38 M24 36 Q30 40 31 38" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.25" />
        </svg>
      </div>

      {/* Red ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/8 blur-[130px] animate-red-pulse" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-red-800/15 blur-[100px]" />

      {/* Main spider-themed card */}
      <div className="relative w-full max-w-[420px] z-10 animate-scale-in">
        <div className="rounded-3xl bg-black/70 backdrop-blur-2xl border border-red-800/40 p-8 md:p-10 shadow-[0_0_80px_rgba(220,38,38,0.1)] relative overflow-hidden">
          {/* Inner web corner */}
          <svg className="absolute top-0 right-0 w-28 h-28 opacity-[0.08]" viewBox="0 0 120 120">
            <path d="M120 0 Q90 12 60 0 Q75 30 60 60 Q30 45 0 60 Q15 30 0 0" fill="none" stroke="#dc2626" strokeWidth="0.6" />
            <path d="M120 0 L60 0 M120 0 L120 60 M120 0 L80 40" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-28 h-28 opacity-[0.08]" viewBox="0 0 120 120">
            <path d="M0 120 Q30 108 60 120 Q45 90 60 60 Q90 75 120 60 Q105 90 120 120" fill="none" stroke="#dc2626" strokeWidth="0.6" />
            <path d="M0 120 L60 120 M0 120 L0 60 M0 120 L40 80" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
          </svg>

          {/* Red accent top bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" style={{ animation: 'webShoot 1.5s ease-out 0.3s forwards' }} />

          {/* Logo with spider energy */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-3">
              <div className="absolute inset-0 rounded-full bg-red-500/25 blur-[30px] scale-[1.8] animate-red-pulse" />
              <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-900 border-2 border-red-400/40 shadow-[0_0_40px_rgba(220,38,38,0.4)]">
                <Image src="/92lr.png" alt="92lr" width={44} height={44} className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              </div>
            </div>
            <h1 className="text-xl font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-300 to-white">92lr</h1>
            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-red-400/50 mt-2">Spider-Sense Security</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="block w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/30 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] focus:ring-1 focus:ring-red-500/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/30 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] focus:ring-1 focus:ring-red-500/20 transition-all"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-xs font-semibold text-red-400 animate-fade-in flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                {error}
              </div>
            )}

            {/* Web-shooting button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-12 rounded-xl font-bold text-xs uppercase tracking-[0.25em] overflow-visible disabled:cursor-not-allowed disabled:opacity-50"
            >
              {/* Rappelling spider */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-y-0 translate-y-2 z-20">
                <svg width="14" height="24" viewBox="0 0 14 24" className="drop-shadow-[0_0_6px_rgba(220,38,38,0.5)]">
                  <line x1="7" y1="0" x2="7" y2="10" stroke="#dc2626" strokeWidth="0.5" opacity="0.6" />
                  <ellipse cx="7" cy="16" rx="4" ry="5.5" fill="#dc2626" opacity="0.7" />
                  <circle cx="7" cy="13" r="2.5" fill="#dc2626" opacity="0.8" />
                  <circle cx="7" cy="12" r="1" fill="#111" opacity="0.7" />
                  <path d="M3 16 Q1 13 1.5 11 M11 16 Q13 13 12.5 11" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.5" />
                </svg>
              </span>
              {/* Pulsing glow ring */}
              <span className="absolute inset-[-4px] rounded-[16px] border-2 border-red-500/0 group-hover:border-red-500/30 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-700" />
              {/* Corner web arcs */}
              <span className="absolute -top-1 -left-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <svg viewBox="0 0 16 16" className="w-full h-full">
                  <path d="M16 0 Q12 2 8 0 Q10 4 8 8 Q4 6 0 8 Q2 4 0 0" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.6" />
                  <path d="M16 0 L8 0 M16 0 L16 8" stroke="#dc2626" strokeWidth="0.7" opacity="0.4" />
                </svg>
              </span>
              <span className="absolute -top-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <svg viewBox="0 0 16 16" className="w-full h-full">
                  <path d="M0 0 Q4 2 8 0 Q6 4 8 8 Q4 6 0 8" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.6" />
                  <path d="M0 0 L8 0 M0 0 L0 8" stroke="#dc2626" strokeWidth="0.7" opacity="0.4" />
                </svg>
              </span>
              <span className="absolute -bottom-1 -left-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <svg viewBox="0 0 16 16" className="w-full h-full">
                  <path d="M16 16 Q12 14 8 16 Q10 12 8 8 Q4 10 0 8" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.6" />
                  <path d="M16 16 L8 16 M16 16 L16 8" stroke="#dc2626" strokeWidth="0.7" opacity="0.4" />
                </svg>
              </span>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <svg viewBox="0 0 16 16" className="w-full h-full">
                  <path d="M0 16 Q4 14 8 16 Q6 12 8 8 Q10 10 16 8" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.6" />
                  <path d="M0 16 L8 16 M0 16 L0 8" stroke="#dc2626" strokeWidth="0.7" opacity="0.4" />
                </svg>
              </span>
              {/* Web-shoot streak */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {/* Top web line */}
              <span className="absolute top-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
              {/* Bottom web line */}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className="relative flex items-center justify-center gap-2.5 text-white">
                <svg className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 9L22 9L16.5 14L19 22L12 17L5 22L7.5 14L2 9L9 9L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Authenticating</span></>
                ) : (
                  <span>Access Console</span>
                )}
              </span>
            </button>
          </form>

          {/* Spider-web divider */}
          <div className="flex items-center gap-3 my-6">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
            <svg width="14" height="14" viewBox="0 0 14 14" className="opacity-30">
              <ellipse cx="7" cy="7" rx="3.5" ry="4.5" fill="#dc2626" opacity="0.5" />
              <circle cx="7" cy="6" r="2" fill="#dc2626" opacity="0.6" />
              <path d="M3.5 7 Q1.5 6 2.5 4.5 M10.5 7 Q12.5 6 11.5 4.5" stroke="#dc2626" strokeWidth="0.8" fill="none" opacity="0.4" />
            </svg>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
          </div>

          {/* Register link - masked hero style */}
          <Link
            href="/register"
            className="group relative flex items-center justify-center gap-2 h-11 rounded-xl border border-red-900/30 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-300 hover:border-red-500/30 transition-all overflow-hidden"
          >
            <span className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500" />
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            Create Account
          </Link>
        </div>

        {/* Great power quote */}
        <p className="text-center mt-5 text-[8px] font-semibold uppercase tracking-[0.3em] text-neutral-600">
          With great access comes great responsibility
        </p>
      </div>
    </div>
  );
}
