import { NextResponse } from "next/server";
import { runCouncil } from "@/lib/quorum/council";
import type { ApiEnvelope, CouncilVerdict } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query =
    searchParams.get("symbol") ?? searchParams.get("address") ?? searchParams.get("q") ?? "SOL";
  return convene(query);
}

export async function POST(req: Request) {
  let query = "SOL";
  try {
    const body = await req.json();
    if (typeof body?.symbol === "string") query = body.symbol;
    else if (typeof body?.address === "string") query = body.address;
    else if (typeof body?.q === "string") query = body.q;
  } catch {
    // ignore
  }
  return convene(query);
}

async function convene(symbol: string) {
  try {
    const verdict = await runCouncil(symbol);
    const env: ApiEnvelope<CouncilVerdict> = {
      ok: true,
      data: verdict,
      source: verdict.source,
      generatedAt: verdict.generatedAt,
    };
    return NextResponse.json(env);
  } catch (e) {
    const env: ApiEnvelope<CouncilVerdict> = {
      ok: false,
      error: e instanceof Error ? e.message : "council failed",
      generatedAt: Date.now(),
    };
    return NextResponse.json(env, { status: 400 });
  }
}
