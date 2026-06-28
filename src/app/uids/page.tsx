"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Fingerprint,
  Search,
  Plus,
  Copy,
  Check,
  Loader2,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldCheck,
  Activity,
  RefreshCw,
  Clock,
  Calendar,
  Coins,
  Gift,
  Info,
  Key,
} from "lucide-react";

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

type User = {
  id: string;
  name: string;
  email: string;
};

type SubTab = "add" | "extend" | "replace" | "remove" | "info";

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

export default function UIDsPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<"paid" | "free">("paid");
  const [statusFilter, setStatusFilter] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const [activeSubTab, setActiveSubTab] = useState<SubTab>("add");
  const [showEdit, setShowEdit] = useState<Resource | null>(null);
  const [showDelete, setShowDelete] = useState<Resource | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // Form states
  const [addForm, setAddForm] = useState({ uid: "", label: "", ownerId: "" });
  const [addDays, setAddDays] = useState(30);

  const [extendForm, setExtendForm] = useState({ resourceId: "", days: 30 });
  const [replaceForm, setReplaceForm] = useState({ resourceId: "", newUid: "" });
  const [removeForm, setRemoveForm] = useState({ resourceId: "" });

  const [editForm, setEditForm] = useState({ uid: "", label: "", status: "", ownerId: "", expiresAt: "" });

  const fetchResources = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", String(page));
    params.set("limit", String(limit));
    fetch(`/api/resources?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          let filtered = d.data.resources;
          if (paymentFilter === "paid") {
            filtered = d.data.resources.filter((r: Resource) => r.expiresAt);
          } else {
            filtered = d.data.resources.filter((r: Resource) => !r.expiresAt);
          }
          setResources(filtered);
          setTotalPages(d.data.pagination.pages);
          setTotal(filtered.length);
        }
      })
      .finally(() => setLoading(false));
  }, [search, statusFilter, page, paymentFilter]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    fetch("/api/users?limit=100")
      .then((r) => r.json())
      .then((d) => d.success && setUsers(d.data.users));
  }, []);

  function copyUid(uid: string, id: string) {
    navigator.clipboard.writeText(uid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  // Handle Add UID POST
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.uid) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        uid: addForm.uid,
        expiresInDays: addDays,
      };
      if (addForm.label) body.label = addForm.label;
      if (addForm.ownerId) body.ownerId = addForm.ownerId;

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d.success) {
        setAddForm({ uid: "", label: "", ownerId: "" });
        setAddDays(30);
        fetchResources();
      } else {
        alert(d.error || "Failed to create resource");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Extend UID Access PATCH
  async function handleExtend(e: React.FormEvent) {
    e.preventDefault();
    if (!extendForm.resourceId) return;
    setSubmitting(true);
    try {
      const target = resources.find((r) => r._id === extendForm.resourceId);
      if (!target) return;

      let baseTime = Date.now();
      if (target.expiresAt) {
        const exp = new Date(target.expiresAt).getTime();
        if (exp > Date.now()) {
          baseTime = exp;
        }
      }

      const newExpiresAt = new Date(baseTime + extendForm.days * 86400000).toISOString();

      const res = await fetch(`/api/resources/${extendForm.resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiresAt: newExpiresAt }),
      });
      const d = await res.json();
      if (d.success) {
        setExtendForm({ resourceId: "", days: 30 });
        fetchResources();
      } else {
        alert(d.error || "Failed to extend resource");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Replace UID PATCH
  async function handleReplace(e: React.FormEvent) {
    e.preventDefault();
    if (!replaceForm.resourceId || !replaceForm.newUid) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/resources/${replaceForm.resourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: replaceForm.newUid }),
      });
      const d = await res.json();
      if (d.success) {
        setReplaceForm({ resourceId: "", newUid: "" });
        fetchResources();
      } else {
        alert(d.error || "Failed to replace UID. Note: Only Admins/Managers can change UIDs.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Remove UID DELETE
  async function handleRemove(e: React.FormEvent) {
    e.preventDefault();
    if (!removeForm.resourceId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/resources/${removeForm.resourceId}`, {
        method: "DELETE",
      });
      const d = await res.json();
      if (d.success) {
        setRemoveForm({ resourceId: "" });
        fetchResources();
      } else {
        alert(d.error || "Failed to delete resource");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle Row Edit Modal
  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!showEdit) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (editForm.uid !== showEdit.uid) body.uid = editForm.uid;
      if (editForm.label !== (showEdit.label ?? "")) body.label = editForm.label;
      if (editForm.status !== showEdit.status) body.status = editForm.status;
      if (editForm.ownerId !== showEdit.owner?._id) body.owner = editForm.ownerId;
      if (editForm.expiresAt) body.expiresAt = editForm.expiresAt;

      const res = await fetch(`/api/resources/${showEdit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d.success) {
        setShowEdit(null);
        fetchResources();
      } else {
        alert(d.error || "Failed to update resource");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!showDelete) return;
    setSubmitting(true);
    try {
      await fetch(`/api/resources/${showDelete._id}`, { method: "DELETE" });
      setShowDelete(null);
      fetchResources();
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(r: Resource) {
    setShowEdit(r);
    setEditForm({
      uid: r.uid,
      label: r.label ?? "",
      status: r.status,
      ownerId: r.owner?._id ?? "",
      expiresAt: r.expiresAt ? r.expiresAt.slice(0, 10) : "",
    });
  }

  const getDurationText = (r: Resource) => {
    if (!r.expiresAt) return "Permanent";
    const diffTime = Math.abs(new Date(r.expiresAt).getTime() - new Date(r.createdAt).getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  return (
    <div className="relative max-w-7xl mx-auto space-y-8 min-h-screen text-white">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">UID Management</h1>
        <p className="mt-1.5 text-sm text-neutral-400 max-w-[65ch] leading-relaxed font-medium">
          Add, extend, replace, or remove UID access. Paid actions consume 1 credit of your account UID limit.
        </p>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl w-full shadow-lg">
        {[
          { id: "add", label: "Add Access", icon: ShieldCheck },
          { id: "extend", label: "Extend Duration", icon: Activity },
          { id: "replace", label: "Replace UID", icon: RefreshCw },
          { id: "remove", label: "Remove Action", icon: Key },
          { id: "info", label: "Information", icon: Info },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeSubTab === t.id;
          const isRemove = t.id === "remove";
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id as SubTab)}
              className={`flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isActive
                  ? isRemove
                    ? "bg-rose-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-white/10"
                    : "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-white/10"
                  : isRemove
                  ? "text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Panels Container */}
      <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-fade-in">
        {activeSubTab === "add" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Add New UID</h3>
              <p className="text-sm text-neutral-400 mt-1.5 font-medium">Consumes 1 UID limit credit. Grants bypass access to the specified user UID.</p>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">UID Code</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="e.g. 1000123456"
                      value={addForm.uid}
                      onChange={(e) => setAddForm({ ...addForm, uid: e.target.value })}
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl glass-input placeholder:text-neutral-600 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Duration (Days)</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <input
                        type="number"
                        value={addDays}
                        onChange={(e) => setAddDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-12 pl-11 pr-4 rounded-xl glass-input font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setAddDays(Math.max(1, addDays - 1))}
                      className="h-12 w-12 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-all cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddDays(addDays + 1)}
                      className="h-12 w-12 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-all cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Label (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Primary Emulator Account"
                    value={addForm.label}
                    onChange={(e) => setAddForm({ ...addForm, label: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl glass-input placeholder:text-neutral-600"
                  />
                </div>

                {isAdmin && users.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Owner Account</label>
                    <select
                      value={addForm.ownerId}
                      onChange={(e) => setAddForm({ ...addForm, ownerId: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl glass-input cursor-pointer"
                    >
                      <option value="" className="bg-[#0b0c16]">Self (you)</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id} className="bg-[#0b0c16]">{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-xl text-sm font-bold glass-button-primary disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4.5 w-4.5" />
                  )}
                  Add UID Resource
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab === "extend" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Extend UID Access</h3>
              <p className="text-sm text-neutral-400 mt-1.5 font-medium">Add validity days to an active or expired UID. Consumes 1 credit.</p>
            </div>
            <form onSubmit={handleExtend} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Select Registered UID</label>
                  <select
                    value={extendForm.resourceId}
                    onChange={(e) => setExtendForm({ ...extendForm, resourceId: e.target.value })}
                    required
                    className="w-full h-12 px-4 rounded-xl glass-input cursor-pointer"
                  >
                    <option value="" className="bg-[#0b0c16]">Choose a registered UID</option>
                    {resources.map((r) => (
                      <option key={r._id} value={r._id} className="bg-[#0b0c16]">
                        {r.uid} {r.label ? `(${r.label})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Extend Duration (Days)</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <input
                        type="number"
                        value={extendForm.days}
                        onChange={(e) => setExtendForm({ ...extendForm, days: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-full h-12 pl-11 pr-4 rounded-xl glass-input font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setExtendForm({ ...extendForm, days: Math.max(1, extendForm.days - 1) })}
                      className="h-12 w-12 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-all cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setExtendForm({ ...extendForm, days: extendForm.days + 1 })}
                      className="h-12 w-12 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-neutral-400 hover:text-white transition-all cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-xl text-sm font-bold glass-button-primary disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Activity className="h-4.5 w-4.5" />
                  )}
                  Extend Access Duration
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab === "replace" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Replace UID</h3>
              <p className="text-sm text-neutral-400 mt-1.5 font-medium">Replace a registered UID with a new target UID. This operation is free of charge.</p>
            </div>
            <form onSubmit={handleReplace} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Current UID</label>
                  <select
                    value={replaceForm.resourceId}
                    onChange={(e) => setReplaceForm({ ...replaceForm, resourceId: e.target.value })}
                    required
                    className="w-full h-12 px-4 rounded-xl glass-input cursor-pointer"
                  >
                    <option value="" className="bg-[#0b0c16]">Choose UID to replace</option>
                    {resources.map((r) => (
                      <option key={r._id} value={r._id} className="bg-[#0b0c16]">
                        {r.uid} {r.label ? `(${r.label})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">New UID Code</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="e.g. 1000123456"
                      value={replaceForm.newUid}
                      onChange={(e) => setReplaceForm({ ...replaceForm, newUid: e.target.value })}
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl glass-input placeholder:text-neutral-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 h-12 rounded-xl text-sm font-bold glass-button-primary disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4.5 w-4.5" />
                  )}
                  Replace UID
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab === "remove" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Remove UID Access</h3>
              <p className="text-sm text-neutral-400 mt-1.5 font-medium">Immediately and permanently revoke access to a UID from the system.</p>
            </div>
            <form onSubmit={handleRemove} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Select Registered UID</label>
                  <select
                    value={removeForm.resourceId}
                    onChange={(e) => setRemoveForm({ ...removeForm, resourceId: e.target.value })}
                    required
                    className="w-full h-12 px-4 rounded-xl glass-input cursor-pointer"
                  >
                    <option value="" className="bg-[#0b0c16]">Choose UID to remove</option>
                    {resources.map((r) => (
                      <option key={r._id} value={r._id} className="bg-[#0b0c16]">
                        {r.uid} {r.label ? `(${r.label})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(220,38,38,0.25)] border border-white/10 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Key className="h-4.5 w-4.5" />
                  )}
                  Remove UID
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab === "info" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">UID Resource Guidelines</h3>
              <p className="text-sm text-neutral-400 mt-1.5 font-medium">System policies regarding active slots and registrations.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 space-y-3.5 shadow-md">
                <Coins className="h-5.5 w-5.5 text-indigo-400" />
                <h4 className="font-extrabold text-sm text-neutral-100">Credits Deductions</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  Adding new UIDs or extending active/expired items consumes 1 credit of your account balance.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 space-y-3.5 shadow-md">
                <RefreshCw className="h-5.5 w-5.5 text-indigo-400" />
                <h4 className="font-extrabold text-sm text-neutral-100">Free Replacements</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  Replacing a registered UID with a new replacement target is free of charge and consumes no credits.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 space-y-3.5 shadow-md">
                <Clock className="h-5.5 w-5.5 text-indigo-400" />
                <h4 className="font-extrabold text-sm text-neutral-100">Expiration & Suspensions</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                  Slots automatically lock on expiration dates. You can extend validity periods at any point in time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Database section */}
      <div className="space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2.5 text-white">
            <Key className="h-5 w-5 text-indigo-400" />
            Your UID Database
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                placeholder="Search UID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 pl-10 pr-4 rounded-xl glass-input text-xs placeholder:text-neutral-600"
              />
            </div>

            {/* Paid / Free Toggle filter */}
            <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-xl shadow-inner">
              <button
                onClick={() => {
                  setPaymentFilter("paid");
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-4 h-8 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  paymentFilter === "paid"
                    ? "bg-indigo-600 text-white shadow-sm border border-white/10"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Coins className="h-3.5 w-3.5" />
                Paid
              </button>
              <button
                onClick={() => {
                  setPaymentFilter("free");
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-4 h-8 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  paymentFilter === "free"
                    ? "bg-indigo-600 text-white shadow-sm border border-white/10"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Gift className="h-3.5 w-3.5" />
                Free
              </button>
            </div>

            {/* Status pills selector */}
            <div className="flex p-1 bg-white/[0.02] border border-white/5 rounded-xl">
              {[
                { id: "", label: "All Status" },
                { id: "active", label: "Active" },
                { id: "expired", label: "Expired" },
                { id: "revoked", label: "Deleted" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStatusFilter(s.id);
                    setPage(1);
                  }}
                  className={`px-3.5 h-8 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    statusFilter === s.id
                      ? "bg-indigo-500/20 border border-indigo-500/35 text-indigo-300 shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Database Table Card */}
        <div className="border border-white/5 bg-white/[0.015] backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-8 space-y-6 animate-pulse">
              <div className="flex gap-4 border-b border-white/5 pb-4">
                <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                <div className="h-4 w-1/5 bg-white/5 rounded"></div>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-white/5">
                  <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                  <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                  <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                  <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                  <div className="h-4 w-1/5 bg-white/5 rounded"></div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-neutral-500">
              <Fingerprint className="h-10 w-10 text-neutral-600 animate-pulse" />
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">No matching records found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.005]">
                      <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">UID Code</th>
                      <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Validity</th>
                      <th className="px-6 py-4.5 text-center text-xs font-bold uppercase tracking-wider text-neutral-400">Status</th>
                      <th className="px-6 py-4.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-400">Timeline</th>
                      <th className="px-6 py-4.5 text-right text-xs font-bold uppercase tracking-wider text-neutral-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.filter(r => r.uid).map((r) => {
                      const isDeleted = r.status === "revoked";
                      const isActive = r.status === "active";
                      const isExpired = r.status === "expired";

                      let statusBadge = "bg-neutral-800 text-neutral-400 border border-neutral-700/50";
                      if (isActive) {
                        statusBadge = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                      } else if (isExpired) {
                        statusBadge = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                      } else if (isDeleted) {
                        statusBadge = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                      }

                      return (
                        <tr key={r._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors last:border-0">
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                isActive ? "bg-emerald-500" : isExpired ? "bg-amber-500" : "bg-rose-500"
                              }`} />
                              <code className="text-xs font-mono font-bold text-indigo-300 rounded-lg bg-black/40 border border-white/5 px-2.5 py-1">
                                {r.uid}
                              </code>
                              <button
                                onClick={() => copyUid(r.uid, r._id)}
                                className="text-neutral-500 hover:text-white cursor-pointer transition-colors"
                              >
                                {copiedId === r._id ? (
                                  <Check className="h-4 w-4 text-emerald-400 animate-scale-in" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                              {r.label && (
                                <span className="text-xs text-neutral-500 font-semibold ml-1">
                                  — {r.label}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-2 text-neutral-300 font-bold text-xs">
                              <Clock className="h-4 w-4 text-neutral-500" />
                              {getDurationText(r)}
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${statusBadge}`}>
                              {isDeleted ? "DELETED" : r.status}
                            </span>
                          </td>
                          <td className="px-6 py-4.5 text-neutral-400 space-y-1.5 text-xs font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-neutral-600" />
                              <span>Added: {new Date(r.createdAt).toLocaleString(undefined, { dateStyle: "medium" })}</span>
                            </div>
                            {r.expiresAt && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-neutral-600" />
                                <span>Expires: {new Date(r.expiresAt).toLocaleString(undefined, { dateStyle: "medium" })}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            {isDeleted ? (
                              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider">No actions</span>
                            ) : (
                              <div className="flex justify-end gap-2.5">
                                <button
                                  onClick={() => openEdit(r)}
                                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer shadow-sm"
                                  title="Edit"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setShowDelete(r)}
                                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-rose-950/40 bg-rose-950/20 text-neutral-500 hover:text-rose-400 hover:bg-rose-900/35 transition-all cursor-pointer shadow-sm"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-white/[0.005]">
                  <p className="text-xs text-neutral-500 font-semibold">
                    Showing page {page} of {totalPages} ({total} total UIDs)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-neutral-400 hover:text-white hover:border-white/10 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-2 text-neutral-400 hover:text-white hover:border-white/10 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Row Edit Modal */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit UID Resource">
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">UID Code</label>
            <input
              value={editForm.uid}
              onChange={(e) => setEditForm({ ...editForm, uid: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Label</label>
            <input
              value={editForm.label}
              onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Status</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full h-11 px-4 rounded-xl glass-input cursor-pointer"
            >
              <option value="active" className="bg-[#0b0c16]">Active</option>
              <option value="expired" className="bg-[#0b0c16]">Expired</option>
              <option value="revoked" className="bg-[#0b0c16]">Revoked / Deleted</option>
              <option value="suspended" className="bg-[#0b0c16]">Suspended</option>
            </select>
          </div>
          {isAdmin && users.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Owner</label>
              <select
                value={editForm.ownerId}
                onChange={(e) => setEditForm({ ...editForm, ownerId: e.target.value })}
                className="w-full h-11 px-4 rounded-xl glass-input cursor-pointer"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#0b0c16]">{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">Expires At</label>
            <input
              type="date"
              value={editForm.expiresAt}
              onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
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

      {/* Row Delete Modal */}
      <Modal open={!!showDelete} onClose={() => setShowDelete(null)} title="Delete UID Resource">
        <p className="mb-6 text-sm text-neutral-400 leading-relaxed font-medium">
          Are you sure you want to delete UID <code className="rounded-lg bg-black/40 border border-white/5 px-2 py-0.5 text-xs font-mono font-bold text-rose-300">{showDelete?.uid}</code>? This action cannot be undone and will revoke emulator bypass access.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="px-5 h-11 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.25)] border border-white/10 transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center justify-center"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Delete
          </button>
          <button
            onClick={() => setShowDelete(null)}
            className="px-5 h-11 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-secondary cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
