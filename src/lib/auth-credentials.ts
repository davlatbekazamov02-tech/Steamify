/**
 * DEMO AUTH CREDENTIALS — Telefon raqam + Parol tizimi
 * Real loyihada backend/database bilan ishlaydi.
 */

import { UserRole } from "./auth-types";

export interface Credential {
  phone: string;       // +998901234567 formatda
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

// Tizim foydalanuvchilari — Super Admin ni o'zingiz sozlang
const SYSTEM_CREDENTIALS: Credential[] = [
  {
    phone: "+998901234567",
    password: "SuperAdmin@2026",
    role: "SUPER_ADMIN",
    firstName: "Super",
    lastName: "Admin",
  },
];

const REGISTERED_USERS_KEY = "STEMIFY_registered_users";

/** localStorage dan ro'yxatdan o'tgan foydalanuvchilarni olish */
function getRegisteredUsers(): Credential[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Yangi foydalanuvchini localStorage ga saqlash */
export function saveRegisteredUser(user: Credential): void {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

/** Telefon raqam allaqachon mavjudmi tekshirish */
export function isPhoneRegistered(phone: string): boolean {
  const normalizedPhone = normalizePhone(phone);
  const allUsers = [...SYSTEM_CREDENTIALS, ...getRegisteredUsers()];
  return allUsers.some((c) => normalizePhone(c.phone) === normalizedPhone);
}

/** Telefon raqamni standart formatga keltirish */
export function normalizePhone(phone: string): string {
  return phone.replace(/\s/g, "").replace(/-/g, "");
}

/** Telefon va parolni tekshirish */
export function verifyCredentials(
  phone: string,
  password: string
): Credential | null {
  const normalizedPhone = normalizePhone(phone);
  const allUsers = [...SYSTEM_CREDENTIALS, ...getRegisteredUsers()];
  const found = allUsers.find(
    (c) => normalizePhone(c.phone) === normalizedPhone && c.password === password
  );
  return found || null;
}

/** O'zbek telefon raqamini validatsiya qilish */
export function validateUzPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // +998 XX XXX XX XX formatda, jami 13 belgi
  return /^\+998[0-9]{9}$/.test(normalized);
}

/** Parol kuchini tekshirish */
export function validatePassword(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 6) {
    return { valid: false, message: "Parol kamida 6 belgidan iborat bo'lishi kerak" };
  }
  return { valid: true, message: "" };
}
