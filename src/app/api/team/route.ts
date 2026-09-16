/**
 * TEAM MEMBERS API — Prisma DB
 * GET: Barcha a'zolar (landing page + admin)
 * POST: Yangi a'zo qo'shish (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { sanitizeText, isValidImageUrl, validateLength } from "@/lib/security";
import { LIMITS } from "@/lib/constants";

export const dynamic = "force-dynamic";

// Role tekshiruvchi helper
async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const role = cookieStore.get("STEMIFY_role")?.value;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/**
 * GET /api/team
 * ?active=true → faqat faol a'zolar (landing page)
 * ?stats=true  → statistika
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const activeOnly = searchParams.get("active") === "true";
    const statsOnly = searchParams.get("stats") === "true";

    if (statsOnly) {
      const [total, active] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
      ]);
      return NextResponse.json({
        success: true,
        data: { total, active, inactive: total - active },
      });
    }

    // TeamMember lar User modelda emas — alohida jadval yo'q
    // team-store.ts in-memory ni saqlaymiz, lekin DB ga ham yozamiz
    // Hozircha in-memory store dan qaytaramiz (landing page uchun)
    const { getAllTeamMembers, getActiveTeamMembers, getTeamStats } = await import("@/lib/team-store");

    const members = activeOnly ? getActiveTeamMembers() : getAllTeamMembers();

    return NextResponse.json({
      success: true,
      data: members,
      count: members.length,
    });
  } catch (error) {
    console.error("[GET /api/team] error:", error);
    return NextResponse.json(
      { success: false, error: "Ma'lumotlarni olishda xatolik" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team — Admin only
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Bu amalni bajarish uchun Admin huquqi kerak" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validatsiya
    const required = ["firstName", "lastName", "role", "bio", "photoUrl", "order"];
    const missing = required.filter((f) => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Majburiy maydonlar to'ldirilmagan", missing },
        { status: 400 }
      );
    }

    if (!validateLength(body.firstName, 2, LIMITS.MAX_NAME_LENGTH)) {
      return NextResponse.json({ success: false, error: "Ism noto'g'ri" }, { status: 400 });
    }
    if (!validateLength(body.bio, 10, LIMITS.MAX_BIO_LENGTH)) {
      return NextResponse.json({ success: false, error: "Bio noto'g'ri" }, { status: 400 });
    }
    if (!isValidImageUrl(body.photoUrl)) {
      return NextResponse.json({ success: false, error: "Rasm URL noto'g'ri" }, { status: 400 });
    }

    const { createTeamMember } = await import("@/lib/team-store");
    const member = createTeamMember({
      firstName: sanitizeText(body.firstName),
      lastName:  sanitizeText(body.lastName),
      role:      sanitizeText(body.role),
      bio:       sanitizeText(body.bio),
      photoUrl:  body.photoUrl,
      order:     Number(body.order),
      isActive:  body.isActive ?? true,
      socialLinks: body.socialLinks || {},
    });

    return NextResponse.json(
      { success: true, data: member, message: "A'zo muvaffaqiyatli qo'shildi" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/team] error:", error);
    return NextResponse.json(
      { success: false, error: "A'zo qo'shishda xatolik" },
      { status: 500 }
    );
  }
}
