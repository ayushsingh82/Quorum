const AI_BASE_URL =
  process.env.QUORUM_AI_BASE_URL ?? "https://0ziii4vt975sjd-8000.proxy.runpod.net";
const AI_MODEL = process.env.QUORUM_AI_MODEL ?? "Qwen/Qwen3-VL-8B-Instruct";
const AI_TIMEOUT_MS = Number(process.env.QUORUM_AI_TIMEOUT_MS ?? 8000);

export const AI_PROVIDER = { baseUrl: AI_BASE_URL, model: AI_MODEL };

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function callQwen(
  messages: ChatMessage[],
  opts: { maxTokens?: number; temperature?: number } = {},
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
  try {
    const res = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_MODEL,
        messages,
        stream: false,
        max_tokens: opts.maxTokens ?? 320,
        temperature: opts.temperature ?? 0.4,
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const text: unknown = json?.choices?.[0]?.message?.content;
    return typeof text === "string" ? text.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const COORDINATOR_SYSTEM = `You are the Coordinator of Quorum — a multi-agent council that judges Solana tokens.

Five specialist agents have voted: Chart, Liquidity, Momentum, Risk, Flow.
Each agent's vote is BUY, HOLD, or AVOID with a confidence (0-100) and a short reason.

Your job:
- Read the votes and the underlying signals.
- If the votes mostly agree, write a 2-sentence rationale that summarizes the consensus.
- If they disagree, write a 2-sentence rationale that names the key tension and which signal wins.
- Always reference at least one concrete number from the signals.
- Output plain text only, no markdown, no headers, no bullets. 2 sentences max.`;

export type CoordinatorInput = {
  symbol: string;
  verdict: "BUY" | "HOLD" | "AVOID";
  mechanism: "vote" | "debate";
  varianceScore: number;
  agentVotes: {
    name: string;
    vote: string;
    confidence: number;
    reason: string;
    signals: { label: string; value: string }[];
  }[];
};

export async function summarizeCouncil(input: CoordinatorInput): Promise<string | null> {
  const rendered = input.agentVotes
    .map((a) => {
      const sig = a.signals.map((s) => `${s.label}=${s.value}`).join(", ");
      return `${a.name}: ${a.vote} (conf ${a.confidence}) — ${a.reason} [${sig}]`;
    })
    .join("\n");
  const user = `Token: ${input.symbol}
Council verdict: ${input.verdict} via ${input.mechanism} (variance ${input.varianceScore})

Votes:
${rendered}

Write the rationale.`;
  return await callQwen(
    [
      { role: "system", content: COORDINATOR_SYSTEM },
      { role: "user", content: user },
    ],
    { maxTokens: 220, temperature: 0.35 },
  );
}
