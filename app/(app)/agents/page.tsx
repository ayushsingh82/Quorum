"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLiveData } from "@/lib/quorum/useLiveData";
import type { AgentReputation } from "@/lib/quorum/types";

const ACCENT = "#22c55e";

const DESCRIPTIONS: Record<string, string> = {
  chart: "Reads 1H candles for RSI14 + EMA9 / EMA21 confluence. Flags overheated zones.",
  liquidity: "Inspects DexScreener pair depth, turnover ratio, and FDV-to-volume sanity.",
  momentum: "Tracks 1H + 24H price drift to spot continuation or exhaustion.",
  risk: "Computes realized volatility + drawdown envelope. Owns the risk gate.",
  flow: "Volume / FDV turnover as fresh-demand proxy. Spots rotation and distribution.",
};

export default function AgentsPage() {
  const agents = useLiveData<AgentReputation[]>("/api/quorum/agents", 20000);
  const list = agents.data ?? [];

  const weightChart = useMemo(
    () =>
      list.map((a) => ({
        name: a.name.replace(" Agent", ""),
        weight: Number(a.weight.toFixed(2)),
        accuracy:
          a.totalCalls > 0 ? Math.round((a.correctCalls / a.totalCalls) * 100) : 0,
      })),
    [list],
  );

  const radarData = useMemo(
    () =>
      list.map((a) => ({
        agent: a.name.replace(" Agent", ""),
        Weight: Math.round(a.weight * 80),
        Accuracy:
          a.totalCalls > 0 ? Math.round((a.correctCalls / a.totalCalls) * 100) : 0,
        PnL: Math.max(0, Math.round(a.rollingPnl * 4 + 40)),
        Activity: Math.min(100, Math.round(a.totalCalls / 2.5)),
      })),
    [list],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Council size
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-emerald-300">{list.length}</h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Top weight
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            ×{list[0] ? list[0].weight.toFixed(2) : "—"}
          </h3>
          <p className="mt-2 text-xs text-zinc-400">
            {list[0]?.name ?? "loading…"}
          </p>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Mean accuracy
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            {list.length
              ? Math.round(
                  list.reduce(
                    (a, b) => a + (b.totalCalls ? (b.correctCalls / b.totalCalls) * 100 : 0),
                    0,
                  ) / list.length,
                )
              : "—"}
            %
          </h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Combined PnL
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-emerald-300">
            {list.length
              ? `${list.reduce((a, b) => a + b.rollingPnl, 0).toFixed(1)}%`
              : "—"}
          </h3>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Reputation weights
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Higher = more sway in next verdict
          </h3>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightChart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#1c1c1c" vertical={false} />
                <XAxis
                  dataKey="name"
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
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#a3a3a3" }} />
                <Bar dataKey="weight" name="Weight" fill={ACCENT} radius={[2, 2, 0, 0]}>
                  {weightChart.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#4ade80" : ACCENT} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Multi-axis profile
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Weight · Accuracy · PnL · Activity
          </h3>
          <div className="mt-5 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius={90}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis
                  dataKey="agent"
                  stroke="#a3a3a3"
                  tick={{ fontSize: 10 }}
                />
                <PolarRadiusAxis stroke="#1f1f23" tick={{ fontSize: 9, fill: "#52525b" }} />
                <Radar name="Weight" dataKey="Weight" stroke={ACCENT} fill={ACCENT} fillOpacity={0.18} />
                <Radar name="Accuracy" dataKey="Accuracy" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} />
                <Radar name="PnL" dataKey="PnL" stroke="#a855f7" fill="#a855f7" fillOpacity={0.12} />
                <Tooltip
                  contentStyle={{
                    background: "#070707",
                    border: "1px solid #18181b",
                    fontSize: 11,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#a3a3a3" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => {
          const acc =
            a.totalCalls > 0 ? Math.round((a.correctCalls / a.totalCalls) * 100) : 0;
          return (
            <article
              key={a.agent}
              className="border border-zinc-800 bg-[#0a0a0a] p-5 transition hover:border-emerald-500/60"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                    {a.agent.toUpperCase()}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-white">{a.name}</h4>
                </div>
                <span className="font-mono text-2xl font-bold text-emerald-300">
                  ×{a.weight.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-xs leading-6 text-zinc-400">
                {DESCRIPTIONS[a.agent] ?? "Specialist agent on the council."}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div className="border border-zinc-900 bg-black px-3 py-2">
                  <p className="text-zinc-500">ACC</p>
                  <p className="mt-0.5 text-zinc-200">{acc}%</p>
                </div>
                <div className="border border-zinc-900 bg-black px-3 py-2">
                  <p className="text-zinc-500">CALLS</p>
                  <p className="mt-0.5 text-zinc-200">{a.totalCalls}</p>
                </div>
                <div className="border border-zinc-900 bg-black px-3 py-2">
                  <p className="text-zinc-500">PNL</p>
                  <p
                    className={`mt-0.5 ${
                      a.rollingPnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {a.rollingPnl >= 0 ? "+" : ""}
                    {a.rollingPnl.toFixed(1)}%
                  </p>
                </div>
              </div>
            </article>
          );
        })}
        {list.length === 0 && (
          <div className="col-span-full border border-zinc-900 bg-black p-8 text-center text-xs text-zinc-500">
            Loading agent reputation…
          </div>
        )}
      </section>
    </div>
  );
}
