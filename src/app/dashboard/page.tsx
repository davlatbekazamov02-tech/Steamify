import { getLeaderboardData, CURRENT_USER } from "@/lib/ranking";
import { getRegionName } from "@/lib/regions";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MyRankingCard } from "@/components/ranking/my-ranking-card";
import { LeaderboardTable } from "@/components/ranking/leaderboard-table";
import { Users, Trophy, Sparkles, MapPin } from "lucide-react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Reyting — Global va Viloyat bo'yicha",
  description:
    "STEMIFY global va viloyat bo'yicha reyting jadvali. XP ballaringizni ko'ring va top ishtirokchilar bilan raqobatlashing.",
  keywords: ["reyting", "leaderboard", "XP", "STEM", "O'zbekiston"],
};

/**
 * Asosiy reyting sahifasi
 * Global va viloyat bo'yicha reytingni ko'rsatadi
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  // URL parametrlarini olish
  const { region } = await searchParams;
  
  // Reyting ma'lumotlarini yuklash
  const data = getLeaderboardData(region);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors">
      {/* Left Navigation Sidebar - Fixed */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar pageTitle="REYTING" />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full space-y-4 sm:space-y-5">
          {/* Statistika kartalari - Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* 1. Jami Ishtirokchilar */}
            <div className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 dark:from-cyan-950/40 dark:to-blue-950/20 border border-cyan-500/20 dark:border-cyan-900/40 p-4 sm:p-5 relative overflow-hidden group hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Jami Ishtirokchilar
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center" aria-hidden="true">
                    <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {data.total}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Faol a'zolar</p>
              </div>
            </div>

            {/* 2. Sizning O'rningiz */}
            <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-500/20 dark:border-amber-900/40 p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Sizning O'rningiz
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/20 flex items-center justify-center" aria-hidden="true">
                    <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  #{data.currentUser.globalRank}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">O'zbekiston bo'yicha</p>
              </div>
            </div>

            {/* 3. Sizning XP ballaringiz */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-500/20 dark:border-emerald-900/40 p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Sizning XP
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center" aria-hidden="true">
                    <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {CURRENT_USER.totalXp}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Tajriba ballari</p>
              </div>
            </div>

            {/* 4. Viloyat bo'yicha o'rningiz */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 dark:from-purple-950/40 dark:to-pink-950/20 border border-purple-500/20 dark:border-purple-900/40 p-4 sm:p-5 relative overflow-hidden group hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Viloyat O'rni
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-500/20 flex items-center justify-center" aria-hidden="true">
                    <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
                  #{data.currentUser.regionalRank}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                  {getRegionName(CURRENT_USER.region, "uz")}
                </p>
              </div>
            </div>
          </div>

          {/* Shaxsiy reyting kartasi */}
          <MyRankingCard
            globalRank={data.currentUser.globalRank}
            globalTotal={data.currentUser.globalTotal}
            regionalRank={data.currentUser.regionalRank}
            regionalTotal={data.currentUser.regionalTotal}
            regionName={CURRENT_USER.region}
            points={CURRENT_USER.totalXp}
            compact={true}
          />

          {/* Asosiy Reyting Jadvali */}
          <LeaderboardTable
            initialParticipants={data.participants}
            initialRegion={region || "all"}
            totalParticipants={data.total}
            currentUserRankGlobal={data.currentUser.globalRank}
            currentUserRankRegional={data.currentUser.regionalRank}
            twoColumn={true}
          />
        </main>
      </div>
    </div>
  );
}
