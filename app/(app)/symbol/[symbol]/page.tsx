import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOKENS, TIMEFRAMES } from "@/src/config/tokens";
import { fetchLiveTokenData } from "@/src/services/marketData";
import { analyzeTimeframe } from "@/src/lib/indicators";
import TradingViewChart from "./TradingViewChart";

type PageProps = {
  params: Promise<{
    symbol: string;
  }>;
};

type DexPair = {
  chainId?: string;
  pairAddress: string;
  dexId?: string;
  baseToken?: { symbol?: string };
  quoteToken?: { symbol?: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  marketCap?: number;
  fdv?: number;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  txns?: { h24?: { buys?: number; sells?: number } };
};

const tokenMeta: Record<string, { name: string; logo?: string; description: string }> = {
  SOL: {
    name: "Solana",
    logo: "https://s2.coinmarketcap.com/static/img/coins/200x200/5426.png",
    description: "Native asset of the Solana ecosystem, shown here as wrapped SOL mint.",
  },
  JTO: {
    name: "Jito",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDSNQ116Qr0wfWThjRE8ayqxqL1d3NrgWITA&s",
    description: "Liquid staking and MEV-related token in the Solana ecosystem.",
  },
  GRASS: {
    name: "Grass",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQl1i8oV3nM4syUBSdcxZhCViLCavM4suWtjQ&s",
    description: "Network-focused token with community and infrastructure interest.",
  },
  PYTH: {
    name: "Pyth Network",
    logo: "https://pbs.twimg.com/profile_images/1948404937857122304/XPBCFnR5_400x400.jpg",
    description: "Oracle-related token with strong Solana ecosystem presence.",
  },
  WIF: {
    name: "dogwifhat",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq0S8cirs7ksAGmZpIJ1hH1yWBU8o9p1dTgQ&s",
    description: "Popular meme token on Solana with strong trader attention.",
  },
  FARTCOIN: {
    name: "Fartcoin",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4atxbLkUPo7ZrtofXit22oRAEMM_WnDEqxg&s",
    description: "High-volatility meme token page with activity-focused metrics.",
  },
  RAY: {
    name: "Raydium",
    logo: "https://coin-images.coingecko.com/coins/images/13928/large/PSigc4ie_400x400.jpg?1696513668",
    description: "DEX and liquidity ecosystem token for Raydium.",
  },
  RENDER: {
    name: "Render",
    logo: "https://pbs.twimg.com/profile_images/1457177843780263941/UZz903Wg_400x400.jpg",
    description: "Render Network token migrated to Solana.",
  },
};

export default async function SymbolPage({ params }: PageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol.toUpperCase();
  const token = TOKENS.find((t) => t.symbol === symbol);
  if (!token) notFound();

  const meta = tokenMeta[symbol] ?? {
    name: symbol,
    logo: undefined,
    description: "Token detail page.",
  };

  const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.address}`, {
    next: { revalidate: 30 },
  }).catch(() => null);
  const dexJson = dexRes?.ok ? await dexRes.json() : null;
  const solanaPairs: DexPair[] = (dexJson?.pairs ?? [])
    .filter((p: DexPair) => p.chainId === "solana")
    .sort((a: DexPair, b: DexPair) => Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0));
  const primary = solanaPairs[0];

  const tfRows = await Promise.all(
    TIMEFRAMES.map(async (tf) => {
      try {
        const { candles } = await fetchLiveTokenData(
          token.address,
          tf.label as "1h" | "4h" | "1d",
          primary?.pairAddress
        );
        const closes = candles.map((c) => c.c);
        const volumes = candles.map((c) => c.v);
        const analysis = analyzeTimeframe(closes, volumes);
        const latest = candles.at(-1);
        return { tf, analysis, latest };
      } catch {
        return { tf, analysis: null, latest: null };
      }
    })
  );
  const oneDay = tfRows.find((r) => r.tf.type === "1D");
  const trendUp = Number(primary?.priceChange?.h24 ?? 0) >= 0;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <section className="mb-5 flex flex-wrap gap-2">
          {TOKENS.map((t) => (
            <Link
              key={t.symbol}
              href={`/symbol/${t.symbol}`}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition ${
                t.symbol === symbol
                  ? "border-green-500 bg-[#0a0a0a] text-green-400"
                  : "border-green-900/60 bg-[#0a0a0a] text-zinc-300 hover:border-green-600 hover:text-green-400"
              }`}
            >
              {tokenMeta[t.symbol]?.logo ? (
                <Image
                  src={tokenMeta[t.symbol]!.logo!}
                  alt={`${t.symbol} logo`}
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] rounded-full object-cover"
                />
              ) : null}
              {t.symbol}
            </Link>
          ))}
        </section>

        <div className="mb-6 flex flex-col gap-4 border-b border-green-900/60 pb-6">
          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-green-400"
          >
            ← Back to dashboard
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="flex items-center gap-4">
              {meta.logo ? (
                <Image
                  src={meta.logo}
                  alt={`${symbol} logo`}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 text-sm font-semibold">
                  {symbol.slice(0, 3)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-semibold tracking-tight">{symbol}</h1>
                  <span className="rounded-full border border-green-700 bg-green-900/20 px-2.5 py-1 text-xs font-medium text-green-400">
                    Live
                  </span>
                </div>
                <p className="text-sm text-zinc-400">
                  {meta.name} · {token.address}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <div className="text-3xl font-semibold">{formatUsd(Number(primary?.priceUsd ?? 0), 6)}</div>
              <div className={`text-sm font-medium ${trendUp ? "text-emerald-400" : "text-rose-400"}`}>
                {formatPercent(Number(primary?.priceChange?.h24 ?? 0))} 24h
              </div>
            </div>
          </div>

          <p className="max-w-3xl text-sm text-zinc-300">{meta.description}</p>
        </div>

        <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
          <StatCard label="Market Cap" value={formatCompactUsd(Number(primary?.marketCap ?? 0))} />
          <StatCard label="24h Volume" value={formatCompactUsd(Number(primary?.volume?.h24 ?? 0))} />
          <StatCard label="Liquidity" value={formatCompactUsd(Number(primary?.liquidity?.usd ?? 0))} />
          <StatCard label="FDV" value={formatCompactUsd(Number(primary?.fdv ?? 0))} />
          <StatCard label="Holders" value="N/A" />
          <StatCard
            label="24h Trades"
            value={formatNumber(
              Number(primary?.txns?.h24?.buys ?? 0) + Number(primary?.txns?.h24?.sells ?? 0)
            )}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-3xl border border-green-900/70 bg-[#0a0a0a] p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Price chart</h2>
                <p className="text-sm text-zinc-400">Live chart integration can be plugged in here.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {TIMEFRAMES.map((tf) => (
                  <span
                    key={tf.type}
                    className={`rounded-xl px-3 py-2 text-sm font-medium ${
                      tf.type === "1D"
                        ? "bg-green-500/15 border border-green-600 text-green-300"
                        : "bg-black text-zinc-300 border border-green-900/60"
                    }`}
                  >
                    {tf.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative h-[320px] overflow-hidden rounded-2xl border border-green-900/60 bg-black md:h-[420px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
              <div className="relative z-10 h-full w-full">
                <TradingViewChart symbol={symbol} />
              </div>

              <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 border-t border-green-900/60 bg-black/60">
                <MiniMetric label="Open" value={formatUsd(oneDay?.latest?.o ?? null, 6)} />
                <MiniMetric label="High" value={formatUsd(oneDay?.latest?.h ?? null, 6)} />
                <MiniMetric label="Low" value={formatUsd(oneDay?.latest?.l ?? null, 6)} />
                <MiniMetric label="Close" value={formatUsd(oneDay?.latest?.c ?? null, 6)} />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <Panel title="Quick stats">
              <KeyValue label="Mint" value={truncate(token.address)} />
              <KeyValue label="Rank" value="N/A" />
              <KeyValue
                label="Vol / MCap"
                value={
                  primary?.volume?.h24 && primary?.marketCap
                    ? `${((primary.volume.h24 / primary.marketCap) * 100).toFixed(2)}%`
                    : "N/A"
                }
              />
              <KeyValue label="Score (1D)" value={oneDay?.analysis ? String(oneDay.analysis.score) : "N/A"} />
              <KeyValue label="RSI (1D)" value={oneDay?.analysis ? String(oneDay.analysis.rsi14) : "N/A"} />
              <KeyValue label="Trend" value={oneDay?.analysis?.trend ?? "N/A"} />
            </Panel>

            <Panel title="Top pools">
              <div className="space-y-3">
                {solanaPairs.slice(0, 3).map((pool) => (
                  <div
                    key={pool.pairAddress}
                    className="rounded-2xl border border-green-900/60 bg-black p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {pool.baseToken?.symbol ?? "BASE"}/{pool.quoteToken?.symbol ?? "QUOTE"}
                      </div>
                      <div className="text-xs text-zinc-400">{pool.dexId ?? "dex"}</div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-zinc-400">
                      <span>Liq: {formatCompactUsd(Number(pool.liquidity?.usd ?? 0))}</span>
                      <span>Vol: {formatCompactUsd(Number(pool.volume?.h24 ?? 0))}</span>
                    </div>
                  </div>
                ))}
                {solanaPairs.length === 0 && (
                  <p className="text-sm text-zinc-400">No pool data available right now.</p>
                )}
              </div>
            </Panel>

            <Panel title="Actions">
              <div className="grid gap-3">
                <a
                  href={`https://solscan.io/token/${token.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-green-900/60 bg-black px-4 py-3 font-medium transition hover:border-green-600 hover:text-green-400"
                >
                  View token on Solscan
                </a>
                {primary?.pairAddress ? (
                  <a
                    href={`https://dexscreener.com/solana/${primary.pairAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-green-900/60 bg-black px-4 py-3 font-medium transition hover:border-green-600 hover:text-green-400"
                  >
                    Open pair on DexScreener
                  </a>
                ) : null}
              </div>
            </Panel>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Timeframe diagnostics">
            <div className="overflow-hidden rounded-2xl border border-green-900/60">
              <div className="grid grid-cols-5 bg-[#0a0a0a] px-4 py-3 text-xs uppercase tracking-wide text-zinc-400">
                <span>TF</span>
                <span>Score</span>
                <span>Trend</span>
                <span>RSI</span>
                <span className="text-right">EMA9 / EMA21</span>
              </div>
              {tfRows.map((row) => (
                <div
                  key={row.tf.type}
                  className="grid grid-cols-5 border-t border-green-900/50 px-4 py-3 text-sm"
                >
                  <span className="text-zinc-400">{row.tf.label}</span>
                  <span>{row.analysis?.score ?? "N/A"}</span>
                  <span className="capitalize">{row.analysis?.trend ?? "N/A"}</span>
                  <span>{row.analysis?.rsi14 ?? "N/A"}</span>
                  <span className="text-right">
                    {row.analysis ? `${row.analysis.ema9.toFixed(4)} / ${row.analysis.ema21.toFixed(4)}` : "N/A"}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="About">
            <div className="space-y-4 text-sm text-zinc-400">
              <p>Price, liquidity, volume, FDV, and pools are live from DexScreener.</p>
              <p>
                Timeframe RSI/EMA values are computed from GeckoTerminal OHLCV via your existing market data service.
              </p>
            </div>
          </Panel>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-green-900/60 bg-[#0a0a0a] p-4">
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-green-900/70 bg-[#0a0a0a] p-4 md:p-5">
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-green-900/40 py-2 text-sm last:border-b-0">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function truncate(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-6)}`;
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatUsd(value: number | null, decimals = 2) {
  if (value === null || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatCompactUsd(value: number) {
  if (!value || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  if (!value || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}
