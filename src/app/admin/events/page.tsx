"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Plus, Trash2, Users, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
import { UZBEKISTAN_REGIONS, getRegionName } from "@/lib/regions";
import {
  getEvents,
  addEvent,
  deleteEvent,
  getEventRegistrationCount,
  getEventRegistrations,
  SteamEvent,
  EventRegistration,
} from "@/lib/events-store";
import { LIMITS, XP_REWARDS } from "@/lib/constants";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<SteamEvent[]>([]);
  const [regCounts, setRegCounts] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventRegs, setSelectedEventRegs] = useState<{ title: string; regs: EventRegistration[] } | null>(null);
  // ✅ confirm() o'rniga custom modal
  const [deleteTarget, setDeleteTarget] = useState<SteamEvent | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("toshkent-shahri");
  const [maxParticipants, setMaxParticipants] = useState(LIMITS.LEADERBOARD_PAGE_SIZE * 5);
  const [xpReward, setXpReward] = useState(XP_REWARDS.EVENT_PARTICIPATION);
  const [category, setCategory] = useState("Muhandislik va Texnologiya");

  const loadEvents = () => {
    const allEvents = getEvents();
    setEvents(allEvents);
    const counts: Record<string, number> = {};
    allEvents.forEach((ev) => {
      counts[ev.id] = getEventRegistrationCount(ev.id);
    });
    setRegCounts(counts);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Sana validatsiyasi — o'tib ketgan sana qabul qilinmaydi
    if (date < todayStr) {
      setFormError("Tadbir sanasi bugundan oldingi bo'lishi mumkin emas.");
      return;
    }
    if (deadlineDate && deadlineDate > date) {
      setFormError("Ro'yxatdan o'tish muddati tadbir sanasidan keyin bo'lishi mumkin emas.");
      return;
    }

    addEvent({
      title,
      description,
      date,
      time,
      deadlineDate: deadlineDate || date,
      location,
      region,
      maxParticipants,
      xpReward,
      category: category || "STEM",
      createdBy: "Bosh Admin",
    });
    setIsModalOpen(false);
    // Reset form
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setDeadlineDate("");
    setLocation("");
    setCategory("Muhandislik va Texnologiya");
    setMaxParticipants(LIMITS.LEADERBOARD_PAGE_SIZE * 5);
    setXpReward(XP_REWARDS.EVENT_PARTICIPATION);
    setRegion("toshkent-shahri");
    setFormError(null);
    loadEvents();
  };

  const handleDelete = (event: SteamEvent) => {
    // ✅ confirm() o'rniga modal ochish
    setDeleteTarget(event);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id);
    loadEvents();
    setDeleteTarget(null);
  };

  const handleViewRegistrations = (event: SteamEvent) => {
    const regs = getEventRegistrations(event.id);
    setSelectedEventRegs({
      title: event.title,
      regs,
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#070b14]">
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar pageTitle="TADBIRLAR BOSHQARUVI" />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Tadbirlar ro'yxati</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Yangi tadbir qo'shish va ro'yxatdan o'tgan ishtirokchilar tahlili
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Yangi tadbir qo'shish</span>
            </button>
          </div>

          {events.length === 0 ? (
            <div className="bg-white dark:bg-[#0d1628] rounded-2xl border border-slate-200 dark:border-[#141e33] p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">Hozircha tadbirlar qo'shilmagan.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0d1628] rounded-2xl border border-slate-200 dark:border-[#141e33] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-[#0a1120] text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Tadbir nomi</th>
                      <th className="px-6 py-4 font-semibold">Sana va Vaqt</th>
                      <th className="px-6 py-4 font-semibold">Ro'yxatdan o'tish oxirgi muddati</th>
                      <th className="px-6 py-4 font-semibold">Manzil</th>
                      <th className="px-6 py-4 font-semibold">Ishtirokchilar</th>
                      <th className="px-6 py-4 font-semibold text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-[#141e33]">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50 dark:hover:bg-[#0a1120]/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          <div>
                            <div>{event.title}</div>
                            <span className="text-[10px] text-cyan-500 font-bold uppercase">{event.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {event.date}, {event.time}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono">
                            {event.deadlineDate || event.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {event.location} ({getRegionName(event.region, "uz")})
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <button
                            onClick={() => handleViewRegistrations(event)}
                            aria-label={`${event.title} tadbirining ro'yxatdan o'tganlarini ko'rish`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-xs font-semibold hover:bg-cyan-500/20 transition-all cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{regCounts[event.id] || 0} / {event.maxParticipants} (Ko&apos;rish)</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(event)}
                            aria-label={`${event.title} tadbirini o'chirish`}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-event-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-[#0d1628] rounded-2xl max-w-xl w-full p-4 sm:p-5 border border-slate-200 dark:border-[#141e33] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h2 id="add-event-dialog-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Yangi tadbir qo&apos;shish
              </h2>
              <button
                type="button"
                onClick={() => { setIsModalOpen(false); setFormError(null); }}
                aria-label="Modalni yopish"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {formError && (
              <div role="alert" className="flex items-start gap-2 p-3 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomi</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: STEAM Innovatsiyalar Hackathoni" className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tavsif</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Tadbir haqida batafsil ma'lumot..." className="w-full px-4 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs"></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tadbir Sanasi</label>
                  <input required type="date" min={todayStr} value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Vaqt</label>
                  <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ro'yxatdan o'tish muddati</label>
                  <input required type="date" min={todayStr} value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Manzil</label>
                  <input required type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Masalan: IT Park Hub" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Viloyat</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs">
                    {UZBEKISTAN_REGIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.nameUz}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Maks. ishtirokchilar</label>
                  <input type="number" value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">XP mukofoti</label>
                  <input type="number" value={xpReward} onChange={(e) => setXpReward(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Turkum</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Masalan: Robototexnika" className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a1120] border border-slate-200 dark:border-[#141e33] rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-white text-xs" />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-100 dark:bg-[#141e33] text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-md">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Registered Users Modal */}
      {selectedEventRegs && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="regs-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-[#0d1628] rounded-2xl max-w-2xl w-full p-4 sm:p-5 border border-slate-200 dark:border-[#141e33] max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 id="regs-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Ro&apos;yxatdan o&apos;tganlar
                </h3>
                <p className="text-xs text-cyan-500 font-semibold">{selectedEventRegs.title}</p>
              </div>
              <button
                onClick={() => setSelectedEventRegs(null)}
                aria-label="Modalni yopish"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {selectedEventRegs.regs.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-8">
                  Hali hech kim ushbu tadbirga ro'yxatdan o'tmagan.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedEventRegs.regs.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {reg.userName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          📍 {getRegionName(reg.userRegion, "uz")} • Token: {reg.qrToken}
                        </div>
                      </div>

                      <div className="text-right">
                        {reg.status === "ATTENDED" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Ishtirok etgan ✓</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[10px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Kutilmoqda</span>
                          </span>
                        )}
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Date(reg.registeredAt).toLocaleDateString("uz-UZ")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedEventRegs(null)}
                className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Delete confirm modal — confirm() o'rniga */}
      {deleteTarget && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-event-title"
          aria-describedby="delete-event-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-[#0d1628] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" aria-hidden="true" />
              </div>
              <div>
                <h3 id="delete-event-title" className="text-sm font-bold text-slate-900 dark:text-white">
                  Tadbirni o&apos;chirish
                </h3>
                <p id="delete-event-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong className="text-slate-700 dark:text-slate-200">{deleteTarget.title}</strong> tadbirini
                  o&apos;chirmoqchimisiz? Bu amalni bekor qilib bo&apos;lmaydi.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Ha, o&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
