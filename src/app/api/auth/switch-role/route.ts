import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";

const VALID_ROLES: UserRole[] = ["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"];

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    if (!role || !VALID_ROLES.includes(role as UserRole)) {
      return NextResponse.json(
        { error: "Noto'g'ri rol" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const maxAge = 60 * 60 * 24 * 30; // 30 kun

    cookieStore.set("STEMIFY_role", role, {
      path: "/",
      maxAge,
      httpOnly: false, // client-side ham o'qishi kerak (middleware uchun)
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("STEMIFY_user_id", DEMO_USERS[role as UserRole].id, {
      path: "/",
      maxAge,
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({
      success: true,
      role,
    });
  } catch (error) {
    console.error("[switch-role] error:", error);
    return NextResponse.json(
      { error: "Rol almashtirishda xatolik" },
      { status: 500 }
    );
  }
}
