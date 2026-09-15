import prisma from "./prisma";
import { DEMO_USERS } from "./auth";

export interface ParticipantItem {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string | null;
  regionId: string;
  regionName: string;
  level: number;
  score: number;
  badgeCount: number;
  attendedSessions: number;
  isCurrentUser?: boolean;
}

export const INITIAL_LEADERBOARD: ParticipantItem[] = [
  {
    id: "p-1",
    rank: 1,
    name: "Sardorbek Ismoilov",
    avatarUrl: "/images/avatars/user-0.jpg",
    regionId: "tashkent_city",
    regionName: "Toshkent shahri",
    level: 5,
    score: 1420,
    badgeCount: 9,
    attendedSessions: 14,
  },
  {
    id: "p-2",
    rank: 2,
    name: "Madinabonu Aliyeva",
    avatarUrl: "/images/avatars/user-1.jpg",
    regionId: "samarkand",
    regionName: "Samarqand viloyati",
    level: 5,
    score: 1350,
    badgeCount: 8,
    attendedSessions: 13,
  },
  {
    id: "p-3",
    rank: 3,
    name: "Diyorbek Rahimov",
    avatarUrl: "/images/avatars/user-2.jpg",
    regionId: "fergana",
    regionName: "Farg‘ona viloyati",
    level: 4,
    score: 1190,
    badgeCount: 7,
    attendedSessions: 11,
  },
  {
    id: "p-4",
    rank: 4,
    name: "Shahnoza Ergasheva",
    avatarUrl: "/images/avatars/user-4.jpg",
    regionId: "bukhara",
    regionName: "Buxoro viloyati",
    level: 4,
    score: 1120,
    badgeCount: 6,
    attendedSessions: 11,
  },
  {
    id: "p-5",
    rank: 5,
    name: "Jasurbek Norboyev",
    avatarUrl: "/images/avatars/user-5.jpg",
    regionId: "andijan",
    regionName: "Andijon viloyati",
    level: 4,
    score: 1040,
    badgeCount: 6,
    attendedSessions: 10,
  },
  {
    id: "p-6",
    rank: 6,
    name: "Zuhra Olimova",
    avatarUrl: "/images/avatars/user-6.jpg",
    regionId: "khorezm",
    regionName: "Xorazm viloyati",
    level: 4,
    score: 980,
    badgeCount: 5,
    attendedSessions: 9,
  },
  {
    id: "p-7",
    rank: 7,
    name: "Bobur Mirzayev",
    avatarUrl: "/images/avatars/user-7.jpg",
    regionId: "namangan",
    regionName: "Namangan viloyati",
    level: 3,
    score: 890,
    badgeCount: 5,
    attendedSessions: 8,
  },
  {
    id: "p-8",
    rank: 8,
    name: "Rayhon Karimova",
    avatarUrl: "/images/avatars/user-8.jpg",
    regionId: "qashqadaryo",
    regionName: "Qashqadaryo viloyati",
    level: 3,
    score: 820,
    badgeCount: 4,
    attendedSessions: 8,
  },
  {
    id: "p-9",
    rank: 9,
    name: "Temur Xoliqov",
    avatarUrl: "/images/avatars/user-9.jpg",
    regionId: "surxondaryo",
    regionName: "Surxondaryo viloyati",
    level: 3,
    score: 760,
    badgeCount: 4,
    attendedSessions: 7,
  },
  {
    id: "p-10",
    rank: 10,
    name: "Nilufar Yusupova",
    avatarUrl: "/images/avatars/user-10.jpg",
    regionId: "jizzakh",
    regionName: "Jizzax viloyati",
    level: 3,
    score: 710,
    badgeCount: 4,
    attendedSessions: 7,
  },
  {
    id: "user_regular_01",
    rank: 18,
    name: "Abduqodir Toshmatov",
    avatarUrl: "/images/avatars/user-3.jpg",
    regionId: "qashqadaryo",
    regionName: "Qashqadaryo viloyati",
    level: 3,
    score: 410,
    badgeCount: 3,
    attendedSessions: 5,
    isCurrentUser: true,
  },
];

export async function getLeaderboardData(regionFilter?: string) {
  try {
    if (process.env.DATABASE_URL) {
      const users = await prisma.user.findMany({
        where: regionFilter && regionFilter !== "all" ? { regionId: regionFilter } : {},
        orderBy: { totalXp: "desc" },
        take: 50,
        include: {
          region: true,
          badges: true,
          attendances: true,
        },
      });

      if (users && users.length > 0) {
        return users.map((u, idx) => ({
          id: u.id,
          rank: idx + 1,
          name: `${u.firstName} ${u.lastName}`,
          avatarUrl: u.image || `/images/avatars/user-${(idx % 10)}.jpg`,
          regionId: u.regionId || "tashkent_city",
          regionName: u.region?.name || "Noma'lum hudud",
          level: u.level,
          score: u.totalXp,
          badgeCount: u.badges.length,
          attendedSessions: u.attendances.length,
        }));
      }
    }
  } catch (error) {
    // Database fallback
  }

  // Fallback to static leaderboard data
  let list = [...INITIAL_LEADERBOARD];
  if (regionFilter && regionFilter !== "all") {
    list = list.filter((p) => p.regionId === regionFilter);
  }
  return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export async function getPersonalRank(userId: string, regionId?: string) {
  const allList = [...INITIAL_LEADERBOARD].sort((a, b) => b.score - a.score);
  const totalCountryUsers = 5240;
  const userInAll = allList.findIndex((p) => p.id === userId);
  const countryRank = userInAll !== -1 ? allList[userInAll].rank : 18;

  const targetRegion = regionId || "qashqadaryo";
  const regionalList = allList.filter((p) => p.regionId === targetRegion);
  const totalRegionUsers = 420;
  const userInRegion = regionalList.findIndex((p) => p.id === userId);
  const regionalRank = userInRegion !== -1 ? userInRegion + 1 : 3;

  return {
    countryRank,
    totalCountryUsers,
    regionalRank,
    totalRegionUsers,
    regionName: "Qashqadaryo viloyati",
  };
}
