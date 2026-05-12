"use client";

import { useEffect, useRef, useState } from "react";

type Turn = {
  id: string;
  role: "user" | "coordinator";
  text: string;
  source?: string;
  ts: number;
};

const SUGGESTIONS = [
  "What did the swarm think about JUP today?",
  "Which agent has the best track record this session?",
  "Compare BONK and WIF — which one looks safer?",
  "Why did the council pick debate over vote on RENDER?",
  "Summarise the strongest BUY verdicts this session.",
];

export default function AskPage() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, loading]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;
    setInput("");
    const userTurn: Turn = {
      id: `u-${Date.now()}`,
      role: "user",
      text: q,
      ts: Date.now(),
    };
    setTurns((t) => [...t, userTurn]);
    setLoading(true);
    try {
      const res = await fetch("/api/quorum/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        cache: "no-store",
      });
      const json = await res.json();
      const text = json?.ok
        ? (json.data.answer as string)
        : `The coordinator could not respond (${json?.error ?? "unknown error"}).`;
      const reply: Turn = {
        id: `c-${Date.now()}`,
        role: "coordinator",
        text,
        source: json?.data?.source,
        ts: Date.now(),
      };
      setTurns((t) => [...t, reply]);
    } catch (e) {
      setTurns((t) => [
        ...t,
        {
          id: `c-${Date.now()}`,
          role: "coordinator",
          text: `Network error: ${e instanceof Error ? e.message : "unknown"}.`,
          ts: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <section className="flex h-[calc(100vh-9.5rem)] flex-col border border-zinc-800 bg-[#0a0a0a]">
        <div className="border-b border-zinc-900 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Ask the Coordinator
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            Natural-language Q&amp;A grounded in this session&apos;s verdicts
          </h3>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
          {turns.length === 0 && (
            <div className="rounded-none border border-dashed border-zinc-800 bg-black/40 p-6 text-sm text-zinc-400">
              The coordinator can answer about recent verdicts, agent
              reputation, mechanism choices, and the tracked Solana roster.
              Convene the swarm on the dashboard first if there&apos;s nothing
              to discuss yet.
            </div>
          )}

          <div className="space-y-4">
            {turns.map((t) => (
              <article
                key={t.id}
                className={
                  t.role === "user"
                    ? "ml-auto max-w-2xl border border-zinc-800 bg-black p-4 text-sm text-zinc-100"
                    : "max-w-3xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4 text-sm text-zinc-100"
                }
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
                  {t.role === "user" ? "You" : "Coordinator"}
                  {t.source ? ` · ${t.source}` : ""}
                </p>
                <p className="mt-2 whitespace-pre-wrap leading-7">{t.text}</p>
              </article>
            ))}
            {loading && (
              <article className="max-w-3xl border border-zinc-800 bg-black/60 p-4 text-sm text-zinc-300">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-emerald-400">
                  Coordinator
                </p>
                <p className="mt-2 leading-7">
                  <span className="inline-flex items-center gap-1">
                    Thinking
                    <span className="ml-1 inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:0.2s]" />
                    </span>
                  </span>
                </p>
              </article>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
          className="border-t border-zinc-900 px-5 py-4"
        >
          <div className="flex items-stretch gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the coordinator anything about the swarm…"
              disabled={loading}
              className="flex-1 border border-zinc-800 bg-black px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/70 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="border border-emerald-500/70 bg-emerald-500 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "…" : "Send"}
            </button>
          </div>
        </form>
      </section>

      <aside className="space-y-4">
        <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            Try asking
          </p>
          <ul className="mt-3 space-y-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  onClick={() => ask(s)}
                  disabled={loading}
                  className="w-full border border-zinc-900 bg-black px-3 py-2 text-left text-xs leading-5 text-zinc-200 transition hover:border-emerald-500/60 hover:text-emerald-300 disabled:opacity-50"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
            What the coordinator knows
          </p>
          <ul className="mt-3 space-y-1.5 text-xs leading-6 text-zinc-400">
            <li>· Recent verdicts in this session</li>
            <li>· Per-agent reputation + accuracy</li>
            <li>· Tracked Solana roster + sectors</li>
            <li>· Mechanism history (vote vs debate)</li>
          </ul>
          <p className="mt-4 border-l-2 border-emerald-500/40 bg-black/40 px-3 py-2 text-[11px] leading-5 text-zinc-400">
            Never gives investment advice. Surfaces what the agents concluded
            — nothing more.
          </p>
        </section>
      </aside>
    </div>
  );
}
