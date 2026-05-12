import { NextResponse } from "next/server";
import { WATCHED_TOKENS } from "@/lib/quorum/tokens";
import { fetchDexPair } from "@/lib/quorum/market";
import type { ApiEnvelope, TokenSummary } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const results = await Promise.all(
    WATCHED_TOKENS.map(async (t): Promise<TokenSummary> => {
      const pair = await fetchDexPair(t.address);
      return {
        symbol: t.symbol,
        address: t.address,
        price: pair?.priceUsd ?? 0,
        change24h: pair?.change24h ?? 0,
        volume24h: pair?.volume24h ?? 0,
        liquidity: pair?.liquidityUsd ?? 0,
      };
    }),
  );
  const env: ApiEnvelope<TokenSummary[]> = {
    ok: true,
    data: results,
    source: "dexscreener",
    generatedAt: Date.now(),
  };
  return NextResponse.json(env);
}
