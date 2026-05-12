"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QuorumShell from "../components/QuorumShell";
import {
  CouncilVerdictCard,
  AgentVotesPanel,
  TranscriptPanel,
} from "../components/CouncilCard";
import { useLiveData, formatCurrency, formatPct } from "@/lib/quorum/useLiveData";
import type {
  AgentReputation,
  CouncilVerdict,
  TokenSummary,
} from "@/lib/quorum/types";

export default function DashboardPage() {
  const tokens = useLiveData<TokenSummary[]>("/api/quorum/tokens", 12000);
  const agents = useLiveData<AgentReputation[]>("/api/quorum/agents", 30000);
  const [active, setActive] = useState<string>("SOL");
  const [verdict, setVerdict] = useState<CouncilVerdict | null>(null);
  const [loading, setLoading] = useState(false);

  async function convene(symbol: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/quorum/council?symbol=${symbol}`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (json?.ok) setVerdict(json.data as CouncilVerdict);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void convene(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const tokenList = tokens.data ?? [];
  const bullish =
    tokenList.filter((t) => t.change24h > 0).length;
  const total = tokenList.length;
  const subtitle = verdict
    ? `Verdict ${verdict.verdict} on ${verdict.symbol} · ${verdict.mechanism}`
    : "Quorum · live";

  return (
    <QuorumShell title="Council Floor" subtitle={subtitle}>
      <div className="space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Active Token
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-emerald-300">{active}</h3>
            <p className="mt-2 text-xs text-zinc-400">
              {verdict ? `${verdict.confidence}/100 confidence` : "convening…"}
            </p>
          </div>
          <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Market Bias
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {bullish}/{total || 0} green
            </h3>
            <p className="mt-2 text-xs text-zinc-400">
              {total ? `${Math.round((bullish / total) * 100)}% of watchlist up 24h` : "—"}
            </p>
          </div>
          <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Mechanism
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              {verdict?.mechanism === "debate" ? "Debate" : "Vote"}
            </h3>
            <p className="mt-2 text-xs text-zinc-400">
              variance {verdict ? verdict.varianceScore.toFixed(2) : "—"}
            </p>
          </div>
          <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
              Council Size
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">5 agents</h3>
            <p className="mt-2 text-xs text-zinc-400">
              reputation-weighted aggregation
            </p>
          </div>
        </section>

        <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
                Token Roster
              </p>
              <h3 className="mt-1 text-base font-semibold text-white">
                Click a token to convene the council
              </h3>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
              {tokens.status === "ready"
                ? `${tokens.source} · refreshed ${tokens.updatedAt ? new Date(tokens.updatedAt).toLocaleTimeString() : "—"}`
                : tokens.status}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tokenList.length === 0 && (
              <span className="border border-zinc-900 bg-black px-4 py-2 text-xs text-zinc-500">
                Loading watchlist…
              </span>
            )}
            {tokenList.map((t) => (
              <button
                key={t.symbol}
                onClick={() => setActive(t.symbol)}
                className={`border px-3 py-2 text-left font-mono text-xs transition ${
                  active === t.symbol
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-900 bg-black text-zinc-300 hover:border-emerald-500/60"
                }`}
              >
                <span className="block text-sm font-bold tracking-[0.06em]">{t.symbol}</span>
                <span className="block text-[10px] text-zinc-500">
                  {formatCurrency(t.price)} ·{" "}
                  <span className={t.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}>
                    {formatPct(t.change24h)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <CouncilVerdictCard verdict={verdict} loading={loading} onRun={() => convene(active)} />

        <AgentVotesPanel verdict={verdict} />

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <TranscriptPanel verdict={verdict} />
          <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
              Agent Leaderboard
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Reputation weights this epoch
            </h3>
            <ul className="mt-5 space-y-2">
              {(agents.data ?? []).map((a, i) => {
                const acc = a.totalCalls > 0 ? (a.correctCalls / a.totalCalls) * 100 : 0;
                return (
                  <li
                    key={a.agent}
                    className="flex items-center justify-between border border-zinc-900 bg-black px-4 py-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-zinc-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{a.name}</p>
                        <p className="font-mono text-[10px] text-zinc-500">
                          {acc.toFixed(0)}% acc · pnl{" "}
                          <span className={a.rollingPnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
                            {a.rollingPnl >= 0 ? "+" : ""}
                            {a.rollingPnl.toFixed(1)}%
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-emerald-300">
                      ×{a.weight.toFixed(2)}
                    </span>
                  </li>
                );
              })}
              {(!agents.data || agents.data.length === 0) && (
                <li className="border border-zinc-900 bg-black px-4 py-6 text-xs text-zinc-500">
                  Loading reputation…
                </li>
              )}
            </ul>
          </section>
        </div>

        <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
                Multi-Token Snapshot
              </p>
              <h3 className="mt-1 text-base font-semibold text-white">
                Live market state · DexScreener
              </h3>
            </div>
            <Link
              href={`/symbol/${active}`}
              className="border border-emerald-500/60 bg-black px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Open {active} →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-900 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-3 py-3 font-medium">Symbol</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">24h</th>
                  <th className="px-3 py-3 font-medium">Vol 24h</th>
                  <th className="px-3 py-3 font-medium">Liquidity</th>
                  <th className="px-3 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {tokenList.map((t) => (
                  <tr key={t.symbol} className="border-b border-zinc-900">
                    <td className="px-3 py-3 font-semibold text-emerald-300">{t.symbol}</td>
                    <td className="px-3 py-3 text-zinc-200">{formatCurrency(t.price)}</td>
                    <td
                      className={`px-3 py-3 ${t.change24h >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {formatPct(t.change24h)}
                    </td>
                    <td className="px-3 py-3 text-zinc-300">
                      ${Math.round(t.volume24h).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-zinc-300">
                      ${Math.round(t.liquidity).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => setActive(t.symbol)}
                        className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300 hover:border-emerald-500/60 hover:text-emerald-300"
                      >
                        Convene
                      </button>
                    </td>
                  </tr>
                ))}
                {tokenList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-xs text-zinc-500">
                      Loading…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </QuorumShell>
  );
}
