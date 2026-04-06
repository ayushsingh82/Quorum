// src/index.ts
import type { Plugin, Action } from "@elizaos/core";

type Timeframe = "1h" | "4h" | "1d";

interface Candle {
  unixTime: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

const TOKENS = [
  { symbol: "SOL", address: "So11111111111111111111111111111111111111112" },
  { symbol: "JTO", address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL" },
  { symbol: "PYTH", address: "HZ1JovNiVvGrGNiiYvQwVdxQwQZo6X6n7f4D8nZr7M7" },
  { symbol: "WIF", address: "REPLACE_WITH_REAL_MINT" },
  { symbol: "FARTCOIN", address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" },
  { symbol: "RAY", address: "REPLACE_WITH_REAL_MINT" },
  { symbol: "RENDER", address: "REPLACE_WITH_REAL_MINT" },
  { symbol: "GRASS", address: "REPLACE_WITH_REAL_MINT" },
];

const GECKO_BASE = "https://api.geckoterminal.com/api/v2";
const DEXSCREENER_BASE = "https://api.dexscreener.com/latest/dex";

async function resolvePoolFromDexScreener(tokenAddress: string) {
  const res = await fetch(`${DEXSCREENER_BASE}/tokens/${tokenAddress}`);
  if (!res.ok) throw new Error(`DexScreener lookup failed: ${res.status}`);

  const json = await res.json();
  const pairs = (json?.pairs ?? [])
    .filter((p: any) => p.chainId === "solana")
    .sort(
      (a: any, b: any) =>
        Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0)
    );

  if (!pairs.length) throw new Error(`No Solana pair found for ${tokenAddress}`);
  return pairs[0].pairAddress as string;
}

function mapTimeframe(tf: Timeframe) {
  if (tf === "1h") return { timeframe: "minute", aggregate: 60 };
  if (tf === "4h") return { timeframe: "hour", aggregate: 4 };
  return { timeframe: "day", aggregate: 1 };
}

async function fetchOHLCV(poolAddress: string, tf: Timeframe, limit = 120): Promise<Candle[]> {
  const { timeframe, aggregate } = mapTimeframe(tf);

  const url =
    `${GECKO_BASE}/networks/solana/pools/${poolAddress}/ohlcv/${timeframe}` +
    `?aggregate=${aggregate}&limit=${limit}&currency=usd&token=base`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GeckoTerminal failed: ${res.status}`);

  const json = await res.json();
  const rows = json?.data?.attributes?.ohlcv_list ?? [];

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(`No OHLCV data for pool ${poolAddress}`);
  }

  return rows.map((r: any[]) => ({
    unixTime: Number(r[0]),
    o: Number(r[1]),
    h: Number(r[2]),
    l: Number(r[3]),
    c: Number(r[4]),
    v: Number(r[5] ?? 0),
  }));
}

async function fetchLiveTokenData(tokenAddress: string, tf: Timeframe, poolAddress?: string) {
  const resolvedPool = poolAddress ?? (await resolvePoolFromDexScreener(tokenAddress));
  const candles = await fetchOHLCV(resolvedPool, tf, 120);
  return { poolAddress: resolvedPool, candles };
}

function ema(values: number[], period: number): number[] {
  if (values.length === 0) return [];
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

function analyzeTimeframe(closes: number[], volumes: number[]) {
  const ema9Series = ema(closes, 9);
  const ema21Series = ema(closes, 21);
  const rsiSeries = rsi(closes, 14);

  const price = closes.at(-1)!;
  const ema9 = ema9Series.at(-1)!;
  const ema21 = ema21Series.at(-1)!;
  const rsi14 = rsiSeries.at(-1)!;

  const lastVolume = volumes.at(-1) ?? 0;
  const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(20, volumes.length));
  const volumeBoost = lastVolume > avgVolume * 1.15;

  let trend = "neutral";
  let momentum = "weak";
  let score = 45;

  if (ema9 > ema21 && price > ema21 && rsi14 >= 50 && rsi14 <= 68) {
    trend = "bullish";
    momentum = volumeBoost ? "strong" : "moderate";
    score = 78 + (volumeBoost ? 6 : 0);
  } else if (ema9 < ema21 && price < ema21 && rsi14 >= 32 && rsi14 < 50) {
    trend = "bearish";
    momentum = volumeBoost ? "strong" : "moderate";
    score = 76 + (volumeBoost ? 6 : 0);
  } else if (ema9 > ema21 && rsi14 > 68) {
    trend = "bullish";
    momentum = "overbought-watch";
    score = 62;
  } else if (ema9 < ema21 && rsi14 < 32) {
    trend = "bearish";
    momentum = "oversold-watch";
    score = 62;
  }

  return {
    price: Number(price.toFixed(6)),
    ema9: Number(ema9.toFixed(6)),
    ema21: Number(ema21.toFixed(6)),
    rsi14: Number(rsi14.toFixed(2)),
    trend,
    momentum,
    volumeBoost,
    score,
  };
}

function explainAnalysis(symbol: string, tf: Timeframe, a: any) {
  if (a.trend === "bullish") {
    return `${symbol} on ${tf} is bullish because EMA9 is above EMA21, price is above the trend line, and RSI is ${a.rsi14}.`;
  }
  if (a.trend === "bearish") {
    return `${symbol} on ${tf} is bearish because EMA9 is below EMA21, price is below the trend line, and RSI is ${a.rsi14}.`;
  }
  return `${symbol} on ${tf} is neutral because the indicators are mixed right now.`;
}

const scanMarketAction: Action = {
  name: "SCAN_SOL_MARKET",
  similes: ["sol screener", "scan sol market", "best solana setup"],
  description: "Scans Solana tokens across 1h, 4h, and 1d using RSI and EMA",

  validate: async () => true,

  handler: async (_runtime, _message, _state, _options, callback) => {
    try {
      const results: any[] = [];

      for (const token of TOKENS) {
        const byTf: Record<string, any> = {};

        for (const tf of ["1h", "4h", "1d"] as const) {
          const { candles, poolAddress } = await fetchLiveTokenData(token.address, tf);

          const closes = candles.map((c) => c.c);
          const volumes = candles.map((c) => c.v);

          const analysis = analyzeTimeframe(closes, volumes);

          byTf[tf] = {
            ...analysis,
            poolAddress,
            explanation: explainAnalysis(token.symbol, tf, analysis),
          };
        }

        const aggregateScore = Math.round(
          byTf["1h"].score * 0.25 +
          byTf["4h"].score * 0.35 +
          byTf["1d"].score * 0.40
        );

        results.push({
          symbol: token.symbol,
          address: token.address,
          aggregateScore,
          timeframes: byTf,
        });
      }

      results.sort((a, b) => b.aggregateScore - a.aggregateScore);
      const top = results[0];

      if (callback) {
        await callback({
          text: `Best setup now is ${top.symbol} with score ${top.aggregateScore}. ${top.timeframes["4h"].explanation}`,
          actions: ["SCAN_SOL_MARKET"],
        });
      }

      return {
        success: true,
        text: `Scanned ${results.length} tokens successfully.`,
        values: {
          bestSymbol: top.symbol,
          bestScore: top.aggregateScore,
        },
        data: {
          bestOpportunity: top,
          rankings: results,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        text: `Market scan failed: ${error.message}`,
        values: {
          error: error.message,
        },
      };
    }
  },

  examples: [
    [
      {
        name: "User",
        content: {
          text: "Scan Solana market and tell me the best setup",
        },
      },
      {
        name: "SolScreener",
        content: {
          text: "Best setup now is SOL on 4h with bullish EMA alignment and healthy RSI.",
          actions: ["SCAN_SOL_MARKET"],
        },
      },
    ],
  ],
};

export const SolScreenerPlugin: Plugin = {
  name: "solscreener",
  description: "AI-powered Solana market intelligence plugin with RSI and EMA analysis",
  actions: [scanMarketAction],
  providers: [],
  evaluators: [],
  services: [],
};

export default SolScreenerPlugin;