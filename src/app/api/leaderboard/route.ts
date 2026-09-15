import { NextRequest, NextResponse } from "next/server";
import { getLeaderboardData } from "@/lib/ranking";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || undefined;

  const data = getLeaderboardData(region);
  return NextResponse.json(data);
}

