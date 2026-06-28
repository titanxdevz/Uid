"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  Activity, 
  CreditCard, 
  Fingerprint, 
  Copy, 
  Check, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import Link from "next/link";

type CreditsData = {
  total: number;
  used: number;
  remaining: number;
};

type Resource = {
  _id: string;
  uid: string;
  label?: string;
  owner: { _id: string; name: string; email: string };
  status: string;
  expiresAt?: string;
  createdAt: string;
};

type AuditEntry = {
  _id: string;
  action: string;
  actor: { _id: string; name: string; email: string };
  targetType?: string;
  createdAt: string;
};

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  active: "success",
  expired: "warning",
  revoked: "destructive",
  suspended: "destructive",
};

const gradientMap: Record<string, string> = {
  "#22c55e": "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)] border border-emerald-400/30", 
  "#f59e0b": "bg-gradient-to-t from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)] border border-amber-400/30", 
  "#ef4444": "bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.35)] border border-rose-400/30", 
  "#a855f7": "bg-gradient-to-t from-purple-600 to-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)] border border-purple-400/30", 
};

function DonutChart({ used, total, size = 140 }: { used: number; total: number; size?: number }) {
  const pct = total ? (used / total) * 100 : 0;
  const r = 46;
  const cx = 60;
  const cy = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]">
      <defs>
        <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={7} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#donutGradient)"
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="relative pt-6">
      {/* Background grid lines */}
      <div className="absolute inset-x-0 bottom-[26px] top-6 flex flex-col justify-between pointer-events-none opacity-20">
        <div className="border-t border-white/5 w-full" />
        <div className="border-t border-white/5 w-full" />
        <div className="border-t border-white/5 w-full" />
      </div>

      <div className="flex items-end gap-5 h-[140px] relative z-10">
        {data.map((bar) => {
          const gradClass = gradientMap[bar.color] || "bg-neutral-500";
          return (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-bold text-neutral-200 font-mono tabular-nums">{bar.value}</span>
              <div className="relative w-full rounded-t-xl bg-black/40 border border-white/5 h-24 overflow-hidden">
                <div
                  className={cn("absolute bottom-0 w-full rounded-t-lg transition-all duration-[800ms] ease-out", gradClass)}
                  style={{
                    height: `${(bar.value / max) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{bar.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveConnectionMonitor({ activeUIDs }: { activeUIDs: string[] }) {
  const [ping, setPing] = useState(42);
  const [sessionTime, setSessionTime] = useState(8085); // 02:14:45 in seconds
  const [dataUp, setDataUp] = useState(42.5);
  const [dataDown, setDataDown] = useState(180.2);

  useEffect(() => {
    // Latency fluctuation
    const pingInterval = setInterval(() => {
      setPing(prev => {
        const change = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const next = prev + change;
        return Math.max(28, Math.min(62, next));
      });
    }, 2500);

    // Session timer ticking & data consumption simulation
    const timerInterval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setDataUp(prev => prev + parseFloat((Math.random() * 0.05).toFixed(3)));
      setDataDown(prev => prev + parseFloat((Math.random() * 0.15).toFixed(3)));
    }, 1000);

    return () => {
      clearInterval(pingInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-2xl space-y-6 relative overflow-hidden border border-white/5">
      {/* Pulse Status Indicator */}
      <div className="absolute top-5 right-6 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400 font-sans">Synced</span>
      </div>

      <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-4">
        ⚡ Live Session & Connection Monitor
      </h2>

      {/* Latency & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/5 bg-black/35 p-3.5 shadow-inner">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Latency / Ping</div>
          <div className="text-xl font-black text-white font-mono mt-1.5 transition-all duration-300 tabular-nums">
            {ping} <span className="text-xs font-extrabold text-indigo-400 font-sans uppercase">ms</span>
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-black/35 p-3.5 shadow-inner">
          <div className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Tunnel Duration</div>
          <div className="text-xl font-black text-white font-mono mt-1.5 tabular-nums">
            {formatTime(sessionTime)}
          </div>
        </div>
      </div>

      {/* Bandwidth Counters */}
      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
            <ArrowUpRight className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Uploaded</div>
            <div className="text-sm font-extrabold text-neutral-200 font-mono mt-0.5 tabular-nums">
              {dataUp.toFixed(2)} <span className="text-[9px] text-neutral-500 font-sans">MB</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-sm">
            <ArrowDownRight className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Downloaded</div>
            <div className="text-sm font-extrabold text-neutral-200 font-mono mt-0.5 tabular-nums">
              {dataDown.toFixed(2)} <span className="text-[9px] text-neutral-500 font-sans">MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tunnels List */}
      <div className="border-t border-white/5 pt-4 space-y-3">
        <div className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">Active UIDs</div>
        {activeUIDs.length === 0 ? (
          <p className="text-xs text-neutral-500 font-bold italic">No active bypass connection detected.</p>
        ) : (
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {activeUIDs.map((uid) => (
              <div key={uid} className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <code className="text-xs font-mono font-bold text-indigo-300">{uid}</code>
                </div>
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [credits, setCredits] = useState<CreditsData | null>(null);
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const isAdmin = session?.user?.role === "admin" || session?.user?.role === "manager";

    Promise.all([
      fetch("/api/credits").then((r) => r.json()),
      fetch("/api/resources?limit=5").then((r) => r.json()),
      fetch("/api/resources?limit=1000").then((r) => r.json()),
      isAdmin ? fetch("/api/audit?limit=5").then((r) => r.json()) : Promise.resolve(null),
    ])
      .then(([c, r5, rAll, a]) => {
        if (c.success) setCredits(c.data);
        if (r5.success) setRecentResources(r5.data.resources);
        if (rAll.success) setAllResources(rAll.data.resources);
        if (a?.success) setRecentActivity(a.data.logs);
      })
      .finally(() => setLoading(false));
  }, [session]);

  function copyUid(uid: string, id: string) {
    navigator.clipboard.writeText(uid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const usedPercent = credits?.total ? Math.round((credits.used / credits.total) * 100) : 0;
  const remainingPercent = credits?.total ? Math.round((credits.remaining / credits.total) * 100) : 0;

  const isAdmin = session?.user?.role === "admin" || session?.user?.role === "manager";

  const statusCounts = {
    active: allResources.filter((r) => r.status === "active").length,
    expired: allResources.filter((r) => r.status === "expired").length,
    revoked: allResources.filter((r) => r.status === "revoked").length,
    suspended: allResources.filter((r) => r.status === "suspended").length,
  };

  const barData = [
    { label: "Active", value: statusCounts.active, color: "#22c55e" },
    { label: "Expired", value: statusCounts.expired, color: "#f59e0b" },
    { label: "Revoked", value: statusCounts.revoked, color: "#ef4444" },
    { label: "Suspended", value: statusCounts.suspended, color: "#a855f7" },
  ];

  const totalResources = allResources.length;
  const activeResources = statusCounts.active;

  // Compute active UIDs list
  const activeUIDList = allResources.filter(r => r.status === "active").map(r => r.uid);

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
            Welcome back, {session?.user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-400 font-medium">
            Here&apos;s a quick overview of your UID manager metrics.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/management"
            className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] backdrop-blur-md px-5 h-11 text-sm font-bold text-neutral-200 hover:text-white hover:border-indigo-500/25 transition-all duration-300 shadow-lg cursor-pointer"
          >
            Management Panel
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md p-6 h-36" />
            ))}
          </>
        ) : (
          <>
            {/* Card 1 */}
            <div className="relative group overflow-hidden rounded-2xl glass-card p-6 shadow-xl hover:-translate-y-1 hover:border-emerald-500/20">
              <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              <div className="mb-4 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Credits Remaining
                </span>
                <div className="rounded-xl bg-emerald-500/10 p-2.5 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-white relative z-10 tracking-tight font-mono">{credits?.remaining ?? 0}</div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/40 border border-white/5 relative z-10 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-[1000ms] ease-out"
                  style={{ width: `${remainingPercent}%` }}
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group overflow-hidden rounded-2xl glass-card p-6 shadow-xl hover:-translate-y-1 hover:border-amber-500/20">
              <div className="absolute -inset-px bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              <div className="mb-4 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Credits Used
                </span>
                <div className="rounded-xl bg-amber-500/10 p-2.5 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                  <Activity className="h-4.5 w-4.5 text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-white relative z-10 tracking-tight font-mono">{credits?.used ?? 0}</div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/40 border border-white/5 relative z-10 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] transition-all duration-[1000ms] ease-out"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group overflow-hidden rounded-2xl glass-card p-6 shadow-xl hover:-translate-y-1 hover:border-indigo-500/20">
              <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              <div className="mb-4 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Total Credits
                </span>
                <div className="rounded-xl bg-indigo-500/10 p-2.5 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                  <CreditCard className="h-4.5 w-4.5 text-indigo-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-white relative z-10 tracking-tight font-mono">{credits?.total ?? 0}</div>
              <p className="mt-3 text-xs font-bold text-neutral-400 uppercase tracking-widest relative z-10">
                <span className="text-indigo-400">{credits?.used ?? 0}</span> used &bull; <span className="text-indigo-300">{credits?.remaining ?? 0}</span> left
              </p>
            </div>

            {/* Card 4 */}
            <div className="relative group overflow-hidden rounded-2xl glass-card p-6 shadow-xl hover:-translate-y-1 hover:border-purple-500/20">
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              <div className="mb-4 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                  Active UIDs
                </span>
                <div className="rounded-xl bg-purple-500/10 p-2.5 border border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                  <Fingerprint className="h-4.5 w-4.5 text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-black text-white relative z-10 tracking-tight font-mono">{activeResources}</div>
              <p className="mt-3 text-xs font-bold text-neutral-400 uppercase tracking-widest relative z-10">
                <span className="text-purple-400">{totalResources}</span> total registered
              </p>
            </div>
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-2xl glass-panel p-6 shadow-2xl">
            <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-neutral-400">Resources by Status</h2>
            <BarChart data={barData} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl glass-panel p-6 shadow-2xl h-full flex flex-col justify-between">
            <h2 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-neutral-400">Credit Allocation</h2>
            <div className="flex flex-col items-center py-4">
              <div className="relative">
                <DonutChart used={credits?.used ?? 0} total={credits?.total ?? 0} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-black text-white tracking-tight font-mono">{usedPercent}%</div>
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">used</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex w-full justify-center gap-6 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    Used: <span className="text-neutral-200 font-mono font-semibold text-xs ml-1">{credits?.used ?? 0}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                  <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                    Left: <span className="text-neutral-200 font-mono font-semibold text-xs ml-1">{credits?.remaining ?? 0}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables & Live Monitor Grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl glass-panel shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 bg-white/[0.01]">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Recent UIDs</h2>
              <Link
                href="/uids"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest decoration-2 hover:underline underline-offset-4"
              >
                Manage UIDs
              </Link>
            </div>
            {loading ? (
              <div className="space-y-4 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.01]" />
                ))}
              </div>
            ) : recentResources.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-neutral-500">
                <Fingerprint className="h-10 w-10 text-neutral-600 animate-pulse" />
                <p className="text-sm font-semibold uppercase tracking-wider text-xs">No UIDs registered</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.005]">
                      <th className="px-6 py-4.5 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        UID
                      </th>
                      <th className="px-6 py-4.5 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Label
                      </th>
                      <th className="px-6 py-4.5 text-left text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Status
                      </th>
                      <th className="px-6 py-4.5 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentResources.map((r) => (
                      <tr
                        key={r._id}
                        className="border-b border-white/[0.03] transition-colors last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <code className="rounded-lg bg-black/40 border border-white/5 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300 shadow-inner">
                              {r.uid}
                            </code>
                            <button
                              onClick={() => copyUid(r.uid, r._id)}
                              className="text-neutral-500 transition hover:text-white cursor-pointer select-none"
                            >
                              {copiedId === r._id ? (
                                <Check className="h-4 w-4 text-emerald-400 animate-scale-in" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-300 font-semibold">{r.label ?? "—"}</td>
                        <td className="px-6 py-4">
                          <Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize border font-bold">
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-neutral-400 font-mono font-semibold tabular-nums">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="rounded-2xl glass-panel shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 bg-white/[0.01]">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Recent Activity</h2>
                <Link
                  href="/management"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest decoration-2 hover:underline underline-offset-4"
                >
                  Central Logs
                </Link>
              </div>
              {loading ? (
                <div className="space-y-4 p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.01]" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-neutral-500">
                  <Activity className="h-10 w-10 text-neutral-600" />
                  <p className="text-sm font-semibold uppercase tracking-wider text-xs">No recent actions</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {recentActivity.map((log) => (
                    <div key={log._id} className="flex items-center gap-4 px-6 py-4.5 hover:bg-white/[0.01] transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-neutral-300 font-semibold">
                          <span className="text-white">{log.actor?.name}</span>
                          <span className="text-neutral-400 font-medium">
                            {" "}
                            {log.action.replace(".", " ")}
                          </span>
                          {log.targetType && (
                            <span className="text-neutral-400 font-medium"> on <span className="text-indigo-400 font-bold">{log.targetType}</span></span>
                          )}
                        </p>
                      </div>
                      <time className="shrink-0 text-xs text-neutral-500 font-mono font-semibold tabular-nums">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side Panel: Live Connection Monitor & Account Info */}
        <div className="lg:col-span-3 space-y-6">
          <LiveConnectionMonitor activeUIDs={activeUIDList} />

          <div className="rounded-2xl glass-panel p-6 shadow-2xl space-y-6">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-4">Account Information</h2>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
                  Access Level
                </p>
                <Badge className="mt-2 capitalize bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full font-bold text-xs shadow-sm">
                  {session?.user?.role}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
                  Email
                </p>
                <p className="mt-2 text-sm font-bold text-neutral-200">{session?.user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">
                  Credits Consumption
                </p>
                <p className="mt-2 text-sm font-bold text-neutral-200 font-mono">
                  {credits?.used ?? 0} <span className="text-neutral-600 font-normal">/</span> {credits?.total ?? 0}
                </p>
                <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-black/40 border border-white/5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all duration-[1000ms] ease-out"
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
              </div>
              <div className="border-t border-white/5 pt-5">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs font-extrabold uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
