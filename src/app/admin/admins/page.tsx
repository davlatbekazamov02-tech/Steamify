"use client";

import { useState } from "react";
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Award,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MENTOR" | "SUPER_ADMIN";
  appointedAt: string;
  appointedBy: string;
  isSelf?: boolean;
}

export default function SuperAdminAdminsPage() {
  const [adminList, setAdminList] = useState<AdminUser[]>([]);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  // ✅ as any o'rniga to'g'ri type
  const [selectedNewRole, setSelectedNewRole] = useState<"ADMIN" | "MENTOR">("ADMIN");
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // ✅ confirm() o'rniga custom confirm modal
  const [demoteTarget, setDemoteTarget] = useState<AdminUser | null>(null);

  const handleAppoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes("@")) {
      setAlert({ type: "error", msg: "Iltimos, to'g'ri email manzil kiriting." });
      return;
    }

    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}`,
      name: newAdminEmail.split("@")[0].toUpperCase(),
      email: newAdminEmail.trim(),
      role: selectedNewRole,
      appointedAt: new Date().toLocaleDateString("uz-UZ"),
      appointedBy: "Jahongir Rahmonov (Super Admin)",
    };

    setAdminList([...adminList, newAdmin]);
    setAlert({
      type: "success",
      msg: `Muvaffaqiyatli! ${newAdmin.email} foydalanuvchisiga ${selectedNewRole} huquqi berildi.`,
    });
    setNewAdminEmail("");
  };

  const handleDemoteRequest = (admin: AdminUser) => {
    if (admin.role === "SUPER_ADMIN") {
      setAlert({ type: "error", msg: "Xavfsizlik qoidasi: Bosh Admin (SUPER_ADMIN) huquqini pasaytirib bo'lmaydi!" });
      return;
    }
    // ✅ confirm() o'rniga modal ochish
    setDemoteTarget(admin);
  };

  const handleDemoteConfirm = () => {
    if (!demoteTarget) return;
    setAdminList(adminList.filter((a) => a.id !== demoteTarget.id));
    setAlert({ type: "success", msg: `${demoteTarget.name} administratorlar safidan chiqarildi.` });
    setDemoteTarget(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="SUPER ADMIN: ADMINLAR VA MENTORLAR NAZORATI" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Maxsus Imtiyozli Hudud
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              Administratorlar va Mentorlar Tarkibi
            </h1>
            <p className="text-xs text-purple-200/80 mt-1 max-w-2xl">
              Ushbu sahifa faqat <strong>SUPER_ADMIN</strong> roli uchun mavjud. Yangi adminlar va
              mentorlarni tayinlashingiz hamda lavozimdan ozod qilishingiz mumkin.
            </p>
          </div>

          {alert && (
            <div
              role="alert"
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
                alert.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
              )}
              <span>{alert.msg}</span>
              <button
                onClick={() => setAlert(null)}
                aria-label="Xabarni yopish"
                className="ml-auto text-current opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Appoint new admin form */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-500" aria-hidden="true" />
              <span>Yangi Mas&apos;ul Xodimni Tayinlash</span>
            </h2>

            <form onSubmit={handleAppoint} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Foydalanuvchi elektron pochtasi (email)..."
                aria-label="Yangi admin email manzili"
                required
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
              />

              <select
                value={selectedNewRole}
                onChange={(e) => setSelectedNewRole(e.target.value as "ADMIN" | "MENTOR")}
                aria-label="Yangi admin roli"
                className="px-3 py-2.5 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="ADMIN">Administrator (ADMIN)</option>
                <option value="MENTOR">Mentor (MENTOR)</option>
              </select>

              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer shrink-0"
              >
                Tayinlash
              </button>
            </form>
          </div>

          {/* List of active Admins & Mentors */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Faol Administratorlar va Mentorlar ({adminList.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {adminList.map((admin) => (
                <div
                  key={admin.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                          : admin.role === "ADMIN"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                      aria-hidden="true"
                    >
                      {admin.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {admin.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                            admin.role === "SUPER_ADMIN"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                              : admin.role === "ADMIN"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {admin.email} • Tayinlangan: {admin.appointedAt} ({admin.appointedBy})
                      </div>
                    </div>
                  </div>

                  <div>
                    {admin.role === "SUPER_ADMIN" ? (
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                        Bosh Rahbar
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDemoteRequest(admin)}
                        aria-label={`${admin.name} huquqini bekor qilish`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Huquqni bekor qilish</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ✅ Custom confirm modal — confirm() o'rniga */}
      {demoteTarget && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="demote-dialog-title"
          aria-describedby="demote-dialog-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-[#0d1527] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" aria-hidden="true" />
              </div>
              <div>
                <h3 id="demote-dialog-title" className="text-sm font-bold text-slate-900 dark:text-white">
                  Huquqni bekor qilish
                </h3>
                <p id="demote-dialog-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong className="text-slate-700 dark:text-slate-200">{demoteTarget.name}</strong> dan{" "}
                  <strong className="text-rose-500">{demoteTarget.role}</strong> huquqini olib tashlab,
                  oddiy ishtirokchi darajasiga tushirmoqchimisiz?
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDemoteTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDemoteConfirm}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Ha, olib tashlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
