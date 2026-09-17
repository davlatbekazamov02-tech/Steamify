import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("steamify_user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Tizimga kiring" },
        { status: 401 }
      );
    }

    // Foydalanuvchini DB dan olish
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        regionId: true,
        totalXp: true,
        level: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Foydalanuvchi topilmadi" },
        { status: 404 }
      );
    }

    // Global rank — o'zidan ko'p XP ega foydalanuvchilar soni + 1
    const globalRank =
      (await prisma.user.count({
        where: {
          isActive: true,
          OR: [
            { totalXp: { gt: user.totalXp } },
            {
              totalXp: user.totalXp,
              createdAt: { lt: user.createdAt },
            },
          ],
        },
      })) + 1;

    const globalTotal = await prisma.user.count({ where: { isActive: true } });

    // Regional rank
    let regionalRank = 0;
    let regionalTotal = 0;

    if (user.regionId) {
      regionalRank =
        (await prisma.user.count({
          where: {
            isActive: true,
            regionId: user.regionId,
            OR: [
              { totalXp: { gt: user.totalXp } },
              {
                totalXp: user.totalXp,
                createdAt: { lt: user.createdAt },
              },
            ],
          },
        })) + 1;

      regionalTotal = await prisma.user.count({
        where: { isActive: true, regionId: user.regionId },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.image,
        region: user.regionId,
        totalXp: user.totalXp,
        level: user.level,
      },
      global: {
        rank: globalRank,
        totalParticipants: globalTotal,
        points: user.totalXp,
      },
      regional: {
        regionId: user.regionId,
        rank: regionalRank,
        totalParticipants: regionalTotal,
        points: user.totalXp,
      },
    });
  } catch (error) {
    console.error("[me/rank] error:", error);
    return NextResponse.json(
      { error: "Ma'lumotlarni olishda xatolik" },
      { status: 500 }
    );
  }
}
