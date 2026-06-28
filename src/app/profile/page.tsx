"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getGravatarUrl, getInitials } from "@/lib/gravatar";
import { Loader2, Check, X, ArrowLeft, User, Shield, Calendar, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  creditsUsed: number;
  avatarUrl: string;
  createdAt: string;
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwMessage, setPwMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfile(d.data);
          setName(d.data.name);
          setEmail(d.data.email);
          setAvatarUrl(d.data.avatarUrl ?? "");
          if (d.data.avatarUrl) {
            setAvatarPreview(d.data.avatarUrl);
          } else if (session?.user?.email) {
            getGravatarUrl(session.user.email, 200).then(setAvatarPreview);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [session]);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, avatarUrl }),
    });

    const d = await res.json();
    if (d.success) {
      setProfile(d.data);
      setMessage({ type: "success", text: "Profile updated successfully" });
      updateSession();
      if (d.data.avatarUrl) {
        setAvatarPreview(d.data.avatarUrl);
      } else if (session?.user?.email) {
        getGravatarUrl(session.user.email, 200).then(setAvatarPreview);
      }
    } else {
      setMessage({ type: "error", text: d.error || "Failed to update profile" });
    }
    setSaving(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage(null);

    if (newPassword !== confirmPassword) {
      setPwMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      setPwMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setPwSaving(true);
    const res = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const d = await res.json();
    if (d.success) {
      setPwMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPwMessage({ type: "error", text: d.error || "Failed to change password" });
    }
    setPwSaving(false);
  }

  useEffect(() => {
    if (avatarUrl && avatarUrl !== profile?.avatarUrl) {
      setAvatarPreview(avatarUrl);
    }
  }, [avatarUrl, profile?.avatarUrl]);

  const initials = getInitials(profile?.name ?? "U");
  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const totalCredits = profile ? profile.credits + profile.creditsUsed : 0;
  const creditsRemaining = profile ? profile.credits : 0;
  const remainingPercent = totalCredits ? Math.round((creditsRemaining / totalCredits) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Header bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-xl p-2.5 border border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white transition-all cursor-pointer shadow-lg hover:border-indigo-500/20"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">Profile Settings</h1>
          <p className="mt-1.5 text-sm text-neutral-400 font-medium">Manage your personal information and security settings.</p>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid gap-6 lg:grid-cols-5 items-start">
        {/* Left Column: User Card & Credit Meter */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Summary Card */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-md p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Glowing avatar frame */}
            <div className="relative group mb-4 h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <div className="h-full w-full rounded-full overflow-hidden bg-neutral-950 border-2 border-[#030307]">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black text-indigo-400 bg-indigo-950/20">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-white leading-tight">{profile?.name}</h3>
            <p className="text-sm text-neutral-400 font-bold mt-1.5">{profile?.email}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge className="capitalize bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full font-bold text-xs tracking-wider uppercase shadow-sm">
                {profile?.role}
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Active Account
              </Badge>
            </div>

            {/* Quick stats items */}
            <div className="w-full border-t border-white/5 mt-6 pt-5 space-y-3.5 text-left text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-2 font-bold">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  Member Since
                </span>
                <span className="text-neutral-200 font-bold">{joinDate}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-2 font-bold">
                  <Star className="h-4 w-4 text-neutral-500" />
                  Plan Status
                </span>
                <span className="text-indigo-300 font-extrabold uppercase tracking-widest text-[9px] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded shadow-sm">
                  Global Standard
                </span>
              </div>
            </div>
          </div>

          {/* Credits remaining summary box */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-md p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 border border-emerald-500/20 text-emerald-400 shadow-sm">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">Credit Balance</p>
                <p className="text-lg font-black text-neutral-200 mt-0.5">
                  {creditsRemaining} <span className="text-neutral-500 text-xs font-normal">/ {totalCredits} left</span>
                </p>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-black/40 border border-white/5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-[1000ms] ease-out"
                style={{ width: `${remainingPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-neutral-500">
              <span>{remainingPercent}% remaining</span>
              <span>Used: {profile?.creditsUsed ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Settings Forms */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-md shadow-2xl overflow-hidden">
            {/* Elegant Tab Selectors */}
            <div className="flex border-b border-white/5 bg-white/[0.005]">
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setMessage(null);
                  setPwMessage(null);
                }}
                className={`flex-1 py-4.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-400 bg-white/[0.01]"
                    : "border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.005]"
                }`}
              >
                <User className="h-4 w-4" />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setActiveTab("password");
                  setMessage(null);
                  setPwMessage(null);
                }}
                className={`flex-1 py-4.5 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === "password"
                    ? "border-indigo-500 text-indigo-400 bg-white/[0.01]"
                    : "border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.005]"
                }`}
              >
                <Shield className="h-4 w-4" />
                Password & Security
              </button>
            </div>

            {/* Forms body container */}
            <div className="p-6 md:p-8">
              {activeTab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full h-11 px-4 rounded-xl glass-input"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full h-11 px-4 rounded-xl glass-input"
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="avatarUrl" className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Profile Picture URL
                    </label>
                    <input
                      id="avatarUrl"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="block w-full h-11 px-4 rounded-xl glass-input"
                    />
                    <p className="text-[10px] text-neutral-500 leading-normal font-semibold uppercase tracking-wider mt-1.5">
                      Leave blank to fall back to Gravatar.
                    </p>
                  </div>

                  {message && (
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${
                        message.type === "success"
                          ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-400"
                          : "border-red-500/20 bg-red-950/20 text-red-400"
                      } animate-fade-in`}
                    >
                      {message.type === "success" ? (
                        <Check className="h-4.5 w-4.5 shrink-0" />
                      ) : (
                        <X className="h-4.5 w-4.5 shrink-0" />
                      )}
                      <span>{message.text}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center px-5 h-11 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Profile Details
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="currentPassword"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-400"
                    >
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="block w-full h-11 px-4 rounded-xl glass-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="newPassword"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-400"
                    >
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      className="block w-full h-11 px-4 rounded-xl glass-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-xs font-bold uppercase tracking-wider text-neutral-400"
                    >
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      className="block w-full h-11 px-4 rounded-xl glass-input"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {pwMessage && (
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${
                        pwMessage.type === "success"
                          ? "border-emerald-500/20 bg-emerald-950/20 text-emerald-400"
                          : "border-red-500/20 bg-red-950/20 text-red-400"
                      } animate-fade-in`}
                    >
                      {pwMessage.type === "success" ? (
                        <Check className="h-4.5 w-4.5 shrink-0" />
                      ) : (
                        <X className="h-4.5 w-4.5 shrink-0" />
                      )}
                      <span>{pwMessage.text}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="inline-flex items-center justify-center px-5 h-11 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary disabled:opacity-50 cursor-pointer shadow-md"
                    >
                      {pwSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Update Security Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
