"use client";

import { useEffect, useState } from "react";
import { 
  Fingerprint, 
  ArrowRight, 
  Activity, 
  Shield, 
  Zap, 
  Globe, 
  Database,
  Terminal
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [ping, setPing] = useState(36);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      setPing(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + change;
        return Math.max(26, Math.min(54, next));
      });
    }, 2000);

    return () => clearInterval(pingInterval);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col relative bg-[#030307]">
      {/* Header */}
      <header className="w-full h-20 border-b border-white/5 bg-black/25 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Fingerprint className="h-5.5 w-5.5 text-white" />
          </div>
          <span className="text-base font-extrabold text-white tracking-widest bg-clip-text bg-gradient-to-r from-white to-neutral-400 uppercase">92lr</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary cursor-pointer shadow-md"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 grid md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full shadow-sm animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
              Emulator Bypass Control Center
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
            The Ultimate <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-white">
              Bypass & Resource
            </span><br />
            Dashboard.
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-[55ch] leading-relaxed font-medium">
            Manage, extend, and monitor emulator bypass clients in real-time. Secure registration systems, credit allocations, and interactive database modules built on premium glassmorphism.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary cursor-pointer shadow-[0_4px_25px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 transition-transform"
            >
              Access Console
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-secondary cursor-pointer hover:-translate-y-0.5 transition-transform"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Hero Interactive Widget */}
        <div className="md:col-span-5 flex justify-center animate-scale-in">
          <div className="w-full max-w-[360px] rounded-2xl glass-panel p-6 shadow-2xl space-y-5 border border-white/5 relative overflow-hidden">
            {/* Pulsing Sonar Glow */}
            <div className="absolute top-5 right-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400">Live Client</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-400 font-extrabold text-[10px] uppercase tracking-wider border-b border-white/5 pb-3">
              <Terminal className="h-4 w-4 text-indigo-400" />
              <span>Bypass Environment</span>
            </div>

            {/* Widget Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-center rounded-xl bg-black/30 border border-white/5 p-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Bypass State</span>
                <span className="text-xs font-bold text-neutral-200">Engaged (Secure)</span>
              </div>
              <div className="flex justify-between items-center rounded-xl bg-black/30 border border-white/5 p-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Client Latency</span>
                <span className="text-xs font-bold font-mono text-indigo-300 tabular-nums">
                  {ping} ms
                </span>
              </div>
              <div className="flex justify-between items-center rounded-xl bg-black/30 border border-white/5 p-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Tunnels</span>
                <span className="text-xs font-mono font-bold text-emerald-400">3 Connected</span>
              </div>
            </div>

            <div className="text-[9px] font-semibold text-neutral-500 text-center leading-normal">
              Simulated connections dynamically synchronized via secure API tunnels.
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section className="border-t border-white/5 bg-white/[0.01] py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Engine Features</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Built for speed, styled for convenience.</h3>
            <p className="text-sm text-neutral-400">
              Explore the advanced suite of utilities engineered to optimize and secure your access database.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: "Real-time Monitor",
                desc: "Monitor tunnel durations, dynamic latency metrics, and bandwidth data synchronization."
              },
              {
                icon: Shield,
                title: "Win 10/11 Security",
                desc: "High-grade client integration bypass designed specifically for Windows environments."
              },
              {
                icon: Globe,
                title: "Central Audit Logs",
                desc: "A tamper-proof ledger tracking user creations, password updates, and credit resets."
              },
              {
                icon: Database,
                title: "Frosted Analytics",
                desc: "View clear donut charts, metrics tabs, and status allocation widgets dynamically."
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="rounded-2xl glass-card p-6 border border-white/5 shadow-lg space-y-4 hover:-translate-y-1 hover:border-indigo-500/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{feat.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40 py-8 text-center text-xs text-neutral-500 font-semibold uppercase tracking-wider relative z-10 mt-auto">
        &copy; {new Date().getFullYear()} 92lr. All rights reserved. Built with NextJS & Glassmorphism.
      </footer>
    </div>
  );
}
