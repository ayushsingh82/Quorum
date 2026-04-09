# @solscreener/market-intelligence

Reusable Solana market-intelligence package for:
- live token snapshot (price, 24h change, liquidity, volume),
- multi-timeframe diagnostics (`1h`, `4h`, `1d`) with RSI/EMA scoring,
- market scan ranking across a token list.

## Install

```bash
npm install @solscreener/market-intelligence
```

## Quick usage

```ts
import { getTokenIntelligence, scanMarket } from "@solscreener/market-intelligence";

const sol = await getTokenIntelligence({ symbol: "SOL" });
console.log(sol.snapshot.priceUsd, sol.timeframes["1d"].score);

const rankings = await scanMarket();
console.log(rankings[0].token.symbol, rankings[0].aggregateScore);
```

## Use in your Next.js route/page

```ts
import { getTokenIntelligence } from "@solscreener/market-intelligence";

export async function getSymbolData(symbol: string) {
  return getTokenIntelligence({ symbol: symbol.toUpperCase() });
}
```

This is designed for pages like:
- `http://localhost:3001/symbol/SOL`
- `http://localhost:3001/symbol/PYTH`

## Publish

From package directory:

```bash
npm run build
npm publish --access public
```
