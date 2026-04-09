import Link from "next/link";

export default function PackagePage() {
  return (
    <main className="space-y-6">
      <section className="border border-green-900/70 bg-[#0a0a0a] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Reusable package</p>
        <h1 className="mt-2 text-3xl font-semibold text-green-400">@solscreener/market-intelligence</h1>
        <p className="mt-3 max-w-3xl text-sm text-zinc-300">
          Publish-ready toolkit for Solana token intelligence (live snapshot, RSI/EMA multi-timeframe
          analysis, and market ranking).
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
          <h2 className="text-xl font-semibold text-white">Install</h2>
          <pre className="mt-4 overflow-x-auto border border-zinc-900 bg-black p-4 text-sm text-zinc-200">
            npm install @solscreener/market-intelligence
          </pre>
        </div>

        <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
          <h2 className="text-xl font-semibold text-white">Quick usage</h2>
          <pre className="mt-4 overflow-x-auto border border-zinc-900 bg-black p-4 text-sm text-zinc-200">
{`import { getTokenIntelligence } from "@solscreener/market-intelligence";

const sol = await getTokenIntelligence({ symbol: "SOL" });
console.log(sol.snapshot.priceUsd, sol.timeframes["1d"].score);`}
          </pre>
        </div>
      </section>

      <section className="border border-green-900/70 bg-[#0a0a0a] p-6">
        <h2 className="text-xl font-semibold text-white">Source in this repo</h2>
        <p className="mt-2 text-sm text-zinc-300">
          <code>packages/solscreener-market-intelligence</code>
        </p>
        <div className="mt-4">
          <Link
            href="/symbol/SOL"
            className="inline-block border border-green-800 px-4 py-2 text-sm text-white transition hover:border-green-500 hover:text-green-400"
          >
            View live /symbol/SOL example
          </Link>
        </div>
      </section>
    </main>
  );
}

