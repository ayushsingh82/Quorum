// src/app/symbol/[symbol]/page.tsx
import Link from "next/link";

type Props = {
  params: {
    symbol: string;
  };
};

const timeframeCards = [
  {
    tf: "1H",
    score: 72,
    trend: "Bullish",
    rsi: 58.2,
    ema9: 142.2,
    ema21: 140.7,
    note: "Short-term momentum remains constructive.",
  },
  {
    tf: "4H",
    score: 81,
    trend: "Bullish",
    rsi: 61.9,
    ema9: 141.8,
    ema21: 138.9,
    note: "Trend confirmation is stronger on this timeframe.",
  },
  {
    tf: "1D",
    score: 86,
    trend: "Bullish",
    rsi: 63.1,
    ema9: 139.6,
    ema21: 133.4,
    note: "Higher timeframe structure supports continuation.",
  },
];

export default function SymbolPage({ params }: Props) {
  const symbol = params.symbol.toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-green-900/70 bg-[#0a0a0a] p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Symbol analysis</p>
          <h1 className="mt-2 text-3xl font-semibold text-green-400">{symbol}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-300">
            Multi-timeframe RSI and EMA analysis for {symbol}, including score, trend direction, and explanation.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="border border-green-800 px-4 py-2 text-sm text-white hover:border-green-500 hover:text-green-400"
        >
          Back to dashboard
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {timeframeCards.map((item) => (
          <div key={item.tf} className="border border-green-900/70 bg-[#0a0a0a] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{item.tf}</h3>
              <span className="text-sm text-green-400">{item.score}/100</span>
            </div>
            <p className="mt-3 text-sm text-zinc-300">{item.trend}</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">RSI</span>
                <span className="text-white">{item.rsi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">EMA9</span>
                <span className="text-white">{item.ema9}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">EMA21</span>
                <span className="text-white">{item.ema21}</span>
              </div>
            </div>

            <p className="mt-4 border-t border-zinc-900 pt-4 text-sm text-zinc-400">
              {item.note}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Chart zone</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Price + indicator area</h3>

          <div className="mt-6 flex h-[360px] items-center justify-center border border-green-900/60 bg-black text-zinc-500">
            Chart placeholder
          </div>
        </div>

        <div className="border border-green-900/70 bg-[#0a0a0a] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Agent reasoning</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Why this setup matters</h3>

          <div className="mt-5 space-y-4 text-sm text-zinc-300">
            <p>
              {symbol} shows positive EMA alignment on higher timeframes, while RSI remains strong but not overheated.
            </p>
            <p>
              The 4H and 1D views are in better agreement than the 1H chart, which increases setup quality.
            </p>
            <p>
              If volume expands with price continuation, this symbol could remain one of the strongest opportunities on the board.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}