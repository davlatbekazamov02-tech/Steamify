import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") || undefined;

    // Barcha foydalanuvchilarni XP bo'yicha tartiblash
    const where = region && region !== "all"
      ? { regionId: region, isActive: true }
      : { isActive: true };

    const users = await prisma.user.findMany({
      where,
      orderBy: [
        { totalXp: "desc" },
        { createdAt: "asc" },
      ],
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

    const total = await prisma.user.count({ where: { isActive: true } });

    // Rank tayinlash
    let currentRank = 1;
    const participants = users.map((u, idx, arr) => {
      if (idx > 0 && u.totalXp === arr[idx - 1].totalXp) {
        // Teng XP bo'lsa oldingi rank
      } else {
        currentRank = idx + 1;
      }
      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        avatarUrl: u.image,
        region: u.regionId || "",
        totalXp: u.totalXp,
        level: u.level,
        rank: currentRank,
        createdAt: u.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      participants,
      total,
      currentUser: {
        globalRank: 0,
        globalTotal: total,
        regionalRank: 0,
        regionalTotal: 0,
        isInCurrentList: false,
      },
    });
  } catch (error) {
    console.error("[leaderboard] error:", error);
    return NextResponse.json(
      { error: "Reyting ma'lumotlarini olishda xatolik" },
      { status: 500 }
    );
  }
}
