import { NextResponse } from "next/server";
import { allReputations } from "@/lib/quorum/reputation";
import type { ApiEnvelope, AgentReputation } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const env: ApiEnvelope<AgentReputation[]> = {
    ok: true,
    data: allReputations(),
    source: "internal",
    generatedAt: Date.now(),
  };
  return NextResponse.json(env);
}
