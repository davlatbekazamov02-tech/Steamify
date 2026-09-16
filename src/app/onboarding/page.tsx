"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  MapPin, 
  User, 
  Phone, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { UZBEKISTAN_REGIONS } from "@/lib/regions";
import { STORAGE_KEYS } from "@/lib/constants";
import { sanitizeText, validateLength } from "@/lib/security";

export default function OnboardingPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regionId, setRegionId] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLength(firstName.trim(), 2, 50)) {
      setError("Ism 2-50 belgi orasida bo'lishi kerak.");
      return;
    }
    if (!validateLength(lastName.trim(), 2, 50)) {
      setError("Familiya 2-50 belgi orasida bo'lishi kerak.");
      return;
    }
    if (!regionId) {
      setError("Iltimos, o'zingiz yashayotgan viloyat/hududni tanlang (majburiy).");
      return;
    }

    // Faqat ommaviy (non-sensitive) ma'lumotlarni localStorage ga saqlash
    // ❌ phone, email — localStorage ga SAQLANMAYDI (sensitive)
    // ✅ ism, familiya, hudud, maktab, sinf — localStorage ga OK
    localStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify({
        firstName: sanitizeText(firstName.trim()),
        lastName: sanitizeText(lastName.trim()),
        regionId,
        school: sanitizeText(school.trim()),
        grade: sanitizeText(grade.trim()),
        // phone va email faqat backend API orqali yuboriladi
        hasPhone: !!phone && phone !== "+998 ",
      })
    );

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden antialiased">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full bg-gradient-to-b from-[#0c1426] to-[#070b14] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(6,182,212,0.15)] relative z-10 space-y-4 sm:space-y-5">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-qadam: Profilni to'ldirish</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
            STEMIFY ga Xush Kelibsiz!
          </h1>
          <p className="text-xs text-slate-400">
            Hududingiz bo'yicha shaxsiy reytingingizni shakllantirish uchun ma'lumotlarni to'ldiring
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ism: *</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Abduqodir"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Familiya: *</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Toshmatov"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Mandatory Region Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Yashash Viloyatingiz / Hududingiz: *</span>
            </label>
            <select
              required
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">Hududni tanlang...</option>
              {UZBEKISTAN_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name.uz}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Telefon raqami:</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Maktab / Ta'lim maskani:</span>
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="1-sonli ixtisoslashtirilgan maktab"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sinf / Bosqich:</span>
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="10-sinf"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
          >
            <span>Profilni Yakunlash va Boshlash</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
