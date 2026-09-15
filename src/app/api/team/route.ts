/**
 * TEAM MEMBERS API ROUTE
 * Admin Panel - Jamoa a'zolarini boshqarish
 * GET: Barcha a'zolar ro'yxati
 * POST: Yangi a'zo qo'shish
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getAllTeamMembers,
  createTeamMember,
  getActiveTeamMembers,
  getTeamStats,
  type TeamMember,
} from "@/lib/team-store";

export const dynamic = "force-dynamic";

/**
 * GET /api/team
 * Query params:
 *   ?active=true - faqat faol a'zolar
 *   ?stats=true - statistika
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get("active") === "true";
    const statsOnly = searchParams.get("stats") === "true";

    // Statistika so'ralgan bo'lsa
    if (statsOnly) {
      const stats = getTeamStats();
      return NextResponse.json({ success: true, data: stats });
    }

    // Faol a'zolar yoki barchasi
    const members = activeOnly ? getActiveTeamMembers() : getAllTeamMembers();

    return NextResponse.json({
      success: true,
      data: members,
      count: members.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Serverda xatolik yuz berdi",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/team
 * Body: Omit<TeamMember, "id" | "createdAt" | "updatedAt">
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validatsiya
    const requiredFields = ["firstName", "lastName", "role", "bio", "photoUrl", "order"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Majburiy maydonlar to'ldirilmagan",
          missing: missingFields,
        },
        { status: 400 }
      );
    }

    // A'zo yaratish
    const newMember = createTeamMember({
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
      bio: body.bio,
      photoUrl: body.photoUrl,
      order: body.order,
      isActive: body.isActive ?? true,
      socialLinks: body.socialLinks || {},
    });

    return NextResponse.json(
      {
        success: true,
        data: newMember,
        message: "A'zo muvaffaqiyatli qo'shildi",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "A'zo qo'shishda xatolik",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
