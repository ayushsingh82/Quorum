"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import Link from "next/link";
import { useLiveData } from "@/lib/quorum/useLiveData";
import { WATCHED_TOKENS, SECTORS } from "@/lib/quorum/tokens";
import type { CouncilVerdict, TokenSummary } from "@/lib/quorum/types";

const ACCENT = "#22c55e";
const SECTOR_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];
const VERDICT_COLOR = {
  BUY: "#22c55e",
  HOLD: "#f59e0b",
  AVOID: "#f43f5e",
};

export default function SignalsPage() {
  const tokens = useLiveData<TokenSummary[]>("/api/quorum/tokens", 18000);
  const history = useLiveData<CouncilVerdict[]>("/api/quorum/history", 20000);

  const sectorBySymbol = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of WATCHED_TOKENS) m.set(t.symbol, t.sector);
    return m;
  }, []);

  const list = tokens.data ?? [];
  const bullish = list.filter((t) => t.change24h > 0).length;
  const bearish = list.length - bullish;
  const totalLiq = list.reduce((a, b) => a + b.liquidity, 0);
  const totalVol = list.reduce((a, b) => a + b.volume24h, 0);

  const biasData = [
    { name: "Up 24h", value: bullish },
    { name: "Down 24h", value: bearish },
  ];

  const sectorAgg = useMemo(() => {
    const map = new Map<string, { liquidity: number; volume: number; count: number; change: number }>();
    for (const t of list) {
      const s = sectorBySymbol.get(t.symbol) ?? "—";
      const e = map.get(s) ?? { liquidity: 0, volume: 0, count: 0, change: 0 };
      e.liquidity += t.liquidity;
      e.volume += t.volume24h;
      e.change += t.change24h;
      e.count += 1;
      map.set(s, e);
    }
    return Array.from(map.entries()).map(([sector, e]) => ({
      sector,
      liquidity: Math.round(e.liquidity / 1e6),
      volume: Math.round(e.volume / 1e6),
      avgChange: e.count > 0 ? Number((e.change / e.count).toFixed(2)) : 0,
      count: e.count,
    }));
  }, [list, sectorBySymbol]);

  const sortedByChange = useMemo(
    () =>
      list
        .slice()
        .sort((a, b) => b.change24h - a.change24h)
        .map((t) => ({
          symbol: t.symbol,
          change: Number(t.change24h.toFixed(2)),
        })),
    [list],
  );

  const scatter = useMemo(
    () =>
      list.map((t) => ({
        symbol: t.symbol,
        liquidity: Math.round(t.liquidity / 1e6),
        volume: Math.round(t.volume24h / 1e6),
        change: t.change24h,
      })),
    [list],
  );

  const verdicts = history.data ?? [];
  const verdictTimeline = useMemo(
    () =>
      verdicts
        .slice()
        .reverse()
        .map((v, i) => ({
          idx: i + 1,
          symbol: v.symbol,
          confidence: v.confidence,
          verdict: v.verdict,
        })),
    [verdicts],
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Tracked tokens
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">{list.length}</h3>
          <p className="mt-2 text-xs text-zinc-400">across {SECTORS.length} sectors</p>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Bullish breadth
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-emerald-300">
            {list.length ? Math.round((bullish / list.length) * 100) : 0}%
          </h3>
          <p className="mt-2 text-xs text-zinc-400">
            {bullish} up · {bearish} down (24h)
          </p>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Aggregate Liq
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            ${(totalLiq / 1e6).toFixed(1)}M
          </h3>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            Aggregate Vol 24h
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">
            ${(totalVol / 1e6).toFixed(1)}M
          </h3>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Market bias
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">Up vs Down · 24h</h3>
          <div className="mt-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={biasData}
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={3}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f43f5e" />
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

        <div className="border border-zinc-800 bg-[#0a0a0a] p-5 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Sector breadth
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Liquidity ($M) and avg 24h change by sector
          </h3>
          <div className="mt-5 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorAgg} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#1c1c1c" vertical={false} />
                <XAxis
                  dataKey="sector"
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
                <Bar dataKey="liquidity" name="Liquidity $M" fill={ACCENT} radius={[2, 2, 0, 0]} />
                <Bar dataKey="volume" name="Volume $M" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            24h ranking
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Best to worst across the roster
          </h3>
          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedByChange}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#1c1c1c" vertical={false} />
                <XAxis
                  dataKey="symbol"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#070707",
                    border: "1px solid #18181b",
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="change" radius={[2, 2, 0, 0]}>
                  {sortedByChange.map((d, i) => (
                    <Cell key={i} fill={d.change >= 0 ? ACCENT : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Vol × Liquidity map
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Each dot is a Solana token · 24h change tints it
          </h3>
          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#1c1c1c" />
                <XAxis
                  type="number"
                  dataKey="liquidity"
                  name="Liquidity $M"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="volume"
                  name="Volume $M"
                  stroke="#52525b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <ZAxis type="number" dataKey="change" range={[40, 200]} />
                <Tooltip
                  cursor={{ stroke: "#27272a" }}
                  contentStyle={{
                    background: "#070707",
                    border: "1px solid #18181b",
                    fontSize: 11,
                  }}
                  formatter={(v: number, n: string) => [`${v}`, n]}
                  labelFormatter={(_, payload) =>
                    payload?.[0]?.payload?.symbol ?? ""
                  }
                />
                <Scatter data={scatter}>
                  {scatter.map((p, i) => (
                    <Cell key={i} fill={p.change >= 0 ? ACCENT : "#f43f5e"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
              Verdict pulse
            </p>
            <h3 className="mt-1 text-base font-semibold text-white">
              Session council activity · {verdicts.length} verdicts
            </h3>
          </div>
          <Link
            href="/reasoning"
            className="border border-emerald-500/60 bg-black px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/10"
          >
            Open ledger →
          </Link>
        </div>
        <div className="mt-5 h-[240px]">
          {verdictTimeline.length === 0 ? (
            <div className="grid h-full place-items-center border border-zinc-900 bg-black text-xs text-zinc-500">
              No verdicts yet this session. Open the Council Floor to convene.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={verdictTimeline}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="confArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ACCENT} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke={ACCENT}
                  fill="url(#confArea)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
          Sector roster
        </p>
        <h3 className="mt-1 text-base font-semibold text-white">
          Per-sector composition with average 24h change
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sectorAgg.map((s, i) => (
            <div key={s.sector} className="border border-zinc-900 bg-black p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2"
                    style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }}
                  />
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                    {s.sector}
                  </p>
                </div>
                <p className="font-mono text-[10px] text-zinc-500">{s.count} tokens</p>
              </div>
              <p
                className={`mt-3 text-2xl font-semibold ${
                  s.avgChange >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {s.avgChange >= 0 ? "+" : ""}
                {s.avgChange}%
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                ${s.liquidity}M liq · ${s.volume}M vol
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
