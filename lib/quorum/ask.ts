import { callQwen } from "./ai";
import { recentVerdicts } from "./history";
import { allReputations } from "./reputation";
import { WATCHED_TOKENS } from "./tokens";

const ASK_SYSTEM = `You are Quorum's Coordinator — the head of an agent swarm that judges Solana tokens.

You speak as the swarm's spokesperson. Reference specific verdicts, agents, and signals from the context provided. Cite numbers. If the user asks about a token you have no recent verdict on, say so plainly and suggest convening the council.

Style:
- 3 to 6 sentences. Use short bullets only when comparing items.
- No markdown headers. No emojis.
- Refer to the system as "the swarm" or "the council".
- Never give investment advice — you explain what the agents concluded, nothing more.`;

export type AskContext = {
  question: string;
};

function renderContext(): string {
  const verdicts = recentVerdicts(8);
  const reps = allReputations();
  const tokenList = WATCHED_TOKENS.slice(0, 12)
    .map((t) => `${t.symbol} (${t.sector})`)
    .join(", ");

  const verdictLines = verdicts.length
    ? verdicts
        .map(
          (v) =>
            `${v.symbol}: ${v.verdict} · conf ${v.confidence} · ${v.mechanism} · variance ${v.varianceScore.toFixed(2)} — ${v.rationale}`,
        )
        .join("\n")
    : "No verdicts in the session yet.";

  const repLines = reps
    .map(
      (r) =>
        `${r.name}: weight ×${r.weight.toFixed(2)}, ${r.totalCalls ? Math.round((r.correctCalls / r.totalCalls) * 100) : 0}% acc, rolling PnL ${r.rollingPnl >= 0 ? "+" : ""}${r.rollingPnl.toFixed(1)}%`,
    )
    .join("\n");

  return [
    "RECENT VERDICTS:",
    verdictLines,
    "",
    "AGENT REPUTATION:",
    repLines,
    "",
    `TRACKED TOKENS: ${tokenList}`,
  ].join("\n");
}

export async function askCoordinator(question: string): Promise<{
  answer: string;
  source: "qwen" | "fallback";
}> {
  const ctx = renderContext();
  const user = `${ctx}\n\nOperator question: ${question}`;
  try {
    const ai = await callQwen(
      [
        { role: "system", content: ASK_SYSTEM },
        { role: "user", content: user },
      ],
      { maxTokens: 380, temperature: 0.4 },
    );
    if (ai && ai.length > 8) return { answer: ai, source: "qwen" };
  } catch {
    // fall through
  }

  const verdicts = recentVerdicts(4);
  if (verdicts.length === 0) {
    return {
      answer:
        "The swarm hasn't convened yet this session. Open the Council Floor and run a verdict on any Solana token, then ask me again.",
      source: "fallback",
    };
  }
  const summary = verdicts
    .map((v) => `${v.symbol} → ${v.verdict} (conf ${v.confidence})`)
    .join(", ");
  return {
    answer: `Heuristic mode (AI offline). Recent verdicts: ${summary}. Ask me about any of those tokens for the cited reasoning, or convene the council on a new symbol.`,
    source: "fallback",
  };
}
