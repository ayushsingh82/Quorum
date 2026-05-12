"use client";

import type { CouncilVerdict } from "@/lib/quorum/types";

const toneFor = (v: "BUY" | "HOLD" | "AVOID") =>
  v === "BUY"
    ? "text-emerald-300 border-emerald-500/60 bg-emerald-500/10"
    : v === "AVOID"
      ? "text-rose-300 border-rose-500/60 bg-rose-500/10"
      : "text-amber-200 border-amber-400/50 bg-amber-400/10";

export function CouncilVerdictCard({
  verdict,
  loading,
  onRun,
}: {
  verdict: CouncilVerdict | null;
  loading: boolean;
  onRun: () => void;
}) {
  return (
    <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Council Verdict
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {verdict?.symbol ?? "—"}
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            {verdict
              ? `${verdict.mechanism.toUpperCase()} · variance ${verdict.varianceScore.toFixed(2)} · source ${verdict.source}`
              : "Not convened yet"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {verdict && (
            <span
              className={`border px-4 py-2 font-mono text-lg font-bold uppercase tracking-[0.16em] ${toneFor(verdict.verdict)}`}
            >
              {verdict.verdict}
            </span>
          )}
          <button
            onClick={onRun}
            disabled={loading}
            className="border border-emerald-500/70 bg-black px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
          >
            {loading ? "Convening…" : "Re-convene"}
          </button>
        </div>
      </div>

      {verdict && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="border border-zinc-900 bg-black p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Confidence
              </p>
              <p className="mt-2 text-2xl font-semibold text-emerald-300">
                {verdict.confidence}
                <span className="text-sm text-zinc-500">/100</span>
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Mechanism
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {verdict.mechanism === "debate" ? "Debate triggered" : "Direct vote"}
              </p>
            </div>
            <div className="border border-zinc-900 bg-black p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Voters
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {verdict.agents.length} agents
              </p>
            </div>
          </div>
          <p className="mt-5 border-l-2 border-emerald-500/60 bg-black/40 px-4 py-3 text-sm leading-7 text-zinc-200">
            {verdict.rationale}
          </p>
        </>
      )}
    </section>
  );
}

export function AgentVotesPanel({ verdict }: { verdict: CouncilVerdict | null }) {
  return (
    <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
        Agent Votes
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">Five specialists, five reads</h3>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {(verdict?.agents ?? []).map((a) => (
          <article
            key={a.agent}
            className="border border-zinc-900 bg-black p-4 transition hover:border-emerald-500/60"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400">
                {a.name}
              </p>
              <span
                className={`border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${toneFor(a.vote)}`}
              >
                {a.vote}
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-300">{a.reason}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.signals.map((s) => (
                <span
                  key={s.label}
                  className="border border-zinc-900 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                >
                  {s.label} <span className="text-zinc-200">{s.value}</span>
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-zinc-500">
              <span>conf {a.confidence}</span>
              <span>w {a.weight.toFixed(2)}</span>
            </div>
          </article>
        ))}
        {!verdict && (
          <div className="border border-zinc-900 bg-black p-6 text-xs text-zinc-500 md:col-span-2 xl:col-span-5">
            Awaiting first convening…
          </div>
        )}
      </div>
    </section>
  );
}

export function TranscriptPanel({ verdict }: { verdict: CouncilVerdict | null }) {
  return (
    <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
        Debate Transcript
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">
        Receipts for every dissent
      </h3>

      <ol className="mt-5 space-y-2">
        {(verdict?.transcript ?? []).map((t, i) => (
          <li
            key={i}
            className="border border-zinc-900 bg-black px-4 py-3 text-xs leading-6"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
              {String(i + 1).padStart(2, "0")} · {t.speaker}
            </span>
            <p className="mt-1 text-zinc-200">{t.line}</p>
          </li>
        ))}
        {!verdict && (
          <li className="border border-zinc-900 bg-black px-4 py-6 text-xs text-zinc-500">
            Transcript appears here after the council convenes.
          </li>
        )}
      </ol>
    </section>
  );
}
