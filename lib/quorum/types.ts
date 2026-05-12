export type CouncilVote = "BUY" | "HOLD" | "AVOID";

export type AgentId =
  | "chart"
  | "liquidity"
  | "momentum"
  | "risk"
  | "flow";

export type AgentVote = {
  agent: AgentId;
  name: string;
  vote: CouncilVote;
  confidence: number;
  weight: number;
  reason: string;
  signals: { label: string; value: string }[];
};

export type CouncilVerdict = {
  symbol: string;
  address: string;
  verdict: CouncilVote;
  confidence: number;
  mechanism: "vote" | "debate";
  varianceScore: number;
  rationale: string;
  agents: AgentVote[];
  transcript: { speaker: string; line: string }[];
  generatedAt: number;
  source: "live" | "mock" | "ai-fallback";
};

export type AgentReputation = {
  agent: AgentId;
  name: string;
  totalCalls: number;
  correctCalls: number;
  rollingPnl: number;
  weight: number;
  lastActive: number;
};

export type TokenSummary = {
  symbol: string;
  address: string;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  verdict?: CouncilVote;
  verdictConfidence?: number;
};

export type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type ApiEnvelope<T> =
  | { ok: true; data: T; source: string; generatedAt: number }
  | { ok: false; error: string; generatedAt: number };
