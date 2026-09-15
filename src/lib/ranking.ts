/**
 * Ishtirokchi ma'lumotlari interfeysi
 * Reyting tizimida ishlatiladi
 */
export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  region: string;
  totalXp: number;
  rank?: number;
  createdAt: string;
}

// Demo rejimi uchun joriy foydalanuvchi — real auth bilan almashtiriladi
export const CURRENT_USER: Participant = {
  id: "",
  firstName: "",
  lastName: "",
  region: "",
  totalXp: 0,
  createdAt: new Date().toISOString(),
};

// Ishtirokchilar ro'yxati — real database dan yuklanadi
export const MOCK_PARTICIPANTS: Participant[] = [];

/**
 * Ishtirokchilarga reyting o'rnini (rank) tayinlash funksiyasi
 * Saralash qoidalari:
 * 1. XP bo'yicha kamayish tartibida
 * 2. Agar XP teng bo'lsa, kim oldin ro'yxatdan o'tgan bo'lsa
 * 3. Teng XP bo'lsa, bir xil rank beriladi
 */
export function assignCompetitionRanks(list: Participant[]): Participant[] {
  // Nusxa olish - asl arrayni o'zgartirmaslik uchun
  const sorted = [...list].sort((a, b) => {
    // 1. XP bo'yicha kamayish tartibida
    if (b.totalXp !== a.totalXp) {
      return b.totalXp - a.totalXp;
    }
    // 2. Teng XP bo'lsa, kim oldin ro'yxatdan o'tgan
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  let currentRank = 1;
  return sorted.map((p, idx, arr) => {
    // Oldingi ishtirokchi bilan XP teng bo'lsa, o'sha rank beriladi
    if (idx > 0 && p.totalXp === arr[idx - 1].totalXp) {
      return { ...p, rank: arr[idx - 1].rank };
    }
    // Aks holda yangi rank tayinlanadi
    currentRank = idx + 1;
    return { ...p, rank: currentRank };
  });
}

export const GLOBAL_TOTAL_COUNT = 0;
export const REGIONAL_TOTAL_COUNTS: Record<string, number> = {};

/**
 * Reyting jadvali natijasi interfeysi
 */
export interface LeaderboardResult {
  participants: Participant[];
  total: number;
  currentUser: {
    participant: Participant;
    globalRank: number;
    globalTotal: number;
    regionalRank: number;
    regionalTotal: number;
    isInCurrentList: boolean;
  };
}

/**
 * Reyting ma'lumotlarini olish funksiyasi
 * @param region - Hudud ID (ixtiyoriy), "all" yoki undefined bo'lsa barcha O'zbekiston
 * @returns Reyting jadvali natijasi (participants, total, currentUser)
 */
export function getLeaderboardData(region?: string): LeaderboardResult {
  // 1. Global reytingni hisoblash (barcha ishtirokchilar)
  const allRanked = assignCompetitionRanks(MOCK_PARTICIPANTS);
  const currentUserGlobal = allRanked.find((p) => p.id === CURRENT_USER.id);
  const globalRank = currentUserGlobal?.rank || 0;

  // 2. Joriy foydalanuvchining viloyat reytingini hisoblash
  const userRegionList = MOCK_PARTICIPANTS.filter((p) => p.region === CURRENT_USER.region);
  const userRegionRanked = assignCompetitionRanks(userRegionList);
  const currentUserRegional = userRegionRanked.find((p) => p.id === CURRENT_USER.id);
  const regionalRank = currentUserRegional?.rank || 0;

  // 3. Tanlangan hudud bo'yicha filtrlash
  let filteredParticipants = allRanked;
  let totalParticipants = GLOBAL_TOTAL_COUNT;

  if (region && region !== "all") {
    // Viloyat tanlangan bo'lsa, faqat o'sha viloyatni ko'rsatish
    const regionalFiltered = MOCK_PARTICIPANTS.filter((p) => p.region === region);
    filteredParticipants = assignCompetitionRanks(regionalFiltered);
    totalParticipants = REGIONAL_TOTAL_COUNTS[region] || 0;
  }

  // 4. Joriy foydalanuvchi ko'rsatilgan ro'yxatda bormi?
  const isInCurrentList = filteredParticipants.some((p) => p.id === CURRENT_USER.id);

  // 5. Natijani qaytarish
  return {
    participants: filteredParticipants,
    total: totalParticipants,
    currentUser: {
      participant: CURRENT_USER,
      globalRank,
      globalTotal: GLOBAL_TOTAL_COUNT,
      regionalRank,
      regionalTotal: REGIONAL_TOTAL_COUNTS[CURRENT_USER.region] || 0,
      isInCurrentList
    }
  };
}
