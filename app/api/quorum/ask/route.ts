import { NextResponse } from "next/server";
import { askCoordinator } from "@/lib/quorum/ask";
import type { ApiEnvelope } from "@/lib/quorum/types";

export const dynamic = "force-dynamic";

type AskResponse = { answer: string; question: string; source: string };

export async function POST(req: Request) {
  let question = "";
  try {
    const body = await req.json();
    if (typeof body?.question === "string") question = body.question;
  } catch {
    // ignore
  }
  question = question.trim().slice(0, 400);
  if (!question) {
    const env: ApiEnvelope<AskResponse> = {
      ok: false,
      error: "question required",
      generatedAt: Date.now(),
    };
    return NextResponse.json(env, { status: 400 });
  }
  const { answer, source } = await askCoordinator(question);
  const env: ApiEnvelope<AskResponse> = {
    ok: true,
    data: { answer, question, source },
    source,
    generatedAt: Date.now(),
  };
  return NextResponse.json(env);
}
