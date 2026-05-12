import { NextResponse } from "next/server";
import { recentVerdicts } from "@/lib/quorum/history";
import type { ApiEnvelope, CouncilVerdict } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") ?? "24")));
  const data = recentVerdicts(limit);
  const env: ApiEnvelope<CouncilVerdict[]> = {
    ok: true,
    data,
    source: "in-memory",
    generatedAt: Date.now(),
  };
  return NextResponse.json(env);
}
