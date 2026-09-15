"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Calendar, 
  FileText, 
  QrCode, 
  Share2, 
  Settings,
  Sparkles,
  Camera,
  Users,
  ShieldCheck,
  Award,
  Sliders,
  UserCheck,
  Home,
  Trophy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/auth-types";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("SUPER_ADMIN");

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )steamify_role=([^;]+)'));
    if (match && match[2]) {
      setRole(match[2] as UserRole);
    }
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = "steamify_role=; path=/; max-age=0";
    document.cookie = "steamify_email=; path=/; max-age=0";
    router.push("/login");
  };

  const mainMenuItems = [
    {
      label: "Bosh Sahifa",
      href: "/",
      icon: Home
    },
    {
      label: "Reyting",
      href: "/dashboard",
      icon: Trophy
    },
    {
      label: "Tadbirlar",
      href: "/events",
      icon: Calendar
    },
    {
      label: "Arizalarim",
      href: "/my-applications",
      icon: FileText
    }
  ];

  const toolsMenuItems = [
    {
      label: "Mening QR-kodim",
      href: "/my-qr",
      icon: QrCode
    },
    {
      label: "Taklif qilish (Referal)",
      href: "/referral",
      icon: Share2
    },
    {
      label: "Sozlamalar",
      href: "/settings",
      icon: Settings
    }
  ];

  const mentorMenuItems = [
    {
      label: "QR Skaner (Davomat)",
      href: "/mentor/scanner",
      icon: Camera
    },
    {
      label: "Mentor Sessiyalari",
      href: "/mentor/sessions",
      icon: Calendar
    },
    {
      label: "Guruhlar va Jamoalar",
      href: "/mentor/teams",
      icon: Users
    }
  ];

  const adminMenuItems = [
    {
      label: "Admin Boshqaruvi",
      href: "/admin",
      icon: ShieldCheck
    },
    {
      label: "Tadbirlar",
      href: "/admin/events",
      icon: Calendar
    },
    {
      label: "Foydalanuvchilar",
      href: "/admin/users",
      icon: Users
    },
    {
      label: "Jamoa A'zolari",
      href: "/admin/team",
      icon: UserCheck
    },
    {
      label: "Arizalar tahlili",
      href: "/admin/applications",
      icon: FileText
    },
    {
      label: "Tizim sozlamalari",
      href: "/admin/system-settings",
      icon: Sliders
    },
  ];

  const isMentorOrAbove = role === "MENTOR" || role === "ADMIN" || role === "SUPER_ADMIN";
  const isAdminOrAbove = role === "ADMIN" || role === "SUPER_ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside
      aria-label="Asosiy navigatsiya paneli"
      className="w-64 bg-white dark:bg-[#070b14] border-r border-slate-200 dark:border-[#141e33] flex flex-col shrink-0 h-screen sticky top-0 transition-colors overflow-hidden"
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-4 gap-3 border-b border-slate-100 dark:border-[#141e33]/60 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Image
              src="/images/steamify-logo.png"
              alt="STEAMIFY Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-wider text-slate-900 dark:text-white">STEAMIFY</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <span className="text-[9px] text-cyan-600 dark:text-cyan-400/80 uppercase tracking-widest font-semibold block">
              STEAM Akademiya
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-4 px-3 space-y-5 overflow-y-auto scrollbar-hide">
        {/* ASOSIY MENYU */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Asosiy Menyu
          </div>
          <nav className="space-y-1" aria-label="Asosiy menyu">
            {mainMenuItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                    active
                      ? "bg-cyan-500/10 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-300 font-semibold border-l-2 border-cyan-500 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      active ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ASBOBLAR */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Asboblar
          </div>
          <nav className="space-y-1" aria-label="Asboblar menyusi">
            {toolsMenuItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                    active
                      ? "bg-cyan-500/10 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-300 font-semibold border-l-2 border-cyan-500 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      active ? "text-cyan-600 dark:text-cyan-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* MENTOR BO'LIMI */}
        {isMentorOrAbove && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-amber-500 uppercase flex items-center justify-between">
              <span>Mentor Bo'limi</span>
              <Award className="w-3 h-3" />
            </div>
            <nav className="space-y-1" aria-label="Mentor bo'limi menyusi">
              {mentorMenuItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                      active
                        ? "bg-amber-500/10 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300 font-semibold border-l-2 border-amber-500"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        "w-4 h-4 transition-colors shrink-0",
                        active ? "text-amber-500" : "text-slate-400 group-hover:text-amber-500"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* BOSHQARUV / ADMIN BO'LIMI */}
        {isAdminOrAbove && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-emerald-500 uppercase flex items-center justify-between">
              <span>Boshqaruv (Admin)</span>
              <ShieldCheck className="w-3 h-3" />
            </div>
            <nav className="space-y-1" aria-label="Boshqaruv menyusi">
              {adminMenuItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                      active
                        ? "bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 font-semibold border-l-2 border-emerald-500"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/50"
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        "w-4 h-4 transition-colors shrink-0",
                        active ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

              {isSuperAdmin && (
                <Link
                  href="/admin/admins"
                  aria-current={isActive("/admin/admins") ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive("/admin/admins")
                      ? "bg-purple-500/10 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-semibold border-l-2 border-purple-500"
                      : "text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                  )}
                >
                  <UserCheck className="w-4 h-4 text-purple-500 shrink-0" aria-hidden="true" />
                  <span className="truncate">Adminlar Nazorati</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom: Social links + Logout */}
      <div className="p-3 mx-3 mb-3 space-y-2 shrink-0">
        {/* Social links */}
        <div className="rounded-xl bg-slate-50 dark:bg-gradient-to-b dark:from-[#0d1628] dark:to-[#0a1120] border border-slate-200 dark:border-cyan-900/30 p-3">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" aria-hidden="true" />
            <span>Bizga qo&apos;shiling</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <a href="https://t.me/steamifyuz" target="_blank" rel="noreferrer"
              className="flex items-center justify-between text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-0.5">
              <span>Telegram</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono">@steamifyuz</span>
            </a>
            <a href="https://www.instagram.com/steamify.uz/" target="_blank" rel="noreferrer"
              className="flex items-center justify-between text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors py-0.5">
              <span>Instagram</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono">steamify.uz</span>
            </a>
          </div>
        </div>

        {/* Logout tugmasi */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          aria-label="Tizimdan chiqish"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Chiqish</span>
        </button>
      </div>
    </aside>
  );
}
