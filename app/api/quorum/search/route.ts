import { NextResponse } from "next/server";
import { searchTokens, type SearchHit } from "@/lib/quorum/search";
import type { ApiEnvelope } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") ?? "12")));
  try {
    const hits = await searchTokens(q, limit);
    const env: ApiEnvelope<SearchHit[]> = {
      ok: true,
      data: hits,
      source: "dexscreener-search",
      generatedAt: Date.now(),
    };
    return NextResponse.json(env);
  } catch (e) {
    const env: ApiEnvelope<SearchHit[]> = {
      ok: false,
      error: e instanceof Error ? e.message : "search failed",
      generatedAt: Date.now(),
    };
    return NextResponse.json(env, { status: 400 });
  }
}
