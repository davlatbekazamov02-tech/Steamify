"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck, Lock, Eye, EyeOff, AlertCircle,
  LogIn, UserPlus, User, CheckCircle2, MapPin,
} from "lucide-react";
import {
  verifyCredentials, saveRegisteredUser,
  isPhoneRegistered, validateUzPhone, validatePassword,
} from "@/lib/auth-credentials";
import { UZBEKISTAN_REGIONS } from "@/lib/regions";
import { cn } from "@/lib/utils";

// O'zbek operatorlari
const UZ_OPERATORS: Record<string, string> = {
  "90": "Beeline", "91": "Beeline",
  "93": "UCell",   "94": "UCell",   "95": "UCell",
  "97": "UzMobile","99": "UzMobile",
  "88": "Uztelecom","33": "Uztelecom",
  "77": "Humans",  "78": "Humans",
};

// ─── Telefon input ──────────────────────────────────────────────
function PhoneInput({ value, onChange, disabled, id }: {
  value: string; onChange: (v: string) => void; disabled?: boolean; id: string;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    let f = "";
    if (raw.length > 0) f = raw.slice(0, 2);
    if (raw.length > 2) f += " " + raw.slice(2, 5);
    if (raw.length > 5) f += " " + raw.slice(5, 7);
    if (raw.length > 7) f += " " + raw.slice(7, 9);
    onChange(f);
  };
  const prefix = value.replace(/\s/g, "").slice(0, 2);
  const operator = UZ_OPERATORS[prefix] || "";

  return (
    <div className="flex rounded-xl overflow-hidden border border-slate-600 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all bg-[#0c1829]">
      <div className="flex items-center gap-2 px-3 bg-[#0a1420] border-r border-slate-700 shrink-0">
        <span className="text-base leading-none">🇺🇿</span>
        <span className="text-sm font-bold text-slate-300">+998</span>
      </div>
      <div className="flex-1 relative">
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => {
            const ok = /^[0-9]$/.test(e.key) ||
              ["Backspace","Delete","ArrowLeft","ArrowRight","Tab","Enter"].includes(e.key) ||
              e.ctrlKey || e.metaKey;
            if (!ok) e.preventDefault();
          }}
          disabled={disabled}
          maxLength={12}
          placeholder="90 123 45 67"
          className="w-full px-3 py-3 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
        />
        {operator && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-cyan-600/70 uppercase tracking-wider pointer-events-none">
            {operator}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Parol input ─────────────────────────────────────────────────
function PasswordInput({ id, value, onChange, placeholder, autoComplete, disabled }: {
  id: string; value: string; onChange: (v: string) => void;
  placeholder?: string; autoComplete?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "••••••••"}
        disabled={disabled}
        className="w-full pl-10 pr-11 py-3 bg-[#0c1829] border border-slate-600 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Parolni yashirish" : "Parolni ko'rsatish"}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

// ─── Input class ─────────────────────────────────────────────────
const inputCls = "w-full pl-9 pr-3 py-3 bg-[#0c1829] border border-slate-600 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50";

// ─── Main ─────────────────────────────────────────────────────────
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from");
  const [tab, setTab] = useState<"login" | "register">("login");

  // Login
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Ro'yxatdan o'tish
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regRegion, setRegRegion] = useState("toshkent-shahri");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // ─── Login handler ───────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const fullPhone = "+998" + loginPhone.replace(/\s/g, "");
    if (!validateUzPhone(fullPhone)) {
      setLoginError("To'g'ri O'zbekiston telefon raqamini kiriting.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Parolni kiriting.");
      return;
    }

    setLoginLoading(true);
    const cred = verifyCredentials(fullPhone, loginPassword);

    if (!cred) {
      setLoginLoading(false);
      setLoginError("Telefon raqam yoki parol noto'g'ri.");
      return;
    }

    // Cookie ga yozish
    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `steamify_role=${cred.role}; path=/; max-age=${maxAge}`;
    document.cookie = `steamify_firstName=${encodeURIComponent(cred.firstName)}; path=/; max-age=${maxAge}`;
    document.cookie = `steamify_lastName=${encodeURIComponent(cred.lastName)}; path=/; max-age=${maxAge}`;

    if (fromPath && fromPath !== "/login") { router.push(fromPath); return; }

    switch (cred.role) {
      case "SUPER_ADMIN": router.push("/admin/admins"); break;
      case "ADMIN":       router.push("/admin");        break;
      case "MENTOR":      router.push("/mentor/scanner"); break;
      default:            router.push("/dashboard");
    }
  };

  // ─── Register handler ─────────────────────────────────────────
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regFirstName.trim() || regFirstName.trim().length < 2) {
      setRegError("Ism kamida 2 belgidan iborat bo'lishi kerak."); return;
    }
    if (!regLastName.trim() || regLastName.trim().length < 2) {
      setRegError("Familiya kamida 2 belgidan iborat bo'lishi kerak."); return;
    }
    if (!regRegion) {
      setRegError("Viloyatni tanlang."); return;
    }

    const fullPhone = "+998" + regPhone.replace(/\s/g, "");
    if (!validateUzPhone(fullPhone)) {
      setRegError("To'g'ri O'zbekiston telefon raqamini kiriting."); return;
    }
    if (isPhoneRegistered(fullPhone)) {
      setRegError("Bu telefon raqam allaqachon ro'yxatdan o'tgan."); return;
    }

    const pwCheck = validatePassword(regPassword);
    if (!pwCheck.valid) { setRegError(pwCheck.message); return; }
    if (regPassword !== regConfirm) {
      setRegError("Parollar mos kelmaydi."); return;
    }

    setRegLoading(true);
    saveRegisteredUser({
      phone: fullPhone,
      password: regPassword,
      role: "USER",
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
    });

    const maxAge = 60 * 60 * 24 * 30;
    document.cookie = `steamify_firstName=${encodeURIComponent(regFirstName.trim())}; path=/; max-age=${maxAge}`;
    document.cookie = `steamify_lastName=${encodeURIComponent(regLastName.trim())}; path=/; max-age=${maxAge}`;
    document.cookie = `steamify_region=${encodeURIComponent(regRegion)}; path=/; max-age=${maxAge}`;

    setRegLoading(false);
    setRegSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden antialiased">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-md w-full relative z-10">
        {/* ── Logo ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0a1628] border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-4 overflow-hidden">
            <img
              src="/images/logo.jpg"
              alt="STEAMIFY"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider">STEAMIFY</h1>
          <p className="text-xs text-slate-500 mt-1">O&apos;zbekiston STEM ta&apos;lim platformasi</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-[#0c1426]/95 border border-white/8 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-white/8">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginError(null); setRegError(null); setRegSuccess(false); }}
                className={cn(
                  "py-4 text-sm font-bold transition-all",
                  tab === t ? "text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <span className="flex items-center justify-center gap-2">
                  {t === "login" ? <><LogIn className="w-4 h-4" aria-hidden="true" />Kirish</> : <><UserPlus className="w-4 h-4" aria-hidden="true" />Ro&apos;yxatdan o&apos;tish</>}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ══ KIRISH ══ */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                {loginError && (
                  <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /><span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="login-phone" className="block text-xs font-semibold text-slate-400">Telefon raqami</label>
                  <PhoneInput id="login-phone" value={loginPhone} onChange={(v) => { setLoginPhone(v); setLoginError(null); }} disabled={loginLoading} />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="login-pass" className="block text-xs font-semibold text-slate-400">Parol</label>
                  <PasswordInput id="login-pass" value={loginPassword} onChange={(v) => { setLoginPassword(v); setLoginError(null); }} autoComplete="current-password" disabled={loginLoading} />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/40 disabled:cursor-not-allowed text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all mt-1"
                >
                  {loginLoading ? (
                    <><span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" aria-hidden="true" />Tekshirilmoqda...</>
                  ) : (
                    <><LogIn className="w-4 h-4" aria-hidden="true" />Tizimga kirish</>
                  )}
                </button>

                <p className="text-center text-xs text-slate-600 pt-1">
                  Hisobingiz yo&apos;qmi?{" "}
                  <button type="button" onClick={() => setTab("register")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                    Ro&apos;yxatdan o&apos;ting
                  </button>
                </p>
              </form>
            )}

            {/* ══ RO'YXATDAN O'TISH ══ */}
            {tab === "register" && (
              <>
                {regSuccess ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Muvaffaqiyatli ro&apos;yxatdan o&apos;tdingiz!</h3>
                      <p className="text-xs text-slate-400">Endi telefon raqam va parolingiz bilan kirishingiz mumkin.</p>
                    </div>
                    <button
                      onClick={() => {
                        setTab("login"); setRegSuccess(false);
                        setRegFirstName(""); setRegLastName(""); setRegRegion("toshkent-shahri");
                        setRegPhone(""); setRegPassword(""); setRegConfirm("");
                      }}
                      className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all"
                    >
                      Kirish sahifasiga o&apos;tish
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3" noValidate>
                    {regError && (
                      <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" /><span>{regError}</span>
                      </div>
                    )}

                    {/* Ism + Familiya */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="reg-fname" className="block text-xs font-semibold text-slate-400">Ism</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                          <input id="reg-fname" type="text" autoComplete="given-name" value={regFirstName}
                            onChange={(e) => { setRegFirstName(e.target.value); setRegError(null); }}
                            placeholder="Ism" disabled={regLoading} className={inputCls} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="reg-lname" className="block text-xs font-semibold text-slate-400">Familiya</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                          <input id="reg-lname" type="text" autoComplete="family-name" value={regLastName}
                            onChange={(e) => { setRegLastName(e.target.value); setRegError(null); }}
                            placeholder="Familiya" disabled={regLoading} className={inputCls} />
                        </div>
                      </div>
                    </div>

                    {/* ✅ Viloyat — yangi qo'shildi */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-region" className="block text-xs font-semibold text-slate-400">
                        Viloyat / Hudud
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
                        <select
                          id="reg-region"
                          value={regRegion}
                          onChange={(e) => { setRegRegion(e.target.value); setRegError(null); }}
                          disabled={regLoading}
                          className="w-full pl-9 pr-3 py-3 bg-[#0c1829] border border-slate-600 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 appearance-none"
                        >
                          {UZBEKISTAN_REGIONS.map((r) => (
                            <option key={r.id} value={r.id} className="bg-[#0c1829]">
                              {r.nameUz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Telefon */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-400">Telefon raqami</label>
                      <PhoneInput id="reg-phone" value={regPhone} onChange={(v) => { setRegPhone(v); setRegError(null); }} disabled={regLoading} />
                      <p className="text-[11px] text-slate-600">Masalan: 90 123 45 67</p>
                    </div>

                    {/* Parol */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-pass" className="block text-xs font-semibold text-slate-400">Parol</label>
                      <PasswordInput id="reg-pass" value={regPassword} onChange={(v) => { setRegPassword(v); setRegError(null); }} autoComplete="new-password" placeholder="Kamida 6 belgi" disabled={regLoading} />
                    </div>

                    {/* Parol tasdiqlash */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-confirm" className="block text-xs font-semibold text-slate-400">Parolni tasdiqlash</label>
                      <PasswordInput id="reg-confirm" value={regConfirm} onChange={(v) => { setRegConfirm(v); setRegError(null); }} autoComplete="new-password" placeholder="Parolni qayta kiriting" disabled={regLoading} />
                      {regConfirm.length > 0 && (
                        <p className={cn("text-[11px] flex items-center gap-1", regPassword === regConfirm ? "text-emerald-500" : "text-rose-400")}>
                          {regPassword === regConfirm
                            ? <><CheckCircle2 className="w-3 h-3" aria-hidden="true" />Parollar mos keldi</>
                            : <><AlertCircle className="w-3 h-3" aria-hidden="true" />Parollar mos kelmaydi</>}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/40 disabled:cursor-not-allowed text-slate-950 font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all"
                    >
                      {regLoading
                        ? <><span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" aria-hidden="true" />Saqlanmoqda...</>
                        : <><UserPlus className="w-4 h-4" aria-hidden="true" />Akkaunt yaratish</>}
                    </button>

                    <p className="text-center text-xs text-slate-600">
                      Hisobingiz bormi?{" "}
                      <button type="button" onClick={() => setTab("login")} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                        Kiring
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-slate-700">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Xavfsiz autentifikatsiya • STEAMIFY © 2026</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
