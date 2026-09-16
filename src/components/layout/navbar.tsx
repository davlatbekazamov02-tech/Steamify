"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Moon,
  Sun,
  Grid,
  User,
  QrCode,
  FileText,
  LogOut,
  ShieldCheck,
  Award,
  Settings,
  ChevronDown,
  Check,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

interface NavbarProps {
  pageTitle?: string;
}

export function Navbar({ pageTitle = "REYTING" }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("SUPER_ADMIN");
  const [cookieFirstName, setCookieFirstName] = useState("");
  const [cookieLastName, setCookieLastName] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const match = document.cookie.match(new RegExp("(^| )STEMIFY_role=([^;]+)"));
    if (match && match[2] && (match[2] as UserRole) in DEMO_USERS) {
      setCurrentRole(match[2] as UserRole);
    }
    // Cookie dan haqiqiy ism olish
    const fnMatch = document.cookie.match(new RegExp("(^| )STEMIFY_firstName=([^;]+)"));
    const lnMatch = document.cookie.match(new RegExp("(^| )STEMIFY_lastName=([^;]+)"));
    if (fnMatch?.[2]) setCookieFirstName(decodeURIComponent(fnMatch[2]));
    if (lnMatch?.[2]) setCookieLastName(decodeURIComponent(lnMatch[2]));
  }, []);

  // Sahifa o'zgarganda mobile menu yopilsin
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Outside click — dropdown lar yopilsin
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown]")) {
        setProfileOpen(false);
        setRoleSwitcherOpen(false);
      }
    };
    if (profileOpen || roleSwitcherOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [profileOpen, roleSwitcherOpen]);

  // ✅ Escape tugmasi — barcha dropdown va mobile menu yopilsin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setRoleSwitcherOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mobile menu ochiq paytda body scroll bloklash
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const currentUser = DEMO_USERS[currentRole] || DEMO_USERS.SUPER_ADMIN;

  // Haqiqiy ism: cookie dan olish, yo'q bo'lsa DEMO_USERS dan
  const displayFirstName = cookieFirstName || currentUser.firstName;
  const displayLastName = cookieLastName || currentUser.lastName;
  const initials = `${displayFirstName[0] || ""}${displayLastName[0] || ""}`.toUpperCase();

  const handleLogout = () => {
    document.cookie = "STEMIFY_role=; path=/; max-age=0";
    document.cookie = "STEMIFY_email=; path=/; max-age=0";
    setProfileOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const handleSwitchRole = async (newRole: UserRole) => {
    try {
      await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      setCurrentRole(newRole);
      setRoleSwitcherOpen(false);
      setProfileOpen(false);
      router.refresh();
    } catch {
      // Silent fail
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        return { label: "BOSH ADMIN", bg: "bg-purple-900/60 text-purple-300 border-purple-600/50" };
      case "ADMIN":
        return { label: "ADMINISTRATOR", bg: "bg-emerald-900/60 text-emerald-300 border-emerald-600/50" };
      case "MENTOR":
        return { label: "MENTOR", bg: "bg-amber-900/60 text-amber-300 border-amber-600/50" };
      default:
        return { label: "ISHTIROKCHI", bg: "bg-cyan-900/60 text-cyan-300 border-cyan-600/50" };
    }
  };

  const roleBadge = getRoleBadge(currentUser.role);

  // Mobile menu navigation items
  const mobileNavLinks = [
    { href: "/dashboard", label: "Reyting" },
    { href: "/events", label: "Tadbirlar" },
    { href: "/my-applications", label: "Arizalarim" },
    { href: "/my-qr", label: "Mening QR" },
    { href: "/referral", label: "Referal" },
    { href: "/settings", label: "Sozlamalar" },
  ];

  return (
    <>
      <header className="h-16 border-b border-slate-200 dark:border-[#141e33] bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 transition-colors">
        {/* Left: Mobile menu button + Page title */}
        <div className="flex items-center gap-3">
          {/* ✅ Mobile hamburger menu tugmasi */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <h1 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {pageTitle}
          </h1>
        </div>

        {/* Right Tools & User Profile */}
        <div className="flex items-center gap-3">
          {/* Role Demo Switcher */}
          <div className="relative" data-dropdown="role-switcher" ref={roleSwitcherRef}>
            <button
              onClick={() => {
                setRoleSwitcherOpen(!roleSwitcherOpen);
                setProfileOpen(false);
              }}
              aria-label="Rolni almashtirish (Sinov rejimi)"
              aria-expanded={roleSwitcherOpen}
              aria-haspopup="listbox"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer ${roleBadge.bg}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{roleBadge.label}</span>
              <ChevronDown
                className={cn("w-3 h-3 opacity-70 transition-transform", roleSwitcherOpen && "rotate-180")}
                aria-hidden="true"
              />
            </button>

            {roleSwitcherOpen && (
              <div
                role="listbox"
                aria-label="Rol tanlang"
                className="absolute right-0 mt-2 w-56 py-1.5 rounded-xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-cyan-900/50 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  Rolni tanlang (Sinov)
                </div>
                {(["SUPER_ADMIN", "ADMIN", "MENTOR", "USER"] as UserRole[]).map((r) => {
                  const isActive = currentRole === r;
                  const roleLabel: Record<UserRole, string> = {
                    SUPER_ADMIN: "Bosh Admin",
                    ADMIN: "Administrator",
                    MENTOR: "Mentor",
                    USER: "Ishtirokchi",
                  };
                  return (
                    <button
                      key={r}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleSwitchRole(r)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold">{roleLabel[r]}</div>
                        <div className="text-[10px] text-cyan-600 dark:text-cyan-400">{r}</div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-cyan-500" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Events shortcut */}
          <Link
            href="/events"
            aria-label="Tadbirlar sahifasi"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <Grid className="w-4 h-4" aria-hidden="true" />
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Yorug' mavzuga o'tish" : "Qorong'i mavzuga o'tish"}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600" aria-hidden="true" />
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" aria-hidden="true" />

          {/* User Profile Dropdown */}
          <div className="relative" data-dropdown="profile" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setRoleSwitcherOpen(false);
              }}
              aria-label={`${displayFirstName} ${displayLastName} — profil menyusi`}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group cursor-pointer"
            >
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.25)] bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                {currentUser.image ? (
                  <Image
                    src={currentUser.image}
                    alt={`${currentUser.firstName} profil rasmi`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span aria-hidden="true">{initials}</span>
                )}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                  {displayFirstName} {displayLastName}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">
                  {currentUser.role === "SUPER_ADMIN"
                    ? "Bosh Admin"
                    : currentUser.role === "ADMIN"
                    ? "Admin"
                    : currentUser.role === "MENTOR"
                    ? "Mentor"
                    : "Ishtirokchi"}
                </div>
              </div>
            </button>

            {profileOpen && (
              <div
                role="menu"
                aria-label="Profil menyusi"
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-cyan-900/40 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Xush kelibsiz, {displayFirstName}!
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    XP:{" "}
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">{currentUser.totalXp}</span> •
                    Daraja: <span className="text-amber-500 font-bold">{currentUser.level}</span>
                  </div>
                </div>

                <div className="space-y-1" role="none">
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-950/40 transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                    <span>Mening profilim</span>
                  </Link>

                  <Link
                    href="/my-qr"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-950/40 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                    <span>Mening QR-kodim</span>
                  </Link>

                  <Link
                    href="/my-applications"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-cyan-950/40 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                    <span>Mening arizalarim</span>
                  </Link>

                  {(currentUser.role === "MENTOR" ||
                    currentUser.role === "ADMIN" ||
                    currentUser.role === "SUPER_ADMIN") && (
                    <Link
                      href="/mentor/scanner"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      <Award className="w-4 h-4 text-amber-500" aria-hidden="true" />
                      <span>Mentor: QR Skaner</span>
                    </Link>
                  )}

                  {(currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") && (
                    <Link
                      href="/admin"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                      <span>Boshqaruv Paneli</span>
                    </Link>
                  )}

                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" role="separator" />

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" aria-hidden="true" />
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobil navigatsiya menyusi"
          className="lg:hidden fixed inset-0 z-40 flex"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <nav
            className="relative z-50 w-72 max-w-[85vw] h-full bg-white dark:bg-[#070b14] border-r border-slate-200 dark:border-[#141e33] flex flex-col overflow-y-auto"
            aria-label="Asosiy navigatsiya"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-[#141e33]/60 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Image
                    src="/images/STEMIFY-logo.png"
                    alt="STEMIFY"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="font-black text-base tracking-wider text-slate-900 dark:text-white">
                  STEAM<span className="text-cyan-400">IFY</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Menyuni yopish"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex-1 py-4 px-3 space-y-1">
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Asosiy Menyu
              </div>
              {mobileNavLinks.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      active
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-l-2 border-cyan-500"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Admin/Mentor links */}
              {(currentUser.role === "MENTOR" || currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") && (
                <>
                  <div className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-wider text-amber-500 uppercase">
                    Mentor
                  </div>
                  <Link
                    href="/mentor/scanner"
                    aria-current={pathname.startsWith("/mentor") ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-all"
                  >
                    QR Skaner
                  </Link>
                </>
              )}

              {(currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") && (
                <>
                  <div className="px-3 pt-3 pb-1 text-[10px] font-bold tracking-wider text-emerald-500 uppercase">
                    Admin
                  </div>
                  <Link
                    href="/admin"
                    aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                  >
                    Boshqaruv Paneli
                  </Link>
                </>
              )}
            </div>

            {/* Bottom user info */}
            <div className="p-3 border-t border-slate-100 dark:border-[#141e33] shrink-0">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-600 dark:text-cyan-300">
                  {initials}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-white">
                    {displayFirstName} {displayLastName}
                  </div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono uppercase">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
