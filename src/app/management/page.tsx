"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Fingerprint,
  ScrollText,
  Plus,
  Search,
  Copy,
  Check,
  Loader2,
  X,
  Edit3,
  Shield,
  Activity,
  Clock,
  Trash2,
} from "lucide-react";
import Image from "next/image";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  creditsUsed: number;
  isActive: boolean;
  createdAt: string;
};

type Resource = {
  _id: string;
  uid: string;
  label?: string;
  owner: { _id: string; name: string; email: string };
  status: string;
  expiresAt?: string;
  createdBy: { _id: string; name: string };
  createdAt: string;
};

type AuditEntry = {
  _id: string;
  action: string;
  actor: { _id: string; name: string; email: string };
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
};

type Tab = "users" | "resources" | "audit";

const roleColors: Record<string, string> = {
  admin: "bg-red-500/15 text-red-300 border-red-500/25",
  manager: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  user: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  expired: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  revoked: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open) { requestAnimationFrame(() => setMounted(true)); }
    else { setMounted(false); }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-red-900/30 bg-[#0a0a14]/95 backdrop-blur-2xl p-6 md:p-8 shadow-[0_0_80px_rgba(220,38,38,0.15),0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-300 ${mounted ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:scale-95'}`}>
        {/* Red accent glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/15 blur-[60px] rounded-full pointer-events-none" />
        {/* Top web line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" style={{ animation: 'webShoot 0.6s ease-out forwards' }} />
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-black/40 border border-white/5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer">
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6 pr-8">{title}</h2>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

function ManagementContent() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("users");

  if (!session) return null;
  if (session.user?.role !== "admin" && session.user?.role !== "manager") return null;

  const tabs = [
    { id: "users" as Tab, label: "Users", icon: Users, count: null as number | null },
    { id: "resources" as Tab, label: "Resources", icon: Fingerprint, count: null },
    { id: "audit" as Tab, label: "Audit Log", icon: ScrollText, count: null },
  ];

  return (
    <div className="flex min-h-screen text-white relative overflow-hidden">
      {/* Background effects (shared) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-[0.015]" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice">
          {[80, 160, 240, 320, 400].map((r, i) => (
            <circle key={`dw${i}`} cx="250" cy="250" r={r} fill="none" stroke="#dc2626" strokeWidth={0.3 - i * 0.05} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`dr${i}`} x1="250" y1="250" x2={250 + 350 * Math.cos(i * Math.PI / 6)} y2={250 + 350 * Math.sin(i * Math.PI / 6)} stroke="#dc2626" strokeWidth="0.12" opacity="0.25" />
          ))}
        </svg>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-red-600/4 blur-[140px] animate-red-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-red-800/4 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[232px] z-20 flex flex-col border-r border-red-900/15 bg-[#080810]/85 backdrop-blur-2xl shadow-[4px_0_40px_rgba(0,0,0,0.5)]">
        {/* Sidebar corner webs */}
        <svg className="absolute top-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none" viewBox="0 0 160 160">
          <path d="M160 0 Q120 10 80 0 Q100 40 80 80 Q120 60 160 80 Q140 40 160 0Z" fill="none" stroke="#dc2626" strokeWidth="0.5" />
          <path d="M160 0 L80 0 M160 0 L160 80" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
        </svg>

        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 pt-7 pb-6 border-b border-red-900/10">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-[10px]" />
            <div className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-900 border border-red-400/25 shadow-[0_0_12px_rgba(220,38,38,0.25)]">
              <Image src="/92lr.png" alt="92lr" width={20} height={20} className="object-contain" />
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white">Admin</p>
            <p className="text-[9px] text-red-400/40 font-semibold tracking-widest uppercase">Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-5 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative w-full flex items-center gap-3 h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? "text-white"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-red-700/80 shadow-[0_0_20px_rgba(220,38,38,0.15)]" />
                )}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
                )}
                {!isActive && (
                  <span className="absolute inset-0 hover:bg-white/[0.03] transition-colors rounded-xl" />
                )}
                <Icon className="h-4 w-4 relative z-10 shrink-0" />
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Spidey silhouette */}
        <div className="px-4 pb-4">
          <div className="relative h-16 rounded-xl bg-gradient-to-b from-red-500/5 to-transparent border border-red-900/10 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]">
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <ellipse cx="50" cy="46" rx="18" ry="12" fill="#dc2626" />
                <circle cx="50" cy="40" r="7" fill="#dc2626" />
                <path d="M50 30 L30 8 M50 30 L70 8 M50 30 L40 14 M50 30 L60 14" stroke="#dc2626" strokeWidth="1" fill="none" />
              </svg>
            </div>
            <div className="relative z-10 flex flex-col justify-center h-full px-3">
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-red-400/40">With great power...</p>
            </div>
          </div>
        </div>

        {/* User info at bottom */}
        <div className="border-t border-red-900/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500/30 to-red-700/30 border border-red-500/20 flex items-center justify-center text-[10px] font-bold text-red-400 shrink-0">
              {getInitials(session.user?.name || "U")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-white truncate">{session.user?.name}</p>
              <p className="text-[8px] uppercase tracking-widest text-red-400/50 font-semibold">{session.user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex-1 ml-[232px]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 space-y-8 pb-16">
          {/* Stats overview cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Users", icon: Users, value: "—", color: "from-red-500/10 to-red-600/5 border-red-500/15", iconBg: "bg-red-500/10 text-red-400 border-red-500/20" },
              { label: "Active Resources", icon: Fingerprint, value: "—", color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/15", iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
              { label: "Audit Entries", icon: ScrollText, value: "—", color: "from-amber-500/10 to-amber-600/5 border-amber-500/15", iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`relative rounded-2xl bg-gradient-to-br ${s.color} border p-5 backdrop-blur-md shadow-lg overflow-hidden group hover:-translate-y-0.5 transition-all duration-300`}>
                  <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">{s.label}</p>
                      <p className="text-2xl font-black text-white mt-1.5 font-mono">{s.value}</p>
                    </div>
                    <div className={`rounded-xl ${s.iconBg} p-2.5 border shadow-sm`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="animate-fade-in">
            {tab === "users" && <UsersTab />}
            {tab === "resources" && <ResourcesTab />}
            {tab === "audit" && <AuditTab />}
          </div>
        </div>
      </div>

      {/* Fixed swinging spider on main area */}
      <div className="fixed top-16 right-[6%] z-10 pointer-events-none animate-swing">
        <svg width="18" height="30" viewBox="0 0 20 32" className="opacity-[0.08]">
          <line x1="10" y1="0" x2="10" y2="16" stroke="#dc2626" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="10" cy="22" rx="5" ry="7" fill="#dc2626" opacity="0.35" />
          <circle cx="10" cy="19" r="2.5" fill="#dc2626" opacity="0.45" />
        </svg>
      </div>
    </div>
  );
}

function TableSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="p-8 space-y-5 animate-pulse">
      <div className="flex gap-4 border-b border-white/5 pb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 flex-1 bg-white/5 rounded" />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3.5 border-b border-white/[0.03]">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 bg-white/5 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", credits: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [showEdit, setShowEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "user", credits: 0, isActive: true, password: "" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showMassEdit, setShowMassEdit] = useState(false);
  const [massEditForm, setMassEditForm] = useState({ role: "", isActive: true, credits: 0 });
  const [massEditing, setMassEditing] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/users?${params}`)
      .then((r) => r.json())
      .then((d) => d.success && setUsers(d.data.users))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredUsers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id)));
    }
  }

  const filteredUsers = users.filter((u) => u.name || u.email);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) {
        setShowAdd(false);
        setForm({ name: "", email: "", password: "", role: "user", credits: 0 });
        fetchUsers();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(u: User) {
    setShowEdit(u);
    setEditForm({ name: u.name, role: u.role, credits: u.credits, isActive: u.isActive, password: "" });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!showEdit) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { name: editForm.name, role: editForm.role, credits: editForm.credits, isActive: editForm.isActive };
      if (editForm.password) body.password = editForm.password;
      const res = await fetch(`/api/users/${showEdit.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json();
      if (d.success) { setShowEdit(null); fetchUsers(); }
      else alert(d.error || "Failed to update user");
    } catch { alert("An error occurred while saving user data."); }
    finally { setSubmitting(false); }
  }

  async function handleDeleteUser(id: string) {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) fetchUsers();
      else alert(d.error || "Failed to delete user");
    } catch { alert("Failed to delete user"); }
  }

  function openMassEdit() {
    setMassEditForm({ role: "", isActive: true, credits: 0 });
    setShowMassEdit(true);
  }

  async function handleMassEdit(e: React.FormEvent) {
    e.preventDefault();
    setMassEditing(true);
    for (const id of selectedIds) {
      try {
        const body: Record<string, unknown> = {};
        if (massEditForm.role) body.role = massEditForm.role;
        body.isActive = massEditForm.isActive;
        if (massEditForm.credits > 0) body.credits = massEditForm.credits;
        await fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } catch { /* skip failed */ }
    }
    setSelectedIds(new Set());
    setShowMassEdit(false);
    setMassEditing(false);
    fetchUsers();
  }

  async function handleMassDelete() {
    setDeleting(true);
    for (const id of selectedIds) {
      try { await fetch(`/api/users/${id}`, { method: "DELETE" }); } catch { /* skip */ }
    }
    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
    setDeleting(false);
    fetchUsers();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-400 transition-colors" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/40 border border-red-900/20 text-xs text-white placeholder-neutral-600 font-medium outline-none focus:border-red-500/40 focus:shadow-[0_0_12px_rgba(220,38,38,0.08)] transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">{selectedIds.size} selected</span>
              <button onClick={openMassEdit} className="group relative h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
                <span className="relative flex items-center gap-1.5 text-white">
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </span>
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="group relative h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-800" />
                <span className="relative flex items-center gap-1.5 text-white">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </span>
              </button>
            </div>
          )}
          <button onClick={() => setShowAdd(!showAdd)} className="group relative inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-1.5 text-white">
              <Plus className="h-4 w-4" />
              Add User
            </span>
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="rounded-2xl border border-red-900/25 bg-black/50 backdrop-blur-md p-6 md:p-8 shadow-2xl animate-fade-in">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            New User Account
          </h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {(["name", "email", "password"] as const).map((field) => (
                <div key={field} className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">{field}</label>
                  <input type={field === "password" ? "password" : field === "email" ? "email" : "text"} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required placeholder={field === "password" ? "Min 6 chars" : field === "email" ? "name@example.com" : "Full name"} className="w-full h-10 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full h-10 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all cursor-pointer">
                  {["user", "manager", "admin"].map((r) => (<option key={r} value={r} className="bg-[#0b0c16] capitalize">{r}</option>))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Credits</label>
                <input type="number" value={form.credits} onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) || 0 })} className="w-full h-10 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-mono font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer">Cancel</button>
              <button type="submit" disabled={submitting} className="group relative px-6 h-10 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden disabled:opacity-50 cursor-pointer">
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-1.5 text-white">{submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Create User</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md shadow-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton cols={isAdmin ? 8 : 7} />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Users className="h-10 w-10 text-neutral-600" />
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.005]">
                  {isAdmin && (
                    <th className="px-4 py-4.5 w-10">
                      <input type="checkbox" checked={selectedIds.size === filteredUsers.length && filteredUsers.length > 0} onChange={toggleSelectAll} className="h-4 w-4 rounded border-red-900/30 bg-black/50 text-red-600 focus:ring-red-500/30 cursor-pointer" />
                    </th>
                  )}
                  {["Name", "Email", "Role", "Credits", "Used", "Status"].map((h) => (
                    <th key={h} className={`px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 ${h === "Credits" || h === "Used" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                  {isAdmin && <th className="px-6 py-4.5 text-right text-[10px] font-bold uppercase tracking-widest text-neutral-500">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSelected = selectedIds.has(u.id);
                  return (
                    <tr key={u.id} className={`border-b border-white/[0.03] transition-colors last:border-0 group ${isSelected ? "bg-red-500/5" : "hover:bg-white/[0.015]"}`}>
                      {isAdmin && (
                        <td className="px-4 py-4">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(u.id)} className="h-4 w-4 rounded border-red-900/30 bg-black/50 text-red-600 focus:ring-red-500/30 cursor-pointer" />
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br border flex items-center justify-center text-xs font-bold ${isSelected ? "from-red-500/40 to-red-700/40 border-red-500/40 text-red-300" : "from-red-500/20 to-red-700/20 border-red-500/20 text-red-400"}`}>
                            {getInitials(u.name)}
                          </div>
                          <span className="font-semibold text-neutral-200">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-400 font-medium">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleColors[u.role] || roleColors.user}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-neutral-200 tabular-nums">{u.credits}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-neutral-400 tabular-nums">{u.creditsUsed}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${u.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(u)} className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-neutral-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer" title="Edit">
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => { setSelectedIds(new Set([u.id])); setShowDeleteConfirm(true); }} className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteConfirm} onClose={() => { if (!deleting) { setShowDeleteConfirm(false); setSelectedIds(new Set()); } }} title={selectedIds.size > 1 ? `Delete ${selectedIds.size} Users` : "Delete User"}>
        <div className="space-y-4">
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/15 p-4">
            <p className="text-xs text-rose-300/80 font-medium leading-relaxed">
              {selectedIds.size > 1
                ? `Are you sure you want to delete ${selectedIds.size} user accounts? This action cannot be undone.`
                : `Are you sure you want to delete this user account? This action cannot be undone.`}
            </p>
          </div>
          {selectedIds.size > 1 && (
            <div className="max-h-32 overflow-y-auto space-y-1.5">
              {filteredUsers.filter((u) => selectedIds.has(u.id)).map((u) => (
                <div key={u.id} className="flex items-center gap-2.5 text-xs text-neutral-400 bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-[9px] font-bold text-red-400">{getInitials(u.name)}</span>
                  <span className="font-semibold text-neutral-300">{u.name}</span>
                  <span className="text-neutral-500 ml-auto">{u.email}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={handleMassDelete} disabled={deleting} className="group relative flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden disabled:opacity-50 cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-800" />
              <span className="relative flex items-center justify-center gap-1.5 text-white">{deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{deleting ? "Deleting..." : `Delete${selectedIds.size > 1 ? ` ${selectedIds.size}` : ""}`}</span>
            </button>
            <button onClick={() => { setShowDeleteConfirm(false); setSelectedIds(new Set()); }} disabled={deleting} className="px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer disabled:opacity-50">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Mass Edit Modal */}
      <Modal open={showMassEdit} onClose={() => { if (!massEditing) { setShowMassEdit(false); setSelectedIds(new Set()); } }} title={`Edit ${selectedIds.size} Users`}>
        <form onSubmit={handleMassEdit} className="space-y-4">
          <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 p-4">
            <p className="text-xs text-blue-300/80 font-medium leading-relaxed">
              Apply changes to <span className="font-bold text-white">{selectedIds.size}</span> selected users. Fields left unchanged will keep their current values.
            </p>
          </div>
          <div className="max-h-28 overflow-y-auto space-y-1">
            {filteredUsers.filter((u) => selectedIds.has(u.id)).map((u) => (
              <div key={u.id} className="flex items-center gap-2 text-xs text-neutral-400 bg-black/30 rounded-lg px-3 py-2 border border-white/5">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[8px] font-bold text-red-400">{getInitials(u.name)}</span>
                <span className="font-semibold text-neutral-300 truncate">{u.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Role</label>
              <select value={massEditForm.role} onChange={(e) => setMassEditForm({ ...massEditForm, role: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-medium outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                <option value="" className="bg-[#0b0c16]">— No change —</option>
                {["user", "manager", "admin"].map((r) => (<option key={r} value={r} className="bg-[#0b0c16] capitalize">{r}</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Status</label>
              <select value={massEditForm.isActive ? "true" : "false"} onChange={(e) => setMassEditForm({ ...massEditForm, isActive: e.target.value === "true" })} className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-medium outline-none focus:border-blue-500/50 transition-all cursor-pointer">
                <option value="true" className="bg-[#0b0c16]">Active</option>
                <option value="false" className="bg-[#0b0c16]">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Credits</label>
            <input type="number" value={massEditForm.credits} onChange={(e) => setMassEditForm({ ...massEditForm, credits: parseInt(e.target.value) || 0 })} placeholder="0 = no change" className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-mono font-medium outline-none focus:border-blue-500/50 transition-all" />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="submit" disabled={massEditing} className="group relative flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden disabled:opacity-50 cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800" />
              <span className="relative flex items-center justify-center gap-1.5 text-white">{massEditing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}{massEditing ? "Saving..." : `Apply to ${selectedIds.size}`}</span>
            </button>
            <button type="button" onClick={() => { setShowMassEdit(false); setSelectedIds(new Set()); }} disabled={massEditing} className="px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer disabled:opacity-50">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit User Account">
        <div className="mb-6 flex items-center gap-3 bg-black/30 rounded-xl p-3 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/20 flex items-center justify-center text-sm font-bold text-red-400 shrink-0">
            {showEdit ? getInitials(showEdit.name) : "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{showEdit?.name}</p>
            <p className="text-[11px] text-neutral-500 truncate">{showEdit?.email}</p>
          </div>
          <span className={`ml-auto inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${showEdit ? roleColors[showEdit.role] || roleColors.user : ""}`}>
            {showEdit?.role}
          </span>
        </div>
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Name</label>
            <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Role</label>
              <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-medium outline-none focus:border-red-500/50 transition-all cursor-pointer">
                {["user", "manager", "admin"].map((r) => (<option key={r} value={r} className="bg-[#0b0c16] capitalize">{r}</option>))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Status</label>
              <select value={editForm.isActive ? "true" : "false"} onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })} className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-medium outline-none focus:border-red-500/50 transition-all cursor-pointer">
                <option value="true" className="bg-[#0b0c16]">Active</option>
                <option value="false" className="bg-[#0b0c16]">Inactive</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Credits (UID Limit)</label>
            <input type="number" value={editForm.credits} onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })} required className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white font-mono font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Reset Password</label>
            <input type="password" placeholder="Leave blank to keep current" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white placeholder-neutral-600 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="submit" disabled={submitting} className="group relative flex-1 h-11 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden disabled:opacity-50 cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-1.5 text-white">{submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Save Changes</span>
            </button>
            <button type="button" onClick={() => setShowEdit(null)} className="px-6 h-11 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ uid: "", label: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    fetch(`/api/resources?${params}`)
      .then((r) => r.json())
      .then((d) => d.success && setResources(d.data.resources))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) { setShowAdd(false); setForm({ uid: "", label: "" }); fetchResources(); }
    } finally { setSubmitting(false); }
  }

  function copyUid(uid: string, id: string) {
    navigator.clipboard.writeText(uid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 group-focus-within:text-red-400 transition-colors" />
          <input
            type="text"
            placeholder="Search UIDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/40 border border-red-900/20 text-xs text-white placeholder-neutral-600 font-medium outline-none focus:border-red-500/40 focus:shadow-[0_0_12px_rgba(220,38,38,0.08)] transition-all"
          />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="group relative inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative flex items-center gap-1.5 text-white">
            <Plus className="h-4 w-4" />
            Add UID
          </span>
        </button>
      </div>

      {showAdd && (
        <div className="rounded-2xl border border-red-900/25 bg-black/50 backdrop-blur-md p-6 md:p-8 shadow-2xl animate-fade-in">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-300 mb-6 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            New UID Resource
          </h3>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5 min-w-[220px] flex-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">UID Code</label>
              <input type="text" placeholder="e.g. 961500570" value={form.uid} onChange={(e) => setForm({ ...form, uid: e.target.value })} required className="w-full h-10 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white placeholder-red-300/20 font-mono font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
            </div>
            <div className="space-y-1.5 min-w-[220px] flex-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Label</label>
              <input type="text" placeholder="e.g. Main account" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full h-10 px-4 rounded-xl bg-black/50 border border-red-900/25 text-sm text-white placeholder-red-300/20 font-medium outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.1)] transition-all" />
            </div>
            <div className="flex gap-3 pb-0.5">
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer">Cancel</button>
              <button type="submit" disabled={submitting} className="group relative px-6 h-10 rounded-xl text-xs font-bold uppercase tracking-wider overflow-hidden disabled:opacity-50 cursor-pointer">
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center gap-1.5 text-white">
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md shadow-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton cols={5} />
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Fingerprint className="h-10 w-10 text-neutral-600" />
            <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">No UID resources registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.005]">
                  {["UID Code", "Label", "Owner", "Status", "Expires"].map((h) => (
                    <th key={h} className={`px-6 py-4.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 ${h === "Expires" ? "text-right" : h === "Status" ? "text-center" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r._id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors last:border-0 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <code className="rounded-lg bg-black/50 border border-red-900/20 px-2.5 py-1 text-xs font-mono font-bold text-red-300">{r.uid}</code>
                        <button onClick={() => copyUid(r.uid, r._id)} className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100" title="Copy UID">
                          {copiedId === r._id ? <Check className="h-3.5 w-3.5 text-emerald-400 animate-scale-in" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300 font-semibold">{r.label || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-200 font-semibold text-xs">{r.owner?.name || "N/A"}</span>
                      {r.owner?.email && <span className="text-neutral-500 text-[10px] ml-2">{r.owner.email}</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border capitalize ${statusColors[r.status] || "bg-neutral-800 text-neutral-400 border-neutral-700/50"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${r.status === "active" ? "bg-emerald-400 animate-pulse" : r.status === "expired" ? "bg-amber-400" : r.status === "revoked" ? "bg-rose-400" : "bg-neutral-500"}`} />
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-400 font-mono font-semibold tabular-nums text-xs">{r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((d) => d.success && setLogs(d.data.logs))
      .finally(() => setLoading(false));
  }, []);

  const actionColors: Record<string, string> = {
    create: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    update: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    delete: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    login: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    revoke: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    suspend: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  function getActionColor(action: string) {
    const key = Object.keys(actionColors).find((k) => action.toLowerCase().includes(k));
    return key ? actionColors[key] : "bg-white/[0.03] text-neutral-300 border-white/10";
  }

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md shadow-2xl"><TableSkeleton cols={5} /></div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md shadow-2xl flex flex-col items-center gap-3 py-16">
          <ScrollText className="h-10 w-10 text-neutral-600" />
          <p className="text-sm font-bold uppercase tracking-wider text-neutral-500">No audit log entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((l, idx) => (
            <div key={l._id} className="group rounded-2xl border border-white/5 bg-black/30 backdrop-blur-md p-5 hover:bg-white/[0.02] hover:border-red-900/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex flex-col items-center gap-1.5 pt-0.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getActionColor(l.action)} border-2`}>
                    {l.action.charAt(0).toUpperCase()}
                  </div>
                  {idx < logs.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-white/5 to-transparent min-h-[12px]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getActionColor(l.action)}`}>
                      {l.action}
                    </span>
                    <span className="text-xs text-neutral-300 font-semibold">{l.actor?.name || "N/A"}</span>
                    {l.targetType && (
                      <>
                        <span className="text-neutral-600 text-[10px]">on</span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 bg-white/[0.03] px-1.5 py-0.5 rounded border border-white/5">{l.targetType}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    {l.targetId && (
                      <code className="text-[10px] font-mono text-red-300/60 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{l.targetId.slice(0, 12)}...</code>
                    )}
                    <time className="text-[10px] text-neutral-500 font-mono font-semibold tabular-nums flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(l.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {l.details && Object.keys(l.details).length > 0 && (
                    <div className="mt-2.5 text-[10px] text-neutral-500 font-mono bg-black/30 rounded-lg px-3 py-2 border border-white/5 truncate">
                      {JSON.stringify(l.details).slice(0, 80)}{JSON.stringify(l.details).length > 80 ? "..." : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManagementPage() {
  return <ManagementContent />;
}
