"use client";

import { useState, useRef } from "react";
import {
  Save,
  CheckCircle2,
  Award,
  Calendar,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { ANIMATION_SPEED, XP_REWARDS } from "@/lib/constants";

const SETTINGS_KEY = "STEMIFY_system_settings";

export default function AdminSystemSettingsPage() {
  // localStorage dan oldingi sozlamalarni yuklash
  const loadSettings = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  };

  const saved = typeof window !== "undefined" ? loadSettings() : null;

  const [applicationsEnabled, setApplicationsEnabled] = useState<boolean>(saved?.applicationsEnabled ?? true);
  const [deadline, setDeadline] = useState<string>(saved?.deadline ?? "2026-10-31");
  const [maxApplications, setMaxApplications] = useState<number>(saved?.maxApplications ?? 500);
  const [attendanceXp, setAttendanceXp] = useState<number>(saved?.attendanceXp ?? XP_REWARDS.SESSION_CHECKIN);
  const [winnerXp, setWinnerXp] = useState<number>(saved?.winnerXp ?? XP_REWARDS.CHALLENGE_FIRST_PLACE);
  const [bestDebaterXp, setBestDebaterXp] = useState<number>(saved?.bestDebaterXp ?? XP_REWARDS.WORKSHOP_COMPLETION);
  const [referralXp, setReferralXp] = useState<number>(saved?.referralXp ?? XP_REWARDS.REFERRAL);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // ✅ setTimeout ref — cleanup uchun
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSave = () => {
    // ✅ localStorage ga saqlash
    const settings = {
      applicationsEnabled,
      deadline,
      maxApplications,
      attendanceXp,
      winnerXp,
      bestDebaterXp,
      referralXp,
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}

    setSavedSuccess(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(
      () => setSavedSuccess(false),
      ANIMATION_SPEED.TOAST
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="TIZIM VA GAMIFIKATSIYA SOZLAMALARI" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Platforma Global Sozlamalari
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Arizalar qabuli, muddatlar va XP gamifikatsiya mexanizmi qiymatlari
              </p>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>O‘zgarishlarni Saqlash</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Barcha sozlamalar muvaffaqiyatli saqlandi va tizimda faollashtirildi!</span>
            </div>
          )}

          {/* Section 1: Admissions / Application controls */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Calendar className="w-4 h-4 text-cyan-500" />
              <span>Arizalar Qabuli Holati</span>
            </h2>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Yangi ishtirokchilar uchun ariza qabul qilish
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  O'chirilganda foydalanuvchilar qabul yopilganligi haqida xabar ko'rishadi
                </div>
              </div>

              <button
                type="button"
                onClick={() => setApplicationsEnabled(!applicationsEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  applicationsEnabled
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                    : "bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                }`}
              >
                {applicationsEnabled ? "Yoniq (Faol)" : "O'chiq (Yopiq)"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Qabul Yakunlanish Muddati (Deadline):
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Maksimal qabul qilinuvchi arizalar soni:
                </label>
                <input
                  type="number"
                  value={maxApplications}
                  onChange={(e) => setMaxApplications(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: XP Gamification values */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-4 h-4 text-amber-500" />
              <span>XP Gamifikatsiya Qiymatlari (Ballar tizimi)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Sessiyaga QR tashrif (Davomat) XP:
                </label>
                <input
                  type="number"
                  value={attendanceXp}
                  onChange={(e) => setAttendanceXp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Musobaqa G'olibligi (Winner) XP:
                </label>
                <input
                  type="number"
                  value={winnerXp}
                  onChange={(e) => setWinnerXp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Eng faol debatchi (Best Debater) XP:
                </label>
                <input
                  type="number"
                  value={bestDebaterXp}
                  onChange={(e) => setBestDebaterXp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Do'stni taklif qilish (Referal) XP:
                </label>
                <input
                  type="number"
                  value={referralXp}
                  onChange={(e) => setReferralXp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
