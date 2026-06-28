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
} from "lucide-react";

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

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white/5 bg-[#0a0a14]/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-scale-in">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-white">{title}</h2>
          <button 
            onClick={onClose} 
            className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white cursor-pointer transition-all duration-200 border border-transparent hover:border-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ManagementContent() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<Tab>("users");

  if (!session) return null;
  if (session.user?.role !== "admin" && session.user?.role !== "manager") return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 min-h-screen text-white">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">Management Panel</h1>
        <p className="text-sm text-neutral-400 mt-1.5 max-w-[65ch] leading-relaxed font-medium">
          Manage system users, register UID resources, and view the central audit activity logs.
        </p>
      </div>

      {/* Tabs Selector - Frosted tabs group */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl w-full shadow-lg">
        {[
          { id: "users" as Tab, label: "Users", icon: Users },
          { id: "resources" as Tab, label: "Resources", icon: Fingerprint },
          { id: "audit" as Tab, label: "Audit Log", icon: ScrollText },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-white/10"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="animate-fade-in">
        {tab === "users" && <UsersTab />}
        {tab === "resources" && <ResourcesTab />}
        {tab === "audit" && <AuditTab />}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="flex gap-4 border-b border-white/5 pb-4">
        <div className="h-4 w-1/4 bg-white/5 rounded"></div>
        <div className="h-4 w-1/4 bg-white/5 rounded"></div>
        <div className="h-4 w-1/4 bg-white/5 rounded"></div>
        <div className="h-4 w-1/4 bg-white/5 rounded"></div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-white/5">
          <div className="h-4 w-1/4 bg-white/5 rounded"></div>
          <div className="h-4 w-1/4 bg-white/5 rounded"></div>
          <div className="h-4 w-1/4 bg-white/5 rounded"></div>
          <div className="h-4 w-1/4 bg-white/5 rounded"></div>
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

  // Edit Modal State
  const [showEdit, setShowEdit] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "user", credits: 0, isActive: true, password: "" });

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
    setEditForm({
      name: u.name,
      role: u.role,
      credits: u.credits,
      isActive: u.isActive,
      password: "",
    });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!showEdit) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name: editForm.name,
        role: editForm.role,
        credits: editForm.credits,
        isActive: editForm.isActive,
      };
      if (editForm.password) {
        body.password = editForm.password;
      }

      const res = await fetch(`/api/users/${showEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d.success) {
        setShowEdit(null);
        fetchUsers();
      } else {
        alert(d.error || "Failed to update user");
      }
    } catch (err) {
      alert("An error occurred while saving user data.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs placeholder:text-neutral-600"
          />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary cursor-pointer shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add User
        </button>
      </div>

      {showAdd && (
        <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          <h3 className="text-base font-bold mb-5">New User Account</h3>
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full h-10 px-4 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full h-10 px-4 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full h-10 px-4 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-10 px-4 rounded-xl glass-input cursor-pointer"
                >
                  <option value="user" className="bg-[#0b0c16]">User</option>
                  <option value="manager" className="bg-[#0b0c16]">Manager</option>
                  <option value="admin" className="bg-[#0b0c16]">Admin</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Credits</label>
                <input
                  type="number"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-4 rounded-xl glass-input font-mono"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {submitting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-neutral-500">
            <Users className="h-10 w-10 text-neutral-600 animate-pulse" />
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.005]">
                  <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Name</th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Email</th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Role</th>
                  <th className="px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-neutral-400">Credits</th>
                  <th className="px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-neutral-400">Used</th>
                  <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">Status</th>
                  {isAdmin && (
                    <th className="px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-neutral-400">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.filter((u) => u.name || u.email).map((u) => {
                  let roleBadge = "bg-transparent text-neutral-400 border border-white/10";
                  if (u.role === "admin") {
                    roleBadge = "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold";
                  } else if (u.role === "manager") {
                    roleBadge = "bg-white/[0.03] text-neutral-300 border border-white/5 font-bold";
                  }

                  return (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors last:border-0">
                      <td className="px-6 py-4 font-semibold text-neutral-200">{u.name}</td>
                      <td className="px-6 py-4 text-neutral-400 font-medium">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs capitalize tracking-wide ${roleBadge}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-neutral-200 tabular-nums">{u.credits}</td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-neutral-400 tabular-nums">{u.creditsUsed}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${u.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4.5 text-right">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => openEdit(u)}
                              className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer shadow-sm"
                              title="Edit User"
                            >
                              <Edit3 className="h-4 w-4" />
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

      {/* Edit User Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit User Account">
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Name</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
              className="w-full h-11 px-4 rounded-xl glass-input"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input cursor-pointer"
            >
              <option value="user" className="bg-[#0b0c16]">User</option>
              <option value="manager" className="bg-[#0b0c16]">Manager</option>
              <option value="admin" className="bg-[#0b0c16]">Admin</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Credits (UID Limit)</label>
            <input
              type="number"
              value={editForm.credits}
              onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) || 0 })}
              required
              className="w-full h-11 px-4 rounded-xl glass-input font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Status</label>
            <select
              value={editForm.isActive ? "true" : "false"}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "true" })}
              className="w-full h-11 px-4 rounded-xl glass-input cursor-pointer"
            >
              <option value="true" className="bg-[#0b0c16]">Active</option>
              <option value="false" className="bg-[#0b0c16]">Inactive</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Reset Password (Optional)</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 h-11 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowEdit(null)}
              className="px-5 h-11 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-secondary cursor-pointer"
            >
              Cancel
            </button>
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
      if (d.success) {
        setShowAdd(false);
        setForm({ uid: "", label: "" });
        fetchResources();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function copyUid(uid: string, id: string) {
    navigator.clipboard.writeText(uid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search UIDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs placeholder:text-neutral-600"
          />
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary cursor-pointer shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add UID
        </button>
      </div>

      {showAdd && (
        <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
          <h3 className="text-base font-bold mb-5">New UID Resource</h3>
          <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1.5 min-w-[200px] flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">UID Code</label>
              <input
                type="text"
                placeholder="e.g. 961500570"
                value={form.uid}
                onChange={(e) => setForm({ ...form, uid: e.target.value })}
                required
                className="w-full h-10 px-4 rounded-xl glass-input font-mono"
              />
            </div>
            <div className="space-y-1.5 min-w-[200px] flex-1">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Label (optional)</label>
              <input
                type="text"
                placeholder="e.g. Main account"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full h-10 px-4 rounded-xl glass-input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {submitting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <TableSkeleton />
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-neutral-500">
            <Fingerprint className="h-10 w-10 text-neutral-600 animate-pulse" />
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">No UID resources registered</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.005]">
                  <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">UID Code</th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Label</th>
                  <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Owner</th>
                  <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">Status</th>
                  <th className="px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-neutral-400">Expires</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => {
                  let statusBadge = "bg-neutral-800 text-neutral-400 border border-neutral-700/50";
                  if (r.status === "active") {
                    statusBadge = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                  } else if (r.status === "expired" || r.status === "suspended") {
                    statusBadge = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                  } else if (r.status === "revoked") {
                    statusBadge = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                  }

                  return (
                    <tr key={r._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <code className="rounded-lg bg-black/40 border border-white/5 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300">
                            {r.uid}
                          </code>
                          <button
                            onClick={() => copyUid(r.uid, r._id)}
                            className="text-neutral-500 hover:text-white transition-colors cursor-pointer"
                            title="Copy UID"
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
                      <td className="px-6 py-4 text-neutral-200 font-semibold">{r.owner?.name ?? "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border capitalize ${statusBadge}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-neutral-400 font-mono font-semibold tabular-nums">
                        {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })}
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

  return (
    <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
      {loading ? (
        <TableSkeleton />
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-neutral-500">
          <ScrollText className="h-10 w-10 text-neutral-600 animate-pulse" />
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">No audit log entries found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.005]">
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Action</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Actor</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Target</th>
                <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Details</th>
                <th className="px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-neutral-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors last:border-0">
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-white/[0.03] border border-white/5 text-indigo-300">
                      {l.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-200 font-semibold">{l.actor?.name ?? "N/A"}</td>
                  <td className="px-6 py-4 text-neutral-400 font-semibold">
                    <span className="text-xs uppercase tracking-widest text-[10px] bg-white/[0.02] px-1.5 py-0.5 border border-white/5 rounded text-neutral-400">{l.targetType}</span>
                    {l.targetId && (
                      <code className="ml-2 rounded-lg bg-black/40 border border-white/5 px-2 py-0.5 text-xs font-mono text-indigo-300 font-bold">
                        {l.targetId.slice(0, 8)}...
                      </code>
                    )}
                  </td>
                  <td className="px-6 py-4 text-neutral-400 max-w-[300px] truncate font-mono text-xs">
                    <code>
                      {JSON.stringify(l.details ?? {}).slice(0, 60)}
                      {JSON.stringify(l.details ?? {}).length > 60 ? "..." : ""}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-right text-neutral-500 font-mono font-semibold tabular-nums whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ManagementPage() {
  return <ManagementContent />;
}
