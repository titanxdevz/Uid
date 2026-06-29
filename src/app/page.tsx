"use client";

import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  Activity, 
  Shield, 
  Zap, 
  Globe, 
  Database,
  Terminal,
  Users,
  Briefcase
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const allRegions = [
  { flag: "🇮🇳", name: "India", ping: "12ms" },
  { flag: "🇧🇩", name: "Bangladesh", ping: "18ms" },
  { flag: "🇵🇰", name: "Pakistan", ping: "22ms" },
  { flag: "🇸🇬", name: "Singapore", ping: "8ms" },
  { flag: "🇯🇵", name: "Japan", ping: "14ms" },
  { flag: "🇰🇷", name: "South Korea", ping: "16ms" },
  { flag: "🇹🇼", name: "Taiwan", ping: "20ms" },
  { flag: "🇲🇾", name: "Malaysia", ping: "24ms" },
  { flag: "🇹🇭", name: "Thailand", ping: "26ms" },
  { flag: "🇮🇩", name: "Indonesia", ping: "28ms" },
  { flag: "🇻🇳", name: "Vietnam", ping: "32ms" },
  { flag: "🇵🇭", name: "Philippines", ping: "34ms" },
  { flag: "🇦🇺", name: "Australia", ping: "42ms" },
  { flag: "🇳🇿", name: "New Zealand", ping: "48ms" },
  { flag: "🇺🇸", name: "United States", ping: "22ms" },
  { flag: "🇨🇦", name: "Canada", ping: "26ms" },
  { flag: "🇧🇷", name: "Brazil", ping: "58ms" },
  { flag: "🇲🇽", name: "Mexico", ping: "45ms" },
  { flag: "🇦🇷", name: "Argentina", ping: "62ms" },
  { flag: "🇬🇧", name: "United Kingdom", ping: "36ms" },
  { flag: "🇩🇪", name: "Germany", ping: "28ms" },
  { flag: "🇫🇷", name: "France", ping: "32ms" },
  { flag: "🇮🇹", name: "Italy", ping: "34ms" },
  { flag: "🇪🇸", name: "Spain", ping: "38ms" },
  { flag: "🇳🇱", name: "Netherlands", ping: "26ms" },
  { flag: "🇸🇪", name: "Sweden", ping: "40ms" },
  { flag: "🇳🇴", name: "Norway", ping: "44ms" },
  { flag: "🇷🇺", name: "Russia", ping: "55ms" },
  { flag: "🇹🇷", name: "Turkey", ping: "42ms" },
  { flag: "🇦🇪", name: "UAE", ping: "34ms" },
  { flag: "🇸🇦", name: "Saudi Arabia", ping: "38ms" },
  { flag: "🇿🇦", name: "South Africa", ping: "65ms" },
  { flag: "🇵🇱", name: "Poland", ping: "36ms" },
  { flag: "🇨🇿", name: "Czech Republic", ping: "34ms" },
  { flag: "🇭🇺", name: "Hungary", ping: "38ms" },
];

const standardPrices = [
  { duration: "1 Day", priceInr: "₹80", priceUsd: "$1", desc: "For quick verification", popular: false },
  { duration: "3 Days", priceInr: "₹180", priceUsd: "$2", desc: "Short term testing pass", popular: false },
  { duration: "1 Week", priceInr: "₹320", priceUsd: "$4", desc: "Perfect weekly access", popular: false },
  { duration: "15 Days", priceInr: "₹399", priceUsd: "$4.5", desc: "Extended trial license", popular: false },
  { duration: "1 Month", priceInr: "₹649", priceUsd: "$8", desc: "Standard monthly access", popular: true },
  { duration: "2 Months", priceInr: "₹1199", priceUsd: "$15", desc: "Double value package", popular: false },
  { duration: "Lifetime", priceInr: "₹3999", priceUsd: "$40", desc: "Unlimited permanent bypass", popular: false }
];

const resellerPlans = [
  { limit: "150 UID Limit", price: "$15", rate: "$0.10 per UID", tier: "Starter Reseller" },
  { limit: "400 UID Limit", price: "$20", rate: "$0.05 per UID", tier: "Silver Reseller" },
  { limit: "700 UID Limit", price: "$30", rate: "$0.042 per UID", tier: "Gold Reseller" },
  { limit: "1000 UID Limit", price: "$40", rate: "$0.04 per UID", tier: "Platinum Reseller" },
  { limit: "1500 UID Limit", price: "$50", rate: "$0.033 per UID", tier: "Diamond Reseller" },
  { limit: "Unlimited UID Limit", price: "$120", rate: "Infinite Credits", tier: "Ultimate Partner", special: true }
];

export default function LandingPage() {
  const [ping, setPing] = useState(36);
  const [pricingTab, setPricingTab] = useState<"standard" | "reseller">("standard");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const filteredRegions = allRegions.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const pingInterval = setInterval(() => {
      setPing(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + change;
        return Math.max(26, Math.min(54, next));
      });
    }, 2000);

    const loadTimer = setTimeout(() => setLoading(false), 2200);

    return () => {
      clearInterval(pingInterval);
      clearTimeout(loadTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#030307] overflow-hidden">
        {/* Animated Web Background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 200 200" preserveAspectRatio="none">
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`lh${i}`} x1="0" y1={i * 7} x2="200" y2={i * 7} stroke="#dc2626" strokeWidth="0.3" opacity="0.5">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${3 + i % 3}s`} repeatCount="indefinite" />
            </line>
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={`lv${i}`} x1={i * 7} y1="0" x2={i * 7} y2="200" stroke="#dc2626" strokeWidth="0.3" opacity="0.5">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${4 + i % 3}s`} repeatCount="indefinite" />
            </line>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`ld${i}`} x1="0" y1={i * 7} x2={i * 10} y2="200" stroke="#dc2626" strokeWidth="0.2" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${5 + i % 4}s`} repeatCount="indefinite" />
            </line>
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`ld2${i}`} x1="200" y1={i * 7} x2={200 - i * 10} y2="200" stroke="#dc2626" strokeWidth="0.2" opacity="0.3">
              <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${5 + i % 4}s`} repeatCount="indefinite" />
            </line>
          ))}
        </svg>

        {/* Corner Webs */}
        <svg className="absolute top-0 left-0 w-40 h-40 opacity-[0.12]" viewBox="0 0 160 160">
          <path d="M0 0 Q40 15 80 0 Q60 40 80 80 Q40 60 0 80 Q15 40 0 0Z" fill="none" stroke="#dc2626" strokeWidth="0.6" strokeDasharray="600" strokeDashoffset="600">
            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2s" fill="freeze" />
          </path>
          <path d="M0 0 L80 0 M0 0 L0 80 M0 0 L60 60" stroke="#dc2626" strokeWidth="0.8" opacity="0.5" strokeDasharray="200" strokeDashoffset="200">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.5s" fill="freeze" />
          </path>
        </svg>
        <svg className="absolute top-0 right-0 w-40 h-40 opacity-[0.12]" viewBox="0 0 160 160">
          <path d="M160 0 Q120 15 80 0 Q100 40 80 80 Q120 60 160 80 Q145 40 160 0Z" fill="none" stroke="#dc2626" strokeWidth="0.6" strokeDasharray="600" strokeDashoffset="600">
            <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2s" fill="freeze" />
          </path>
          <path d="M160 0 L80 0 M160 0 L160 80 M160 0 L100 60" stroke="#dc2626" strokeWidth="0.8" opacity="0.5" strokeDasharray="200" strokeDashoffset="200">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="1.5s" fill="freeze" />
          </path>
        </svg>

        {/* Center Content */}
        <div className="relative flex flex-col items-center gap-6 z-10">
          {/* Outer Glow Ring */}
          <div className="absolute w-44 h-44 rounded-full border border-red-500/20 animate-[spin_8s_linear_infinite]" />
          <div className="absolute w-36 h-36 rounded-full border border-red-500/10 animate-[spin_6s_linear_infinite_reverse]" />

          {/* Logo Container */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-red-600/25 blur-[40px] scale-150 animate-pulse" />
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-900 border-2 border-red-400/50 shadow-[0_0_60px_rgba(220,38,38,0.5)]">
              <Image src="/92lr.png" alt="92lr" width={64} height={64} className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-red-300 to-white">
              92lr
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-400/60">
              Initializing Systems
            </p>
          </div>

          {/* Animated Loading Bar */}
          <div className="w-48 h-[2px] bg-red-900/30 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-red-400 to-transparent rounded-full animate-[loadingBar_1.8s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />
          </div>

          {/* Web Particles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-red-400/40 rounded-full animate-[floatUp_2s_ease-out_infinite]" />
            <div className="absolute top-0 right-1/4 w-1.5 h-1.5 bg-red-500/30 rounded-full animate-[floatUp_2.5s_ease-out_0.3s_infinite]" />
            <div className="absolute top-0 left-1/3 w-0.5 h-0.5 bg-red-300/40 rounded-full animate-[floatUp_3s_ease-out_0.6s_infinite]" />
            <div className="absolute bottom-0 right-1/3 w-1 h-1 bg-red-400/30 rounded-full animate-[floatDown_2.8s_ease-out_0.2s_infinite]" />
            <div className="absolute bottom-0 left-1/4 w-0.5 h-0.5 bg-red-500/40 rounded-full animate-[floatDown_2.2s_ease-out_0.5s_infinite]" />
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-2 text-[9px] font-mono text-red-400/40 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>CONNECTING TO BYPASS NODE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col relative bg-[#030307]">
      {/* Spider-Man Web Pattern Background - Animated Curved Webs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Animated Corner Web SVG - Top Left */}
        <svg className="absolute top-0 left-0 w-64 h-64 opacity-20 animate-web-corner" viewBox="0 0 200 200">
          <path d="M0 0 Q50 20 100 0 Q80 50 100 100 Q50 80 0 100 Q20 50 0 0Z" fill="none" stroke="#dc2626" strokeWidth="0.5" className="web-line" />
          <path d="M0 0 Q35 15 70 0 Q55 35 70 70 Q35 55 0 70 Q15 35 0 0Z" fill="none" stroke="#dc2626" strokeWidth="0.4" className="web-line-delayed" />
          <path d="M0 0 Q20 10 40 0 Q30 20 40 40 Q20 30 0 40 Q10 20 0 0Z" fill="none" stroke="#dc2626" strokeWidth="0.3" />
          <path d="M0 0 L100 0 M0 0 L0 100 M0 0 L80 80" stroke="#dc2626" strokeWidth="0.6" opacity="0.4" />
          <path d="M30 0 Q30 30 0 30 M60 0 Q60 60 0 60 M90 0 Q90 90 0 90" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.3" />
          <path d="M0 30 Q30 30 30 0 M0 60 Q60 60 60 0 M0 90 Q90 90 90 0" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.3" />
        </svg>

        {/* Animated Corner Web SVG - Top Right */}
        <svg className="absolute top-0 right-0 w-64 h-64 opacity-20 animate-web-corner" viewBox="0 0 200 200" style={{ animationDelay: '1.5s' }}>
          <path d="M200 0 Q150 20 100 0 Q120 50 100 100 Q150 80 200 100 Q180 50 200 0Z" fill="none" stroke="#dc2626" strokeWidth="0.5" className="web-line" />
          <path d="M200 0 Q165 15 130 0 Q145 35 130 70 Q165 55 200 70 Q185 35 200 0Z" fill="none" stroke="#dc2626" strokeWidth="0.4" className="web-line-delayed" />
          <path d="M200 0 L100 0 M200 0 L200 100 M200 0 L120 80" stroke="#dc2626" strokeWidth="0.6" opacity="0.4" />
          <path d="M170 0 Q170 30 200 30 M140 0 Q140 60 200 60" fill="none" stroke="#dc2626" strokeWidth="0.3" opacity="0.3" />
        </svg>

        {/* Animated Corner Web SVG - Bottom Left */}
        <svg className="absolute bottom-0 left-0 w-48 h-48 opacity-15 animate-web-corner" viewBox="0 0 200 200" style={{ animationDelay: '3s' }}>
          <path d="M0 200 Q50 180 100 200 Q80 150 100 100 Q50 120 0 100 Q20 150 0 200Z" fill="none" stroke="#dc2626" strokeWidth="0.4" className="web-line" />
          <path d="M0 200 L100 200 M0 200 L0 100 M0 200 L70 130" stroke="#dc2626" strokeWidth="0.5" opacity="0.3" />
          <path d="M35 200 Q35 165 0 165 M65 200 Q65 135 0 135" fill="none" stroke="#dc2626" strokeWidth="0.25" opacity="0.25" />
        </svg>

        {/* Animated Corner Web SVG - Bottom Right */}
        <svg className="absolute bottom-0 right-0 w-48 h-48 opacity-15 animate-web-corner" viewBox="0 0 200 200" style={{ animationDelay: '2s' }}>
          <path d="M200 200 Q150 180 100 200 Q120 150 100 100 Q150 120 200 100 Q180 150 200 200Z" fill="none" stroke="#dc2626" strokeWidth="0.4" className="web-line" />
          <path d="M200 200 L100 200 M200 200 L200 100 M200 200 L130 130" stroke="#dc2626" strokeWidth="0.5" opacity="0.3" />
        </svg>

        {/* Swinging Spider */}
        <div className="absolute top-24 right-[15%] z-10 animate-swing">
          <svg width="28" height="40" viewBox="0 0 28 40" className="opacity-30">
            <line x1="14" y1="0" x2="14" y2="20" stroke="#dc2626" strokeWidth="0.8" opacity="0.5" />
            <ellipse cx="14" cy="28" rx="8" ry="10" fill="#dc2626" opacity="0.6" />
            <circle cx="14" cy="24" r="4" fill="#dc2626" opacity="0.7" />
            <path d="M6 28 Q2 24 4 20 M22 28 Q26 24 24 20" stroke="#dc2626" strokeWidth="1.2" fill="none" opacity="0.5" />
            <path d="M8 32 Q4 36 2 34 M20 32 Q24 36 26 34" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.4" />
          </svg>
        </div>

        {/* Floating Web Particles */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-red-500/30 blur-sm web-particle" />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-red-400/25 blur-sm web-particle" />
        <div className="absolute top-2/3 left-1/3 w-2.5 h-2.5 rounded-full bg-red-500/20 blur-sm web-particle" />
        <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-red-300/20 blur-sm web-particle" />
        <div className="absolute top-3/4 right-1/5 w-1.5 h-1.5 rounded-full bg-red-400/15 blur-sm web-particle" />
      </div>

      {/* Header */}
      <header className="w-full h-20 border-b border-red-900/30 bg-black/40 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-900 border border-red-400/30 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <Image src="/92lr.png" alt="92lr" width={26} height={26} className="object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]" />
          </div>
          <span className="text-base font-extrabold text-white tracking-widest bg-clip-text bg-gradient-to-r from-red-400 via-red-300 to-white uppercase">92lr</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 grid md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.15)] animate-intense-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-300">
              Emulator Bypass Control Center
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
            The Ultimate <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-300 to-white drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Bypass & Resource
            </span><br />
            Dashboard.
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-[55ch] leading-relaxed font-medium">
            Manage, extend, and monitor emulator bypass clients in real-time. Secure registration systems, credit allocations, and interactive database modules built on premium glassmorphism.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/login" 
              className="group relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-primary cursor-pointer shadow-[0_4px_25px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 transition-transform overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              Access Console
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link 
              href="/register" 
              className="group relative inline-flex items-center justify-center h-12 px-7 rounded-xl text-xs font-bold uppercase tracking-wider glass-button-secondary cursor-pointer hover:-translate-y-0.5 transition-transform hover:border-red-400/20 overflow-hidden"
            >
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              Create Account
            </Link>
          </div>
        </div>

        {/* Hero Interactive Widget with Logo */}
        <div className="md:col-span-5 flex justify-center animate-scale-in">
          <div className="w-full max-w-[360px] rounded-2xl glass-panel p-6 shadow-[0_0_40px_rgba(220,38,38,0.1)] space-y-5 border border-red-900/30 relative overflow-hidden group hover:shadow-[0_0_60px_rgba(220,38,38,0.2)] transition-all duration-700">
            {/* Red Glow Top */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-600/20 blur-[60px] group-hover:bg-red-600/30 transition-all duration-700" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-red-800/15 blur-[60px] group-hover:bg-red-800/25 transition-all duration-700" />
            
            {/* Web corner decoration inside widget */}
            <svg className="absolute top-0 right-0 w-20 h-20 opacity-10" viewBox="0 0 80 80">
              <path d="M80 0 Q60 10 40 0 Q50 20 40 40 Q20 30 0 40 Q10 20 0 0" fill="none" stroke="#dc2626" strokeWidth="0.5" />
              <path d="M80 0 L40 0 M80 0 L80 40" stroke="#dc2626" strokeWidth="0.4" />
            </svg>

            {/* Spider-Man Logo Display */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-600/30 blur-[25px] scale-150 group-hover:bg-red-500/40 group-hover:blur-[30px] transition-all duration-700" />
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-900 border-2 border-red-400/40 shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all duration-700">
                  <Image src="/92lr.png" alt="92lr" width={48} height={48} className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-all duration-700" />
                </div>
              </div>
              <span className="text-sm font-black text-white tracking-[0.2em] uppercase bg-clip-text bg-gradient-to-r from-red-400 to-white">92lr</span>
            </div>

            <div className="flex items-center gap-2 text-neutral-400 font-extrabold text-[10px] uppercase tracking-wider border-b border-red-900/30 pb-3">
              <Terminal className="h-4 w-4 text-red-400" />
              <span>Bypass Environment</span>
            </div>

            {/* Widget Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center rounded-xl bg-black/40 border border-red-900/30 p-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Bypass State</span>
                <span className="text-xs font-bold text-red-200">Engaged (Secure)</span>
              </div>
              <div className="flex justify-between items-center rounded-xl bg-black/40 border border-red-900/30 p-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Client Latency</span>
                <span className="text-xs font-bold font-mono text-red-300 tabular-nums">
                  {ping} ms
                </span>
              </div>
              <div className="flex justify-between items-center rounded-xl bg-black/40 border border-red-900/30 p-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Tunnels</span>
                <span className="text-xs font-mono font-bold text-red-300">3 Connected</span>
              </div>
            </div>

            <div className="text-[9px] font-semibold text-neutral-500 text-center leading-normal">
              Simulated connections dynamically synchronized via secure API tunnels.
            </div>
          </div>
        </div>
      </main>

      {/* Web Shimmer Divider */}
      <div className="web-divider mx-auto w-3/4" />

      {/* Supported Global Regions - Compact Sliding Carousel */}
      <section className="bg-gradient-to-b from-red-950/10 to-transparent py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6 relative z-10">
          {/* Header + Search Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-300">{allRegions.length} Nodes</span>
              </div>
              <h3 className="text-sm font-black text-white tracking-tight">Global Coverage</h3>
            </div>
            {/* Search Input */}
            <div className="relative w-full md:w-56">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search region..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-black/50 border border-red-900/30 text-xs text-white placeholder-red-300/30 font-semibold outline-none focus:border-red-500/50 focus:shadow-[0_0_12px_rgba(220,38,38,0.15)] transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-red-400/50 hover:text-red-300 text-xs cursor-pointer">&times;</button>
              )}
            </div>
          </div>

          {/* Auto-Scrolling Region Badges */}
          <div className="relative">
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#030307] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#030307] to-transparent z-10 pointer-events-none" />

            {/* Scrolling container */}
            <div className="overflow-hidden">
              <div className="flex gap-2.5 animate-scroll will-change-transform">
                {/* First copy */}
                {filteredRegions.map((reg, i) => (
                  <div
                    key={`a${i}`}
                    className="group/badge flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/20 border border-red-900/30 text-xs font-bold text-neutral-300 hover:border-red-500/40 hover:bg-red-900/30 hover:text-red-200 transition-all duration-300 cursor-default shrink-0"
                  >
                    <span className="text-sm select-none">{reg.flag}</span>
                    <span>{reg.name}</span>
                    <code className="text-[9px] font-mono text-neutral-600 group-hover/badge:text-red-400 transition-colors">{reg.ping}</code>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
                  </div>
                ))}
                {/* Duplicate for seamless scroll */}
                {filteredRegions.map((reg, i) => (
                  <div
                    key={`b${i}`}
                    className="group/badge flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/20 border border-red-900/30 text-xs font-bold text-neutral-300 hover:border-red-500/40 hover:bg-red-900/30 hover:text-red-200 transition-all duration-300 cursor-default shrink-0"
                  >
                    <span className="text-sm select-none">{reg.flag}</span>
                    <span>{reg.name}</span>
                    <code className="text-[9px] font-mono text-neutral-600 group-hover/badge:text-red-400 transition-colors">{reg.ping}</code>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {search && filteredRegions.length === 0 && (
            <p className="text-center text-xs text-neutral-500">No regions match your search.</p>
          )}
        </div>
      </section>

      {/* Web Shimmer Divider */}
      <div className="web-divider mx-auto w-1/2" />

      {/* Pricing & License Plans */}
      <section className="bg-gradient-to-b from-red-950/5 via-transparent to-transparent py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-red-400">Licensing Tiers</h2>
            <h3 className="text-3xl font-black text-white tracking-tight">Flexible pricing options</h3>
            <p className="text-xs text-neutral-400">
              Select between individual client bypass passes or unlock partner options through our reseller models.
            </p>

            {/* Plans Toggle */}
            <div className="inline-flex p-1 bg-black/45 border border-red-900/30 rounded-xl shadow-[inset_0_0_15px_rgba(220,38,38,0.05)]">
              <button
                onClick={() => setPricingTab("standard")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  pricingTab === "standard" 
                    ? "bg-red-600 text-white shadow-md border border-white/5" 
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Standard Passes
              </button>
              <button
                onClick={() => setPricingTab("reseller")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  pricingTab === "reseller" 
                    ? "bg-red-600 text-white shadow-md border border-white/5" 
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                Reseller Licenses
              </button>
            </div>
          </div>

          {pricingTab === "standard" ? (
            /* Standard Pricing Cards Grid */
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto justify-center">
              {standardPrices.map((plan, idx) => (
                <div 
                  key={idx}
                  className={`group rounded-2xl glass-card p-6 border relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 ${
                    plan.popular 
                      ? "border-red-500/40 bg-red-500/[0.03] shadow-[0_15px_40px_rgba(220,38,38,0.15)]" 
                      : plan.duration === "Lifetime" 
                        ? "border-red-500/40 bg-red-500/[0.02] shadow-[0_15px_40px_rgba(220,38,38,0.1)]" 
                        : "border-white/5 bg-white/[0.005]"
                  }`}
                >
                  {/* Web line hover effect */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent group-hover:w-3/4 transition-all duration-500" />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent group-hover:w-3/4 transition-all duration-500 delay-100" />
                  {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-600 text-white border border-red-400/20 shadow-md">
                        Best Value
                      </span>
                  )}
                  {plan.duration === "Lifetime" && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-600 text-white border border-red-400/20 shadow-md">
                      Infinite Access
                    </span>
                  )}
                  <div className="space-y-4">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">{plan.duration}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">{plan.priceInr}</span>
                      <span className="text-xs font-semibold text-neutral-500">/ {plan.priceUsd}</span>
                    </div>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed">{plan.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-white/5 mt-5">
                    <Link 
                      href="/login" 
                      className={`w-full inline-flex items-center justify-center h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        plan.popular
                          ? "glass-button-primary"
                          : "glass-button-secondary"
                      }`}
                    >
                      Purchase Pass
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Reseller Plans Table/Grid */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {resellerPlans.map((plan, idx) => (
                <div 
                  key={idx}
                  className={`group rounded-2xl glass-card p-6 border relative flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 ${
                    plan.special
                      ? "border-red-500/40 bg-red-500/[0.03] shadow-[0_15px_40px_rgba(220,38,38,0.15)]"
                      : "border-white/5 bg-white/[0.005]"
                  }`}
                >
                  {/* Web line hover effect */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent group-hover:w-3/4 transition-all duration-500" />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent group-hover:w-3/4 transition-all duration-500 delay-100" />
                  {plan.special && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-red-600 text-white border border-red-400/20 shadow-md">
                      Unlimited Credits
                    </span>
                  )}
                  <div className="space-y-4">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">{plan.tier}</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">{plan.limit}</span>
                    </div>
                    <div className="flex justify-between items-center rounded-xl bg-black/35 border border-white/5 p-3.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500">Bundle Price</span>
                      <span className="text-sm font-black text-red-300 font-mono">{plan.price}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">{plan.rate}</div>
                  </div>
                  <div className="pt-6 border-t border-white/5 mt-5">
                    <Link 
                      href="/login" 
                      className={`w-full inline-flex items-center justify-center h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        plan.special
                          ? "glass-button-primary"
                          : "glass-button-secondary"
                      }`}
                    >
                      Acquire Licenses
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Web Shimmer Divider */}
      <div className="web-divider mx-auto w-3/4" />

      {/* Engine Features Grid Section */}
      <section className="bg-gradient-to-b from-transparent via-red-950/5 to-red-950/10 py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-red-400">Engine Features</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Built for speed, styled for convenience.</h3>
            <p className="text-xs text-neutral-400">
              Explore the advanced suite of utilities engineered to optimize and secure your access database.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: "Real-time Monitor",
                desc: "Monitor tunnel durations, dynamic latency metrics, and bandwidth data synchronization."
              },
              {
                icon: Shield,
                title: "Win 10/11 Security",
                desc: "High-grade client integration bypass designed specifically for Windows environments."
              },
              {
                icon: Globe,
                title: "Central Audit Logs",
                desc: "A tamper-proof ledger tracking user creations, password updates, and credit resets."
              },
              {
                icon: Database,
                title: "Frosted Analytics",
                desc: "View clear donut charts, metrics tabs, and status allocation widgets dynamically."
              }
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="group rounded-2xl glass-card p-6 border border-white/5 shadow-lg space-y-4 hover:-translate-y-1 hover:border-red-500/10 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent group-hover:w-full transition-all duration-500" />
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-sm group-hover:bg-red-500/20 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all duration-500">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="relative z-10 text-sm font-bold text-white uppercase tracking-wider">{feat.title}</h4>
                  <p className="relative z-10 text-xs text-neutral-400 leading-relaxed font-semibold">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Web Shimmer Divider */}
      <div className="web-divider mx-auto w-1/3" />

      {/* Footer */}
      <footer className="bg-gradient-to-t from-black/60 via-red-950/5 to-transparent py-8 text-center text-xs text-neutral-500 font-semibold uppercase tracking-wider relative z-10 mt-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-40">
            <ellipse cx="6" cy="6" rx="3" ry="4" fill="#dc2626" opacity="0.6" />
            <circle cx="6" cy="5" r="2" fill="#dc2626" opacity="0.7" />
            <path d="M3 6 Q1 5 2 4 M9 6 Q11 5 10 4" stroke="#dc2626" strokeWidth="0.8" fill="none" opacity="0.5" />
          </svg>
          <span className="text-red-400 font-black tracking-[0.3em]">92lr</span>
          <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-40">
            <ellipse cx="6" cy="6" rx="3" ry="4" fill="#dc2626" opacity="0.6" />
            <circle cx="6" cy="5" r="2" fill="#dc2626" opacity="0.7" />
            <path d="M3 6 Q1 5 2 4 M9 6 Q11 5 10 4" stroke="#dc2626" strokeWidth="0.8" fill="none" opacity="0.5" />
          </svg>
        </div>
        &copy; {new Date().getFullYear()} — All rights reserved.
      </footer>
    </div>
  );
}
