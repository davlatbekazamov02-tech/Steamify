"use client";

import { Trophy, MapPin, TrendingUp, Sparkles } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { getRegionName } from "@/lib/regions";

interface MyRankingCardProps {
  globalRank: number;
  globalTotal: number;
  regionalRank: number;
  regionalTotal: number;
  regionName: string;
  points: number;
  compact?: boolean;
}

/**
 * Foydalanuvchining shaxsiy reyting kartasi
 * Global va viloyat reytingini ko'rsatadi
 */
export function MyRankingCard({
  globalRank,
  globalTotal,
  regionalRank,
  regionalTotal,
  regionName,
  points,
  compact = false,
}: MyRankingCardProps) {
  const localizedRegion = getRegionName(regionName, "uz");

  // Progress bar foizini hisoblash (eng kam 5%, eng ko'p 100%)
  const calculateProgress = (rank: number, total: number): number => {
    if (total === 0) return 5;
    const percentage = 100 - (rank / total) * 100;
    return Math.max(5, Math.min(100, percentage));
  };

  const globalProgress = calculateProgress(globalRank, globalTotal);
  const regionalProgress = calculateProgress(regionalRank, regionalTotal);

  return (
    <div className="rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0c1426] dark:via-[#090f1d] dark:to-[#060a15] border border-slate-200 dark:border-cyan-900/40 p-4 sm:p-5 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Orqa fonda yorqin effektlar (faqat dark mode) */}
      <div className="hidden dark:block absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500" />
      <div className="hidden dark:block absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Sarlavha va umumiy XP */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-sm">
            <Trophy className="w-4.5 h-4.5" />
          </div>
          <h2 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-white">
            Mening Shaxsiy Reytingim
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 text-xs font-bold text-cyan-700 dark:text-cyan-300 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>{formatNumber(points)} XP</span>
        </div>
      </div>

      {/* Ikki ustunli reyting kartalari */}
      <div className={`grid ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"} gap-3 relative z-10`}>
        
        {/* 1. O'zbekiston bo'yicha reyting */}
        <div className="rounded-xl bg-slate-50 dark:bg-[#090f1d]/80 border border-slate-200 dark:border-slate-800/80 p-3.5 hover:border-cyan-500/40 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span role="img" aria-label="O'zbekiston">🇺🇿</span>
              <span>O'zbekiston bo'yicha</span>
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-500" aria-hidden="true" />
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-400">
              #{globalRank}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              / {formatNumber(globalTotal)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-2">
            <span>{globalRank}-o'rinda</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold">{formatNumber(points)} XP</span>
          </div>
          
          {/* Progress bar - Global */}
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 rounded-full shadow-sm transition-all duration-500 ease-out"
              style={{ width: `${globalProgress}%` }}
              role="progressbar"
              aria-valuenow={globalProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Global reyting: ${globalProgress.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* 2. Viloyat bo'yicha reyting */}
        <div className="rounded-xl bg-slate-50 dark:bg-[#090f1d]/80 border border-slate-200 dark:border-slate-800/80 p-3.5 hover:border-amber-500/40 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span className="truncate">{localizedRegion}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold whitespace-nowrap">
              Viloyat
            </span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-500 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-400">
              #{regionalRank}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              / {formatNumber(regionalTotal)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-2">
            <span>{regionalRank}-o'rinda</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{formatNumber(points)} XP</span>
          </div>
          
          {/* Progress bar - Regional */}
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 rounded-full shadow-sm transition-all duration-500 ease-out"
              style={{ width: `${regionalProgress}%` }}
              role="progressbar"
              aria-valuenow={regionalProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Viloyat reyting: ${regionalProgress.toFixed(1)}%`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
