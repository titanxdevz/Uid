"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Check } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.error || "Registration failed");
      setLoading(false);
    } else {
      setStep(2);
      setTimeout(() => router.push("/"), 1800);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#030307] overflow-hidden">
      {/* Massive expanding web burst */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 500 500">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`rw${i}`} x1="250" y1="250" x2={250 + 350 * Math.cos(i * Math.PI / 10)} y2={250 + 350 * Math.sin(i * Math.PI / 10)} stroke="#dc2626" strokeWidth="0.3" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${3 + i % 3}s`} repeatCount="indefinite" />
          </line>
        ))}
        {[50, 100, 150, 200, 250, 300].map((r, i) => (
          <circle key={`cw${i}`} cx="250" cy="250" r={r} fill="none" stroke="#dc2626" strokeWidth={0.5 - i * 0.07}>
            <animate attributeName="r" values={`${r};${r + 30};${r}`} dur={`${5 + i * 1.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur={`${5 + i * 1.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Animated web strands sweeping across */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
        <path d="M0 250 Q100 200 200 250 Q300 300 400 250 Q450 220 500 250" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.08" strokeDasharray="30 15">
          <animate attributeName="stroke-dashoffset" from="0" to="-90" dur="3s" repeatCount="indefinite" />
          <animate attributeName="d" values="M0 250 Q100 200 200 250 Q300 300 400 250 Q450 220 500 250;M0 250 Q100 300 200 250 Q300 200 400 250 Q450 280 500 250;M0 250 Q100 200 200 250 Q300 300 400 250 Q450 220 500 250" dur="5s" repeatCount="indefinite" />
        </path>
        <path d="M250 0 Q200 100 250 200 Q300 300 250 400 Q220 450 250 500" fill="none" stroke="#dc2626" strokeWidth="0.2" opacity="0.06" strokeDasharray="20 15">
          <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="4s" repeatCount="indefinite" />
        </path>
      </svg>

      {/* Spider crawling down the wall */}
      <div className="absolute top-6 left-[15%] hidden lg:block animate-spider-crawl z-10">
        <svg width="20" height="28" viewBox="0 0 20 28" className="opacity-15">
          <ellipse cx="10" cy="18" rx="6" ry="8" fill="#dc2626" />
          <circle cx="10" cy="14" r="4" fill="#dc2626" />
          <circle cx="10" cy="13" r="2" fill="#111" />
          <path d="M4 18 Q1 14 2 11 M16 18 Q19 14 18 11" stroke="#dc2626" strokeWidth="1.2" fill="none" />
          <path d="M5 22 Q2 26 1 24 M15 22 Q18 26 19 24" stroke="#dc2626" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* Red energy glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-red-600/8 blur-[130px] animate-red-pulse" />
      <div className="absolute -top-20 right-10 w-60 h-60 rounded-full bg-red-800/12 blur-[90px]" />

      {step === 1 ? (
        /* Registration Form */
        <div className="relative w-full max-w-[420px] z-10 animate-scale-in">
          <div className="rounded-3xl bg-black/70 backdrop-blur-2xl border border-red-800/40 p-8 md:p-10 shadow-[0_0_80px_rgba(220,38,38,0.1)] relative overflow-hidden">
            {/* Corner webs */}
            <svg className="absolute top-0 left-0 w-24 h-24 opacity-[0.06]" viewBox="0 0 100 100">
              <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L70 70" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
              <path d="M0 0 Q30 10 60 0 Q45 30 60 60 Q30 45 0 60" fill="none" stroke="#dc2626" strokeWidth="0.5" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.06]" viewBox="0 0 100 100">
              <path d="M100 100 L0 100 M100 100 L100 0 M100 100 L30 30" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
              <path d="M100 100 Q70 90 40 100 Q55 70 40 40 Q70 55 100 40" fill="none" stroke="#dc2626" strokeWidth="0.5" />
            </svg>

            {/* Red accent bottom bar */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" style={{ animation: 'webShoot 1.5s ease-out 0.3s forwards' }} />

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-3">
                <div className="absolute inset-0 rounded-full bg-red-500/25 blur-[30px] scale-[1.8] animate-red-pulse" />
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-900 border-2 border-red-400/40 shadow-[0_0_40px_rgba(220,38,38,0.4)]">
                  <Image src="/92lr.png" alt="92lr" width={44} height={44} className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </div>
              </div>
              <h1 className="text-xl font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-300 to-white">Join 92lr</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-red-400/50 mt-2">Origin Story</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="block w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/30 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] focus:ring-1 focus:ring-red-500/20 transition-all"
                />
              </div>

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
                  className="block w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/30 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] focus:ring-1 focus:ring-red-500/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="block w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/30 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(220,38,38,0.15)] focus:ring-1 focus:ring-red-500/20 transition-all"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-xs font-semibold text-red-400 animate-fade-in flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                  {error}
                </div>
              )}

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
                    <><Loader2 className="h-4 w-4 animate-spin" /><span className="tracking-[0.2em]">Creating</span></>
                  ) : (
                    <span className="tracking-[0.2em]">Activate Access</span>
                  )}
                </span>
              </button>
            </form>

            {/* Spider divider */}
            <div className="flex items-center gap-3 my-6">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
              <svg width="14" height="14" viewBox="0 0 14 14" className="opacity-30">
                <ellipse cx="7" cy="7" rx="3.5" ry="4.5" fill="#dc2626" opacity="0.5" />
                <circle cx="7" cy="6" r="2" fill="#dc2626" opacity="0.6" />
                <path d="M3.5 7 Q1.5 6 2.5 4.5 M10.5 7 Q12.5 6 11.5 4.5" stroke="#dc2626" strokeWidth="0.8" fill="none" opacity="0.4" />
              </svg>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
            </div>

            <Link
              href="/login"
              className="group relative flex items-center justify-center gap-2 h-11 rounded-xl border border-red-900/30 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-300 hover:border-red-500/30 transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-500" />
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              Sign In Instead
            </Link>
          </div>

          <p className="text-center mt-5 text-[8px] font-semibold uppercase tracking-[0.3em] text-neutral-600">
            Every hero has a beginning &bull; 92lr
          </p>
        </div>
      ) : (
        /* Success State - Spider bite glow */
        <div className="relative z-10 animate-scale-in text-center">
          <div className="rounded-3xl bg-black/70 backdrop-blur-2xl border border-red-500/30 p-12 shadow-[0_0_80px_rgba(220,38,38,0.15)] max-w-sm mx-auto relative overflow-hidden">
            {/* Web corner decorations */}
            <svg className="absolute top-0 right-0 w-20 h-20 opacity-[0.08]" viewBox="0 0 100 100">
              <path d="M100 0 Q70 10 40 0 Q55 30 40 40 Q70 25 100 40" fill="none" stroke="#dc2626" strokeWidth="0.5" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-20 h-20 opacity-[0.08]" viewBox="0 0 100 100">
              <path d="M0 100 Q30 90 60 100 Q45 70 60 60 Q30 75 0 60" fill="none" stroke="#dc2626" strokeWidth="0.5" />
            </svg>

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500/25 blur-[30px] scale-[1.8] animate-red-pulse" />
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-900 border-2 border-red-400/40 shadow-[0_0_40px_rgba(220,38,38,0.4)]">
                  <Check className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-black text-white tracking-wider uppercase">Activated</h2>
              <p className="text-xs text-neutral-400 max-w-[200px]">Your spider-sense is tingling. Redirecting...</p>
              <div className="w-32 h-[2px] bg-red-900/30 rounded-full overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-red-500 to-red-400 rounded-full animate-[loadingBar_1.2s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
