"use client";

export interface SteamEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  deadlineDate: string;
  location: string;
  region: string;
  maxParticipants: number;
  xpReward: number;
  category: string;
  createdBy: string;
  createdAt: string;
  photos?: string[]; // Tadbir fotosuratlar URL lari
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userRegion: string;
  registeredAt: string;
  qrToken: string;
  status: "PENDING" | "ATTENDED";
  teamName?: string;
  attendedAt?: string;
}

const EVENTS_KEY = "STEMIFY_events";
const REGISTRATIONS_KEY = "STEMIFY_registrations";

function getFromStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getEvents(): SteamEvent[] {
  return getFromStorage<SteamEvent>(EVENTS_KEY);
}

export function addEvent(event: Omit<SteamEvent, "id" | "createdAt">): SteamEvent {
  const events = getEvents();
  const newEvent: SteamEvent = {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  saveToStorage(EVENTS_KEY, events);
  return newEvent;
}

export function deleteEvent(id: string): void {
  const events = getEvents().filter((e) => e.id !== id);
  saveToStorage(EVENTS_KEY, events);
  const regs = getRegistrations().filter((r) => r.eventId !== id);
  saveToStorage(REGISTRATIONS_KEY, regs);
}

export function updateEvent(id: string, data: Partial<SteamEvent>): SteamEvent | null {
  const events = getEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  events[index] = { ...events[index], ...data };
  saveToStorage(EVENTS_KEY, events);
  return events[index];
}

export function getRegistrations(): EventRegistration[] {
  return getFromStorage<EventRegistration>(REGISTRATIONS_KEY);
}

export function registerForEvent(
  eventId: string,
  userId: string,
  userName: string,
  userRegion: string = "toshkent-shahri"
): EventRegistration {
  const regs = getRegistrations();
  const existing = regs.find((r) => r.eventId === eventId && r.userId === userId);
  if (existing) return existing;
  const newReg: EventRegistration = {
    id: `reg_${Date.now()}`,
    eventId,
    userId,
    userName,
    userRegion,
    registeredAt: new Date().toISOString(),
    qrToken: Math.random().toString(36).substring(2, 10).toUpperCase(),
    status: "PENDING",
  };
  regs.push(newReg);
  saveToStorage(REGISTRATIONS_KEY, regs);
  return newReg;
}

export function markAttendance(
  tokenOrUserId: string,
  eventId?: string,
  teamName?: string
): { success: boolean; registration?: EventRegistration; message: string } {
  const regs = getRegistrations();
  const cleanInput = tokenOrUserId.trim().toUpperCase();

  const regIndex = regs.findIndex(
    (r) =>
      (r.qrToken === cleanInput || r.userId.toUpperCase() === cleanInput || r.id.toUpperCase() === cleanInput) &&
      (!eventId || r.eventId === eventId)
  );

  if (regIndex === -1) {
    // Try finding by token regardless of eventId
    const fallbackIndex = regs.findIndex((r) => r.qrToken === cleanInput || r.userId.toUpperCase() === cleanInput);
    if (fallbackIndex === -1) {
      return { success: false, message: "Ishtirokchi yoki QR token topilmadi!" };
    }
    const target = regs[fallbackIndex];
    target.status = "ATTENDED";
    target.teamName = teamName || target.teamName || "Umumiy";
    target.attendedAt = new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
    regs[fallbackIndex] = target;
    saveToStorage(REGISTRATIONS_KEY, regs);
    return { success: true, registration: target, message: `${target.userName} davomatdan o'tdi (+10 XP)!` };
  }

  const target = regs[regIndex];
  target.status = "ATTENDED";
  target.teamName = teamName || target.teamName || "Umumiy";
  target.attendedAt = new Date().toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
  regs[regIndex] = target;
  saveToStorage(REGISTRATIONS_KEY, regs);
  return { success: true, registration: target, message: `${target.userName} davomatdan o'tdi (+10 XP)!` };
}

export function getUserEventRegistration(eventId: string, userId: string): EventRegistration | undefined {
  return getRegistrations().find((r) => r.eventId === eventId && r.userId === userId);
}

export function isUserRegistered(eventId: string, userId: string): boolean {
  return getRegistrations().some((r) => r.eventId === eventId && r.userId === userId);
}

export function getUserRegistrations(userId: string): EventRegistration[] {
  return getRegistrations().filter((r) => r.userId === userId);
}

export function getEventRegistrations(eventId: string): EventRegistration[] {
  return getRegistrations().filter((r) => r.eventId === eventId);
}

export function getEventRegistrationCount(eventId: string): number {
  return getEventRegistrations(eventId).length;
}
