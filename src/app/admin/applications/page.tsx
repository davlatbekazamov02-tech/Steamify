"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Award,
  Calendar,
  MapPin,
  Lock,
  Unlock,
  Trash2,
  Users,
  Layers,
  Phone,
  AlertCircle,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import {
  getCamps,
  addCamp,
  deleteCamp,
  toggleCampStatus,
  getApplications,
  updateApplicationStatus,
  isApplicationsGloballyOpen,
  setApplicationsGloballyOpen,
  CampProgram,
  CampApplication,
} from "@/lib/camps-store";
import { UZBEKISTAN_REGIONS, getRegionName } from "@/lib/regions";

export default function AdminApplicationsPage() {
  const [mainView, setMainView] = useState<"APPLICATIONS" | "CAMPS">("APPLICATIONS");
  const [activeTab, setActiveTab] = useState<"ALL" | "Kutilmoqda" | "Tasdiqlangan" | "Rad etilgan">("ALL");
  const [selectedApp, setSelectedApp] = useState<CampApplication | null>(null);

  const [globalOpen, setGlobalOpen] = useState(true);
  const [camps, setCamps] = useState<CampProgram[]>([]);
  const [applications, setApplications] = useState<CampApplication[]>([]);

  // New Camp Modal State
  const [showAddCampModal, setShowAddCampModal] = useState(false);
  const [campTitle, setCampTitle] = useState("");
  const [campDescription, setCampDescription] = useState("");
  const [campLocation, setCampLocation] = useState("");
  const [campRegion, setCampRegion] = useState("toshkent-shahri");
  const [campStartDate, setCampStartDate] = useState("");
  const [campEndDate, setCampEndDate] = useState("");
  const [campDeadline, setCampDeadline] = useState("");
  const [campMaxParts, setCampMaxParts] = useState(50);
  // ✅ confirm() o'rniga custom modal
  const [deleteCampTarget, setDeleteCampTarget] = useState<CampProgram | null>(null);

  const loadData = () => {
    setGlobalOpen(isApplicationsGloballyOpen());
    setCamps(getCamps());
    setApplications(getApplications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleGlobalOpen = () => {
    const newState = !globalOpen;
    setGlobalOpen(newState);
    setApplicationsGloballyOpen(newState);
  };

  const handleCreateCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campTitle.trim()) return;

    addCamp({
      title: campTitle,
      description: campDescription,
      location: campLocation,
      region: campRegion,
      startDate: campStartDate,
      endDate: campEndDate,
      deadlineDate: campDeadline || campStartDate,
      isOpen: true,
      maxParticipants: campMaxParts,
    });

    setCampTitle("");
    setCampDescription("");
    setCampLocation("");
    setShowAddCampModal(false);
    loadData();
  };

  const handleToggleCamp = (campId: string) => {
    toggleCampStatus(campId);
    loadData();
  };

  const handleDeleteCamp = (camp: CampProgram) => {
    // ✅ confirm() o'rniga modal ochish
    setDeleteCampTarget(camp);
  };

  const handleDeleteCampConfirm = () => {
    if (!deleteCampTarget) return;
    deleteCamp(deleteCampTarget.id);
    loadData();
    setDeleteCampTarget(null);
  };

  const handleUpdateStatus = (appId: string, status: "Tasdiqlangan" | "Rad etilgan") => {
    updateApplicationStatus(appId, status);
    loadData();
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status });
    }
  };

  const filteredApps = applications.filter((a) => {
    if (activeTab === "ALL") return true;
    return a.status === activeTab;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased transition-colors">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="ARIZALAR VA CAMPLAR BOSHQARUVI" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Arizalar va Camp Boshqaruvi
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Camp dasturlarini e&apos;lon qilish, qabulni ochish/yopish va arizalarni tasdiqlash
              </p>
            </div>

            {/* Global Applications Switch */}
            <div className="flex items-center gap-3 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 p-3 rounded-2xl shadow-sm">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Arizalar Qabuli:
              </span>
              <button
                onClick={handleToggleGlobalOpen}
                aria-label={globalOpen ? "Arizalar qabulini yopish" : "Arizalar qabulini ochish"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  globalOpen
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/40"
                }`}
              >
                {globalOpen ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Ochiq (Faol)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Yopiq (Bloklangan)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              onClick={() => setMainView("APPLICATIONS")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainView === "APPLICATIONS"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>Kelib tushgan arizalar ({applications.length})</span>
            </button>

            <button
              onClick={() => setMainView("CAMPS")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mainView === "CAMPS"
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" aria-hidden="true" />
              <span>Camp va Dasturlar ({camps.length})</span>
            </button>
          </div>

          {/* VIEW 1: APPLICATIONS LIST */}
          {mainView === "APPLICATIONS" && (
            <div className="space-y-4">
              {/* Filter Tabs */}
              <div className="flex gap-2" role="tablist" aria-label="Ariza holati filtri">
                {(
                  [
                    { id: "ALL", label: "Barchasi" },
                    { id: "Kutilmoqda", label: "Kutilmoqda" },
                    { id: "Tasdiqlangan", label: "Tasdiqlangan" },
                    { id: "Rad etilgan", label: "Rad etilgan" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === t.id
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {filteredApps.length === 0 ? (
                <div className="rounded-3xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-12 text-center flex flex-col items-center justify-center">
                  <FileText className="w-10 h-10 text-slate-400 mb-2" aria-hidden="true" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Hozircha arizalar kelib tushmagan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Foydalanuvchilar ochiq camp dasturlariga ariza topshirganda bu yerda ko&apos;rinadi.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* List on left */}
                  <div className="lg:col-span-6 space-y-3">
                    {filteredApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${app.userName} arizasini ko'rish`}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedApp(app)}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer bg-white dark:bg-[#0d1527] shadow-sm ${
                          selectedApp?.id === app.id
                            ? "border-cyan-500 ring-2 ring-cyan-500/20"
                            : "border-slate-200 dark:border-cyan-900/40 hover:border-cyan-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {app.userName}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.status === "Tasdiqlangan"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : app.status === "Rad etilgan"
                                ? "bg-rose-500/10 text-rose-500"
                                : "bg-amber-500/10 text-amber-500"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mb-1">
                          {app.campTitle}
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                          📍 {getRegionName(app.userRegion, "uz")} • {app.school} ({app.grade})
                        </div>

                        <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between">
                          <span>Tel: {app.phone}</span>
                          <span>{app.submittedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detail on right */}
                  <div className="lg:col-span-6 bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-3xl p-6 shadow-sm">
                    {selectedApp ? (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                              {selectedApp.userName}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {selectedApp.school} ({selectedApp.grade})
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              selectedApp.status === "Tasdiqlangan"
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                : selectedApp.status === "Rad etilgan"
                                ? "bg-rose-500/10 text-rose-500 border border-rose-500/30"
                                : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                            }`}
                          >
                            {selectedApp.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Tanlangan Camp:</span>
                            <div className="font-bold text-cyan-600 dark:text-cyan-400">{selectedApp.campTitle}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase font-bold">Telefon:</span>
                              <div className="font-semibold">{selectedApp.phone}</div>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase font-bold">Telegram:</span>
                              <div className="font-semibold text-cyan-500">{selectedApp.telegram || "-"}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                            Motivatsiya va Maqsadlar:
                          </h4>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#070b14] p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                            {selectedApp.motivation}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.id, "Tasdiqlangan")}
                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            ✓ Qabul Qilish (Tasdiqlash)
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.id, "Rad etilgan")}
                            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            ✕ Rad Etish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
                        <FileText className="w-8 h-8 mb-2 opacity-50" aria-hidden="true" />
                        <p className="text-xs">
                          Tafsilotlarni ko&apos;rish uchun arizani tanlang.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: CAMPS MANAGEMENT */}
          {mainView === "CAMPS" && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Mavjud Camp va Dasturlar Ro&apos;yxati
                </h2>
                <button
                  onClick={() => setShowAddCampModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Yangi Camp Yaratish</span>
                </button>
              </div>

              {camps.length === 0 ? (
                <div className="rounded-3xl bg-white dark:bg-[#0b1222]/90 border border-slate-200 dark:border-[#14223d] p-12 text-center flex flex-col items-center justify-center">
                  <Layers className="w-10 h-10 text-slate-400 mb-2" aria-hidden="true" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Hozircha Camp dasturlari yaratilmagan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                    Ishtirokchilar ariza topshirishlari uchun yuqoridagi tugma orqali yangi Camp dasturi yarating.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {camps.map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleToggleCamp(camp.id)}
                            aria-label={camp.isOpen ? `${camp.title} qabulini yopish` : `${camp.title} qabulini ochish`}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              camp.isOpen
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/30"
                            }`}
                          >
                            {camp.isOpen ? (
                              <Unlock className="w-3 h-3" aria-hidden="true" />
                            ) : (
                              <Lock className="w-3 h-3" aria-hidden="true" />
                            )}
                            <span>{camp.isOpen ? "Qabul Ochiq" : "Qabul Yopiq"}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCamp(camp)}
                            aria-label={`${camp.title} campini o'chirish`}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {camp.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {camp.description}
                        </p>

                        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-cyan-500 shrink-0" aria-hidden="true" />
                            <span>{camp.startDate} — {camp.endDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" aria-hidden="true" />
                            <span>{camp.location} ({getRegionName(camp.region, "uz")})</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-500">
                            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            <span>Deadline: {camp.deadlineDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span>Maksimal qatnashchilar: {camp.maxParticipants} kishi</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* New Camp Modal */}
      {showAddCampModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-camp-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-[#0d1628] rounded-3xl max-w-lg w-full p-6 border border-cyan-500/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 id="add-camp-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
                Yangi Camp / Dastur E&apos;lon Qilish
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCampModal(false)}
                aria-label="Modalni yopish"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateCamp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Camp Nomi:
                </label>
                <input
                  type="text"
                  required
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="Masalan: STEAM Yozgi Innovatsiyalar Camp 2026"
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tavsif:
                </label>
                <textarea
                  rows={2}
                  value={campDescription}
                  onChange={(e) => setCampDescription(e.target.value)}
                  placeholder="Camp haqida qisqacha ma'lumot va yo'nalishlar..."
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Manzil:
                  </label>
                  <input
                    type="text"
                    required
                    value={campLocation}
                    onChange={(e) => setCampLocation(e.target.value)}
                    placeholder="Masalan: Bo'stonliq, STEAM Hub"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Viloyat:
                  </label>
                  <select
                    value={campRegion}
                    onChange={(e) => setCampRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  >
                    {UZBEKISTAN_REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nameUz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Boshlanish Sanasi:
                  </label>
                  <input
                    type="date"
                    required
                    value={campStartDate}
                    onChange={(e) => setCampStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tugash Sanasi:
                  </label>
                  <input
                    type="date"
                    required
                    value={campEndDate}
                    onChange={(e) => setCampEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Qabul Deadline:
                  </label>
                  <input
                    type="date"
                    required
                    value={campDeadline}
                    onChange={(e) => setCampDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Maksimal Qatnashchilar:
                </label>
                <input
                  type="number"
                  value={campMaxParts}
                  onChange={(e) => setCampMaxParts(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampModal(false)}
                  className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs shadow-md"
                >
                  E&apos;lon qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Delete confirm modal — confirm() o'rniga */}
      {deleteCampTarget && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-camp-title"
          aria-describedby="delete-camp-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-[#0d1628] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" aria-hidden="true" />
              </div>
              <div>
                <h3 id="delete-camp-title" className="text-sm font-bold text-slate-900 dark:text-white">
                  Campni o&apos;chirish
                </h3>
                <p id="delete-camp-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong className="text-slate-700 dark:text-slate-200">{deleteCampTarget.title}</strong> campini
                  o&apos;chirmoqchimisiz? Unga tegishli arizalar ham o&apos;chiriladi.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteCampTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDeleteCampConfirm}
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
