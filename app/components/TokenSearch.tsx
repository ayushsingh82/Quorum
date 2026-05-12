"use client";

import { useEffect, useRef, useState } from "react";
import type { SearchHit } from "@/lib/quorum/search";

export default function TokenSearch({
  onSelect,
  placeholder = "Search any Solana token by symbol, name, or mint…",
  className = "",
}: {
  onSelect: (hit: { symbol: string; address: string; name?: string }) => void;
  placeholder?: string;
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const tid = useRef<number | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (tid.current) window.clearTimeout(tid.current);
    if (!query || query.length < 1) {
      setHits([]);
      return;
    }
    tid.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/quorum/search?q=${encodeURIComponent(query)}&limit=10`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json?.ok) {
          setHits(json.data as SearchHit[]);
          setOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      if (tid.current) window.clearTimeout(tid.current);
    };
  }, [query]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onFocus={() => hits.length > 0 && setOpen(true)}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-zinc-800 bg-black px-4 py-2.5 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-500/70"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto border border-zinc-800 bg-[#070707] shadow-lg">
          {loading && (
            <div className="px-4 py-3 font-mono text-xs text-zinc-500">searching…</div>
          )}
          {!loading && hits.length === 0 && (
            <div className="px-4 py-3 font-mono text-xs text-zinc-500">
              no Solana tokens matched
            </div>
          )}
          {hits.map((h) => (
            <button
              key={`${h.address}-${h.pairAddress}`}
              onClick={() => {
                onSelect({ symbol: h.symbol, address: h.address, name: h.name });
                setOpen(false);
                setQuery("");
              }}
              className="flex w-full items-center justify-between gap-3 border-b border-zinc-900 px-4 py-3 text-left transition hover:bg-emerald-500/10"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-emerald-300">
                    {h.symbol}
                  </span>
                  <span className="text-xs text-zinc-400">{h.name}</span>
                  {h.source === "watchlist" && (
                    <span className="border border-emerald-500/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-300">
                      tracked
                    </span>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-zinc-500">
                  {h.address.slice(0, 8)}…{h.address.slice(-6)} · {h.dex}
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-zinc-200">
                  {h.priceUsd > 0 ? `$${h.priceUsd.toLocaleString(undefined, { maximumFractionDigits: 6 })}` : "—"}
                </div>
                <div
                  className={
                    h.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                  }
                >
                  {h.change24h ? `${h.change24h >= 0 ? "+" : ""}${h.change24h.toFixed(2)}%` : "—"}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
