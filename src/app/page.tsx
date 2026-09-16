"use client";

// Root metadata src/app/layout.tsx da belgilangan
// events-store localStorage based bo'lgani uchun "use client" kerak

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Calendar,
  Users,
  Sparkles,
  ExternalLink,
  Mail,
  MapPin,
  Award,
  Zap,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getLeaderboardData } from "@/lib/ranking";
import { getEvents } from "@/lib/events-store";
import { formatNumber } from "@/lib/utils";
import { getRegionName } from "@/lib/regions";
import { getActiveTeamMembers } from "@/lib/team-store";
import { sanitizeText, getSafeImageUrl, getSafeSocialLinks } from "@/lib/security";
import { LIMITS, ANIMATION_SPEED } from "@/lib/constants";
import { HeroCarousel } from "@/components/landing/hero-carousel";

export default function LandingPage() {
  const heroImages = [
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
  ];

  // Client-side data (localStorage based stores)
  const [upcomingEvents, setUpcomingEvents] = useState<ReturnType<typeof getEvents>>([]);
  // Reyting expand state
  const [showAllRankings, setShowAllRankings] = useState(false);

  useEffect(() => {
    setUpcomingEvents(getEvents().slice(0, LIMITS.UPCOMING_EVENTS));
  }, []);

  // Server-safe stores (in-memory, no localStorage)
  const leaderboardData = getLeaderboardData();
  const allParticipants = leaderboardData.participants; // barcha ishtirokchilar
  const topParticipants = allParticipants.slice(0, LIMITS.TOP_PARTICIPANTS); // top 5
  const teamMembers = getActiveTeamMembers();

  return (
    <div className="min-h-screen bg-[#070b14] text-white antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070b14]/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Image
                src="/images/STEMIFY-logo.png"
                alt="STEMIFY"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-wider">
              STEAM<span className="text-cyan-400">IFY</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">Bosh Sahifa</a>
            <a href="#leaderboard" className="hover:text-cyan-400 transition-colors">Reyting</a>
            <a href="#events" className="hover:text-cyan-400 transition-colors">Tadbirlar</a>
            <a href="#team" className="hover:text-cyan-400 transition-colors">Jamoa</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">Haqida</a>
          </div>

          <Link
            href="/login"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
          >
            Tizimga Kirish
          </Link>
        </div>
      </nav>

      {/* ✅ Hero — animatsiyalar alohida Client Component da */}
      <HeroCarousel heroImages={heroImages} />

      {/* ✅ Partners scrolling strip — fncp.uz ga o'xshash */}
      <section className="py-5 border-t border-white/5 bg-[#070b14] relative overflow-hidden">
        <div className="relative">
          {/* Fade left/right */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#070b14] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#070b14] to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            {/* 2 ta nusxa — cheksiz scroll uchun */}
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center gap-10 shrink-0"
                aria-hidden={copy === 1}
                style={{ animation: `partnersScroll 30s linear infinite` }}
              >
                {[
                  { name: "Yoshlar Ishlari Agentligi", abbr: "YIA" },
                  { name: "Iqtisodiyot va Moliya Vazirligi", abbr: "IMV" },
                  { name: "Markaziy Bank", abbr: "MB" },
                  { name: "IT Park Uzbekistan", abbr: "ITP" },
                  { name: "Raqamli Ta'lim", abbr: "RT" },
                  { name: "TDIU", abbr: "TDIU" },
                  { name: "Yoshlar Ishlari", abbr: "YIA" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/8 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[9px] font-black text-cyan-400">
                      {p.abbr.slice(0, 1)}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{p.name}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-cyan-500/20 bg-gradient-to-b from-[#070b14] to-[#0a0f1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan-500/20 flex items-center justify-center" aria-hidden="true">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{formatNumber(leaderboardData.total)}+</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Ishtirokchilar</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/20 flex items-center justify-center" aria-hidden="true">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {upcomingEvents.length > 0 ? `${upcomingEvents.length}+` : "—"}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Faol Tadbirlar</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/20 flex items-center justify-center" aria-hidden="true">
                <Trophy className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">14</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Viloyatlar</div>
            </div>

            <div className="text-center p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/20 flex items-center justify-center" aria-hidden="true">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">4</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">STEM Yo&apos;nalishlari</div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="py-20 border-t border-cyan-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Liderlar <span className="text-cyan-400">Reytingi</span>
            </h2>
            <p className="text-slate-400 text-sm uppercase tracking-wider">
              Global Reyting • Jonli Ko&apos;rsatkichlar
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl bg-white/5 backdrop-blur-md border border-cyan-500/20 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
              <div className="col-span-2">O&apos;rin</div>
              <div className="col-span-6">Ishtirokchi</div>
              <div className="col-span-4 text-right">Ball (XP)</div>
            </div>

            {/* Ko'rsatiladigan ishtirokchilar */}
            {(showAllRankings ? allParticipants : topParticipants).map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-all group"
              >
                <div className="col-span-2 flex items-center">
                  {p.rank === 1 ? (
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                      {p.rank}
                    </div>
                  ) : p.rank === 2 ? (
                    <div className="w-10 h-10 rounded-full bg-slate-400/20 border-2 border-slate-400/50 flex items-center justify-center text-slate-300 font-black">
                      {p.rank}
                    </div>
                  ) : p.rank === 3 ? (
                    <div className="w-10 h-10 rounded-full bg-amber-700/20 border-2 border-amber-700/50 flex items-center justify-center text-amber-600 font-black">
                      {p.rank}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                      {p.rank}
                    </div>
                  )}
                </div>
                <div className="col-span-6 flex flex-col justify-center">
                  <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {p.firstName} {p.lastName}
                  </div>
                  <div className="text-xs text-slate-500">{getRegionName(p.region, "uz")}</div>
                </div>
                <div className="col-span-4 flex items-center justify-end">
                  <span className="font-mono font-bold text-cyan-400">{formatNumber(p.totalXp)} XP</span>
                </div>
              </div>
            ))}

            {/* To'liq reyting tugmasi — inline expand */}
            <button
              onClick={() => setShowAllRankings(!showAllRankings)}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/3 hover:bg-white/8 text-slate-300 hover:text-cyan-400 text-sm font-bold uppercase tracking-wider transition-all border-t border-white/5"
              aria-expanded={showAllRankings}
            >
              {showAllRankings ? (
                <>
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  Yig&apos;ish
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  To&apos;liq Reyting ({allParticipants.length} ishtirokchi)
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section id="events" className="py-20 border-t border-cyan-500/20 bg-gradient-to-b from-[#070b14] to-[#0a0f1a]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-black">
              Faol <span className="text-cyan-400">Tadbirlar</span>
            </h2>
            <Link
              href="/events"
              className="hidden md:flex items-center gap-2 text-cyan-400 font-bold text-sm hover:text-cyan-300 transition-colors"
            >
              Barchasi
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Hozircha faol tadbirlar yo&apos;q. Tez orada yangilanadi!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl bg-white/5 border border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase rounded-full">
                        {event.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Award className="w-4 h-4" aria-hidden="true" />
                        <span className="text-xs font-bold">+{event.xpReward}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Members Section */}
      <section id="team" className="py-20 border-t border-cyan-500/20 bg-gradient-to-b from-[#070b14] to-[#0a0f1a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Bizning <span className="text-cyan-400">Jamoa</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              STEMIFY platformasini yaratgan va rivojlantirgan professional mutaxassislar jamoasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => {
              const safeSocialLinks = getSafeSocialLinks(member.socialLinks);
              return (
                <div
                  key={member.id}
                  className="rounded-2xl bg-white/5 border border-cyan-500/20 overflow-hidden hover:border-cyan-500/40 hover:-translate-y-2 transition-all group"
                >
                  {/* ✅ Next.js Image — background div o'rniga */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getSafeImageUrl(member.photoUrl, "/images/default-avatar.png")}
                      alt={`${sanitizeText(member.firstName)} ${sanitizeText(member.lastName)}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/50 to-transparent z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-6 -mt-20 relative z-10">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {sanitizeText(member.firstName)} {sanitizeText(member.lastName)}
                    </h3>
                    <p className="text-sm text-cyan-400 font-semibold mb-3 uppercase tracking-wider">
                      {sanitizeText(member.role)}
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                      {sanitizeText(member.bio)}
                    </p>

                    {/* ✅ Safe Social Links */}
                    <div className="flex gap-3">
                      {safeSocialLinks.telegram && (
                        <a
                          href={safeSocialLinks.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all"
                          aria-label={`${sanitizeText(member.firstName)} Telegram profili`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-3.146 6.536-3.146 6.536s-.18.434-.54.434c-.18 0-.36-.18-.54-.36l-2.7-2.16-1.44-1.08-2.52-1.8c-.18-.18-.36-.36-.36-.54 0-.18.18-.36.36-.36l10.8-4.32c.36-.18.72-.18.9.18.18.18.18.54.18.72z" />
                          </svg>
                        </a>
                      )}
                      {safeSocialLinks.linkedin && (
                        <a
                          href={safeSocialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all"
                          aria-label={`${sanitizeText(member.firstName)} LinkedIn profili`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      )}
                      {safeSocialLinks.github && (
                        <a
                          href={safeSocialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all"
                          aria-label={`${sanitizeText(member.firstName)} GitHub profili`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {safeSocialLinks.email && (
                        <a
                          href={safeSocialLinks.email}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-all"
                          aria-label={`${sanitizeText(member.firstName)} Email`}
                        >
                          <Mail className="w-4 h-4" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 border-t border-cyan-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Nima Uchun <span className="text-cyan-400">STEMIFY</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              STEM ta&apos;lim platformasi sifatida biz yoshlarning bilim va ko&apos;nikmalarini rivojlantirishga yordam beramiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Trophy className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Reyting Tizimi</h3>
              <p className="text-slate-400">
                Global va viloyat bo&apos;yicha reyting tizimida o&apos;z o&apos;rningizni egallang va eng yaxshilar bilan raqobatlashing
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all">
              <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Faol Tadbirlar</h3>
              <p className="text-slate-400">
                Muntazam o&apos;tkaziladigan sessiyalar, musobaqalar va lagerlarda ishtirok eting, yangi bilimlar oling
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-16 h-16 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6" aria-hidden="true">
                <Target className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">XP Tizimi</h3>
              <p className="text-slate-400">
                Har bir tadbirda ishtirok etib, topshiriqlarni bajarib XP ball to&apos;plang va o&apos;sib boring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-cyan-500/20 bg-gradient-to-b from-[#070b14] to-[#050810]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Image
                    src="/images/STEMIFY-logo.png"
                    alt="STEMIFY"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-black">
                  STEAM<span className="text-cyan-400">IFY</span>
                </span>
              </div>
              <p className="text-sm text-slate-400">
                O&apos;zbekiston STEM ta&apos;lim va reyting platformasi
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Reyting</Link></li>
                <li><Link href="/events" className="hover:text-cyan-400 transition-colors">Tadbirlar</Link></li>
                <li><Link href="/my-applications" className="hover:text-cyan-400 transition-colors">Arizalar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Tizim</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/login" className="hover:text-cyan-400 transition-colors">Kirish</Link></li>
                <li><Link href="/onboarding" className="hover:text-cyan-400 transition-colors">Ro&apos;yxatdan o&apos;tish</Link></li>
                <li><Link href="/settings" className="hover:text-cyan-400 transition-colors">Sozlamalar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Aloqa</h4>
              <address className="not-italic space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                  <a href="mailto:info@STEMIFY.uz" className="hover:text-cyan-400 transition-colors">
                    info@STEMIFY.uz
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-500" aria-hidden="true" />
                  <span>Toshkent, O&apos;zbekiston</span>
                </div>
              </address>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2026 STEMIFY. O&apos;zbekiston STEM ta&apos;lim Platformasi</p>
            <nav aria-label="Footer navigatsiyasi" className="flex gap-6">
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Maxfiylik</Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">Qoidalar</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
