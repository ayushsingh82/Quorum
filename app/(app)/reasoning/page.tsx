"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLiveData } from "@/lib/quorum/useLiveData";
import type { CouncilVerdict } from "@/lib/quorum/types";

const COLORS = {
  BUY: "#22c55e",
  HOLD: "#f59e0b",
  AVOID: "#f43f5e",
};

const SEED_TOKENS = ["SOL", "JUP", "JTO", "WIF", "BONK", "PYTH"];

export default function ReasoningPage() {
  const history = useLiveData<CouncilVerdict[]>("/api/quorum/history", 15000);
  const [seeding, setSeeding] = useState(false);

  async function seed() {
    if (seeding) return;
    setSeeding(true);
    try {
      await Promise.all(
        SEED_TOKENS.map((sym) =>
          fetch(`/api/quorum/council?symbol=${sym}`, { cache: "no-store" }),
        ),
      );
      history.refresh();
    } finally {
      setSeeding(false);
    }
  }

  useEffect(() => {
    if (history.status === "ready" && (history.data ?? []).length === 0 && !seeding) {
      void seed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.status]);

  const verdicts = history.data ?? [];

  const voteDist = useMemo(() => {
    const c = { BUY: 0, HOLD: 0, AVOID: 0 };
    for (const v of verdicts) c[v.verdict]++;
    return [
      { name: "BUY", value: c.BUY },
      { name: "HOLD", value: c.HOLD },
      { name: "AVOID", value: c.AVOID },
    ];
  }, [verdicts]);

  const mechanism = useMemo(() => {
    const c = { vote: 0, debate: 0 };
    for (const v of verdicts) c[v.mechanism]++;
    return [
      { name: "Vote", value: c.vote },
      { name: "Debate", value: c.debate },
    ];
  }, [verdicts]);

  const timeline = useMemo(() => {
    return verdicts
      .slice()
      .reverse()
      .map((v, i) => ({
        idx: i + 1,
        symbol: v.symbol,
        confidence: v.confidence,
        variance: v.varianceScore * 100,
        verdict: v.verdict,
      }));
  }, [verdicts]);

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3 border border-zinc-800 bg-[#0a0a0a] p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Verdict ledger
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            {verdicts.length} convening{verdicts.length === 1 ? "" : "s"} this session
          </h3>
        </div>
        <button
          onClick={seed}
          disabled={seeding}
          className="border border-emerald-500/60 bg-black px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
        >
          {seeding ? "Seeding…" : "Convene 6 tokens"}
        </button>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Confidence Timeline
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Verdict confidence + variance per convening
          </h3>
          <div className="mt-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#1c1c1c" vertical={false} />
                <XAxis
                  dataKey="symbol"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#070707",
                    border: "1px solid #18181b",
                    fontSize: 11,
                  }}
                  labelStyle={{ color: "#a3a3a3" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#a3a3a3" }} />
                <Bar dataKey="confidence" fill="#22c55e" name="Confidence">
                  {timeline.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.verdict as keyof typeof COLORS]} />
                  ))}
                </Bar>
                <Bar dataKey="variance" fill="#3f3f46" name="Variance × 100" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Vote distribution
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">BUY / HOLD / AVOID</h3>
          <div className="mt-5 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={voteDist}
                  innerRadius={48}
                  outerRadius={84}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                >
                  {voteDist.map((d) => (
                    <Cell key={d.name} fill={COLORS[d.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#070707",
                    border: "1px solid #18181b",
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#a3a3a3" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Mechanism split
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">Debate vs Vote</h3>
          <div className="mt-5 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mechanism} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#1c1c1c" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#070707",
                    border: "1px solid #18181b",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Latest verdicts
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Click a card to inspect the rationale
          </h3>
          <ul className="mt-5 space-y-2">
            {verdicts.slice(0, 8).map((v) => (
              <li
                key={`${v.symbol}-${v.generatedAt}`}
                className="border border-zinc-900 bg-black px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em]"
                      style={{
                        color: COLORS[v.verdict],
                        borderColor: `${COLORS[v.verdict]}66`,
                      }}
                    >
                      {v.verdict}
                    </span>
                    <p className="text-sm font-semibold text-white">{v.symbol}</p>
                    <p className="font-mono text-[10px] text-zinc-500">
                      conf {v.confidence} · var {v.varianceScore.toFixed(2)} ·{" "}
                      {v.mechanism}
                    </p>
                  </div>
                  <p className="font-mono text-[10px] text-zinc-500">
                    {new Date(v.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <p className="mt-2 text-xs leading-6 text-zinc-300">{v.rationale}</p>
              </li>
            ))}
            {verdicts.length === 0 && (
              <li className="border border-zinc-900 bg-black px-4 py-8 text-center text-xs text-zinc-500">
                No verdicts yet. Press &quot;Convene 6 tokens&quot; above.
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
