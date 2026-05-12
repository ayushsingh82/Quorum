"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Dither from "./Dither";

type NavSection = { label: string; items: { href: string; label: string }[] };

const NAV: NavSection[] = [
  {
    label: "Council",
    items: [
      { href: "/dashboard", label: "Council Floor" },
      { href: "/reasoning", label: "Reasoning Log" },
      { href: "/agents", label: "Agents" },
    ],
  },
  {
    label: "Market",
    items: [
      { href: "/signals", label: "Signals" },
      { href: "/tokens", label: "Tokens" },
      { href: "/symbol/SOL", label: "Token Detail" },
      { href: "/alerts", label: "Alerts" },
    ],
  },
];

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Council Floor", subtitle: "Live verdict · per-agent votes · transcript" },
  "/reasoning": { title: "Reasoning Log", subtitle: "Every verdict, every transcript" },
  "/agents": { title: "Agents", subtitle: "Reputation, performance, weight" },
  "/tokens": { title: "Tokens", subtitle: "Solana ecosystem · live DexScreener feed" },
  "/alerts": { title: "Alert Stream", subtitle: "Council-driven triggers" },
  "/signals": { title: "Signals", subtitle: "Aggregate market overview" },
};

function resolveTitle(pathname: string | null) {
  if (!pathname) return { title: "Quorum", subtitle: "Solana agent council" };
  if (pathname.startsWith("/symbol/")) {
    const sym = pathname.split("/")[2] ?? "Token";
    return { title: `Token · ${sym.toUpperCase()}`, subtitle: "Live pair + multi-timeframe analysis" };
  }
  if (pathname.startsWith("/token/")) {
    const sym = pathname.split("/")[2] ?? "Token";
    return { title: `Token · ${sym.toUpperCase()}`, subtitle: "Redirecting…" };
  }
  return TITLES[pathname] ?? { title: "Quorum", subtitle: "Solana agent council" };
}

export default function QuorumShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { title, subtitle } = resolveTitle(pathname);

  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-zinc-900 bg-[#050505] lg:flex">
        <Link href="/" className="block border-b border-zinc-900 px-6 py-6">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center border border-emerald-500/60 bg-black/50 font-mono text-sm font-semibold text-emerald-300">
              Q
            </span>
            <span className="font-mono text-sm font-semibold tracking-[0.28em] text-emerald-300">
              QUORUM
            </span>
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Solana agent council
          </p>
        </Link>
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {NAV.map((sec) => (
            <div key={sec.label} className="mb-5">
              <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
                {sec.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {sec.items.map((n) => {
                  const active =
                    pathname === n.href ||
                    (n.href !== "/" && pathname?.startsWith(n.href + "/"));
                  return (
                    <Link
                      key={n.href}
                      href={n.href}
                      className={`border px-4 py-2.5 text-sm transition ${
                        active
                          ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-900 bg-black text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300"
                      }`}
                    >
                      {n.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-zinc-900 px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-zinc-600">
          v0.1 · council ready
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="relative z-20 overflow-hidden border-b border-zinc-900">
          <div className="absolute inset-0 opacity-80">
            <Dither
              waveColor={[0.2, 0.85, 0.45]}
              disableAnimation={false}
              enableMouseInteraction={false}
              colorNum={4}
              waveAmplitude={0.42}
              waveFrequency={3.4}
              waveSpeed={0.12}
            />
          </div>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-emerald-400">
                {subtitle}
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-2 border border-emerald-500/40 bg-black/70 px-3 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300">
                LIVE
              </span>
            </div>
          </div>
        </header>

        <div className="px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
