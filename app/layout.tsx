// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "SolScreener",
  description: "AI-powered Solana market screener",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="min-h-screen bg-black">
          <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-green-900/60 bg-[#050505] lg:block">
            <div className="border-b border-green-900/60 px-6 py-6">
              <h1 className="text-2xl font-semibold tracking-wide text-green-400">
                SolScreener
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Solana market intelligence
              </p>
            </div>

            <nav className="flex flex-col gap-2 px-4 py-6 text-sm">
              <Link
                href="/dashboard"
                className="border border-green-900/70 bg-[#0a0a0a] px-4 py-3 text-zinc-200 transition hover:border-green-500 hover:text-green-400"
              >
                Dashboard
              </Link>
              <Link
                href="/alerts"
                className="border border-green-900/70 bg-[#0a0a0a] px-4 py-3 text-zinc-200 transition hover:border-green-500 hover:text-green-400"
              >
                Alerts
              </Link>
              <Link
                href="/symbol/SOL"
                className="border border-green-900/70 bg-[#0a0a0a] px-4 py-3 text-zinc-200 transition hover:border-green-500 hover:text-green-400"
              >
                Tokens
              </Link>
              <Link
                href="/package"
                className="border border-green-900/70 bg-[#0a0a0a] px-4 py-3 text-zinc-200 transition hover:border-green-500 hover:text-green-400"
              >
                NPM Package
              </Link>
            </nav>
          </aside>

          <main className="min-h-screen lg:ml-64">
            <header className="border-b border-green-900/60 bg-[#070707] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                 
                  <h2 className="text-lg font-medium text-white">
                    SolScreener - Best Trading Opportunities
                  </h2>
                </div>
                <div className="border border-green-900/70 bg-[#0b0b0b] px-4 py-2 text-sm text-green-400">
                  LIVE
                </div>
              </div>
            </header>

            <div className="px-6 py-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}