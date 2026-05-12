import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Quorum — Solana agent council",
  description:
    "Quorum is a multi-agent council that debates and votes on Solana tokens. Five specialist agents, reputation-weighted, with on-chain audit trail.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
