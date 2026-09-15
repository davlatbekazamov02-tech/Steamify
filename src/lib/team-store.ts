/**
 * TEAM MEMBERS DATA STORE
 * Landing page "Bizning Jamoa" bo'limi uchun
 * Admin paneldan CRUD operatsiyalari
 */

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string; // Masalan: "Bosh Direktor", "Texnik Rahbar"
  bio: string; // Qisqa tarjimai hol
  photoUrl: string; // Rasm URL (Unsplash yoki upload)
  order: number; // Tartib raqami (1, 2, 3...)
  isActive: boolean; // Landing page da ko'rsatish
  socialLinks?: {
    telegram?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Jamoa a'zolari — Admin panel orqali qo'shiladi
let teamMembers: TeamMember[] = [];

/**
 * Barcha jamoalarni olish (admin panel uchun)
 */
export function getAllTeamMembers(): TeamMember[] {
  return [...teamMembers].sort((a, b) => a.order - b.order);
}

/**
 * Faqat aktiv jamoalarni olish (landing page uchun)
 */
export function getActiveTeamMembers(): TeamMember[] {
  return teamMembers
    .filter((member) => member.isActive)
    .sort((a, b) => a.order - b.order);
}

/**
 * ID bo'yicha jamoa a'zosini olish
 */
export function getTeamMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((member) => member.id === id);
}

/**
 * Yangi jamoa a'zosi qo'shish
 */
export function createTeamMember(
  data: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
): TeamMember {
  const newMember: TeamMember = {
    ...data,
    id: `tm-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  teamMembers.push(newMember);
  return newMember;
}

/**
 * Jamoa a'zosini yangilash
 */
export function updateTeamMember(
  id: string,
  data: Partial<Omit<TeamMember, "id" | "createdAt">>
): TeamMember | null {
  const index = teamMembers.findIndex((member) => member.id === id);
  
  if (index === -1) {
    return null;
  }
  
  teamMembers[index] = {
    ...teamMembers[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return teamMembers[index];
}

/**
 * Jamoa a'zosini o'chirish
 */
export function deleteTeamMember(id: string): boolean {
  const index = teamMembers.findIndex((member) => member.id === id);
  
  if (index === -1) {
    return false;
  }
  
  teamMembers.splice(index, 1);
  return true;
}

/**
 * Jamoa a'zosini faollashtirish/o'chirish
 */
export function toggleTeamMemberStatus(id: string): TeamMember | null {
  const index = teamMembers.findIndex((member) => member.id === id);
  
  if (index === -1) {
    return null;
  }
  
  teamMembers[index].isActive = !teamMembers[index].isActive;
  teamMembers[index].updatedAt = new Date().toISOString();
  
  return teamMembers[index];
}

/**
 * Tartib raqamini o'zgartirish (drag & drop uchun)
 */
export function reorderTeamMembers(memberId: string, newOrder: number): boolean {
  const member = teamMembers.find((m) => m.id === memberId);
  
  if (!member) {
    return false;
  }
  
  const oldOrder = member.order;
  
  // Tartibni yangilash
  teamMembers.forEach((m) => {
    if (m.id === memberId) {
      m.order = newOrder;
      m.updatedAt = new Date().toISOString();
    } else if (oldOrder < newOrder && m.order > oldOrder && m.order <= newOrder) {
      m.order -= 1;
    } else if (oldOrder > newOrder && m.order >= newOrder && m.order < oldOrder) {
      m.order += 1;
    }
  });
  
  return true;
}

/**
 * Jamoa statistikasi
 */
export function getTeamStats() {
  return {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.isActive).length,
    inactive: teamMembers.filter((m) => !m.isActive).length,
  };
}
