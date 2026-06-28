"use client";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, Fingerprint, LogOut, Download, LayoutDashboard, Shield, User } from "lucide-react";

function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/uids", label: "UIDs", icon: Fingerprint },
    { href: "/management", label: "Management", icon: Shield, roles: ["admin", "manager"] },
    { href: "/downloads", label: "Downloads & Tools", icon: Download },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(session.user?.role ?? "")
  );

  return (
    <div className="md:hidden relative z-50">
      {/* Top Header Bar - Frosty glass */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Fingerprint className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-wider bg-clip-text bg-gradient-to-r from-white to-neutral-400">92lr</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-neutral-400 hover:bg-white/5 hover:text-white cursor-pointer transition-all duration-200 border border-transparent hover:border-white/5"
        >
          {open ? <X className="h-5 w-5 animate-scale-in" /> : <Menu className="h-5 w-5 animate-scale-in" />}
        </button>
      </div>

      {/* Drawer Overlay - Translucent glass pane */}
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-[#030307]/80 backdrop-blur-lg border-b border-white/5 flex flex-col p-6 space-y-2 animate-fade-in shadow-2xl">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3.5 h-12 px-4 rounded-xl text-sm font-semibold transition-all border ${
                  active
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.03] border-transparent"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? "text-indigo-400" : "text-neutral-400"}`} />
                {item.label}
              </Link>
            );
          })}
          <div className="border-t border-white/5 pt-6 mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center gap-3.5 h-12 px-4 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/15 transition-all cursor-pointer"
            >
              <LogOut className="h-4.5 w-4.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGuestPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  return (
    <div className="relative min-h-screen w-full text-white overflow-x-hidden">
      {/* Shared Ambient Background Glows */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#030307] pointer-events-none">
        <div 
          className="absolute top-[10%] left-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/12 blur-[120px]" 
          style={{ animation: 'floatBlob 25s infinite alternate ease-in-out' }} 
        />
        <div 
          className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] rounded-full bg-blue-500/8 blur-[130px]" 
          style={{ animation: 'floatBlob 35s infinite alternate-reverse ease-in-out' }} 
        />
        <div 
          className="absolute top-[35%] left-[45%] w-[380px] h-[380px] rounded-full bg-violet-500/8 blur-[110px]" 
          style={{ animation: 'floatBlob 30s infinite alternate ease-in-out' }} 
        />
      </div>

      {isGuestPage ? (
        <div className="animate-fade-in w-full">{children}</div>
      ) : (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          {/* Mobile Top Navbar */}
          <MobileNavbar />

          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main content canvas */}
          <main className="flex-1 overflow-auto w-full relative z-10">
            <div className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10 w-full animate-slide-up">{children}</div>
          </main>
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppShellContent>{children}</AppShellContent>
    </SessionProvider>
  );
}
