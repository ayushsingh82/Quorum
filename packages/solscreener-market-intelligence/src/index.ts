export type TokenConfig = {
  symbol: string;
  address: string;
};

export type Timeframe = "1h" | "4h" | "1d";

export type Candle = {
  unixTime: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export const DEFAULT_TOKENS: TokenConfig[] = [
  { symbol: "SOL", address: "So11111111111111111111111111111111111111112" },
  { symbol: "JTO", address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL" },
  { symbol: "GRASS", address: "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs" },
  { symbol: "PYTH", address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3" },
  { symbol: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { symbol: "FARTCOIN", address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" },
  { symbol: "RAY", address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { symbol: "RENDER", address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof" },
];

const GECKO_BASE = "https://api.geckoterminal.com/api/v2";
const DEXSCREENER_BASE = "https://api.dexscreener.com/latest/dex";

type DexPair = {
  chainId?: string;
  pairAddress: string;
  dexId?: string;
  priceUsd?: string;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  marketCap?: number;
  fdv?: number;
  txns?: { h24?: { buys?: number; sells?: number } };
};

export type Snapshot = {
  pairAddress: string;
  dexId: string | null;
  priceUsd: number;
  change24h: number;
  liquidityUsd: number;
  volume24h: number;
  marketCap: number;
  fdv: number;
  trades24h: number;
  topPairs: DexPair[];
};

export type TimeframeAnalysis = {
  timeframe: Timeframe;
  price: number;
  ema9: number;
  ema21: number;
  rsi14: number;
  trend: "bullish" | "bearish" | "neutral";
  momentum: "strong" | "moderate" | "overbought-watch" | "oversold-watch" | "weak" | "mixed";
  volumeBoost: boolean;
  score: number;
  poolAddress: string;
};

export type TokenIntelligence = {
  token: TokenConfig;
  snapshot: Snapshot;
  timeframes: Record<Timeframe, TimeframeAnalysis>;
  aggregateScore: number;
};

function mapTimeframe(tf: Timeframe) {
  if (tf === "1h") return { timeframe: "minute", aggregate: 60 };
  if (tf === "4h") return { timeframe: "hour", aggregate: 4 };
  return { timeframe: "day", aggregate: 1 };
}

function ema(values: number[], period: number): number[] {
  if (values.length < period) return [];
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values[0];
  for (let i = 0; i < values.length; i++) {
    const current = i === 0 ? values[i] : values[i] * k + prev * (1 - k);
    out.push(current);
    prev = current;
  }
  return out;
}

function rsi(values: number[], period = 14): number[] {
  if (values.length < period + 1) return [];
  const out: number[] = new Array(values.length).fill(NaN);
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return out;
}

export function analyzeTimeframe(closes: number[], volumes: number[]) {
  const ema9 = ema(closes, 9);
  const ema21 = ema(closes, 21);
  const rsi14 = rsi(closes, 14);
  const lastPrice = closes.at(-1) ?? 0;
  const lastEma9 = ema9.at(-1) ?? 0;
  const lastEma21 = ema21.at(-1) ?? 0;
  const lastRsi = rsi14.at(-1) ?? 0;
  const lastVolume = volumes.at(-1) ?? 0;
  const avgVolume20 =
    volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(20, volumes.length));
  const priceAboveSlow = lastPrice > lastEma21;
  const emaBullish = lastEma9 > lastEma21;
  const emaBearish = lastEma9 < lastEma21;
  const volumeBoost = lastVolume > avgVolume20 * 1.15;

  let trend: TimeframeAnalysis["trend"] = "neutral";
  let momentum: TimeframeAnalysis["momentum"] = "mixed";
  let score = 50;
  if (emaBullish && priceAboveSlow && lastRsi >= 50 && lastRsi <= 68) {
    trend = "bullish";
    momentum = volumeBoost ? "strong" : "moderate";
    score = 70 + Math.min(20, (lastRsi - 50) * 1.2) + (volumeBoost ? 8 : 0);
  } else if (emaBearish && !priceAboveSlow && lastRsi >= 32 && lastRsi < 50) {
    trend = "bearish";
    momentum = volumeBoost ? "strong" : "moderate";
    score = 70 + Math.min(20, (50 - lastRsi) * 1.2) + (volumeBoost ? 8 : 0);
  } else if (emaBullish && lastRsi > 68) {
    trend = "bullish";
    momentum = "overbought-watch";
    score = 62;
  } else if (emaBearish && lastRsi < 32) {
    trend = "bearish";
    momentum = "oversold-watch";
    score = 62;
  } else {
    trend = "neutral";
    momentum = "weak";
    score = 45;
  }
  return {
    price: Number(lastPrice.toFixed(6)),
    ema9: Number(lastEma9.toFixed(6)),
    ema21: Number(lastEma21.toFixed(6)),
    rsi14: Number(lastRsi.toFixed(2)),
    trend,
    momentum,
    volumeBoost,
    score: Math.max(0, Math.min(100, Math.round(score))),
  };
}

export async function resolvePoolFromDexScreener(tokenAddress: string): Promise<Snapshot> {
  const res = await fetch(`${DEXSCREENER_BASE}/tokens/${tokenAddress}`);
  if (!res.ok) throw new Error(`DexScreener lookup failed: ${res.status}`);
  const json = await res.json();
  const pairs = ((json?.pairs ?? []) as DexPair[])
    .filter((p) => p.chainId === "solana")
    .sort((a, b) => Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0));
  if (!pairs.length) throw new Error(`No Solana pair found for token ${tokenAddress}`);
  const primary = pairs[0];
  return {
    pairAddress: primary.pairAddress,
    dexId: primary.dexId ?? null,
    priceUsd: Number(primary.priceUsd ?? 0),
    change24h: Number(primary.priceChange?.h24 ?? 0),
    liquidityUsd: Number(primary.liquidity?.usd ?? 0),
    volume24h: Number(primary.volume?.h24 ?? 0),
    marketCap: Number(primary.marketCap ?? 0),
    fdv: Number(primary.fdv ?? 0),
    trades24h: Number(primary.txns?.h24?.buys ?? 0) + Number(primary.txns?.h24?.sells ?? 0),
    topPairs: pairs.slice(0, 3),
  };
}

export async function fetchOHLCVFromGeckoTerminal(
  poolAddress: string,
  tf: Timeframe,
  limit = 120
): Promise<Candle[]> {
  const { timeframe, aggregate } = mapTimeframe(tf);
  const url =
    `${GECKO_BASE}/networks/solana/pools/${poolAddress}/ohlcv/${timeframe}` +
    `?aggregate=${aggregate}&limit=${limit}&currency=usd&token=base`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GeckoTerminal OHLCV failed: ${res.status}`);
  const json = await res.json();
  const list = json?.data?.attributes?.ohlcv_list ?? json?.data?.attributes?.ohlcvList ?? [];
  if (!Array.isArray(list) || !list.length) throw new Error(`No OHLCV data for pool ${poolAddress}`);
  return list.map((row: number[]) => ({
    unixTime: Number(row[0]),
    o: Number(row[1]),
    h: Number(row[2]),
    l: Number(row[3]),
    c: Number(row[4]),
    v: Number(row[5] ?? 0),
  }));
}

export async function getTokenIntelligence(input: {
  symbol?: string;
  address?: string;
  tokenList?: TokenConfig[];
}): Promise<TokenIntelligence> {
  const tokenList = input.tokenList ?? DEFAULT_TOKENS;
  let token: TokenConfig | undefined;
  if (input.address) token = tokenList.find((t) => t.address === input.address);
  if (!token && input.symbol) {
    const wantedSymbol = input.symbol.toUpperCase();
    token = tokenList.find((t) => t.symbol === wantedSymbol);
  }
  if (!token && input.address) token = { symbol: "CUSTOM", address: input.address };
  if (!token) throw new Error("Token not found. Pass a known symbol or address.");

  const snapshot = await resolvePoolFromDexScreener(token.address);
  const frames = (["1h", "4h", "1d"] as const).map(async (tf) => {
    const candles = await fetchOHLCVFromGeckoTerminal(snapshot.pairAddress, tf, 120);
    const closes = candles.map((c) => c.c);
    const volumes = candles.map((c) => c.v);
    const analysis = analyzeTimeframe(closes, volumes);
    return {
      timeframe: tf,
      ...analysis,
      poolAddress: snapshot.pairAddress,
    } satisfies TimeframeAnalysis;
  });
  const resolved = await Promise.all(frames);
  const timeframes = {
    "1h": resolved.find((r) => r.timeframe === "1h")!,
    "4h": resolved.find((r) => r.timeframe === "4h")!,
    "1d": resolved.find((r) => r.timeframe === "1d")!,
  };
  const aggregateScore = Math.round(
    timeframes["1h"].score * 0.25 + timeframes["4h"].score * 0.35 + timeframes["1d"].score * 0.4
  );
  return { token, snapshot, timeframes, aggregateScore };
}

export async function scanMarket(tokenList: TokenConfig[] = DEFAULT_TOKENS) {
  const all = await Promise.all(tokenList.map((token) => getTokenIntelligence({ address: token.address, tokenList })));
  return all.sort((a, b) => b.aggregateScore - a.aggregateScore);
}
