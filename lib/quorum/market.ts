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
