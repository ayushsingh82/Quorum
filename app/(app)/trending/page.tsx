"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLiveData, formatCurrency, formatPct } from "@/lib/quorum/useLiveData";
import type { TrendingHit } from "@/lib/quorum/trending";

export default function TrendingPage() {
  const trending = useLiveData<TrendingHit[]>("/api/quorum/trending?limit=12", 30000);

  const list = trending.data ?? [];

  const stats = useMemo(() => {
    const greens = list.filter((t) => t.change24h > 0).length;
    const liq = list.reduce((a, b) => a + b.liquidity, 0);
    const vol = list.reduce((a, b) => a + b.volume24h, 0);
    return { greens, liq, vol };
  }, [list]);

  return (
    <div className="space-y-6">
      <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
          Discovery feed
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Boosted Solana tokens · outside the watchlist
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
          Pulled live from DexScreener&apos;s token-boost rails. These are
          tokens the market is currently paying to surface — fresh listings,
          new memes, mid-cap rotations. Convene the swarm to get a verdict on
          anything that catches your eye.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Surfaced now
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-emerald-300">
            {list.length}
          </h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Up 24h
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            {stats.greens}
            <span className="text-base text-zinc-500"> / {list.length}</span>
          </h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Combined Liquidity
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            ${(stats.liq / 1e6).toFixed(2)}M
          </h3>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => (
          <article
            key={t.address}
            className="group border border-zinc-800 bg-[#0a0a0a] p-5 transition hover:border-emerald-500/60"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-xl font-bold text-emerald-300">
                    {t.symbol}
                  </h4>
                  <span className="border border-zinc-800 bg-black px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400">
                    boost {t.boost.toFixed(0)}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-zinc-500">{t.name}</p>
                <p className="mt-1 font-mono text-[10px] text-zinc-600">
                  {t.address.slice(0, 6)}…{t.address.slice(-6)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-zinc-100">
                  {formatCurrency(t.priceUsd)}
                </p>
                <p
                  className={`mt-0.5 text-xs font-medium ${
                    t.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatPct(t.change24h)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px]">
              <div className="border border-zinc-900 bg-black px-3 py-2">
                <p className="text-zinc-500">VOL 24H</p>
                <p className="mt-0.5 text-zinc-200">
                  ${(t.volume24h / 1e6).toFixed(2)}M
                </p>
              </div>
              <div className="border border-zinc-900 bg-black px-3 py-2">
                <p className="text-zinc-500">LIQUIDITY</p>
                <p className="mt-0.5 text-zinc-200">
                  ${(t.liquidity / 1e6).toFixed(2)}M
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href={`https://dexscreener.com/solana/${t.address}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 border border-zinc-800 bg-black px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
              >
                DexScreener ↗
              </a>
              <Link
                href={`/dashboard?address=${t.address}`}
                className="flex-1 border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Convene
              </Link>
            </div>
          </article>
        ))}
        {trending.status !== "ready" && list.length === 0 && (
          <div className="col-span-full border border-zinc-900 bg-black px-4 py-12 text-center text-xs text-zinc-500">
            Loading boosted Solana tokens…
          </div>
        )}
        {trending.status === "ready" && list.length === 0 && (
          <div className="col-span-full border border-zinc-900 bg-black px-4 py-12 text-center text-xs text-zinc-500">
            No boosted Solana tokens returned right now. Try again in a
            minute.
          </div>
        )}
      </section>
    </div>
  );
}
