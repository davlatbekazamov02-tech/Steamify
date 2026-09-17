"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Calendar, MapPin, Award, CheckCircle2, Clock, ShieldCheck, QrCode } from "lucide-react";
import { UZBEKISTAN_REGIONS } from "@/lib/regions";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";
import { 
  getEvents, 
  registerForEvent, 
  getUserEventRegistration, 
  getEventRegistrationCount, 
  SteamEvent,
  EventRegistration 
} from "@/lib/events-store";
import { QRCodeSVG } from "qrcode.react";

export default function EventsPage() {
  const [events, setEvents] = useState<SteamEvent[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [currentUser, setCurrentUser] = useState(DEMO_USERS.USER);
  const [userRegs, setUserRegs] = useState<Record<string, EventRegistration | undefined>>({});
  const [regCounts, setRegCounts] = useState<Record<string, number>>({});
  
  // Modal state with dynamic 60s QR timer
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; reg: EventRegistration; eventTitle: string } | null>(null);
  const [qrToken, setQrToken] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Load role from cookie
    const match = document.cookie.match(new RegExp('(^| )steamify_role=([^;]+)'));
    if (match && match[2]) {
      const role = match[2] as UserRole;
      if (DEMO_USERS[role]) {
        setCurrentUser(DEMO_USERS[role]);
      }
    }
  }, []);

  const loadData = useCallback(() => {
    const allEvents = getEvents();
    setEvents(allEvents);

    const regMap: Record<string, EventRegistration | undefined> = {};
    const counts: Record<string, number> = {};
    allEvents.forEach((ev) => {
      regMap[ev.id] = getUserEventRegistration(ev.id, currentUser.id);
      counts[ev.id] = getEventRegistrationCount(ev.id);
    });
    setUserRegs(regMap);
    setRegCounts(counts);
  }, [currentUser.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // QR Token rotation timer in modal
  useEffect(() => {
    if (!qrModal?.isOpen) return;

    setQrToken(qrModal.reg.qrToken || Math.random().toString(36).substring(2, 10).toUpperCase());
    setTimeLeft(60);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setQrToken(Math.random().toString(36).substring(2, 10).toUpperCase());
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrModal?.isOpen, qrModal?.reg.qrToken]);

  const handleRegister = (event: SteamEvent) => {
    const reg = registerForEvent(
      event.id, 
      currentUser.id, 
      `${currentUser.firstName} ${currentUser.lastName}`,
      currentUser.regionId || "toshkent-shahri"
    );
    loadData();
    setQrModal({
      isOpen: true,
      eventTitle: event.title,
      reg,
    });
  };

  const filteredEvents = selectedRegion === "all" 
    ? events 
    : events.filter((e) => e.region === selectedRegion);

  const isDeadlinePassed = (deadlineStr: string) => {
    if (!deadlineStr) return false;
    const deadline = new Date(deadlineStr);
    deadline.setHours(23, 59, 59, 999);
    return new Date() > deadline;
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#070b14]">
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar pageTitle="TADBIRLAR" />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Barcha tadbirlar</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Sessiyalarga ro‘yxatdan o‘ting, QR pasport oling va ishtirok etib XP ballar jamg‘aring
              </p>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-[#0d1628] border border-slate-200 dark:border-[#141e33] rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="all">Barcha viloyatlar</option>
              {UZBEKISTAN_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>{r.nameUz}</option>
              ))}
            </select>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-950/30 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-cyan-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Hozircha tadbirlar yo'q
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Admin yangi tadbirlar qo'shganda bu yerda ko'rinadi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredEvents.map((event) => {
                const userReg = userRegs[event.id];
                const expired = isDeadlinePassed(event.deadlineDate || event.date);
                const full = (regCounts[event.id] || 0) >= event.maxParticipants;

                return (
                  <div key={event.id} className="bg-white dark:bg-[#0d1628] rounded-2xl border border-slate-200 dark:border-[#141e33] overflow-hidden flex flex-col shadow-sm hover:border-cyan-500/40 hover:shadow-lg transition-all">
                    <div className="p-4 flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold uppercase rounded-full border border-cyan-500/30">
                          {event.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                          <Award className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">+{event.xpReward} XP</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Ro'yxatdan o'tish deadline: {event.deadlineDate || event.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-[#141e33] bg-slate-50/50 dark:bg-[#0a1120]/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Ishtirokchilar: {regCounts[event.id] || 0}/{event.maxParticipants}
                        </span>
                        <div className="w-20 h-1.5 bg-slate-200 dark:bg-[#141e33] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${Math.min(100, ((regCounts[event.id] || 0) / event.maxParticipants) * 100)}%` }}
                          />
                        </div>
                      </div>
                      
                      {userReg ? (
                        userReg.status === "ATTENDED" ? (
                          <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Ishtirok etildi ✓ (+{event.xpReward} XP olindi)</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-xl">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Ro'yxatdan o'tilgan (Ishtirok kutilmoqda)</span>
                            </div>
                            <button
                              onClick={() => setQrModal({ isOpen: true, eventTitle: event.title, reg: userReg })}
                              className="w-full flex items-center justify-center gap-1.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer"
                            >
                              <QrCode className="w-4 h-4" />
                              <span>QR Kodni Ko'rsatish</span>
                            </button>
                          </div>
                        )
                      ) : expired ? (
                        <div className="w-full text-center py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-semibold rounded-xl">
                          Ro'yxatdan o'tish muddati tugagan
                        </div>
                      ) : full ? (
                        <div className="w-full text-center py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-semibold rounded-xl">
                          Joy qolmagan
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRegister(event)}
                          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                        >
                          Ro'yxatdan o'tish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Dynamic QR Modal */}
      {qrModal?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0d1628] rounded-2xl max-w-sm w-full p-5 text-center border border-cyan-500/40 shadow-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold border border-cyan-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DINAMIK TADBIR PASPORTI</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {qrModal.eventTitle}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ishtirok etishingizni tasdiqlash uchun mentorga ushbu QR kodni ko'rsating.
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block border-4 border-cyan-500 shadow-xl">
              <QRCodeSVG
                value={JSON.stringify({
                  userId: qrModal.reg.userId,
                  name: qrModal.reg.userName,
                  token: qrToken,
                  eventId: qrModal.reg.eventId
                })}
                size={200}
                level="H"
              />
            </div>

            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Amal qilish vaqti:</span>
                <span className="text-slate-900 dark:text-white font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                  {timeLeft} soniya
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Token: <span className="text-cyan-500 font-bold">{qrToken}</span>
              </div>
            </div>

            <button
              onClick={() => setQrModal(null)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
