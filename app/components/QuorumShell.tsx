import Link from "next/link";
import type { ReactNode } from "react";
import Dither from "./Dither";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Council Floor" },
  { href: "/symbol/SOL", label: "Token Detail" },
  { href: "/alerts", label: "Alerts" },
  { href: "/package", label: "Plugin" },
];

export default function QuorumShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-zinc-900 bg-[#050505] lg:flex lg:flex-col">
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
        <nav className="flex flex-col gap-1.5 px-3 py-5 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="border border-zinc-900 bg-black px-4 py-3 text-zinc-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-zinc-900 px-6 py-4 text-[10px] uppercase tracking-[0.24em] text-zinc-600">
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
                {subtitle ?? "Quorum · live"}
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
