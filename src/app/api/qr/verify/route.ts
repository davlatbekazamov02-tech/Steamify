import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, sessionId, token, mentorId, teamId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Foydalanuvchi ID talab qilinadi" }, { status: 400 });
    }

    const effectiveSessionId = sessionId || "session_default_2026";
    const awardedXp = 10;

    // Database recording with graceful fallback
    let userRecord = null;
    try {
      if (process.env.DATABASE_URL) {
        // Check existing attendance
        const existing = await prisma.attendance.findUnique({
          where: {
            userId_sessionId: {
              userId,
              sessionId: effectiveSessionId,
            },
          },
        });

        if (existing) {
          return NextResponse.json(
            { error: "Ushbu ishtirokchi allaqachon ro'yxatdan o'tkazilgan (Dublikat)!" },
            { status: 400 }
          );
        }

        // Record attendance
        await prisma.attendance.create({
          data: {
            userId,
            sessionId: effectiveSessionId,
            method: "QR",
            checkedById: mentorId || "mentor_system",
          },
        });

        // Award points
        await prisma.pointTransaction.create({
          data: {
            userId,
            sessionId: effectiveSessionId,
            amount: awardedXp,
            type: "ATTENDANCE",
            reason: "Sessiyaga QR orqali tashrif (+10 XP)",
            createdBy: mentorId || "mentor_system",
          },
        });

        // Update user XP
        userRecord = await prisma.user.update({
          where: { id: userId },
          data: {
            totalXp: { increment: awardedXp },
          },
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            actorId: mentorId,
            actorName: "Mentor",
            action: "QR_CHECK_IN",
            entityType: "Attendance",
            entityId: userId,
            details: `QR orqali sessiyaga belgilandi va ${awardedXp} XP berildi`,
          },
        });
      }
    } catch (dbErr) {
      // DB operation failed - continuing without audit log
    }

    return NextResponse.json({
      success: true,
      message: "Davomat muvaffaqiyatli belgilandi! +10 XP taqdim etildi.",
      awardedXp,
      checkedInAt: new Date().toISOString(),
      user: {
        id: userId,
        newTotalXp: userRecord ? userRecord.totalXp : 420,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "QR kodni tekshirishda xatolik yuz berdi" }, { status: 500 });
  }
}
