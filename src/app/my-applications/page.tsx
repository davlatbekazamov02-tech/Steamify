"use client";

import { useState, useEffect, useRef } from "react";
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  Plus, 
  Send, 
  Lock, 
  Unlock, 
  FileX, 
  Layers,
  Phone,
  School,
  Sparkles
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { 
  getCamps, 
  getUserApplications, 
  submitApplication, 
  isApplicationsGloballyOpen, 
  CampProgram, 
  CampApplication 
} from "@/lib/camps-store";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";
import { getRegionName } from "@/lib/regions";

export default function MyApplicationsPage() {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS.USER);
  const [isGloballyOpen, setIsGloballyOpen] = useState(true);
  const [availableCamps, setAvailableCamps] = useState<CampProgram[]>([]);
  const [myApplications, setMyApplications] = useState<CampApplication[]>([]);

  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState<string>("");
  const [school, setSchool] = useState("");
  const [grade, setGrade] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [motivation, setMotivation] = useState("");
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  // ✅ setTimeout ref — cleanup uchun
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Read role from cookie
    const match = document.cookie.match(new RegExp('(^| )STEMIFY_role=([^;]+)'));
    if (match && match[2]) {
      const role = match[2] as UserRole;
      if (DEMO_USERS[role]) {
        setCurrentUser(DEMO_USERS[role]);
      }
    }
  }, []);

  const loadData = () => {
    const globalStatus = isApplicationsGloballyOpen();
    setIsGloballyOpen(globalStatus);
    const camps = getCamps().filter((c) => c.isOpen);
    setAvailableCamps(camps);
    if (camps.length > 0 && !selectedCampId) {
      setSelectedCampId(camps[0].id);
    }
    setMyApplications(getUserApplications(currentUser.id));
  };

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCamp = availableCamps.find((c) => c.id === selectedCampId);
    if (!targetCamp) return;

    submitApplication({
      campId: targetCamp.id,
      campTitle: targetCamp.title,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userRegion: currentUser.regionId || "toshkent-shahri",
      school,
      grade,
      phone,
      telegram,
      motivation,
    });

    setShowApplyModal(false);
    setMotivation("");
    setSuccessNotice(`Arizangiz "${targetCamp.title}" uchun muvaffaqiyatli topshirildi! Adminlar tomonidan ko'rib chiqiladi.`);
    loadData();
    // ✅ Oldingi timeoutni bekor qilib yangi o'rnatish
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setSuccessNotice(null), 5000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="MENING ARIZALARIM" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Mening Arizalarim
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                STEM Camp va maxsus dasturlarga topshirilgan arizalaringiz holati
              </p>
            </div>

            {isGloballyOpen && availableCamps.length > 0 ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Ariza Topshirish</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-semibold">
                <Lock className="w-4 h-4" />
                <span>Qabul Yopiq</span>
              </div>
            )}
          </div>

          {/* Banner: Applications Closed Notice */}
          {!isGloballyOpen && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Arizalar qabuli hozirda admin tomonidan yopib qo'yilgan
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Hozirda yangi arizalar qabuli to'xtatilgan. Yangi mavsumiy camp yoki maxsus dasturlar e'lon qilinganda, ushbu sahifada ariza topshirish imkoniyati ochiladi.
                </p>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Section: Open Camps Available for Application */}
          {isGloballyOpen && availableCamps.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Hozirda Ochiq Camp va Dasturlar</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {availableCamps.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 shadow-sm flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          <span>Qabul Ochiq</span>
                        </span>
                        <span className="text-[11px] text-amber-500 font-mono">
                          Deadline: {camp.deadlineDate}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {camp.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {camp.description}
                      </p>

                      <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{camp.startDate} — {camp.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                          <span>{camp.location} ({getRegionName(camp.region, "uz")})</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCampId(camp.id);
                        setShowApplyModal(true);
                      }}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Ariza Topshirish
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Submitted Applications History */}
          <div className="space-y-2.5 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-500" />
              <span>Yuborilgan Arizalarim Tarixi</span>
            </h2>

            {myApplications.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-3 text-slate-400">
                  <FileX className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Hozircha arizalar topshirilmagan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Ochiq camp dasturlaridan birini tanlab, o'z arizangizni yuborishingiz mumkin.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {app.status === "Tasdiqlangan" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tasdiqlangan (Qabul qilindi)</span>
                          </span>
                        ) : app.status === "Rad etilgan" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            <span>Rad etilgan</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            <Clock className="w-3 h-3" />
                            <span>Kutilmoqda (Ko'rib chiqilmoqda)</span>
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          Topshirilgan: {app.submittedAt}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {app.campTitle}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {app.school} ({app.grade}) • Tel: {app.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Application Modal */}
          {showApplyModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0d1527] border border-cyan-500/40 rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-500" />
                    <span>STEM Camp Dasturiga Ariza</span>
                  </h3>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="text-slate-400 hover:text-white text-sm p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tanlangan Camp / Dastur:
                    </label>
                    <select
                      value={selectedCampId}
                      onChange={(e) => setSelectedCampId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                    >
                      {availableCamps.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Maktab / Litsey:
                      </label>
                      <input
                        type="text"
                        required
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Masalan: 1-sonli IDUM"
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Sinf / Kurs:
                      </label>
                      <input
                        type="text"
                        required
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        placeholder="Masalan: 10-sinf"
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Telefon Raqami:
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+998 90 123 45 67"
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Telegram:
                      </label>
                      <input
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="@username"
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Motivatsiya: Nima uchun bu Campda qatnashmoqchisiz?
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Qiziqishlaringiz, loyiha g'oyalaringiz va maqsadlaringiz haqida yozing..."
                      className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                    >
                      Yuborish
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
