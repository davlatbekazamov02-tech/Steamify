"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  ArrowRight, 
  Camera,
  Layers
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { getEvents, getEventRegistrationCount, SteamEvent } from "@/lib/events-store";
import { getRegionName } from "@/lib/regions";

export default function MentorSessionsPage() {
  const [sessions, setSessions] = useState<SteamEvent[]>([]);

  useEffect(() => {
    setSessions(getEvents());
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="MENTOR SESSIYALARI VA GURUHLAR" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Biriktirilgan Sessiyalar
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Super Admin tomonidan yaratilgan tadbir va mashg‘ulotlar ro'yxati
              </p>
            </div>

            <Link
              href="/mentor/scanner"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>QR Skanerga O'tish</span>
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-8 text-center flex flex-col items-center justify-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-2">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hozircha biriktirilgan sessiyalar yo'q
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Super Admin tomonidan yangi tadbir yoki mashg'ulot qo'shilgandan so'ng, bu yerda avtomatik ko'rinadi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {sessions.map((sess) => {
                const regCount = getEventRegistrationCount(sess.id);
                return (
                  <div
                    key={sess.id}
                    className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-cyan-500/50 hover:shadow-lg transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                          {sess.category || "Tadbir"}
                        </span>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          +{sess.xpReward} XP
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                        {sess.title}
                      </h3>

                      <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{sess.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{sess.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span className="line-clamp-1">{sess.location} ({getRegionName(sess.region, "uz")})</span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Ishtirokchilar:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {regCount} / {sess.maxParticipants}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${Math.min(100, (regCount / sess.maxParticipants) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3">
                      <Link
                        href={`/mentor/scanner?eventId=${sess.id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        <span>Skanerni Boshlash</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
