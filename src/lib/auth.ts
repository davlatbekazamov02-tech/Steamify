import { cookies } from "next/headers";
import prisma from "./prisma";
import { UserRole, SessionUser, DEMO_USERS } from "./auth-types";

export * from "./auth-types";

export async function getCurrentUser(): Promise<SessionUser> {
  try {
    const cookieStore = await cookies();
    const roleCookie = cookieStore.get("STEMIFY_role")?.value as UserRole | undefined;
    const userIdCookie = cookieStore.get("STEMIFY_user_id")?.value;

    if (roleCookie && DEMO_USERS[roleCookie]) {
      return DEMO_USERS[roleCookie];
    }

    if (userIdCookie) {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { id: userIdCookie },
        });
        if (dbUser) {
          return {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            role: dbUser.role as UserRole,
            regionId: dbUser.regionId,
            totalXp: dbUser.totalXp,
            level: dbUser.level,
            referralCode: dbUser.referralCode,
            image: dbUser.image,
          };
        }
      } catch (err) {
        // Database connection fallback
      }
    }
  } catch (e) {
    // Next.js build-time pre-render
  }

  return DEMO_USERS.SUPER_ADMIN;
}
