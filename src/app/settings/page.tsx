"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  CreditCard, 
  Link as LinkIcon, 
  ShieldCheck, 
  Users, 
  Check, 
  Camera,
  MapPin,
  Phone,
  Mail,
  Copy,
  Lock,
  Smartphone,
  Globe,
  Award
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { MyRankingCard } from "@/components/ranking/my-ranking-card";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";
import { UZBEKISTAN_REGIONS, getRegionName } from "@/lib/regions";
import { cn } from "@/lib/utils";
import { APP_URL } from "@/lib/constants";

export default function SettingsPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("USER");
  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )steamify_role=([^;]+)'));
    if (match && match[2]) setCurrentRole(match[2] as UserRole);
  }, []);
  const currentUser = DEMO_USERS[currentRole];

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form States
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  // phone va bio currentUser dan olinadi, bo'sh bo'lsa default
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [region, setRegion] = useState(currentUser.regionId || "toshkent-shahri");

  // Links Form States
  const [telegram, setTelegram] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState(APP_URL);
  const [linkedin, setLinkedin] = useState("");

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setRegion(currentUser.regionId || "toshkent-shahri");
  }, [currentUser]);

  const subMenuItems = [
    { id: "profile", label: "Ommaviy profil", icon: User },
    { id: "account", label: "Hisob ma‘lumotlari", icon: CreditCard },
    { id: "links", label: "Havolalar", icon: LinkIcon },
    { id: "security", label: "Xavfsizlik", icon: ShieldCheck },
    { id: "referrals", label: "Referallar", icon: Users },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(`${APP_URL}/ref/${currentUser.referralCode || "STEAM2026"}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="SOZLAMALAR" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <MyRankingCard
            globalRank={18}
            globalTotal={5240}
            regionalRank={3}
            regionalTotal={420}
            regionName={getRegionName(region, "uz")}
            points={currentUser.totalXp || 0}
            compact
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Left Sub-Menu */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-3 sm:p-4 shadow-sm">
                <div className="px-3 mb-3 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                  Sozlamalar Menyusi
                </div>
                <nav className="space-y-1">
                  {subMenuItems.map((item) => {
                    const active = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer",
                          active
                            ? "bg-cyan-500/10 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-300 border-l-2 border-cyan-500 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/40"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", active ? "text-cyan-500" : "text-slate-400")} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Right Forms */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* TAB 1: Profile */}
              {activeTab === "profile" && (
                <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 sm:p-5 shadow-sm">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Ommaviy Profil
                  </h2>

                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex flex-col items-center justify-center sm:items-start py-2">
                      <div className="relative group cursor-pointer">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-sm bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {currentUser.firstName[0]}{currentUser.lastName[0]}
                          </span>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Camera className="w-6 h-6" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Profil rasmi (Avatar)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Ism
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Familiya
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Telefon Raqami
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998 90 123 45 67"
                            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                            required
                          />
                          <Phone className="w-4 h-4 text-cyan-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Viloyat / Hudud
                        </label>
                        <div className="relative">
                          <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
                          >
                            {UZBEKISTAN_REGIONS.map((r) => (
                              <option key={r.id} value={r.id} className="bg-white dark:bg-[#0b1222] text-slate-900 dark:text-white">
                                {r.nameUz}
                              </option>
                            ))}
                          </select>
                          <MapPin className="w-4 h-4 text-cyan-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Bio (O'zingiz haqingizda)
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        O‘zgarishlarni saqlash
                      </button>

                      {isSaved && (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold animate-in fade-in">
                          <Check className="w-4 h-4" />
                          <span>Muvaffaqiyatli saqlandi!</span>
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: Account Details */}
              {activeTab === "account" && (
                <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 sm:p-5 shadow-sm space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Hisob Ma'lumotlari
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Elektron Pochta:</span>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center gap-2">
                        <Mail className="w-4 h-4 text-cyan-500" />
                        <span>{currentUser.email || "student@gmail.com"}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Foydalanuvchi ID:</span>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                        {currentUser.id}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Hisob Turi (Rol):</span>
                      <div className="text-xs font-bold text-cyan-500 font-mono uppercase">
                        {currentUser.role}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">Hisob Holati:</span>
                      <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Faol va Tasdiqlangan ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Links */}
              {activeTab === "links" && (
                <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 sm:p-5 shadow-sm space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Ijtimoiy Tarmoqlar va Havolalar
                  </h2>

                  <form onSubmit={handleSave} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Telegram Profil
                      </label>
                      <input
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        GitHub Profil URL
                      </label>
                      <input
                        type="text"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Portfolio / Veb-Sayt URL
                      </label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        LinkedIn Profil
                      </label>
                      <input
                        type="text"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                      >
                        Havolalarni Saqlash
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: Security */}
              {activeTab === "security" && (
                <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 sm:p-5 shadow-sm space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">
                    Xavfsizlik va Parolni O'zgartirish
                  </h2>

                  <form onSubmit={handleSave} className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Joriy Parol
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Yangi Parol
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Yangi Parolni Tasdiqlash
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-[#1a2d4f] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Ikki bosqichli autentifikatsiya (2FA)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Kirish paytida Telegram yoki Email orqali tasdiqlash
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                        className="w-5 h-5 accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                      >
                        Parolni Yangilash
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: Referrals */}
              {activeTab === "referrals" && (
                <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-4 sm:p-5 shadow-sm space-y-4">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                    Referal Dasturi
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Do'stlaringizni taklif qiling va har bir taklif qilingan do'st uchun **+25 XP** qo'lga kiriting!
                  </p>

                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                    <label className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      Sizning Shaxsiy Taklif Havolangiz:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${APP_URL}/ref/${currentUser.referralCode || "STEAM2026"}`}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                      />
                      <button
                        onClick={handleCopyRef}
                        className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copySuccess ? "Nusxalandi!" : "Nusxalash"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                      <div className="text-2xl font-black text-slate-900 dark:text-white">0 kishi</div>
                      <div className="text-xs text-slate-400">Taklif qilingan do'stlar</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
                      <div className="text-2xl font-black text-amber-500">+0 XP</div>
                      <div className="text-xs text-slate-400">Ishlab topilgan referal ballar</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
