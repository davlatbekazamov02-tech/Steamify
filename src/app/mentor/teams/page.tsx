"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, UserPlus, Camera, Trash2, MapPin } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { UZBEKISTAN_REGIONS, getRegionName } from "@/lib/regions";

interface TeamMember {
  id: string;
  name: string;
  region: string;
  role: string;
}

interface Team {
  id: string;
  name: string;
  badge: string;
  region: string;
  members: TeamMember[];
}

const TEAMS_KEY = "steamify_mentor_teams";

export default function MentorTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(null);

  // New team form state
  const [teamName, setTeamName] = useState("");
  const [teamBadge, setTeamBadge] = useState("");
  const [teamRegion, setTeamRegion] = useState("toshkent-shahri");

  // New member form state
  const [memberName, setMemberName] = useState("");
  const [memberRegion, setMemberRegion] = useState("toshkent-shahri");
  const [memberRole, setMemberRole] = useState("Ishtirokchi");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TEAMS_KEY);
      if (saved) {
        setTeams(JSON.parse(saved));
      }
    } catch {
      setTeams([]);
    }
  }, []);

  const saveTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    try {
      localStorage.setItem(TEAMS_KEY, JSON.stringify(newTeams));
    } catch {}
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName) return;

    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: teamName,
      badge: teamBadge || teamName.substring(0, 5).toUpperCase(),
      region: teamRegion,
      members: [],
    };

    saveTeams([...teams, newTeam]);
    setTeamName("");
    setTeamBadge("");
    setShowCreateModal(false);
  };

  const handleAddMember = (teamId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName) return;

    const updated = teams.map((t) => {
      if (t.id === teamId) {
        return {
          ...t,
          members: [
            ...t.members,
            {
              id: `mem_${Date.now()}`,
              name: memberName,
              region: getRegionName(memberRegion, "uz"),
              role: memberRole,
            },
          ],
        };
      }
      return t;
    });

    saveTeams(updated);
    setMemberName("");
    setShowAddMemberModal(null);
  };

  const handleDeleteTeam = (teamId: string) => {
    saveTeams(teams.filter((t) => t.id !== teamId));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="GURUHLAR VA JAMOALAR BOSHQARUVI" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Sessiya Jamoalari
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ishtirokchilarni viloyat va guruhlarga ajratish hamda jamoalarni boshqarish
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Jamoa Yaratish</span>
            </button>
          </div>

          {teams.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-8 text-center flex flex-col items-center justify-center space-y-2 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 mb-2">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Hozircha jamoalar yaratilmagan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Mentor sifatida viloyatingiz bo'yicha yangi jamoa yaratishingiz va ishtirokchilarni biriktirishingiz mumkin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-lg transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                        {team.badge}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">
                          {team.members.length} ishtirokchi
                        </span>
                        <button
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-cyan-500" />
                      <span>{getRegionName(team.region, "uz")}</span>
                    </p>

                    <div className="mt-4 space-y-2">
                      {team.members.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2 text-center">
                          A'zolar mavjud emas
                        </p>
                      ) : (
                        team.members.map((m) => (
                          <div
                            key={m.id}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {m.name}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {m.region}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {m.role}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <button
                      onClick={() => setShowAddMemberModal(team.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-all cursor-pointer border border-cyan-500/30"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>A'zo qo'shish</span>
                    </button>

                    <Link
                      href="/mentor/scanner"
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center transition-all"
                      title="Skaner"
                    >
                      <Camera className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create Team Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0d1527] border border-cyan-500/40 rounded-2xl p-4 sm:p-5 max-w-md w-full shadow-2xl space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Yangi Jamoa Yaratish
                </h3>
                <form onSubmit={handleCreateTeam} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Jamoa Nomi:
                    </label>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Masalan: Qashqadaryo Inovatorlari"
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Viloyat:
                    </label>
                    <select
                      value={teamRegion}
                      onChange={(e) => setTeamRegion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      {UZBEKISTAN_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nameUz}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Belgi / Nishon (Ixtiyoriy):
                    </label>
                    <input
                      type="text"
                      value={teamBadge}
                      onChange={(e) => setTeamBadge(e.target.value)}
                      placeholder="Masalan: Team Alpha"
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                    >
                      Yaratish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Member Modal */}
          {showAddMemberModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0d1527] border border-cyan-500/40 rounded-2xl p-4 sm:p-5 max-w-md w-full shadow-2xl space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Jamoaga A'zo Qo'shish
                </h3>
                <form onSubmit={(e) => handleAddMember(showAddMemberModal, e)} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ism va Familiya:
                    </label>
                    <input
                      type="text"
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="Masalan: Jasur Aliyev"
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Viloyat:
                    </label>
                    <select
                      value={memberRegion}
                      onChange={(e) => setMemberRegion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      {UZBEKISTAN_REGIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nameUz}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rol:
                    </label>
                    <input
                      type="text"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder="Masalan: Jamoa sardori / Dasturchi"
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(null)}
                      className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                    >
                      Qo'shish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
