"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getGravatarUrl, getInitials } from "@/lib/gravatar";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Shield,
  LogOut,
  ChevronLeft,
  Fingerprint,
  User,
  Download,
} from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "user"],
  },
  {
    href: "/uids",
    label: "UIDs",
    icon: Fingerprint,
    roles: ["admin", "manager", "user"],
  },
  {
    href: "/management",
    label: "Management",
    icon: Shield,
    roles: ["admin", "manager"],
  },
  {
    href: "/downloads",
    label: "Downloads & Tools",
    icon: Download,
    roles: ["admin", "manager", "user"],
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    roles: ["admin", "manager", "user"],
  },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      getGravatarUrl(session.user.email, 80).then(setAvatarUrl);
    }
  }, [session?.user?.email]);

  if (!session) return null;

  const initials = getInitials(session.user?.name ?? "U");
  const visibleItems = navItems.filter(
    (item) =>
      item.roles.includes(session.user?.role ?? "") || item.roles.includes("*")
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-white/5 bg-black/30 backdrop-blur-xl transition-all duration-300 ease-in-out relative z-30 shadow-2xl h-screen",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4 bg-white/[0.01]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-red-800 border border-white/10 shadow-[0_0_15px_rgba(220,38,38,0.25)]">
          <Fingerprint className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-white tracking-wider bg-clip-text bg-gradient-to-r from-white to-neutral-400">
            92lr
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white cursor-pointer transition-all duration-200 border border-transparent hover:border-white/5",
            collapsed && "ml-0"
          )}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 p-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all border cursor-pointer relative duration-300",
                active
                  ? "bg-red-500/10 text-red-300 border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]"
                  : "text-neutral-400 hover:bg-white/[0.02] hover:border-white/[0.04] hover:text-neutral-200 border-transparent"
              )}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-r-full shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
              )}
              <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-all duration-300", active ? "text-red-400 scale-105" : "text-neutral-500 group-hover:text-neutral-300")} />
              {!collapsed && (
                <span className="transition-all duration-200">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Profile Settings */}
      <div className="border-t border-white/5 p-4 bg-white/[0.005]">
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className={cn(
              "flex flex-1 items-center gap-3 rounded-xl p-2 text-sm text-neutral-400 transition-all duration-300 hover:bg-white/[0.03] hover:text-neutral-200 border border-transparent hover:border-white/5",
              collapsed && "justify-center"
            )}
          >
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-neutral-900 border border-white/[0.08] shadow-inner">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-neutral-400 bg-neutral-900">
                  {initials}
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 truncate text-left animate-fade-in">
                <p className="text-sm font-semibold leading-tight text-neutral-200">
                  {session.user?.name}
                </p>
                <p className="truncate text-xs text-neutral-500 font-medium mt-0.5">{session.user?.email}</p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded-xl p-2 text-neutral-400 transition-all duration-300 hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/15 cursor-pointer"
              title="Sign out"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
