import type { Candle } from "./types";

const DEXSCREENER = "https://api.dexscreener.com/latest/dex";
const GECKO = "https://api.geckoterminal.com/api/v2";

export type DexPair = {
  pairAddress: string;
  priceUsd: number;
  liquidityUsd: number;
  volume24h: number;
  change1h: number;
  change24h: number;
  fdv: number;
};

export async function fetchDexPair(tokenAddress: string): Promise<DexPair | null> {
  try {
    const res = await fetch(`${DEXSCREENER}/tokens/${tokenAddress}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const pairs = (json?.pairs ?? [])
      .filter((p: { chainId: string }) => p.chainId === "solana")
      .sort(
        (a: { liquidity?: { usd?: number } }, b: { liquidity?: { usd?: number } }) =>
          Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0),
      );
    if (!pairs.length) return null;
    const p = pairs[0];
    return {
      pairAddress: p.pairAddress,
      priceUsd: Number(p.priceUsd ?? 0),
      liquidityUsd: Number(p.liquidity?.usd ?? 0),
      volume24h: Number(p.volume?.h24 ?? 0),
      change1h: Number(p.priceChange?.h1 ?? 0),
      change24h: Number(p.priceChange?.h24 ?? 0),
      fdv: Number(p.fdv ?? 0),
    };
  } catch {
    return null;
  }
}

export async function fetchCandles(
  poolAddress: string,
  timeframe: "1h" | "4h" | "1d" = "1h",
  limit = 90,
): Promise<Candle[]> {
  const map = {
    "1h": { timeframe: "minute", aggregate: 60 },
    "4h": { timeframe: "hour", aggregate: 4 },
    "1d": { timeframe: "day", aggregate: 1 },
  } as const;
  const cfg = map[timeframe];
  try {
    const url = `${GECKO}/networks/solana/pools/${poolAddress}/ohlcv/${cfg.timeframe}?aggregate=${cfg.aggregate}&limit=${limit}&currency=usd&token=base`;
    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = await res.json();
    const rows = json?.data?.attributes?.ohlcv_list ?? [];
    return rows
      .map((r: number[]) => ({
        t: Number(r[0]),
        o: Number(r[1]),
        h: Number(r[2]),
        l: Number(r[3]),
        c: Number(r[4]),
        v: Number(r[5] ?? 0),
      }))
      .reverse();
  } catch {
    return [];
  }
}

export function ema(values: number[], period: number): number[] {
  if (values.length === 0) return [];
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values[0];
  for (let i = 0; i < values.length; i++) {
    const v = i === 0 ? values[i] : values[i] * k + prev * (1 - k);
    out.push(v);
    prev = v;
  }
  return out;
}

export function rsi(values: number[], period = 14): number {
  if (values.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const d = values[i] - values[i - 1];
    if (d >= 0) gains += d;
    else losses -= d;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    const g = d > 0 ? d : 0;
    const l = d < 0 ? -d : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
  }
  return avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
}

export type TimeframeAnalysis = {
  price: number;
  ema9: number;
  ema21: number;
  rsi14: number;
  trend: "bullish" | "bearish" | "neutral";
  momentum: "strong" | "moderate" | "weak" | "mixed" | "overbought-watch" | "oversold-watch";
  volumeBoost: boolean;
  score: number;
};

export function analyzeTimeframe(closes: number[], volumes: number[]): TimeframeAnalysis | null {
  if (closes.length < 22) return null;
  const ema9Series = ema(closes, 9);
  const ema21Series = ema(closes, 21);
  const lastEma9 = ema9Series.at(-1)!;
  const lastEma21 = ema21Series.at(-1)!;
  const lastRsi = rsi(closes, 14);
  const lastPrice = closes.at(-1)!;
  const lastVolume = volumes.at(-1) ?? 0;
  const avgVolume20 =
    volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(20, volumes.length));
  const volumeBoost = lastVolume > avgVolume20 * 1.15;

  let trend: TimeframeAnalysis["trend"] = "neutral";
  let momentum: TimeframeAnalysis["momentum"] = "mixed";
  let score = 50;

  if (lastEma9 > lastEma21 && lastPrice > lastEma21 && lastRsi >= 50 && lastRsi <= 68) {
    trend = "bullish";
    momentum = volumeBoost ? "strong" : "moderate";
    score = 70 + Math.min(20, (lastRsi - 50) * 1.2) + (volumeBoost ? 8 : 0);
  } else if (lastEma9 < lastEma21 && lastPrice < lastEma21 && lastRsi >= 32 && lastRsi < 50) {
    trend = "bearish";
    momentum = volumeBoost ? "strong" : "moderate";
    score = 70 + Math.min(20, (50 - lastRsi) * 1.2) + (volumeBoost ? 8 : 0);
  } else if (lastEma9 > lastEma21 && lastRsi > 68) {
    trend = "bullish";
    momentum = "overbought-watch";
    score = 62;
  } else if (lastEma9 < lastEma21 && lastRsi < 32) {
    trend = "bearish";
    momentum = "oversold-watch";
    score = 62;
  } else {
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

export function realizedVolatility(closes: number[]): number {
  if (closes.length < 3) return 0;
  const rets: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    rets.push(Math.log(closes[i] / closes[i - 1]));
  }
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance =
    rets.reduce((a, b) => a + (b - mean) * (b - mean), 0) / Math.max(1, rets.length - 1);
  return Math.sqrt(variance) * Math.sqrt(24 * 365) * 100;
}
