import { NextResponse } from "next/server";
import { getLeaderboardData, CURRENT_USER, REGIONAL_TOTAL_COUNTS, GLOBAL_TOTAL_COUNT } from "@/lib/ranking";
import { getRegionName } from "@/lib/regions";

export async function GET() {
  const data = getLeaderboardData();

  return NextResponse.json({
    user: {
      id: CURRENT_USER.id,
      name: `${CURRENT_USER.firstName} ${CURRENT_USER.lastName}`,
      avatar: CURRENT_USER.avatarUrl,
      region: CURRENT_USER.region,
      totalXp: CURRENT_USER.totalXp,
    },
    global: {
      rank: data.currentUser.globalRank,
      totalParticipants: GLOBAL_TOTAL_COUNT,
      points: CURRENT_USER.totalXp,
    },
    regional: {
      region: getRegionName(CURRENT_USER.region),
      regionId: CURRENT_USER.region,
      rank: data.currentUser.regionalRank,
      totalParticipants: REGIONAL_TOTAL_COUNTS[CURRENT_USER.region] || 420,
      points: CURRENT_USER.totalXp,
    }
  });
}

