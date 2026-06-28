"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Loader2, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.push("/");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-8 md:p-10 rounded-2xl glass-panel animate-scale-in border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.4)] animate-pulse">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 uppercase">Create Account</h1>
          <p className="mt-2 text-xs text-neutral-400 font-semibold uppercase tracking-wider">Register for UID Manager</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="block w-full h-12 pl-11 pr-4 rounded-xl glass-input placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full h-12 pl-11 pr-4 rounded-xl glass-input placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wider text-neutral-400"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="block w-full h-12 pl-11 pr-4 rounded-xl glass-input placeholder:text-neutral-600"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-3 text-xs font-semibold text-red-400 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2 glass-button-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-neutral-500 font-semibold uppercase tracking-wider">
          Already have an account?{" "}
          <Link href="/" className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-2 transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
