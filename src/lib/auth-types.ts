export type UserRole = "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";

export interface SessionUser {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: UserRole;
  regionId: string | null;
  totalXp: number;
  level: number;
  referralCode: string;
  image?: string | null;
}

export const DEMO_USERS: Record<UserRole, SessionUser> = {
  SUPER_ADMIN: {
    id: "user_super_admin",
    email: null,
    firstName: "Super",
    lastName: "Admin",
    role: "SUPER_ADMIN",
    regionId: null,
    totalXp: 0,
    level: 1,
    referralCode: "",
    image: null,
  },
  ADMIN: {
    id: "user_admin",
    email: null,
    firstName: "Admin",
    lastName: "",
    role: "ADMIN",
    regionId: null,
    totalXp: 0,
    level: 1,
    referralCode: "",
    image: null,
  },
  MENTOR: {
    id: "user_mentor",
    email: null,
    firstName: "Mentor",
    lastName: "",
    role: "MENTOR",
    regionId: null,
    totalXp: 0,
    level: 1,
    referralCode: "",
    image: null,
  },
  USER: {
    id: "user_default",
    email: null,
    firstName: "Foydalanuvchi",
    lastName: "",
    role: "USER",
    regionId: null,
    totalXp: 0,
    level: 1,
    referralCode: "",
    image: null,
  },
};

export function hasRole(currentRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (currentRole === "SUPER_ADMIN") return true;
  return requiredRoles.includes(currentRole);
}
