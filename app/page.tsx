import Link from "next/link";
import Dither from "./components/Dither";

const pillars = [
  { k: "Convene", v: "Five specialist agents read live Solana market state" },
  { k: "Deliberate", v: "Mechanism selector picks vote vs debate by variance" },
  { k: "Verify", v: "Every signal cited, every dissent logged in transcript" },
  { k: "Score", v: "Reputation-weighted — agents earn or lose weight per call" },
];

const agents = [
  { name: "Chart Agent", role: "RSI + EMA confluence on 1H candles" },
  { name: "Liquidity Agent", role: "Pool depth + turnover from DexScreener" },
  { name: "Momentum Agent", role: "1H and 24H price drift" },
  { name: "Risk Agent", role: "Realized volatility + drawdown envelope" },
  { name: "Flow Agent", role: "Turnover as % of FDV — fresh demand signal" },
];

const tokens = ["SOL", "JTO", "JUP", "PYTH", "WIF", "BONK", "RAY", "RENDER"];

const loopSteps = [
  { n: "01", t: "Ingest", d: "DexScreener pair · GeckoTerminal candles" },
  { n: "02", t: "Vote", d: "Five agents emit BUY · HOLD · AVOID" },
  { n: "03", t: "Select", d: "Variance > threshold → debate, else vote" },
  { n: "04", t: "Synthesize", d: "Coordinator (Qwen) writes the rationale" },
];

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <Dither
            waveColor={[0.2, 0.85, 0.45]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.5}
            colorNum={4}
            waveAmplitude={0.52}
            waveFrequency={4.2}
            waveSpeed={0.16}
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />

        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center border border-emerald-500/60 bg-black/50 font-mono text-sm font-semibold text-emerald-300">
              Q
            </span>
            <span className="font-mono text-sm font-semibold tracking-[0.32em] text-emerald-300">
              QUORUM
            </span>
          </div>
          <div className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.24em] text-zinc-300 md:flex">
            <Link href="/dashboard" className="hover:text-emerald-300">
              Dashboard
            </Link>
            <a href="#agents" className="hover:text-emerald-300">
              Agents
            </a>
            <a href="#flow" className="hover:text-emerald-300">
              Flow
            </a>
            <Link
              href="/dashboard"
              className="border border-emerald-500/70 bg-black/40 px-3 py-1.5 text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Open
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 py-16">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mx-auto mb-6 inline-block border border-emerald-500/60 bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-300">
              AgentSwarm · Multi-Agent Council · Solana
            </p>
            <h1 className="text-6xl font-black tracking-[0.12em] text-white sm:text-8xl">
              QUORUM
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-8 text-zinc-200 sm:text-lg">
              A swarm of five specialist agents debates and votes on Solana tokens.
              Mechanism selector picks{" "}
              <span className="text-emerald-300">debate</span> when they disagree,{" "}
              <span className="text-emerald-300">vote</span> when they don&apos;t —
              every signal cited, every dissent logged.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="relative inline-block bg-[#22c55e] px-8 py-4 text-base font-bold uppercase tracking-[0.16em] text-black transition duration-150 hover:bg-[#4ade80]"
              >
                Open Council Floor
              </Link>
              <Link
                href="/symbol/SOL"
                className="relative inline-block border border-emerald-500/70 bg-black/40 px-8 py-4 text-base font-bold uppercase tracking-[0.16em] text-emerald-300 transition hover:bg-emerald-500/10"
              >
                See a Verdict
              </Link>
            </div>

            <ul className="mx-auto mt-12 grid max-w-4xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((f) => (
                <li
                  key={f.k}
                  className="border border-zinc-800 bg-black/60 p-3 backdrop-blur-sm transition hover:border-emerald-500/60"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
                    {f.k}
                  </p>
                  <p className="mt-1 text-sm text-zinc-200">{f.v}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {tokens.map((t) => (
                <Link
                  key={t}
                  href={`/symbol/${t}`}
                  className="border border-zinc-800 bg-black/40 px-3 py-1.5 font-mono text-xs text-zinc-200 backdrop-blur-sm transition hover:border-emerald-500/60 hover:text-emerald-300"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="agents" className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
            01 · The Council
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Five specialists. One verdict. Always with receipts.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Each agent reads a different slice of the market and casts an
            independent vote. Reputation is earned over time — agents whose
            calls survive backtest get weighted more in future verdicts.
          </p>

          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((a, i) => (
              <div
                key={a.name}
                className="group border border-zinc-800 bg-[#0a0a0a] p-5 transition hover:border-emerald-500/60"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
                    Agent · {String(i + 1).padStart(2, "0")}
                  </p>
                  <span className="font-mono text-[10px] text-zinc-600">v1</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{a.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{a.role}</p>
              </div>
            ))}
            <div className="border border-emerald-500/40 bg-emerald-500/5 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
                Agent · 00
              </p>
              <h3 className="mt-3 text-lg font-semibold text-emerald-300">
                Coordinator
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Picks the mechanism, aggregates votes by reputation, narrates
                the verdict via Qwen.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
            02 · The Loop
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            From signal to verdict in one round trip.
          </h2>
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {loopSteps.map((s) => (
              <div key={s.n} className="border border-zinc-800 bg-[#0a0a0a] p-5">
                <p className="font-mono text-2xl font-bold text-emerald-400">{s.n}</p>
                <h3 className="mt-2 text-base font-semibold text-white">{s.t}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="relative overflow-hidden border border-emerald-500/40 bg-black p-10">
            <div className="absolute inset-0 opacity-60">
              <Dither
                waveColor={[0.2, 0.85, 0.45]}
                disableAnimation={false}
                enableMouseInteraction={false}
                colorNum={4}
                waveAmplitude={0.45}
                waveFrequency={3.6}
                waveSpeed={0.12}
              />
            </div>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
                03 · Walk into the room
              </p>
              <h3 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                Open the council floor and watch a verdict get made.
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                The dashboard streams live agent votes, the debate transcript,
                and the coordinator&apos;s synthesis — all from public APIs, no
                wallet required.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-block bg-emerald-500 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-emerald-400"
                >
                  Enter Dashboard
                </Link>
                <Link
                  href="/alerts"
                  className="inline-block border border-zinc-700 bg-black/60 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-emerald-500/60 hover:text-emerald-300"
                >
                  View Alerts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-zinc-500">
          <p>
            Quorum · built for <span className="text-emerald-400">AgentSwarm</span> · Solana
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-600">
            v0.1 · council ready
          </p>
        </div>
      </footer>
    </main>
  );
}
