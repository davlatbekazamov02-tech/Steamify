"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, Plus, X, UserCheck, Users, UserX, Pencil, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  getTeamStats,
  type TeamMember,
} from "@/lib/team-store";
import { sanitizeText, isValidImageUrl, validateLength, getSafeImageUrl } from "@/lib/security";
import { LIMITS } from "@/lib/constants";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(getAllTeamMembers());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    bio: "",
    photoUrl: "",
    order: getAllTeamMembers().length + 1,
    isActive: true,
    socialLinks: { telegram: "", linkedin: "", github: "", email: "" },
  });

  const stats = getTeamStats();

  const resetForm = () => {
    setFormData({
      firstName: "", lastName: "", role: "", bio: "", photoUrl: "",
      order: getAllTeamMembers().length + 1,
      isActive: true,
      socialLinks: { telegram: "", linkedin: "", github: "", email: "" },
    });
    setEditingMember(null);
    setIsFormOpen(false);
    setFormError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateLength(formData.firstName, 2, LIMITS.MAX_NAME_LENGTH)) {
      setFormError(`Ism 2-${LIMITS.MAX_NAME_LENGTH} belgi orasida bo'lishi kerak`);
      return;
    }
    if (!validateLength(formData.lastName, 2, LIMITS.MAX_NAME_LENGTH)) {
      setFormError(`Familiya 2-${LIMITS.MAX_NAME_LENGTH} belgi orasida bo'lishi kerak`);
      return;
    }
    if (!validateLength(formData.role, 3, LIMITS.MAX_ROLE_LENGTH)) {
      setFormError(`Lavozim 3-${LIMITS.MAX_ROLE_LENGTH} belgi orasida bo'lishi kerak`);
      return;
    }
    if (!validateLength(formData.bio, 10, LIMITS.MAX_BIO_LENGTH)) {
      setFormError(`Tarjimai hol 10-${LIMITS.MAX_BIO_LENGTH} belgi orasida bo'lishi kerak`);
      return;
    }
    if (!isValidImageUrl(formData.photoUrl)) {
      setFormError("Noto'g'ri rasm URL. Faqat Unsplash, Cloudinary yoki Steamify domenlaridan rasm yuklang");
      return;
    }

    const sanitizedData = {
      ...formData,
      firstName: sanitizeText(formData.firstName),
      lastName:  sanitizeText(formData.lastName),
      role:      sanitizeText(formData.role),
      bio:       sanitizeText(formData.bio),
      socialLinks: {
        telegram: formData.socialLinks.telegram ? sanitizeText(formData.socialLinks.telegram) : "",
        linkedin: formData.socialLinks.linkedin ? sanitizeText(formData.socialLinks.linkedin) : "",
        github:   formData.socialLinks.github   ? sanitizeText(formData.socialLinks.github)   : "",
        email:    formData.socialLinks.email    ? sanitizeText(formData.socialLinks.email)    : "",
      },
    };

    if (editingMember) {
      updateTeamMember(editingMember.id, sanitizedData);
    } else {
      createTeamMember(sanitizedData);
    }
    setMembers(getAllTeamMembers());
    resetForm();
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName, lastName: member.lastName,
      role: member.role, bio: member.bio, photoUrl: member.photoUrl,
      order: member.order, isActive: member.isActive,
      socialLinks: member.socialLinks || { telegram: "", linkedin: "", github: "", email: "" },
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteTeamMember(deleteTarget.id);
    setMembers(getAllTeamMembers());
    setDeleteTarget(null);
  };

  const handleToggleStatus = (id: string) => {
    toggleTeamMemberStatus(id);
    setMembers(getAllTeamMembers());
  };

  const inputCls = "w-full px-3 py-2.5 bg-slate-100 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors";
  const labelCls = "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 antialiased">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="JAMOA A'ZOLARI BOSHQARUVI" />

        <main className="flex-1 p-3 sm:p-4 w-full space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Jamoa A&apos;zolari
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Landing page &quot;Bizning Jamoa&quot; bo&apos;limini boshqaring
              </p>
            </div>
            <button
              onClick={() => { resetForm(); setIsFormOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Yangi A&apos;zo Qo&apos;shish
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10">
                <Users className="w-4 h-4 text-cyan-500" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.total}</div>
                <div className="text-[11px] text-slate-500">Jami</div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <UserCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.active}</div>
                <div className="text-[11px] text-slate-500">Faol</div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-500/10">
                <UserX className="w-4 h-4 text-slate-400" aria-hidden="true" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-500">{stats.inactive}</div>
                <div className="text-[11px] text-slate-500">Nofaol</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4">#</th>
                    <th className="px-5 py-4">Rasm</th>
                    <th className="px-5 py-4">Ism Familiya</th>
                    <th className="px-5 py-4">Lavozim</th>
                    <th className="px-5 py-4">Holat</th>
                    <th className="px-5 py-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                        Hozircha a&apos;zolar yo&apos;q
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-5 py-4 text-slate-500">{member.order}</td>
                        <td className="px-5 py-4">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                            <Image
                              src={getSafeImageUrl(member.photoUrl, "/images/default-avatar.png")}
                              alt={`${member.firstName} ${member.lastName}`}
                              fill sizes="40px" className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                          {member.firstName} {member.lastName}
                        </td>
                        <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{member.role}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleStatus(member.id)}
                            aria-label={member.isActive ? "Nofaol qilish" : "Faol qilish"}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                              member.isActive
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {member.isActive ? "Faol" : "Nofaol"}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(member)}
                              aria-label={`${member.firstName} ni tahrirlash`}
                              className="p-1.5 text-cyan-600 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(member)}
                              aria-label={`${member.firstName} ni o'chirish`}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ===== FORM MODAL ===== */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="team-form-title"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white dark:bg-[#0d1527] border border-slate-200 dark:border-cyan-900/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 id="team-form-title" className="text-base font-bold text-slate-900 dark:text-white">
                {editingMember ? "A'zoni Tahrirlash" : "Yangi A'zo Qo'shish"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                aria-label="Yopish"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ism *</label>
                  <input type="text" required value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={inputCls} placeholder="Jamshid" />
                </div>
                <div>
                  <label className={labelCls}>Familiya *</label>
                  <input type="text" required value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={inputCls} placeholder="Karimov" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Lavozim / Rol *</label>
                <input type="text" required value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={inputCls} placeholder="Bosh Direktor" />
              </div>

              <div>
                <label className={labelCls}>Qisqa Tarjimai Hol *</label>
                <textarea required value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3} className={inputCls}
                  placeholder="STEAM ta'lim sohasida 10+ yillik tajriba..." />
              </div>

              <div>
                <label className={labelCls}>Rasm URL *</label>
                <input type="url" required value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className={inputCls} placeholder="https://images.unsplash.com/..." />
                <p className="text-[11px] text-slate-500 mt-1">Unsplash, Cloudinary yoki Steamify domeni</p>
              </div>

              <div>
                <label className={labelCls}>Tartib Raqami</label>
                <input type="number" min="1" value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className={inputCls} />
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Ijtimoiy Tarmoqlar
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(["telegram", "linkedin", "github", "email"] as const).map((key) => (
                    <div key={key}>
                      <label className={labelCls}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <input
                        type={key === "email" ? "email" : "text"}
                        value={formData.socialLinks[key]}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, [key]: e.target.value }
                        })}
                        className={inputCls}
                        placeholder={key === "telegram" ? "@username" : key === "email" ? "user@example.com" : "username"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input type="checkbox" id="isActive" checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer" />
                <label htmlFor="isActive" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Landing page da ko&apos;rsatish
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetForm}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Bekor Qilish
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all">
                  {editingMember ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {deleteTarget && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-member-title"
          aria-describedby="delete-member-desc"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div className="bg-white dark:bg-[#0d1527] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-500" aria-hidden="true" />
              </div>
              <div>
                <h3 id="delete-member-title" className="text-sm font-bold text-slate-900 dark:text-white">
                  A&apos;zoni o&apos;chirish
                </h3>
                <p id="delete-member-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <strong className="text-slate-700 dark:text-slate-200">
                    {deleteTarget.firstName} {deleteTarget.lastName}
                  </strong> ni o&apos;chirishni xohlaysizmi? Bu amalni bekor qilib bo&apos;lmaydi.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                Bekor qilish
              </button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md">
                Ha, o&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
