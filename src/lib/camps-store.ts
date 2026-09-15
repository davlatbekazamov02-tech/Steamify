"use client";

export interface CampProgram {
  id: string;
  title: string;
  description: string;
  location: string;
  region: string;
  startDate: string;
  endDate: string;
  deadlineDate: string;
  isOpen: boolean;
  maxParticipants: number;
  createdAt: string;
}

export interface CampApplication {
  id: string;
  campId: string;
  campTitle: string;
  userId: string;
  userName: string;
  userRegion: string;
  school: string;
  grade: string;
  phone: string;
  telegram: string;
  motivation: string;
  direction?: string;
  status: "Kutilmoqda" | "Tasdiqlangan" | "Rad etilgan";
  submittedAt: string;
}

const CAMPS_KEY = "steamify_camp_programs";
const APPLICATIONS_KEY = "steamify_submitted_applications";
const GLOBAL_OPEN_KEY = "steamify_applications_global_open";

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function isApplicationsGloballyOpen(): boolean {
  return getFromStorage<boolean>(GLOBAL_OPEN_KEY, true);
}

export function setApplicationsGloballyOpen(isOpen: boolean): void {
  saveToStorage(GLOBAL_OPEN_KEY, isOpen);
}

export function getCamps(): CampProgram[] {
  return getFromStorage<CampProgram[]>(CAMPS_KEY, []);
}

export function addCamp(camp: Omit<CampProgram, "id" | "createdAt">): CampProgram {
  const camps = getCamps();
  const newCamp: CampProgram = {
    ...camp,
    id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  camps.unshift(newCamp);
  saveToStorage(CAMPS_KEY, camps);
  return newCamp;
}

export function toggleCampStatus(campId: string): boolean {
  const camps = getCamps();
  let newStatus = false;
  const updated = camps.map((c) => {
    if (c.id === campId) {
      newStatus = !c.isOpen;
      return { ...c, isOpen: newStatus };
    }
    return c;
  });
  saveToStorage(CAMPS_KEY, updated);
  return newStatus;
}

export function deleteCamp(campId: string): void {
  const camps = getCamps().filter((c) => c.id !== campId);
  saveToStorage(CAMPS_KEY, camps);
}

export function getApplications(): CampApplication[] {
  return getFromStorage<CampApplication[]>(APPLICATIONS_KEY, []);
}

export function submitApplication(app: Omit<CampApplication, "id" | "submittedAt" | "status">): CampApplication {
  const apps = getApplications();
  const newApp: CampApplication = {
    ...app,
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: "Kutilmoqda",
    submittedAt: new Date().toLocaleDateString("uz-UZ", { day: "2-digit", month: "long", year: "numeric" }),
  };
  apps.unshift(newApp);
  saveToStorage(APPLICATIONS_KEY, apps);
  return newApp;
}

export function updateApplicationStatus(appId: string, status: "Kutilmoqda" | "Tasdiqlangan" | "Rad etilgan"): void {
  const apps = getApplications();
  const updated = apps.map((a) => (a.id === appId ? { ...a, status } : a));
  saveToStorage(APPLICATIONS_KEY, updated);
}

export function getUserApplications(userId: string): CampApplication[] {
  return getApplications().filter((a) => a.userId === userId);
}
