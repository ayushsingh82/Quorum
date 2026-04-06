// src/app/dashboard/page.tsx
import Link from "next/link";

const tokens = [
  { symbol: "SOL", score: 84, trend: "Bullish", rsi: 61.2, ema9: 142.2, ema21: 139.8 },
  { symbol: "JTO", score: 76, trend: "Bullish", rsi: 58.4, ema9: 3.42, ema21: 3.31 },
  { symbol: "GRASS", score: 63, trend: "Neutral", rsi: 49.8, ema9: 1.92, ema21: 1.93 },
  { symbol: "PYTH", score: 71, trend: "Bullish", rsi: 56.1, ema9: 0.78, ema21: 0.75 },
  { symbol: "WIF", score: 67, trend: "Neutral", rsi: 52.6, ema9: 2.11, ema21: 2.09 },
  { symbol: "FARTCOIN", score: 79, trend: "Bullish", rsi: 60.3, ema9: 1.14, ema21: 1.07 },
  { symbol: "RAY", score: 62, trend: "Bearish", rsi: 43.8, ema9: 1.87, ema21: 1.94 },
  { symbol: "RENDER", score: 74, trend: "Bullish", rsi: 57.7, ema9: 8.34, ema21: 8.01 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Best setup now</p>
          <h3 className="mt-3 text-3xl font-semibold text-green-400">SOL</h3>
          <p className="mt-2 text-sm text-zinc-300">1D bullish structure with strong momentum.</p>
        </div>

        <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Market bias</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">Bullish</h3>
          <p className="mt-2 text-sm text-zinc-400">5 of 8 tracked tokens aligned upward.</p>
        </div>

        <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Alerts active</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">12</h3>
          <p className="mt-2 text-sm text-zinc-400">Watching RSI and EMA crossover conditions.</p>
        </div>

        <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tracked symbols</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">8</h3>
          <p className="mt-2 text-sm text-zinc-400">SOL, JTO, GRASS, PYTH, WIF, FARTCOIN, RAY, RENDER</p>
        </div>
      </section>

      <section className="border border-green-900/70 bg-[#0a0a0a] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Scanner output</p>
            <h3 className="text-xl font-semibold text-white">Top opportunity board</h3>
          </div>
          <div className="text-sm text-zinc-400">Updated 1 min ago</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tokens.slice(0, 4).map((token) => (
            <Link
              key={token.symbol}
              href={`/symbol/${token.symbol}`}
              className="border border-green-900/70 bg-black p-4 transition hover:border-green-500"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-green-400">{token.symbol}</h4>
                <span className="text-sm text-zinc-400">{token.score}/100</span>
              </div>
              <p className="mt-3 text-sm text-zinc-300">{token.trend}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-zinc-500">RSI</p>
                  <p className="text-white">{token.rsi}</p>
                </div>
                <div>
                  <p className="text-zinc-500">EMA9</p>
                  <p className="text-white">{token.ema9}</p>
                </div>
                <div>
                  <p className="text-zinc-500">EMA21</p>
                  <p className="text-white">{token.ema21}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-green-900/70 bg-[#0a0a0a] p-6">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Multi-timeframe board</p>
          <h3 className="text-xl font-semibold text-white">Tracked symbols</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-green-900/60 text-left text-zinc-400">
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Trend</th>
                <th className="px-4 py-3 font-medium">RSI</th>
                <th className="px-4 py-3 font-medium">EMA9</th>
                <th className="px-4 py-3 font-medium">EMA21</th>
                <th className="px-4 py-3 font-medium">View</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.symbol} className="border-b border-zinc-900">
                  <td className="px-4 py-4 text-green-400">{token.symbol}</td>
                  <td className="px-4 py-4 text-white">{token.score}</td>
                  <td className="px-4 py-4 text-zinc-300">{token.trend}</td>
                  <td className="px-4 py-4 text-zinc-300">{token.rsi}</td>
                  <td className="px-4 py-4 text-zinc-300">{token.ema9}</td>
                  <td className="px-4 py-4 text-zinc-300">{token.ema21}</td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/symbol/${token.symbol}`}
                      className="border border-green-800 px-3 py-2 text-xs uppercase tracking-wide text-white hover:border-green-500 hover:text-green-400"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}