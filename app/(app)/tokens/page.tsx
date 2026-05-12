"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TokenSearch from "../../components/TokenSearch";
import { useLiveData, formatCurrency, formatPct } from "@/lib/quorum/useLiveData";
import { WATCHED_TOKENS, SECTORS } from "@/lib/quorum/tokens";
import type { TokenSummary } from "@/lib/quorum/types";

type Sort = "liquidity" | "change" | "volume" | "name";

export default function TokensPage() {
  const tokens = useLiveData<TokenSummary[]>("/api/quorum/tokens", 18000);
  const [sector, setSector] = useState<string>("ALL");
  const [sort, setSort] = useState<Sort>("liquidity");

  const sectorBySymbol = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of WATCHED_TOKENS) m.set(t.symbol, t.sector);
    return m;
  }, []);

  const nameBySymbol = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of WATCHED_TOKENS) m.set(t.symbol, t.name);
    return m;
  }, []);

  const filtered = useMemo(() => {
    const list = (tokens.data ?? []).slice();
    const withSector = list.map((t) => ({
      ...t,
      sector: sectorBySymbol.get(t.symbol) ?? "—",
      name: nameBySymbol.get(t.symbol) ?? t.symbol,
    }));
    const f =
      sector === "ALL"
        ? withSector
        : withSector.filter((t) => t.sector === sector);
    return f.sort((a, b) => {
      if (sort === "name") return a.symbol.localeCompare(b.symbol);
      if (sort === "change") return b.change24h - a.change24h;
      if (sort === "volume") return b.volume24h - a.volume24h;
      return b.liquidity - a.liquidity;
    });
  }, [tokens.data, sector, sort, sectorBySymbol, nameBySymbol]);

  const bullish = filtered.filter((t) => t.change24h > 0).length;
  const totalLiq = filtered.reduce((a, b) => a + b.liquidity, 0);
  const totalVol = filtered.reduce((a, b) => a + b.volume24h, 0);

  return (
    <div className="space-y-6">
      <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
          Search any Solana token
        </p>
        <h3 className="mt-1 text-base font-semibold text-white">
          DexScreener-powered. Type a symbol, name, or mint address.
        </h3>
        <div className="mt-4">
          <TokenSearch
            onSelect={(hit) => {
              window.location.href = `/symbol/${hit.symbol}`;
            }}
          />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Tokens shown
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{filtered.length}</h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Green / 24h
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-emerald-300">{bullish}</h3>
          <p className="mt-2 text-xs text-zinc-400">
            {filtered.length ? `${Math.round((bullish / filtered.length) * 100)}% bullish bias` : "—"}
          </p>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Aggregate Liquidity
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            ${(totalLiq / 1e6).toFixed(2)}M
          </h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Aggregate Vol 24h
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            ${(totalVol / 1e6).toFixed(2)}M
          </h3>
        </div>
      </section>

      <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSector("ALL")}
              className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                sector === "ALL"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-zinc-800 text-zinc-300 hover:border-emerald-500/40"
              }`}
            >
              All
            </button>
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                  sector === s
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-800 text-zinc-300 hover:border-emerald-500/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Sort by
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="border border-zinc-800 bg-black px-3 py-1.5 font-mono text-xs text-zinc-200 outline-none focus:border-emerald-500/70"
            >
              <option value="liquidity">Liquidity</option>
              <option value="volume">Volume 24h</option>
              <option value="change">24h Change</option>
              <option value="name">Symbol</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <article
            key={t.symbol}
            className="group border border-zinc-800 bg-[#0a0a0a] p-5 transition hover:border-emerald-500/60"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-bold text-emerald-300">{t.symbol}</h4>
                  <span className="border border-zinc-800 bg-black px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-400">
                    {t.sector}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">{t.name}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-zinc-100">
                  {formatCurrency(t.price)}
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
              <Link
                href={`/symbol/${t.symbol}`}
                className="flex-1 border border-zinc-800 bg-black px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
              >
                Detail
              </Link>
              <Link
                href={`/dashboard?symbol=${t.symbol}`}
                className="flex-1 border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/20"
              >
                Convene
              </Link>
            </div>
          </article>
        ))}
        {tokens.status !== "ready" && filtered.length === 0 && (
          <div className="col-span-full border border-zinc-900 bg-black px-4 py-12 text-center text-xs text-zinc-500">
            Loading token roster…
          </div>
        )}
      </section>
    </div>
  );
}
