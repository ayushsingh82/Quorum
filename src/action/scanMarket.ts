// src/actions/scanMarket.ts
import type { Action } from "@elizaos/core";
import { TOKENS, TIMEFRAMES } from "../config/tokens";
import { fetchOHLCV } from "../services/birdeye";
import { analyzeTimeframe, explainAnalysis } from "../lib/indicators";

export const scanMarketAction: Action = {
  name: "SCAN_SOL_MARKET",
  description: "Scan Solana tokens across 1h, 4h, and 1d with RSI and EMA analysis",
  similes: ["scan sol market", "sol screener", "find best solana setup"],

  validate: async () => true,

  handler: async (runtime, message) => {
    const results: any[] = [];

    for (const token of TOKENS) {
      const byTf: Record<string, any> = {};

      for (const tf of TIMEFRAMES) {
        const candles = await fetchOHLCV(token.address, tf.type, 120);
        const closes = candles.map((c) => c.c);
        const volumes = candles.map((c) => c.v);

        const analysis = analyzeTimeframe(closes, volumes);
        byTf[tf.label] = {
          ...analysis,
          explanation: explainAnalysis(token.symbol, tf.label, analysis),
        };
      }

      const aggregateScore =
        Math.round(
          (byTf["1h"].score * 0.25 +
            byTf["4h"].score * 0.35 +
            byTf["1d"].score * 0.4) * 100
        ) / 100;

      results.push({
        symbol: token.symbol,
        address: token.address,
        timeframes: byTf,
        aggregateScore,
      });
    }

    results.sort((a, b) => b.aggregateScore - a.aggregateScore);
    const top = results[0];

    return {
      text: `Best current setup is ${top.symbol} with aggregate score ${top.aggregateScore}. ${top.timeframes["4h"].explanation}`,
      data: {
        bestOpportunity: top,
        rankings: results,
        generatedAt: new Date().toISOString(),
      },
      values: {
        marketScanCompleted: true,
      },
    };
  },
};