import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { XP_REWARDS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("STEMIFY_role")?.value;
    const mentorDbId = cookieStore.get("STEMIFY_user_id")?.value;

    // Faqat mentor, admin, super_admin tekshira oladi
    if (!role || !["MENTOR", "ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Bu amalni bajarish uchun Mentor huquqi kerak" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, sessionId, teamId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Foydalanuvchi ID talab qilinadi" },
        { status: 400 }
      );
    }

    // Foydalanuvchini DB dan tekshirish
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, totalXp: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi. QR token noto'g'ri." },
        { status: 404 }
      );
    }

    const effectiveSessionId = sessionId || "session_default";

    // Dublikat tekshirish
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_sessionId: { userId, sessionId: effectiveSessionId },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: `${user.firstName} ${user.lastName} allaqachon davomatdan o'tkazilgan!`,
          alreadyCheckedIn: true,
        },
        { status: 409 }
      );
    }

    const awardedXp = XP_REWARDS.SESSION_CHECKIN;

    // Transaction — atomik yozish
    const [attendance, , updatedUser] = await prisma.$transaction([
      // 1. Davomat yozish
      prisma.attendance.create({
        data: {
          userId,
          sessionId: effectiveSessionId,
          method: "QR",
          checkedById: mentorDbId || undefined,
        },
      }),

      // 2. XP transaction
      prisma.pointTransaction.create({
        data: {
          userId,
          sessionId: effectiveSessionId,
          amount: awardedXp,
          type: "ATTENDANCE",
          reason: `Sessiyaga QR orqali tashrif (+${awardedXp} XP)`,
          createdBy: mentorDbId || undefined,
        },
      }),

      // 3. User XP yangilash
      prisma.user.update({
        where: { id: userId },
        data: { totalXp: { increment: awardedXp } },
        select: { id: true, firstName: true, lastName: true, totalXp: true },
      }),
    ]);

    // 4. Audit log (transaction tashqarisida — kritik emas)
    try {
      await prisma.auditLog.create({
        data: {
          actorId: mentorDbId || null,
          actorName: "Mentor",
          action: "QR_CHECK_IN",
          entityType: "Attendance",
          entityId: attendance.id,
          details: `${user.firstName} ${user.lastName} sessiyaga belgilandi. +${awardedXp} XP`,
        },
      });
    } catch {
      // Audit log xato bo'lsa jarayon to'xtamaydi
    }

    return NextResponse.json({
      success: true,
      message: `${updatedUser.firstName} ${updatedUser.lastName} davomatdan o'tkazildi! +${awardedXp} XP`,
      awardedXp,
      checkedInAt: attendance.checkedInAt.toISOString(),
      user: {
        id: updatedUser.id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        newTotalXp: updatedUser.totalXp,
      },
    });
  } catch (error) {
    console.error("[qr/verify] error:", error);
    return NextResponse.json(
      { error: "QR tasdiqlashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
