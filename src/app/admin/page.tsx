"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Calendar, 
  Award, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Settings, 
  ArrowUpRight,
  Sparkles,
  Sliders,
  UserCheck
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Jami Foydalanuvchilar",
      value: "5,240",
      change: "+12% bu oy",
      icon: Users,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    },
    {
      title: "Faol Sessiyalar",
      value: "6 ta",
      change: "2 tasi bugun",
      icon: Calendar,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      title: "Jami Taqdim Etilgan XP",
      value: "84,350",
      change: "+4,200 oxirgi hafta",
      icon: Award,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/30",
    },
    {
      title: "Topshirilgan Arizalar",
      value: "348",
      change: "18 tasi ko'rib chiqilmoqda",
      icon: FileText,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="BOSHQARUV PANELI (ADMIN DASHBOARD)" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-[#0c1424] border border-cyan-900/40 p-5 sm:p-6 rounded-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>STEMIFY Markaziy Boshqaruv Tizimi</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Boshqaruv va Monitoring Markazi
              </h1>
              <p className="text-sm text-slate-300 mt-2">
                STEM platformasining barcha viloyatlar bo'yicha ishtirokchilari, o'tkazilayotgan tadbirlar, arizalar va ballar dinamikasi nazorati.
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 rounded-2xl shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {s.title}
                    </span>
                    <div className={`p-2 rounded-xl border ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {s.value}
                  </div>
                  <div className="text-xs font-semibold text-emerald-500">
                    {s.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Link
              href="/admin/users"
              className="group bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 sm:p-5 rounded-2xl shadow-sm hover:border-cyan-500/60 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                  Foydalanuvchilar Nazorati
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Barcha 14 ta hudud ishtirokchilari ro'yxati, ballar (XP) taqsimoti, faollik ko'rsatkichlari.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                <span>O'tish</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/admin/applications"
              className="group bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 sm:p-5 rounded-2xl shadow-sm hover:border-purple-500/60 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                  Arizalar Tahlili
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Kelib tushgan qabul arizalarini ko'rib chiqish, qabul qilish, rad etish yoki kutish ro'yxatiga olish.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
                <span>Ko'rib chiqish</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/admin/system-settings"
              className="group bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 sm:p-5 rounded-2xl shadow-sm hover:border-amber-500/60 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  Tizim Sozlamalari
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Arizalar qabulini yoqish/o'chirish, davomat va g'oliblik XP qiymatlarini sozlash.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span>Sozlash</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          </div>

          {/* Super Admin Special Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-200">
                  Bosh Administrator Maxsus Bo'limi: Adminlar Nazorati
                </h4>
                <p className="text-xs text-purple-300/70 mt-0.5">
                  Faqat Super Admin uchun: Yangi adminlarni tayinlash, mentorlar huquqlarini boshqarish.
                </p>
              </div>
            </div>
            <Link
              href="/admin/admins"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all shrink-0"
            >
              Adminlarni Boshqarish
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
