"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Crown, Star, ArrowUp, X, MapPin } from "lucide-react";
import { Participant, CURRENT_USER } from "@/lib/ranking";
import { RegionFilter } from "./region-filter";
import { getRegionName } from "@/lib/regions";
import { cn, formatNumber } from "@/lib/utils";

interface LeaderboardTableProps {
  initialParticipants: Participant[];
  initialRegion?: string;
  totalParticipants: number;
  currentUserRankGlobal: number;
  currentUserRankRegional: number;
  twoColumn?: boolean;
}

/**
 * Reyting jadvali komponenti
 * Ikki ustunli yoki bitta ustunli ko'rinishni qo'llab-quvvatlaydi
 * Hudud bo'yicha filtrlash imkoniyati mavjud
 */
export function LeaderboardTable({
  initialParticipants,
  initialRegion = "all",
  totalParticipants,
  currentUserRankGlobal,
  currentUserRankRegional,
  twoColumn = false,
}: LeaderboardTableProps) {
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);

  const participants = useMemo(() => {
    if (!selectedRegion || selectedRegion === "all") {
      return initialParticipants;
    }
    return initialParticipants.filter((p) => p.region === selectedRegion);
  }, [initialParticipants, selectedRegion]);

  /**
   * Ishtirokchilarni ikkiga bo'lish (twoColumn rejimida)
   */
  const { leftColumn, rightColumn } = useMemo(() => {
    if (!twoColumn) {
      return { leftColumn: participants, rightColumn: [] };
    }
    const mid = Math.ceil(participants.length / 2);
    return {
      leftColumn: participants.slice(0, mid),
      rightColumn: participants.slice(mid)
    };
  }, [participants, twoColumn]);

  const isAll = !selectedRegion || selectedRegion === "all";
  const currentRegionName = getRegionName(selectedRegion, "uz");

  /**
   * Hudud tanlanganida URL ni yangilash va filtr o'zgartirish
   */
  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    // URL ni yangilash (sahifani reload qilmasdan)
    const url = new URL(window.location.href);
    if (regionId === "all") {
      url.searchParams.delete("region");
    } else {
      url.searchParams.set("region", regionId);
    }
    window.history.pushState({}, "", url.toString());
  };

  /**
   * Rank badge elementini yaratish
   * 1, 2, 3-o'rinlar uchun maxsus badge, qolganlari uchun oddiy raqam
   */
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)] animate-pulse-subtle" role="img" aria-label="1-o'rin">
          <Crown className="w-4.5 h-4.5 fill-amber-400 text-amber-400" aria-hidden="true" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-lg bg-slate-400/20 border-2 border-slate-400/50 flex items-center justify-center text-slate-700 dark:text-slate-200 font-black text-sm shadow-md" aria-label="2-o'rin">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-lg bg-amber-700/20 border-2 border-amber-600/50 flex items-center justify-center text-amber-600 dark:text-amber-300 font-black text-sm shadow-md" aria-label="3-o'rin">
          3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-sm" aria-label={`${rank}-o'rin`}>
        {rank}
      </div>
    );
  };

  /**
   * Ishtirokchining boshlang'ich harflarini olish (avatar yo'q bo'lsa)
   */
  const getInitials = (p: Participant) => {
    const first = p.firstName?.[0] || "";
    const last = p.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="space-y-3 pb-20 relative">
      {/* Top Header Section with Title and Filter Icon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span>
                {isAll
                  ? "Umumiy Reyting Jadvali"
                  : `${currentRegionName.toUpperCase()} REYTINGI`}
              </span>
            </h1>

            {/* Active Filter Badge with Reset */}
            {!isAll && (
              <button
                onClick={() => handleRegionSelect("all")}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/80 border border-cyan-500/40 text-xs font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 transition-colors shadow-sm cursor-pointer"
              >
                <span>{currentRegionName}</span>
                <X className="w-3 h-3 text-cyan-500 hover:text-slate-900 dark:hover:text-white" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            STEM musobaqalari va mashg'ulotlarida eng yuqori natija ko'rsatgan ishtirokchilar • {formatNumber(totalParticipants)} nafar ishtirokchi
          </p>
        </div>

        {/* Region Filter Button */}
        <div className="relative flex items-center gap-3 self-end sm:self-auto">
          <RegionFilter
            selectedRegion={selectedRegion}
            onSelectRegion={handleRegionSelect}
            locale="uz"
          />
        </div>
      </div>

      {/* Leaderboard Table Container */}
      {participants.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Hozircha ishtirokchilar yo'q</h2>
        </div>
      ) : twoColumn ? (
        // TWO COLUMN LAYOUT (like in the reference image)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Left Column */}
          <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-[#14223d]/60">
              {leftColumn.map((p) => {
                const isMe = p.id === CURRENT_USER.id;
                const rank = p.rank || 1;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-all",
                      isMe ? "bg-cyan-500/10 dark:bg-cyan-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    )}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      {rank <= 3 ? getRankBadge(rank) : (
                        <span className="text-sm font-bold text-slate-400">{rank}</span>
                      )}
                    </div>
                    {p.avatarUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 flex-shrink-0">
                        <Image src={p.avatarUrl} alt={p.firstName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                        {getInitials(p)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        @{p.firstName.toLowerCase()}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                      {formatNumber(p.totalXp)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column */}
          <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-[#14223d]/60">
              {rightColumn.map((p) => {
                const isMe = p.id === CURRENT_USER.id;
                const rank = p.rank || 1;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 transition-all",
                      isMe ? "bg-cyan-500/10 dark:bg-cyan-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                    )}
                  >
                    <div className="flex-shrink-0 w-8 text-center">
                      {rank <= 3 ? getRankBadge(rank) : (
                        <span className="text-sm font-bold text-slate-400">{rank}</span>
                      )}
                    </div>
                    {p.avatarUrl ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 flex-shrink-0">
                        <Image src={p.avatarUrl} alt={p.firstName} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 flex-shrink-0">
                        {getInitials(p)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {p.firstName} {p.lastName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        @{p.firstName.toLowerCase()}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                      {formatNumber(p.totalXp)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] shadow-sm overflow-hidden backdrop-blur-xs transition-colors">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-[#14223d] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-transparent">
            <div className="col-span-2 sm:col-span-1 text-center">O'rni</div>
            <div className="col-span-8 sm:col-span-9 pl-2">Ishtirokchi</div>
            <div className="col-span-2 text-right pr-2">Ball (XP)</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100 dark:divide-[#14223d]/60">
            {participants.map((p) => {
              const isMe = p.id === CURRENT_USER.id;
              const rank = p.rank || 1;

              return (
                <div
                  key={p.id}
                  id={isMe ? "current-user-row" : undefined}
                  className={cn(
                    "grid grid-cols-12 px-4 sm:px-5 py-2.5 sm:py-3 items-center transition-all duration-200 relative",
                    isMe
                      ? "bg-cyan-500/10 dark:bg-cyan-950/40 border-y-2 border-cyan-500/80 shadow-[inset_0_0_20px_rgba(6,182,212,0.15)] my-0.5"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/40"
                  )}
                >
                  {/* 1. Rank */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center items-center">
                    {getRankBadge(rank)}
                  </div>

                  {/* 2. Participant Profile */}
                  <div className="col-span-8 sm:col-span-9 pl-2 flex items-center gap-3.5">
                    {p.avatarUrl ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-500/30 shrink-0">
                        <Image
                          src={p.avatarUrl}
                          alt={p.firstName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                        {getInitials(p)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "text-sm font-semibold truncate",
                          isMe ? "text-cyan-700 dark:text-cyan-300 font-bold" : "text-slate-900 dark:text-white"
                        )}>
                          {p.firstName} {p.lastName}
                        </span>

                        {isMe && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                            <Star className="w-2.5 h-2.5 fill-cyan-500 text-cyan-500" />
                            <span>Siz</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{getRegionName(p.region, "uz")}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. XP Points */}
                  <div className="col-span-2 text-right pr-2">
                    <span className={cn(
                      "text-sm font-bold font-mono tracking-tight",
                      isMe ? "text-cyan-600 dark:text-cyan-400" : "text-cyan-600 dark:text-cyan-400/90"
                    )}>
                      {formatNumber(p.totalXp)} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar for Current User */}
      <div className="fixed bottom-4 left-4 right-4 lg:left-[272px] lg:right-8 z-40 pointer-events-none">
        <div className="pointer-events-auto rounded-3xl bg-white/95 dark:bg-[#091122]/95 border-2 border-cyan-500/70 p-3.5 sm:p-4 shadow-[0_10px_35px_rgba(6,182,212,0.25)] backdrop-blur-md flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-4 min-w-0">
            {/* Rank info */}
            <div className="flex flex-col items-center justify-center px-3 border-r border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">O'rningiz</span>
              <span className="text-xl font-black text-cyan-600 dark:text-cyan-400">#{currentUserRankGlobal}</span>
            </div>

            {/* Avatar va Foydalanuvchi ma'lumotlari */}
            <div className="flex items-center gap-3 min-w-0">
              {CURRENT_USER.avatarUrl ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/50 shadow-sm shrink-0 hidden sm:block">
                  <Image
                    src={CURRENT_USER.avatarUrl}
                    alt={CURRENT_USER.firstName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-sm font-bold text-cyan-600 dark:text-cyan-300 shrink-0 hidden sm:block">
                  {CURRENT_USER.firstName[0]}{CURRENT_USER.lastName[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-semibold hidden md:inline">
                    Sizning pozitsiyangiz
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex-wrap">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{CURRENT_USER.totalXp} XP</span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-slate-700 dark:text-slate-300 hidden sm:inline">🇺🇿 O'zbekistonda: #{currentUserRankGlobal}</span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-slate-700 dark:text-slate-300 hidden sm:inline">📍 {getRegionName(CURRENT_USER.region, "uz")}: #{currentUserRankRegional}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky foydalanuvchi pozitsiyasi pastda */}
          <button
            onClick={() => {
              const el = document.getElementById("current-user-row");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            aria-label="Foydalanuvchi joylashuviga o'tish"
            className="w-9 h-9 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
