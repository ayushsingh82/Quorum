import { NextResponse } from "next/server";
import { fetchTrending, type TrendingHit } from "@/lib/quorum/trending";
import type { ApiEnvelope } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(20, Math.max(4, Number(searchParams.get("limit") ?? "12")));
  try {
    const data = await fetchTrending(limit);
    const env: ApiEnvelope<TrendingHit[]> = {
      ok: true,
      data,
      source: "dexscreener-boosts",
      generatedAt: Date.now(),
    };
    return NextResponse.json(env);
  } catch (e) {
    const env: ApiEnvelope<TrendingHit[]> = {
      ok: false,
      error: e instanceof Error ? e.message : "trending failed",
      generatedAt: Date.now(),
    };
    return NextResponse.json(env, { status: 500 });
  }
}
