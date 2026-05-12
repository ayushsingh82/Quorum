import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Quorum — Solana agent swarm",
  description:
    "Quorum is an agent swarm that debates and votes on Solana tokens. Specialist agents read live market state, cast independent votes, and resolve disagreement through a debate-or-vote mechanism — every dissent on an auditable transcript.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
