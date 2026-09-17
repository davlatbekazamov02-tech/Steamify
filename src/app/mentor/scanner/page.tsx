"use client";

import { useState, useEffect } from "react";
import { 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Plus,
  MapPin,
  Users,
  Shield
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { getEvents, markAttendance, getEventRegistrations, SteamEvent, EventRegistration } from "@/lib/events-store";
import { UZBEKISTAN_REGIONS, getRegionName } from "@/lib/regions";
import { XP_REWARDS } from "@/lib/constants";

interface Team {
  id: string;
  name: string;
  region: string;
  memberCount: number;
}

export default function MentorScannerPage() {
  const [events, setEvents] = useState<SteamEvent[]>([]);
  const [activeSession, setActiveSession] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("qashqadaryo");
  
  // Teams management for selected region
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const [manualInput, setManualInput] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [recentCheckIns, setRecentCheckIns] = useState<EventRegistration[]>([]);

  // Load events and saved teams
  useEffect(() => {
    const allEvents = getEvents();
    setEvents(allEvents);
    if (allEvents.length > 0) {
      setActiveSession(allEvents[0].id);
    }

    // Initial default teams for region
    loadTeamsForRegion("qashqadaryo");
  }, []);

  const loadTeamsForRegion = (regionId: string) => {
    try {
      const saved = localStorage.getItem(`steamify_teams_${regionId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTeams(parsed);
        if (parsed.length > 0) setSelectedTeam(parsed[0].name);
        else setSelectedTeam("");
      } else {
        // Default starting teams for selected region
        const defaultTeams: Team[] = [
          { id: "t1", name: `${getRegionName(regionId, "uz")} Inovatorlari`, region: regionId, memberCount: 0 },
          { id: "t2", name: `${getRegionName(regionId, "uz")} Robototexniklari`, region: regionId, memberCount: 0 },
        ];
        setTeams(defaultTeams);
        setSelectedTeam(defaultTeams[0].name);
        localStorage.setItem(`steamify_teams_${regionId}`, JSON.stringify(defaultTeams));
      }
    } catch {
      setTeams([]);
    }
  };

  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    loadTeamsForRegion(newRegion);
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const createdTeam: Team = {
      id: `team_${Date.now()}`,
      name: newTeamName.trim(),
      region: selectedRegion,
      memberCount: 0,
    };

    const updatedTeams = [...teams, createdTeam];
    setTeams(updatedTeams);
    setSelectedTeam(createdTeam.name);
    try {
      localStorage.setItem(`steamify_teams_${selectedRegion}`, JSON.stringify(updatedTeams));
    } catch {}

    setNewTeamName("");
    setShowAddTeamModal(false);
  };

  // Update recent check-ins when active session changes
  useEffect(() => {
    if (activeSession) {
      const regs = getEventRegistrations(activeSession).filter((r) => r.status === "ATTENDED");
      setRecentCheckIns(regs);
    }
  }, [activeSession]);

  const handleProcessQr = (rawString: string) => {
    if (!rawString.trim()) {
      setStatusMessage({ type: "error", text: "Iltimos, QR kod yoki foydalanuvchi tokenini kiriting!" });
      return;
    }

    setStatusMessage(null);
    let token = rawString.trim();

    try {
      const parsed = JSON.parse(rawString);
      if (parsed.token) token = parsed.token;
      else if (parsed.userId) token = parsed.userId;
    } catch {}

    const teamToAssign = selectedTeam || "Umumiy";

    const result = markAttendance(token, activeSession, teamToAssign);

    if (result.success && result.registration) {
      // Update team member count
      const updatedTeams = teams.map((t) => {
        if (t.name === teamToAssign) return { ...t, memberCount: t.memberCount + 1 };
        return t;
      });
      setTeams(updatedTeams);
      try {
        localStorage.setItem(`steamify_teams_${selectedRegion}`, JSON.stringify(updatedTeams));
      } catch {}

      setStatusMessage({
        type: "success",
        text: `Muvaffaqiyatli! ${result.registration.userName} davomatdan o'tdi (+${XP_REWARDS.SESSION_CHECKIN} XP) hamda "${teamToAssign}" jamoasiga (${getRegionName(selectedRegion, "uz")}) biriktirildi.`,
      });
      setManualInput("");
      
      if (activeSession) {
        setRecentCheckIns(getEventRegistrations(activeSession).filter((r) => r.status === "ATTENDED"));
      }
    } else {
      setStatusMessage({
        type: "error",
        text: result.message || "Davomatni tasdiqlashda xatolik! QR token noto'g'ri yoki allaqachon ishlatilgan.",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="MENTOR: QR SKANER VA DAVOMAT" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 sm:p-5 rounded-2xl shadow-sm">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Mentor Tekshiruv Markazi</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Sessiya Davomatini Qabul Qilish
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Viloyat bo'yicha jamoalarga taqsimlash va ishtirokchilar QR kodini skanerlash
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 min-w-[320px]">
              {/* Viloyat Select */}
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-500" />
                  <span>Viloyat:</span>
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {UZBEKISTAN_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameUz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Select */}
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400">
                  Sessiya / Tadbir:
                </label>
                {events.length === 0 ? (
                  <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 text-slate-500 text-xs rounded-xl border border-slate-300 dark:border-slate-800">
                    Tadbirlar yo'q
                  </div>
                ) : (
                  <select
                    value={activeSession}
                    onChange={(e) => setActiveSession(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Alert Status Banner */}
          {statusMessage && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium animate-in fade-in duration-200 ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-300"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Left Box: Teams & QR Scanner */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
              
              {/* Dynamic Jamoalar Bo'limi */}
              <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-500" />
                    <span>Jamoaga biriktirish ({getRegionName(selectedRegion, "uz")}):</span>
                  </label>
                  <button
                    onClick={() => setShowAddTeamModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-bold transition-all cursor-pointer border border-cyan-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Jamoa qo'shish</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {teams.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTeam(t.name)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        selectedTeam === t.name
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      <span>{t.name}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">
                        {t.memberCount}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Scanner Viewfinder */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-500" />
                  <span>QR Kod Skaneri</span>
                </h2>

                <div className="relative aspect-video rounded-2xl bg-slate-900 border-2 border-dashed border-cyan-500/50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                  
                  <div className="relative w-36 h-36 border-2 border-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                    <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white" />
                    <Camera className="w-9 h-9 text-cyan-400/80 animate-pulse" />
                  </div>

                  <div className="mt-3 text-xs text-slate-300 font-medium">
                    Kamerani ishtirokchining QR kodiga qarating
                  </div>
                </div>
              </div>

              {/* Manual Input */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Foydalanuvchi ID / QR Tokenini kiriting:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Masalan: QR Token yoki ID..."
                    className="flex-1 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => handleProcessQr(manualInput)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Tekshirish
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box: Live Session Stats */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 rounded-2xl shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sessiya Davomat Ko‘rsatkichlari
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                      {recentCheckIns.length}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Davomatdan o'tdi
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-2xl font-black text-amber-500">
                      +{recentCheckIns.length * XP_REWARDS.SESSION_CHECKIN} XP
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Taqdim etilgan ball
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Check-Ins List */}
              <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Oxirgi O'tgan Ishtirokchilar
                  </h3>
                  <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Jonli
                  </span>
                </div>

                <div className="space-y-2">
                  {recentCheckIns.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-6">
                      Hali hech kim davomatdan o'tmadi
                    </p>
                  ) : (
                    recentCheckIns.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {user.userName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            📍 {getRegionName(user.userRegion, "uz")} • Jamoa: <span className="text-cyan-500 font-semibold">{user.teamName || "Umumiy"}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-500">
                            +{XP_REWARDS.SESSION_CHECKIN} XP ✓
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {user.attendedAt || "Hozir"}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0d1628] rounded-2xl max-w-sm w-full p-4 sm:p-5 border border-cyan-500/40 shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Yangi Jamoa Qo'shish ({getRegionName(selectedRegion, "uz")})
            </h3>
            <form onSubmit={handleAddTeam} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jamoa Nomi:
                </label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Masalan: Lochinlar / Inovatorlar"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTeamModal(false)}
                  className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-md"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
