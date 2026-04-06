// src/app/page.tsx
import Link from "next/link";

const features = [
  {
    title: "Multi-timeframe analysis",
    description:
      "Scan 1H, 4H, and 1D structures in one place and quickly see where the strongest setup is forming.",
  },
  {
    title: "RSI + EMA intelligence",
    description:
      "Turn raw indicator values into trend direction, momentum quality, and ranked trading opportunities.",
  },
  {
    title: "AI market explanations",
    description:
      "Get plain-English reasoning for every signal so the platform feels like an analyst, not just a dashboard.",
  },
];

const trackedTokens = ["SOL", "JTO", "GRASS", "PYTH", "WIF", "FARTCOIN", "RAY", "RENDER"];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-green-900/60 bg-[#050505]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide text-green-400">
              SolScreener
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              AI-powered Solana market intelligence
            </p>
          </div>

          <nav className="hidden items-center gap-3 md:flex">
            <Link
              href="/dashboard"
              className="border border-green-800 px-4 py-2 text-sm text-white transition hover:border-green-500 hover:text-green-400"
            >
              Dashboard
            </Link>
            <Link
              href="/alerts"
              className="border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-green-500 hover:text-green-400"
            >
              Alerts
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-green-900/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Solana trading agent
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              Find the <span className="text-green-400">best Solana setup</span> across
              multiple timeframes.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">
              SolScreener scans SOL and top Solana ecosystem tokens, calculates RSI and EMA
              signals across 1H, 4H, and 1D charts, and tells you where the strongest
              opportunity is right now.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/dashboard"
                className="border border-green-700 bg-[#0b0b0b] px-6 py-3 text-sm font-medium text-green-400 transition hover:border-green-500"
              >
                Open Dashboard
              </Link>
              <Link
                href="/symbol/SOL"
                className="border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-green-500 hover:text-green-400"
              >
                View SOL Analysis
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {trackedTokens.map((token) => (
                <span
                  key={token}
                  className="border border-green-900/60 bg-[#090909] px-4 py-2 text-sm text-zinc-300"
                >
                  {token}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Live summary</p>

            <div className="mt-6 border border-green-900/60 bg-black p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-green-400">Best Setup Now</h3>
                <span className="text-sm text-zinc-500">Live</span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Symbol</p>
                  <p className="mt-2 text-3xl font-semibold text-white">SOL</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Score</p>
                  <p className="mt-2 text-3xl font-semibold text-green-400">84/100</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Trend</p>
                  <p className="mt-2 text-lg text-white">Bullish</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Timeframe</p>
                  <p className="mt-2 text-lg text-white">1D</p>
                </div>
              </div>
              <p className="mt-5 border-t border-zinc-900 pt-4 text-sm leading-6 text-zinc-400">
                EMA alignment is positive on higher timeframes and RSI remains strong without
                entering an overheated zone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-green-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Core system</p>
            <h3 className="mt-2 text-3xl font-semibold text-white">
              Built for fast market decisions
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border border-green-900/70 bg-[#0a0a0a] p-6"
              >
                <h4 className="text-xl font-semibold text-green-400">{feature.title}</h4>
                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-green-900/40">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">How it works</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                A simple market intelligence loop
              </h3>

              <div className="mt-6 space-y-4 text-sm text-zinc-300">
                <div className="border border-zinc-900 bg-black p-4">
                  <span className="text-green-400">01.</span> Fetch live token and candle data.
                </div>
                <div className="border border-zinc-900 bg-black p-4">
                  <span className="text-green-400">02.</span> Compute RSI, EMA, trend, and score.
                </div>
                <div className="border border-zinc-900 bg-black p-4">
                  <span className="text-green-400">03.</span> Rank the best opportunities across timeframes.
                </div>
                <div className="border border-zinc-900 bg-black p-4">
                  <span className="text-green-400">04.</span> Explain the signal in plain English.
                </div>
              </div>
            </div>

            <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Why it matters</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Less chart overload, faster decisions
              </h3>

              <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-300">
                <p className="border border-zinc-900 bg-black p-4">
                  Instead of checking every chart manually, traders get one ranked market view.
                </p>
                <p className="border border-zinc-900 bg-black p-4">
                  Multi-timeframe confirmation helps filter weaker setups and noisy moves.
                </p>
                <p className="border border-zinc-900 bg-black p-4">
                  The AI explanation layer makes technical analysis easier to understand quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="border border-green-900/70 bg-[#0a0a0a] p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Start now</p>
                <h3 className="mt-2 text-3xl font-semibold text-white">
                  Open the dashboard and start scanning the market.
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-zinc-300">
                  SolScreener is designed to show the strongest opportunity first, then help
                  you inspect symbols and alerts in a clean workflow.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="border border-green-700 bg-black px-6 py-3 text-sm font-medium text-green-400 transition hover:border-green-500"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/alerts"
                  className="border border-zinc-800 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-green-500 hover:text-green-400"
                >
                  View Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}