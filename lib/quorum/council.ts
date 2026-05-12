import type { AgentVote, CouncilVerdict, CouncilVote } from "./types";
import { runAllAgents } from "./agents";
import { fetchDexPair, fetchCandles } from "./market";
import { summarizeCouncil } from "./ai";
import { findToken } from "./tokens";
import { resolveToken } from "./search";
import { recordVerdict } from "./history";

const VOTE_SCORE: Record<CouncilVote, number> = { BUY: 1, HOLD: 0, AVOID: -1 };

function aggregateVotes(agents: AgentVote[]): {
  verdict: CouncilVote;
  confidence: number;
  weightedScore: number;
} {
  let weighted = 0;
  let totalWeight = 0;
  let totalConfidence = 0;
  for (const a of agents) {
    const w = a.weight * (a.confidence / 100);
    weighted += VOTE_SCORE[a.vote] * w;
    totalWeight += w;
    totalConfidence += a.confidence;
  }
  const score = totalWeight > 0 ? weighted / totalWeight : 0;
  let verdict: CouncilVote = "HOLD";
  if (score > 0.25) verdict = "BUY";
  else if (score < -0.25) verdict = "AVOID";
  const avgConf = agents.length > 0 ? totalConfidence / agents.length : 50;
  return { verdict, confidence: Math.round(avgConf), weightedScore: score };
}

function varianceOf(agents: AgentVote[]): number {
  const scores = agents.map((a) => VOTE_SCORE[a.vote]);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const v = scores.reduce((a, b) => a + (b - mean) * (b - mean), 0) / scores.length;
  return Math.round(v * 100) / 100;
}

function buildTranscript(agents: AgentVote[], verdict: CouncilVote, mechanism: "vote" | "debate") {
  const lines: { speaker: string; line: string }[] = [];
  lines.push({ speaker: "Coordinator", line: `Convening council. Mechanism: ${mechanism}.` });
  for (const a of agents) {
    lines.push({ speaker: a.name, line: `Vote ${a.vote} (conf ${a.confidence}). ${a.reason}` });
  }
  if (mechanism === "debate") {
    const dissent = agents.filter((a) => a.vote !== verdict).map((a) => a.name).join(", ");
    if (dissent) {
      lines.push({
        speaker: "Coordinator",
        line: `Dissent from ${dissent}. Re-weighting by reputation and confidence.`,
      });
    }
  }
  lines.push({ speaker: "Coordinator", line: `Quorum reached. Final verdict: ${verdict}.` });
  return lines;
}

function fallbackRationale(agents: AgentVote[], verdict: CouncilVote): string {
  const aligned = agents.filter((a) => a.vote === verdict);
  const top = aligned.sort((a, b) => b.confidence - a.confidence)[0];
  if (top) {
    return `Council sides with ${top.name} at ${top.confidence}% confidence: ${top.reason} ${aligned.length} of ${agents.length} agents agreed.`;
  }
  return `Council split — no agent reached majority confidence. Default verdict: ${verdict}.`;
}

export async function runCouncil(query: string): Promise<CouncilVerdict> {
  const local = findToken(query);
  const token = local
    ? { symbol: local.symbol, address: local.address }
    : await resolveToken(query);
  if (!token) {
    throw new Error(`Unknown Solana token: ${query}`);
  }
  const pair = await fetchDexPair(token.address);
  const candles = pair?.pairAddress
    ? await fetchCandles(pair.pairAddress, "1h", 90)
    : [];

  const agents = runAllAgents({ pair, candles });
  const variance = varianceOf(agents);
  const mechanism: "vote" | "debate" = variance > 0.55 ? "debate" : "vote";
  const { verdict, confidence } = aggregateVotes(agents);
  const transcript = buildTranscript(agents, verdict, mechanism);

  let rationale = fallbackRationale(agents, verdict);
  let source: CouncilVerdict["source"] = pair ? "live" : "mock";

  try {
    const ai = await summarizeCouncil({
      symbol: token.symbol,
      verdict,
      mechanism,
      varianceScore: variance,
      agentVotes: agents.map((a) => ({
        name: a.name,
        vote: a.vote,
        confidence: a.confidence,
        reason: a.reason,
        signals: a.signals,
      })),
    });
    if (ai) rationale = ai;
    else source = pair ? "ai-fallback" : "mock";
  } catch {
    source = pair ? "ai-fallback" : "mock";
  }

  const result: CouncilVerdict = {
    symbol: token.symbol,
    address: token.address,
    verdict,
    confidence,
    mechanism,
    varianceScore: variance,
    rationale,
    agents,
    transcript,
    generatedAt: Date.now(),
    source,
  };
  recordVerdict(result);
  return result;
}
