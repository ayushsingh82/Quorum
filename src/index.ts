// src/index.ts — Eliza plugin entry; shared logic lives under config/, lib/, services/, action/
import type { Plugin } from "@elizaos/core";
import { scanMarketAction } from "./action/scanMarket";

export const SolScreenerPlugin: Plugin = {
  name: "solscreener",
  description:
    "AI-powered Solana market intelligence plugin with RSI and EMA analysis",
  actions: [scanMarketAction],
  providers: [],
  evaluators: [],
  services: [],
};

export { scanMarketAction } from "./action/scanMarket";
export { TOKENS, TIMEFRAMES } from "./config/tokens";
export * from "./lib/indicators";
export * from "./services/marketData";

export default SolScreenerPlugin;
