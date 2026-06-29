"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Activity,
  CreditCard,
  Fingerprint,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Gauge,
  Server,
  Shield,
  Clock,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Bell,
  Plus,
  Search,
  Timer,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CreditsData = { total: number; used: number; remaining: number };

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

function MiniDonut({ used, total, size = 100 }: { used: number; total: number; size?: number }) {
  const pct = total ? (used / total) * 100 : 0;
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={6} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#donutGrad)"
        strokeWidth={7}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]"
      />
    </svg>
  );
}

function LiveMonitor({ activeUIDs }: { activeUIDs: string[] }) {
  const [ping, setPing] = useState(42);
  const [sessionTime, setSessionTime] = useState(8085);
  const [dataUp, setDataUp] = useState(42.5);
  const [dataDown, setDataDown] = useState(180.2);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      setPing(prev => Math.max(28, Math.min(62, prev + Math.floor(Math.random() * 9) - 4)));
    }, 2500);
    const timerInterval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setDataUp(prev => prev + parseFloat((Math.random() * 0.05).toFixed(3)));
      setDataDown(prev => prev + parseFloat((Math.random() * 0.15).toFixed(3)));
    }, 1000);
    return () => { clearInterval(pingInterval); clearInterval(timerInterval); };
  }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className="rounded-2xl bg-black/40 border border-red-900/20 p-5 space-y-4 relative overflow-hidden">
      <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">Live</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
        <Zap className="h-3.5 w-3.5 text-red-400" />
        Live Connection
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Ping", value: `${ping} ms`, icon: Gauge, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
          { label: "Uptime", value: fmt(sessionTime), icon: Clock, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-black/30 border border-white/5 p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`rounded-lg ${s.bg} p-1`}><Icon className={`h-3 w-3 ${s.color}`} /></div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">{s.label}</span>
              </div>
              <p className="text-lg font-black text-white font-mono tabular-nums">{s.value}</p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-1.5 text-rose-400">
            <ArrowUpRight className="h-3 w-3" />
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Up</p>
            <p className="text-xs font-bold text-neutral-200 font-mono tabular-nums">{dataUp.toFixed(1)} <span className="text-[9px] text-neutral-500">MB</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-1.5 text-rose-400">
            <ArrowDownRight className="h-3 w-3" />
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Down</p>
            <p className="text-xs font-bold text-neutral-200 font-mono tabular-nums">{dataDown.toFixed(1)} <span className="text-[9px] text-neutral-500">MB</span></p>
          </div>
        </div>
      </div>
      <div className="pt-2 border-t border-white/5">
        <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Active UIDs</p>
        {activeUIDs.length === 0 ? (
          <p className="text-[10px] text-neutral-500 italic">No active connections</p>
        ) : (
          <div className="space-y-1.5 max-h-24 overflow-y-auto">
            {activeUIDs.map((uid) => (
              <div key={uid} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.01] border border-white/5">
                <code className="text-[10px] font-mono font-bold text-red-300">{uid}</code>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-neutral-400 uppercase tracking-wider">{bar.label}</span>
            <span className="font-mono font-bold text-white tabular-nums">{bar.value}</span>
          </div>
          <div className="h-2 rounded-full bg-black/40 border border-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-[800ms] ease-out"
              style={{
                width: `${(bar.value / max) * 100}%`,
                background: bar.color,
                boxShadow: `0 0 10px ${bar.color}66`,
              }}
            />
          </div>
        </div>
      ))}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [uidValue, setUidValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [expiringSoon, setExpiringSoon] = useState<Resource[]>([]);

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

  useEffect(() => {
    setExpiringSoon(allResources.filter(r => {
      if (!r.expiresAt) return false;
      const days = (new Date(r.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 7;
    }));
  }, [allResources]);

  function copyUid(uid: string, id: string) {
    navigator.clipboard.writeText(uid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const handleCopyAll = useCallback(() => {
    const text = recentResources.map(r => r.uid).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedId("__all__");
    setTimeout(() => setCopiedId(null), 2000);
  }, [recentResources]);

  const handleCreateUid = useCallback(async () => {
    if (!uidValue.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uidValue.trim(), label: labelValue.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        const [r5, rAll] = await Promise.all([
          fetch("/api/resources?limit=5").then(r => r.json()),
          fetch("/api/resources?limit=1000").then(r => r.json()),
        ]);
        if (r5.success) setRecentResources(r5.data.resources);
        if (rAll.success) setAllResources(rAll.data.resources);
        setUidValue("");
        setLabelValue("");
      }
    } finally {
      setCreating(false);
    }
  }, [uidValue, labelValue]);

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
  const activeUIDList = allResources.filter(r => r.status === "active").map(r => r.uid);

  const filteredResources = searchQuery
    ? recentResources.filter(r =>
        r.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.label && r.label.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : recentResources;

  const actionLabel = (action: string) =>
    action.replace(".", " ").replace(/_/g, " ");

  const memberSince = "Member since";

  return (
    <div className="relative min-h-screen">
      {/* Spider web background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-[0.015]" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
          {[80, 160, 240, 320, 400].map((r, i) => (
            <circle key={`dw${i}`} cx="250" cy="250" r={r} fill="none" stroke="#dc2626" strokeWidth={0.3 - i * 0.05} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`dr${i}`} x1="250" y1="250" x2={250 + 350 * Math.cos(i * Math.PI / 6)} y2={250 + 350 * Math.sin(i * Math.PI / 6)} stroke="#dc2626" strokeWidth="0.12" opacity="0.2" />
          ))}
        </svg>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-red-600/5 blur-[120px] animate-red-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-red-800/4 blur-[100px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-full bg-red-500/15 blur-[10px]" />
              <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-900 border border-red-400/30 shadow-[0_0_12px_rgba(220,38,38,0.25)]">
                <Image src="/92lr.png" alt="92lr" width={22} height={22} className="object-contain" />
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500">Dashboard</p>
              <h1 className="text-xl font-black text-white tracking-tight">
                Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {session?.user?.name?.split(" ")[0]}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="capitalize bg-red-500/10 text-red-300 border border-red-500/20 rounded-lg px-2.5 py-1 text-[9px] font-bold tracking-wider">
              <Shield className="h-2.5 w-2.5 mr-1" />
              {session?.user?.role}
            </Badge>
            {isAdmin && (
              <Link
                href="/management"
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-red-900/25 bg-red-500/5 hover:bg-red-500/10 text-[9px] font-bold uppercase tracking-wider text-red-300 hover:text-red-200 transition-all"
              >
                <Settings className="h-3 w-3" />
                Admin
              </Link>
            )}
            <Link
              href="/profile"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/5 hover:bg-white/[0.03] text-[9px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-200 transition-all"
            >
              <User className="h-3 w-3" />
              Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-transparent hover:bg-rose-500/10 text-[9px] font-bold uppercase tracking-wider text-rose-400/70 hover:text-rose-300 transition-all cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* System status bar */}
        <div className="rounded-xl bg-gradient-to-r from-red-500/5 via-red-600/5 to-transparent border border-red-900/15 p-3 flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Spider-Sense Active</span>
          <span className="text-[10px] text-neutral-600">|</span>
          <span className="text-[10px] text-neutral-400 font-medium">All systems nominal &bull; {activeResources} active UIDs</span>
        </div>

        {/* UID count by status mini grid */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Total", value: totalResources, from: "from-amber-500/10", to: "to-amber-600/5", border: "border-amber-500/15", text: "text-amber-400" },
            { label: "Active", value: activeResources, from: "from-emerald-500/10", to: "to-emerald-600/5", border: "border-emerald-500/15", text: "text-emerald-400" },
            { label: "Expiring", value: expiringSoon.length, from: "from-yellow-500/10", to: "to-yellow-600/5", border: "border-yellow-500/15", text: "text-yellow-400" },
            { label: "Expired", value: statusCounts.expired, from: "from-red-500/10", to: "to-red-600/5", border: "border-red-500/15", text: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl bg-gradient-to-br ${s.from} ${s.to} border ${s.border} p-3`}>
              <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">{s.label}</p>
              <p className={`text-lg font-black font-mono tabular-nums ${s.text}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick UID inline creation */}
        <div className="rounded-xl bg-black/40 border border-red-900/20 p-4 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 shrink-0">
            <Plus className="h-3.5 w-3.5 text-red-400" />
            New UID
          </div>
          <input
            type="text"
            placeholder="UID code"
            value={uidValue}
            onChange={(e) => setUidValue(e.target.value)}
            className="flex-1 bg-black/40 border border-red-900/20 rounded-lg px-3 py-2 text-[11px] font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-500/30"
          />
          <input
            type="text"
            placeholder="Label (optional)"
            value={labelValue}
            onChange={(e) => setLabelValue(e.target.value)}
            className="flex-[2] bg-black/40 border border-red-900/20 rounded-lg px-3 py-2 text-[11px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-500/30"
          />
          <button
            onClick={handleCreateUid}
            disabled={creating || !uidValue.trim()}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-[9px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {creating ? "..." : <Plus className="h-3 w-3" />}
            {creating ? "Creating" : "Create"}
          </button>
        </div>

        {/* Quick actions row */}
        <div className="flex gap-3">
          {[
            { label: "My UIDs", href: "/uids", icon: Fingerprint },
            { label: "Downloads", href: "/downloads", icon: ArrowDownRight },
            { label: "Profile", href: "/profile", icon: User },
            { label: "Get Support", icon: Bell, disabled: true },
          ].map((action) => {
            const Icon = action.icon;
            if (action.disabled) {
              return (
                <div
                  key={action.label}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl bg-black/40 border border-red-900/20 text-[9px] font-bold uppercase tracking-wider text-neutral-600 opacity-50 cursor-default"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </div>
              );
            }
            return (
              <Link
                key={action.label}
                href={action.href!}
                className="flex items-center gap-2 h-9 px-4 rounded-xl bg-black/40 border border-red-900/20 hover:bg-red-500/5 hover:border-red-500/20 text-[9px] font-bold uppercase tracking-wider text-neutral-400 hover:text-red-300 transition-all"
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </Link>
            );
          })}
        </div>

        {/* Metric cards */}
        {loading ? (
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.01] h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Credits Remaining", value: credits?.remaining ?? 0, icon: Sparkles, grad: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/15", iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", barColor: "from-emerald-500 to-teal-400", pct: remainingPercent },
              { label: "Active UIDs", value: activeResources, icon: Fingerprint, grad: "from-red-500/10 to-red-600/5 border-red-500/15", iconBg: "bg-red-500/10 text-red-400 border-red-500/20", barColor: "from-red-500 to-rose-400", pct: totalResources ? (activeResources / totalResources) * 100 : 0 },
              { label: "Total Resources", value: totalResources, icon: Server, grad: "from-amber-500/10 to-amber-600/5 border-amber-500/15", iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20", barColor: "from-amber-500 to-orange-400", pct: 100 },
              { label: "Credits Used", value: credits?.used ?? 0, icon: TrendingUp, grad: "from-violet-500/10 to-violet-600/5 border-violet-500/15", iconBg: "bg-violet-500/10 text-violet-400 border-violet-500/20", barColor: "from-violet-500 to-purple-400", pct: usedPercent },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`relative rounded-2xl bg-gradient-to-br ${s.grad} border p-4 overflow-hidden group hover:-translate-y-0.5 transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">{s.label}</span>
                      {s.label === "Credits Used" && (
                        <span className="text-[7px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-1.5 py-0.5">
                          +{usedPercent}% this period
                        </span>
                      )}
                    </div>
                    <div className={`rounded-lg ${s.iconBg} p-1.5 border`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white font-mono tracking-tight tabular-nums">{s.value}</p>
                  <div className="mt-3 h-1.5 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.min(s.pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Status distribution pills row */}
        <div className="flex gap-2">
          {[
            { label: "Active", count: statusCounts.active, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
            { label: "Expired", count: statusCounts.expired, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
            { label: "Revoked", count: statusCounts.revoked, color: "bg-red-500/10 text-red-400 border-red-500/20" },
            { label: "Suspended", count: statusCounts.suspended, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
          ].map((s) => (
            <div key={s.label} className={`rounded-full ${s.color} border px-3 py-1 text-[9px] font-bold uppercase tracking-wider`}>
              {s.label} ({s.count})
            </div>
          ))}
        </div>

        {/* Main grid: charts + tables */}
        <div className="grid grid-cols-5 gap-5">
          {/* Left — resources bar chart */}
          <div className="col-span-3 rounded-2xl bg-black/40 border border-red-900/20 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-red-400" />
                Resources by Status
              </h2>
              <Link href="/uids" className="text-[9px] font-mono font-bold text-neutral-500 hover:text-red-400 transition-colors">
                {totalResources} total
              </Link>
            </div>
            <StatusBarChart data={barData} />
          </div>

          {/* Right — credit allocation donut */}
          <div className="col-span-2 rounded-2xl bg-black/40 border border-red-900/20 p-5 flex flex-col">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2 mb-4">
              <CreditCard className="h-3.5 w-3.5 text-red-400" />
              Credit Allocation
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative">
                <MiniDonut used={credits?.used ?? 0} total={credits?.total ?? 0} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-black text-white font-mono">{usedPercent}%</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-500">Used</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 mt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(220,38,38,0.6)]" />
                  <span className="text-[9px] font-bold text-neutral-400">Used <span className="text-white font-mono">{credits?.used ?? 0}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(220,38,38,0.6)]" />
                  <span className="text-[9px] font-bold text-neutral-400">Left <span className="text-white font-mono">{credits?.remaining ?? 0}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom grid: recent UIDs + live monitor + activity */}
        <div className="grid grid-cols-5 gap-5">
          {/* Recent UIDs — wider */}
          <div className="col-span-2 rounded-2xl bg-black/40 border border-red-900/20 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/10">
              <div className="flex items-center gap-2">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                  <Fingerprint className="h-3.5 w-3.5 text-red-400" />
                  Recent UIDs
                </h2>
                <button
                  onClick={handleCopyAll}
                  className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  title="Copy all UIDs"
                >
                  {copiedId === "__all__" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-28 bg-black/40 border border-red-900/20 rounded-lg pl-6 pr-2 py-1 text-[10px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-red-500/30"
                  />
                </div>
                <Link href="/uids" className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors shrink-0">
                  View All
                </Link>
              </div>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-white/[0.01]" />)}
              </div>
            ) : recentResources.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-neutral-500">
                <Fingerprint className="h-8 w-8 text-neutral-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider">No UIDs yet</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-neutral-500">
                <Search className="h-8 w-8 text-neutral-600" />
                <p className="text-[10px] font-bold uppercase tracking-wider">No results</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.03]">
                {filteredResources.map((r) => (
                  <div key={r._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.01] transition-colors">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <code className="text-[11px] font-mono font-bold text-red-300 truncate">{r.uid}</code>
                      <button
                        onClick={() => copyUid(r.uid, r._id)}
                        className="text-neutral-500 hover:text-white transition-colors shrink-0 cursor-pointer"
                      >
                        {copiedId === r._id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-semibold truncate max-w-[100px]">{r.label || "—"}</span>
                    <Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize text-[8px] font-bold px-2 py-0.5 border">
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live monitor */}
          <div className="col-span-1">
            <LiveMonitor activeUIDs={activeUIDList} />
          </div>

          {/* Recent activity + account info */}
          <div className="col-span-2 space-y-5">
            {/* Account card */}
            <div className="rounded-2xl bg-black/40 border border-red-900/20 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 border border-red-500/20 flex items-center justify-center text-sm font-bold text-red-400">
                  {session?.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
                  <p className="text-[10px] text-neutral-500 truncate">{session?.user?.email}</p>
                  <p className="text-[9px] text-neutral-600 mt-0.5 flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />
                    {memberSince}
                  </p>
                </div>
                <Badge className="capitalize bg-red-500/10 text-red-300 border-red-500/20 rounded-lg text-[8px] font-bold px-2">
                  <Shield className="h-2.5 w-2.5 mr-1" />
                  {session?.user?.role}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider">Credit Usage</span>
                  <span className="font-mono font-bold text-white">{credits?.used ?? 0} / {credits?.total ?? 0}</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/40 border border-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-1000" style={{ width: `${usedPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Expiring soon UIDs widget */}
            {expiringSoon.length > 0 ? (
              <div className="rounded-2xl bg-black/40 border border-red-900/20 p-5">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2 mb-3">
                  <Timer className="h-3.5 w-3.5 text-red-400" />
                  Expiring Soon
                </h2>
                <div className="space-y-2">
                  {expiringSoon.slice(0, 5).map((r) => (
                    <div key={r._id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.01] border border-white/5">
                      <div className="min-w-0 flex-1">
                        <code className="text-[10px] font-mono font-bold text-red-300 truncate block">{r.uid}</code>
                        {r.label && <p className="text-[8px] text-neutral-500 truncate">{r.label}</p>}
                      </div>
                      <span className="text-[9px] text-yellow-400 font-mono shrink-0 ml-2">
                        {new Date(r.expiresAt!).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-black/40 border border-red-900/20 p-5">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2 mb-3">
                  <Timer className="h-3.5 w-3.5 text-red-400" />
                  Expiring Soon
                </h2>
                <p className="text-[10px] text-neutral-500 italic">No resources expiring soon</p>
              </div>
            )}

            {/* Recent activity */}
            {isAdmin && (
              <div className="rounded-2xl bg-black/40 border border-red-900/20 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-red-900/10">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-red-400" />
                    Activity
                  </h2>
                  <Link href="/management" className="text-[9px] font-bold text-red-400 hover:text-red-300 uppercase tracking-wider transition-colors">
                    All Logs
                  </Link>
                </div>
                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-neutral-500">
                    <Activity className="h-6 w-6 text-neutral-600" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">No activity</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.03]">
                    {recentActivity.map((log) => (
                      <div key={log._id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.01] transition-colors">
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-1.5 text-red-400 shrink-0">
                          <Activity className="h-3 w-3" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-neutral-300 truncate">
                            <span className="font-bold text-white">{log.actor?.name}</span>
                            <span className="text-neutral-500"> {actionLabel(log.action)}</span>
                            {log.targetType && <span className="text-red-400 font-bold"> on {log.targetType}</span>}
                          </p>
                        </div>
                        <time className="text-[9px] text-neutral-500 font-mono shrink-0 tabular-nums">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
