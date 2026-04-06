**SolScreener** is a solid choice. It clearly sounds Solana-native, it explains the product fast, and it fits your idea of scanning the market for the best setups across timeframes.  The project should be positioned as an **AI market intelligence agent for Solana**, not just a chart dashboard, because the challenge is specifically about building a useful ElizaOS agent and deploying it on Nosana. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)

## Project name

| Item | Final choice |
|---|---|
| **Project name** | **SolScreener** |
| **Tagline** | **AI-powered Solana market screener for multi-timeframe opportunities** |
| **Short version** | **SolScreener scans SOL and top Solana ecosystem tokens, combines RSI + EMA analysis, and tells you where the best opportunity is right now.**  [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/) |

## Repository layout

The Next.js app keeps **UI in `app/`** and **shared logic in `src/`** so the Eliza plugin and the frontend can reuse the same types and functions later.

| Path | Purpose |
|------|---------|
| `app/` | App Router pages and layout: home, dashboard, alerts, token detail (`/token/[symbol]`). |
| `src/index.ts` | ElizaOS plugin entry — exports `SolScreenerPlugin`, `scanMarketAction`, and re-exports config, indicators, and market services. |
| `src/config/tokens.ts` | Watchlist: token symbols, mint addresses, and timeframe labels (`1h` / `4h` / `1d`). |
| `src/services/marketData.ts` | Market data: DexScreener pool resolution, GeckoTerminal OHLCV, and `fetchOHLCV` (pool + candles for a mint). |
| `src/lib/indicators.ts` | Technical core: EMA, RSI, `analyzeTimeframe`, plain-English `explainAnalysis`. |
| `src/action/scanMarket.ts` | Eliza action **`SCAN_SOL_MARKET`** — scans the watchlist, scores setups, returns ranked results. |

**Note:** The product brief below sometimes mentions **15m**; the current implementation uses **1h, 4h, and 1d** only, matching `TIMEFRAMES` in config.

## What we are building

SolScreener is a **Solana-native trading opportunity agent** that monitors **SOL plus selected Solana ecosystem tokens** across **15m, 1h, and 4h timeframes**, calculates **EMA and RSI signals**, and ranks the strongest setup with a clear explanation.  Instead of making users manually check multiple charts and tokens, the agent turns raw technical signals into a simple answer like: **best token now, best timeframe, signal strength, and reason**. [solana](https://solana.com)

The product is not meant to be an auto-trading bot.  It is a **decision-support agent** that helps traders and Solana users quickly find opportunities, monitor watchlists, and understand whether a setup is bullish, bearish, or mixed. [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/)

## How it helps users

SolScreener helps by reducing chart overload.  A trader normally checks many tokens, many timeframes, and multiple indicators, but SolScreener compresses that into one ranked view with explanations, which is much faster and more practical. [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/)

It helps users in these ways:

- Finds the **best setup now** across a small Solana watchlist. [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/)
- Uses **RSI + EMA confluence**, so signals are not based on only one indicator. [youtube](https://www.youtube.com/watch?v=57OwL37PZHA)
- Adds **trend summaries** like bullish, bearish, or mixed. [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/)
- Can show **signal strength** and optionally support/resistance context. [tradingpedia](https://www.tradingpedia.com/forex-trading-strategies/forex-trading-strategy-8-a-combination-of-rsi-ema-and-candlestick-setups/)
- Gives **plain-English explanations**, which makes technical analysis easier to understand. [arxiv](https://arxiv.org/html/2501.06781v1)

## Core idea

| Layer | What it does |
|---|---|
| **Market scanner** | Tracks SOL and 3 to 5 major Solana ecosystem tokens.  [solana](https://solana.com) |
| **Timeframe engine** | Checks 15m, 1h, and 4h charts to compare setups.  [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/) |
| **Indicator engine** | Uses EMA for trend confirmation and RSI for momentum/overbought-oversold context.  [youtube](https://www.youtube.com/watch?v=57OwL37PZHA) |
| **Opportunity scorer** | Ranks tokens and timeframes by setup quality, strength, and alignment.  [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/) |
| **AI explanation layer** | Converts technical data into natural-language reasons and alerts.  [arxiv](https://arxiv.org/html/2501.06781v1) |

## Main features

| Feature | Description |
|---|---|
| **Token watchlist** | SOL plus 3 to 5 ecosystem tokens like JUP, PYTH, BONK, WIF, and RAY.  [solana](https://solana.com) |
| **Multi-timeframe analysis** | Compare signals on 15m, 1h, and 4h to avoid weak one-timeframe setups.  [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/) |
| **RSI + EMA combo** | Use momentum plus trend confirmation together for stronger screening logic.  [youtube](https://www.youtube.com/watch?v=57OwL37PZHA) |
| **Best opportunity card** | Highlight the top setup currently available.  [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/) |
| **Bullish/Bearish summary** | Quickly show current trend bias for each token.  [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/) |
| **Signal strength score** | Give each setup a simple confidence or momentum score.  [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/) |
| **Alerts** | Notify when new confluence conditions appear.  [luma](https://luma.com/9i9eu7vg) |
| **Simple memory/watchlist** | Save user preferences and favorite tokens.  [arxiv](https://arxiv.org/html/2501.06781v1) |

## RSI + EMA logic

The intelligence of SolScreener should come from **confluence**, not from a single indicator.  EMA helps identify trend direction, while RSI helps measure momentum and whether a move is stretched or potentially attractive. [youtube](https://www.youtube.com/watch?v=Q-iKBb2BO6c)

A simple logic can be:

- **Bullish setup:** fast EMA above slow EMA, RSI healthy and not overheated, higher timeframe trend supportive. [youtube](https://www.youtube.com/watch?v=Q-iKBb2BO6c)
- **Bearish setup:** fast EMA below slow EMA, RSI weak, higher timeframe trend confirms downside. [youtube](https://www.youtube.com/watch?v=Q-iKBb2BO6c)
- **Watch setup:** RSI improves near support but EMA trend has not fully confirmed yet. [tradingpedia](https://www.tradingpedia.com/forex-trading-strategies/forex-trading-strategy-8-a-combination-of-rsi-ema-and-candlestick-setups/)

This is powerful because the app is not only showing indicator values; it is interpreting them into a **ranked opportunity engine**. [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/)

## Why this fits the challenge

The challenge requires builders to create a **personal AI agent with ElizaOS**, give it a **custom frontend/UI**, and **deploy it on Nosana’s decentralized GPU network** in a **Docker container**.  SolScreener fits that well because it is a real-use-case agent with a strong interface, clear utility, and a workflow that can be explained quickly in a demo. [nosana](https://nosana.com/blog/nosana-monthly-march-edition/)

It also maps nicely to the judging criteria:
- **Technical implementation:** indicator engine, scoring, error handling. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)
- **Nosana integration:** proper deployment, containerization, live endpoint. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)
- **Usefulness & UX:** easy-to-understand opportunity dashboard. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)
- **Creativity:** Solana-focused AI screener is more specific than a generic chatbot. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)
- **Documentation:** easy to document because the flow is clear. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)

## Tech stack

| Part | Tech | Why |
|---|---|---|
| **Agent framework** | **ElizaOS v2**  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) | Handles agent runtime, tools, memory, actions, and structured behavior.  [arxiv](https://arxiv.org/html/2501.06781v1) |
| **Deployment** | **Nosana**  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) | Runs the app on decentralized GPU infrastructure built around Solana.  [learn.bybit](https://learn.bybit.com/en/web3/what-is-nosana-nos) |
| **Model layer** | **Qwen3.5-27B-AWQ-4bit endpoint** from challenge resources  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) | Gives you the LLM layer for explanations and agent responses.  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) |
| **Frontend** | React / Next.js or Vite frontend  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) | Clean dashboard for tokens, signals, alerts, and rankings.  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) |
| **Backend/API** | Node.js 23+  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) | Fits the challenge guidance and works well with ElizaOS tooling.  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) |
| **Containerization** | Docker  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) | Required for Nosana deployment and challenge compliance.  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) |
| **Market data** | Solana-friendly price/candle API or exchange market data feed  [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/) | Needed for token prices, candles, EMA, RSI, and signal computation.  [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/) |
| **Optional memory** | Lightweight DB / local store / Eliza memory layer  [arxiv](https://arxiv.org/html/2501.06781v1) | Saves watchlist and alert preferences.  [arxiv](https://arxiv.org/html/2501.06781v1) |

## What Nosana does here

Nosana is the **compute layer** for your project.  Instead of hosting SolScreener on a traditional centralized cloud, you package it in Docker and deploy it on **Nosana’s decentralized GPU network**, which is exactly what the challenge wants. [learn.bybit](https://learn.bybit.com/en/web3/what-is-nosana-nos)

For SolScreener, Nosana gives you:
- A challenge-aligned deployment path. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)
- Decentralized infrastructure on the Solana stack. [learn.bybit](https://learn.bybit.com/en/web3/what-is-nosana-nos)
- A better story for the demo, because your agent is not just built for Solana users, it is also **running on Solana-aligned decentralized compute**. [youtube](https://www.youtube.com/watch?v=J9lfl2QOmhU)

## What ElizaOS does here

ElizaOS is the **agent brain and orchestration layer**.  It gives you the structure for tools, memory, actions, and response generation, so your app feels like an intelligent assistant rather than just a static screener. [github](https://github.com/elizaos/eliza)

In SolScreener, ElizaOS can handle:
- Pulling market data through tools. [arxiv](https://arxiv.org/html/2501.06781v1)
- Running analysis workflows. [arxiv](https://arxiv.org/html/2501.06781v1)
- Summarizing why one setup ranks above another. [arxiv](https://arxiv.org/html/2501.06781v1)
- Remembering watchlist preferences and recent interactions. [github](https://github.com/elizaos/eliza)
- Producing alerts or explanations in natural language. [arxiv](https://arxiv.org/html/2501.06781v1)

## How the system works

| Step | What happens |
|---|---|
| **1. Data fetch** | The app fetches SOL and ecosystem token candle data for 15m, 1h, and 4h.  [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/) |
| **2. Indicator calculation** | The backend computes EMA values, RSI, and optional support/resistance levels.  [youtube](https://www.youtube.com/watch?v=57OwL37PZHA) |
| **3. Signal engine** | The agent scores each token-timeframe setup using confluence rules.  [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/) |
| **4. Ranking** | It ranks the strongest current opportunities.  [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/) |
| **5. AI explanation** | ElizaOS turns the signal logic into plain-English reasoning.  [arxiv](https://arxiv.org/html/2501.06781v1) |
| **6. UI output** | Users see cards, scores, charts, trend labels, and alerts in the dashboard.  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) |
| **7. Deployment** | The whole app runs in a Docker container on Nosana.  [nosana](https://nosana.com/blog/builders-challenge-elizaos/) |

## Ideal MVP

For the challenge, your MVP should stay focused.  The best version is: [nosana](https://nosana.com/blog/builders-challenge-elizaos/)

- SOL + 4 ecosystem tokens. [solana](https://solana.com)
- 15m / 1h / 4h analysis. [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/)
- RSI + EMA combo. [youtube](https://www.youtube.com/watch?v=57OwL37PZHA)
- Opportunity score and ranking. [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/)
- Best setup now card. [blockchainappfactory](https://www.blockchainappfactory.com/blog/how-to-build-a-token-dashboard-a-complete-guide-for-2025/)
- Trend summary and plain-English explanation. [tradingfinder](https://tradingfinder.com/education/forex/rsi-ema-strategy/)
- Simple watchlist and alert system. [arxiv](https://arxiv.org/html/2501.06781v1)

That is enough to feel polished without becoming too big for the timeline. [nosana](https://nosana.com/blog/builders-challenge-elizaos/)

## Final pitch

**SolScreener is an AI-powered Solana market screener built with ElizaOS and deployed on Nosana. It monitors SOL and top Solana ecosystem tokens across multiple timeframes, combines RSI and EMA signals, ranks the strongest trading opportunities, and explains them in plain English through a clean dashboard and alert system.** [youtube](https://www.youtube.com/watch?v=J9lfl2QOmhU)

If you want, next I can give you:
- a **300-word final submission description**,
- a **full feature roadmap table**,
- or the **exact architecture and folder structure** for building SolScreener.

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