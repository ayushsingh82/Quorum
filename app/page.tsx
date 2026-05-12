import Link from "next/link";
import Dither from "./components/Dither";
import QuorumLogo from "./components/QuorumLogo";

const pillars = [
  { k: "Convene", v: "Type any Solana token. The swarm wakes up and reads it." },
  { k: "Deliberate", v: "Specialist agents vote. High variance triggers a debate." },
  { k: "Verify", v: "Every claim cites a number. Every dissent stays on the record." },
  { k: "Score", v: "Reputation tracks each agent. Good calls grow weight, bad calls shed it." },
];

const swarm = [
  { name: "Chart Agent", role: "RSI + EMA confluence on live 1H candles." },
  { name: "Liquidity Agent", role: "Pool depth, turnover, and FDV-to-volume sanity." },
  { name: "Momentum Agent", role: "1H and 24H drift — continuation vs exhaustion." },
  { name: "Risk Agent", role: "Realized volatility + drawdown envelope per regime." },
  { name: "Flow Agent", role: "Volume / FDV turnover — fresh demand vs distribution." },
];

const stats = [
  { k: "20+", v: "Solana tokens tracked" },
  { k: "8", v: "ecosystem sectors" },
  { k: "0", v: "wallets required" },
  { k: "∞", v: "verdicts auditable" },
];

const loopSteps = [
  { n: "01", t: "Ingest", d: "DexScreener pair · GeckoTerminal candles" },
  { n: "02", t: "Vote", d: "Each agent emits BUY · HOLD · AVOID with cited signals" },
  { n: "03", t: "Select", d: "Variance > threshold → debate, else vote" },
  { n: "04", t: "Synthesise", d: "Coordinator (Qwen) narrates the verdict" },
];

const tokens = ["SOL", "JTO", "JUP", "PYTH", "WIF", "BONK", "RAY", "RENDER"];

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
          <Link href="/" className="flex items-center gap-3">
            <QuorumLogo size={36} className="text-emerald-300" />
            <span className="font-mono text-sm font-semibold tracking-[0.32em] text-emerald-300">
              QUORUM
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.24em] text-zinc-300 md:flex">
            <Link href="/dashboard" className="hover:text-emerald-300">
              Dashboard
            </Link>
            <a href="#swarm" className="hover:text-emerald-300">
              The Swarm
            </a>
            <a href="#flow" className="hover:text-emerald-300">
              How It Runs
            </a>
            <Link
              href="/dashboard"
              className="border border-emerald-500/70 bg-black/40 px-3 py-1.5 text-emerald-300 transition hover:bg-emerald-500/10"
            >
              Open
            </Link>
          </div>
        </nav>

        <div className="relative z-10 flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 pb-16 pt-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mx-auto mb-6 inline-block border border-emerald-500/60 bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-300">
              AgentSwarm · Solana · Read-only by design
            </p>

            <div className="mb-6 flex items-center justify-center">
              <QuorumLogo size={88} className="text-emerald-300 drop-shadow-[0_0_40px_rgba(34,197,94,0.35)]" />
            </div>

            <h1 className="text-6xl font-black tracking-[0.12em] text-white sm:text-8xl">
              QUORUM
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-300/80">
              A swarm of specialists. One verdict. Always with receipts.
            </p>

            <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-8 text-zinc-200 sm:text-lg">
              Most crypto AI gives you one opinion. <span className="text-emerald-300">Quorum gives you a swarm.</span>{" "}
              Specialist agents read live Solana market state, cast independent
              votes, and resolve disagreement through a{" "}
              <span className="text-emerald-300">debate-or-vote</span> mechanism —
              every dissent on the transcript, every claim citing a number.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="relative inline-block bg-emerald-500 px-8 py-4 text-base font-bold uppercase tracking-[0.16em] text-black transition duration-150 hover:bg-emerald-400"
              >
                Convene the Swarm
              </Link>
              <Link
                href="/reasoning"
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
                  <p className="mt-1.5 text-sm text-zinc-200">{f.v}</p>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Live on
              </span>
              {tokens.map((t) => (
                <Link
                  key={t}
                  href={`/symbol/${t}`}
                  className="border border-zinc-800 bg-black/40 px-3 py-1.5 font-mono text-xs text-zinc-200 backdrop-blur-sm transition hover:border-emerald-500/60 hover:text-emerald-300"
                >
                  {t}
                </Link>
              ))}
              <Link
                href="/tokens"
                className="border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-300 transition hover:bg-emerald-500/20"
              >
                + 12 more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.k} className="border border-zinc-800 bg-[#0a0a0a] p-5 text-center">
                <p className="font-mono text-4xl font-black text-emerald-300">{s.k}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
            01 · Why a swarm
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            One agent guesses. A swarm reasons.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            A single model trained on a single signal is just a chart with a
            louder voice. Real research desks specialise — quant, flows,
            macro, risk — and the head trader arbitrates. Quorum rebuilds
            that desk as an agent swarm on Solana data.
          </p>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Single AI
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">One opinion</h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-400">
                <li>· No specialisation</li>
                <li>· No audit trail</li>
                <li>· No dissent</li>
              </ul>
            </div>
            <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                Indicator stack
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">Five charts</h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-400">
                <li>· You synthesise manually</li>
                <li>· No narrative</li>
                <li>· No memory</li>
              </ul>
            </div>
            <div className="border border-emerald-500/40 bg-emerald-500/5 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
                Quorum swarm
              </p>
              <h3 className="mt-3 text-lg font-semibold text-emerald-300">
                Specialists + transcript
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-300">
                <li>· Reputation per agent</li>
                <li>· Debate-or-vote mechanism</li>
                <li>· Every dissent on the record</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="swarm" className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
            02 · The Swarm
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-4xl">
            Named agents. Public track records. Honest disagreement.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
            Each agent in the swarm reads a different slice of the market and
            casts an independent vote. Reputation is earned over time —
            agents whose calls survive backtest get weighted more in the next
            verdict.
          </p>

          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {swarm.map((a, i) => (
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
              <h3 className="mt-3 text-lg font-semibold text-emerald-300">Coordinator</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Picks the mechanism, aggregates votes by reputation, narrates
                the verdict via Qwen, and writes the transcript.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
            03 · How it runs
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

          <div className="mt-10 border border-zinc-800 bg-[#0a0a0a] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
              Example verdict
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.18em] text-emerald-300">
                BUY
              </span>
              <span className="text-lg font-semibold text-white">JUP</span>
              <span className="font-mono text-xs text-zinc-500">
                conf 71 · variance 0.32 · vote
              </span>
            </div>
            <p className="mt-4 border-l-2 border-emerald-500/60 bg-black/40 px-4 py-3 text-sm leading-7 text-zinc-200">
              Council sides with Chart Agent at 78% confidence: EMA9 above
              EMA21, price above trend, RSI 61 in the healthy momentum zone.
              Four of five agents agreed; Risk Agent dissented on the 24h
              drawdown envelope — logged in the transcript.
            </p>
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
            <div className="relative z-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-emerald-400">
                  04 · Walk into the room
                </p>
                <h3 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                  Type a Solana token. Watch the swarm reason.
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
                  The dashboard streams live agent votes, the debate
                  transcript, and the coordinator&apos;s synthesis — all from
                  public APIs. No wallet, no signature, no fee.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-block bg-emerald-500 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-emerald-400"
                  >
                    Enter Dashboard
                  </Link>
                  <Link
                    href="/signals"
                    className="inline-block border border-zinc-700 bg-black/60 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-zinc-200 transition hover:border-emerald-500/60 hover:text-emerald-300"
                  >
                    View Market Signals
                  </Link>
                </div>
              </div>
              <QuorumLogo size={140} className="hidden text-emerald-300/80 md:block" />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-zinc-900 bg-black">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <QuorumLogo size={20} className="text-emerald-400" />
            <p>
              Quorum · built for <span className="text-emerald-400">AgentSwarm</span> · Solana
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-zinc-600">
            v0.1 · swarm ready
          </p>
        </div>
      </footer>
    </main>
  );
}
