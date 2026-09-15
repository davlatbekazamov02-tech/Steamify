import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_USERS, UserRole } from "@/lib/auth-types";

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    if (!role || !DEMO_USERS[role as UserRole]) {
      return NextResponse.json({ error: "Noto'g'ri rol" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("steamify_role", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    cookieStore.set("steamify_user_id", DEMO_USERS[role as UserRole].id, { path: "/", maxAge: 60 * 60 * 24 * 30 });

    return NextResponse.json({ success: true, user: DEMO_USERS[role as UserRole] });
  } catch (error) {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
