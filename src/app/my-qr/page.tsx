"use client";

import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Shield, RefreshCw, Clock } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";
import { getRegionName } from "@/lib/regions";
import { QR_TOKEN_TIMEOUT } from "@/lib/constants";

export default function MyQrPage() {
  const [timeLeft, setTimeLeft] = useState(QR_TOKEN_TIMEOUT);
  const [qrToken, setQrToken] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<UserRole>("USER");

  useEffect(() => {
    setQrToken(Math.random().toString(36).substring(2, 10).toUpperCase());
    const match = document.cookie.match(new RegExp('(^| )steamify_role=([^;]+)'));
    if (match && match[2]) {
      setCurrentRole(match[2] as UserRole);
    }
  }, []);

  const currentUser = DEMO_USERS[currentRole];

  const rotateToken = useCallback(() => {
    const newToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    setQrToken(newToken);
    setTimeLeft(QR_TOKEN_TIMEOUT);
    setLastUpdated(new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, []);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Token yangilash - stale closure xatosini oldini olish uchun inline qilindi
          const newToken = Math.random().toString(36).substring(2, 10).toUpperCase();
          setQrToken(newToken);
          setLastUpdated(new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
          return QR_TOKEN_TIMEOUT;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const qrPayload = JSON.stringify({
    userId: currentUser.id,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    region: currentUser.regionId,
    token: qrToken,
    generatedAt: lastUpdated
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="MENING QR" />

        <main className="flex-1 p-3 sm:p-4 w-full flex flex-col items-center justify-center">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gradient-to-b dark:from-[#0c1426] dark:to-[#070b14] border border-slate-200 dark:border-cyan-500/30 p-6 shadow-sm text-center relative overflow-hidden transition-colors">
            <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-950/70 border border-cyan-500/40 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-4 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-cyan-500" />
              <span>DINAMIK XAVFSIZ QR PASPORT</span>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {currentUser.firstName} {currentUser.lastName}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              📍 {currentUser.regionId ? getRegionName(currentUser.regionId, "uz") : "Noma'lum"} • {currentUser.totalXp} XP
            </p>

            <div className="my-5 flex flex-col items-center justify-center">
              <div className="p-4 rounded-2xl bg-white shadow-xl border-4 border-cyan-500 inline-block">
                <QRCodeSVG value={qrPayload} size={210} level="H" includeMargin={false} />
              </div>

              <div className="mt-4 w-full max-w-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                    <span>Amal qilish vaqti:</span>
                  </span>
                  <span className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-slate-200 dark:border-cyan-800/60">
                    {timeLeft} soniya
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: `${(timeLeft / 60) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Token: <span className="text-slate-900 dark:text-slate-300 font-bold">{qrToken}</span>
                  </span>
                  <button
                    onClick={rotateToken}
                    className="inline-flex items-center gap-1 text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Hozir yangilash</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 max-w-md mx-auto text-left">
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                🛡️ <strong>Firibgarlikdan himoyalangan:</strong> Skrinshot olib tarqatishning oldini olish uchun ushbu QR kod <strong>har 1 daqiqada (60 soniya)</strong> avtomatik yangilanadi.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={rotateToken}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Yangilash</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
