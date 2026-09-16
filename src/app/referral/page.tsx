"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Gift, Users, Trophy } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { APP_URL } from "@/lib/constants";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("USER");

  useEffect(() => {
    const match = document.cookie.match(new RegExp("(^| )STEMIFY_role=([^;]+)"));
    if (match && match[2]) setCurrentRole(match[2] as UserRole);
  }, []);

  const currentUser = DEMO_USERS[currentRole];
  const referralCode = currentUser.referralCode || "STEAM2026";
  const referralLink = `${APP_URL}/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="REFERAL HAVOLA" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          {/* Header Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-[#080d1a] border border-cyan-500/30 p-5 sm:p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-3">
                <Gift className="w-3.5 h-3.5 text-cyan-400" />
                <span>+50 XP HAR BIR DO‘STINGIZ UCHUN</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white leading-tight">
                Do‘stlaringizni taklif qiling va reytingda ko‘tariling!
              </h1>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Do‘stlaringiz sizning referal havolangiz orqali ro‘yxatdan o‘tib, birinchi tadbirga qatnashganda sizga ham, ularga ham qo‘shimcha XP beriladi.
              </p>

              {/* Referral Link Box */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-900/50 text-xs font-mono text-cyan-300 select-all"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Nusxalandi!" : "Nusxalash"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Jami taklif qilinganlar</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">6 nafar</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Faol ishtirokchilar</span>
              <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">4 nafar</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 shadow-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">To‘plangan bonus XP</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">+200 XP</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
