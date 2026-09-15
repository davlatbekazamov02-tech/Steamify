"use client";

import { useState, useRef } from "react";
import {
  Users,
  Search,
  Filter,
  Award,
  Plus,
  ShieldCheck,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { UZBEKISTAN_REGIONS } from "@/lib/regions";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  region: string;
  role: "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";
  xp: number;
  level: number;
  status: "Faol" | "Nofaol";
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [xpModalUser, setXpModalUser] = useState<ManagedUser | null>(null);
  const [xpAdjustment, setXpAdjustment] = useState(10);
  const [xpReason, setXpReason] = useState("Aktiv ishtirok uchun rag'bat");
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  // ✅ setTimeout ref — cleanup uchun
  const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [users, setUsers] = useState<ManagedUser[]>([]);

  const handleApplyXp = () => {
    if (!xpModalUser) return;
    setUsers(
      users.map((u) =>
        u.id === xpModalUser.id ? { ...u, xp: u.xp + Number(xpAdjustment) } : u
      )
    );
    setAlertMsg(`${xpModalUser.name} foydalanuvchisiga ${xpAdjustment > 0 ? "+" : ""}${xpAdjustment} XP qo'shildi! Sabab: ${xpReason}`);
    setXpModalUser(null);
    // ✅ Oldingi timeoutni bekor qilib, yangi timeout o'rnatish
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlertMsg(null), 4000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === "all" || u.region === regionFilter;
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRegion && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="FOYDALANUVCHILAR VA BALLAR BOSHQARUVI" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Foydalanuvchilar Ro‘yxati
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ishtirokchilar, mentorlar va administratorlar bazasi hamda XP berish
              </p>
            </div>
          </div>

          {alertMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{alertMsg}</span>
            </div>
          )}

          {/* Search & Filter bar */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ism yoki email orqali izlash..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Barcha Viloyatlar</option>
                {UZBEKISTAN_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name.uz}
                  </option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Barcha Rollar</option>
                <option value="USER">Ishtirokchi (USER)</option>
                <option value="MENTOR">Mentor</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Foydalanuvchi</th>
                    <th className="px-6 py-4">Viloyat</th>
                    <th className="px-6 py-4">Roli</th>
                    <th className="px-6 py-4">XP / Daraja</th>
                    <th className="px-6 py-4">Holat</th>
                    <th className="px-6 py-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {UZBEKISTAN_REGIONS.find((r) => r.id === u.region)?.name.uz || u.region}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : u.role === "ADMIN"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : u.role === "MENTOR"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                          {u.xp} XP
                        </span>{" "}
                        <span className="text-slate-400 font-semibold">• {u.level}-daraja</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setXpModalUser(u)}
                          className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 hover:text-slate-950 text-cyan-600 dark:text-cyan-400 font-bold rounded-lg border border-cyan-500/30 transition-all cursor-pointer"
                        >
                          XP Berish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* XP Adjustment Modal */}
          {xpModalUser && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0d1527] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-cyan-500" />
                    <span>XP Ball Taqdim Etish</span>
                  </h3>
                  <button
                    onClick={() => setXpModalUser(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Foydalanuvchi: <strong className="text-slate-900 dark:text-white">{xpModalUser.name}</strong> ({xpModalUser.xp} XP)
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ball Miqdori (musbat yoki manfiy):
                  </label>
                  <input
                    type="number"
                    value={xpAdjustment}
                    onChange={(e) => setXpAdjustment(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ball berish sababi:
                  </label>
                  <input
                    type="text"
                    value={xpReason}
                    onChange={(e) => setXpReason(e.target.value)}
                    placeholder="Masalan: Eng yaxshi debatchi mukofoti"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    onClick={() => setXpModalUser(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleApplyXp}
                    className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 cursor-pointer"
                  >
                    Tasdiqlash
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
