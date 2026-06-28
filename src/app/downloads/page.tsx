"use client";

import {
  Download,
  Info,
  Laptop,
  Zap,
  ShieldCheck,
  Globe,
  LayoutGrid,
  ShieldAlert,
} from "lucide-react";

export default function DownloadsPage() {
  return (
    <div className="relative max-w-7xl mx-auto space-y-8 min-h-screen text-white">
      {/* Info Banner - Frosty blue */}
      <div className="flex items-center gap-3.5 p-4.5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 backdrop-blur-md shadow-lg animate-fade-in">
        <Info className="h-5 w-5 text-indigo-400 shrink-0" />
        <div className="text-sm font-semibold text-indigo-200">
          <span className="font-extrabold uppercase tracking-widest text-[10px] mr-2.5 px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30">LATEST</span>
          Uid Bypass OB54 Update Live & Secure!
        </div>
      </div>

      {/* Hero Card */}
      <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl space-y-4 relative overflow-hidden">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-sm">
          <Zap className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          Next-Gen Bypass Tools
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-2">
          Downloads & Integrations
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-[70ch] leading-relaxed font-medium">
          Download the official 92lr UID Bypass client for Windows. Stay updated with the latest security bypasses and automated injection tools.
        </p>
      </div>

      {/* Centered card containing the download client */}
      <div className="max-w-2xl mx-auto w-full">
        {/* Bypass Client Card */}
        <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl p-8 shadow-2xl space-y-8 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-[0_15px_40px_rgba(99,102,241,0.06)] transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
                <Laptop className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase shadow-sm">
                Windows 10 / 11
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Global Bypass Client</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium">
                The core client executable program optimized to bypass emulator blocklists and establish secure tunnels.
              </p>
            </div>

            {/* Features capsules (2x2 grid) */}
            <div className="grid gap-4 grid-cols-2">
              {[
                { label: "1-Click Operation", icon: Zap, color: "text-amber-400" },
                { label: "Auto-Updates", icon: ShieldCheck, color: "text-emerald-400" },
                { label: "Web Synced", icon: Globe, color: "text-blue-400" },
                { label: "Tray Integration", icon: LayoutGrid, color: "text-purple-400" },
              ].map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-white/5 bg-black/40 hover:bg-black/55 hover:border-white/10 transition-all duration-200 shadow-inner"
                  >
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${f.color}`} />
                    <span className="text-xs text-neutral-300 font-bold tracking-wide truncate">{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/5">
            {/* Download Link to our local copy */}
            <a
              href="/92lr UID Bypass.exe"
              download="92lr UID Bypass.exe"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold glass-button-primary cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.2)]"
            >
              <Download className="h-4.5 w-4.5" />
              Download Global Client
            </a>
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold glass-button-secondary cursor-pointer"
            >
              <ShieldAlert className="h-4.5 w-4.5 text-emerald-400" />
              Generate Custom EXE Builder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
