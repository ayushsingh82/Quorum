import { WATCHED_TOKENS } from "./tokens";

const DEXSCREENER_SEARCH = "https://api.dexscreener.com/latest/dex/search";

export type SearchHit = {
  symbol: string;
  address: string;
  name: string;
  priceUsd: number;
  liquidityUsd: number;
  volume24h: number;
  change24h: number;
  pairAddress: string;
  dex: string;
  source: "watchlist" | "dexscreener";
};

type DSPair = {
  chainId?: string;
  pairAddress?: string;
  dexId?: string;
  baseToken?: { address?: string; symbol?: string; name?: string };
  priceUsd?: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  priceChange?: { h24?: number };
};

export async function searchTokens(query: string, limit = 12): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const lower = q.toLowerCase();
  const local: SearchHit[] = WATCHED_TOKENS
    .filter(
      (t) =>
        t.symbol.toLowerCase().includes(lower) ||
        t.name.toLowerCase().includes(lower) ||
        t.address.toLowerCase() === lower,
    )
    .map((t) => ({
      symbol: t.symbol,
      address: t.address,
      name: t.name,
      priceUsd: 0,
      liquidityUsd: 0,
      volume24h: 0,
      change24h: 0,
      pairAddress: "",
      dex: "watchlist",
      source: "watchlist" as const,
    }));

  try {
    const res = await fetch(`${DEXSCREENER_SEARCH}?q=${encodeURIComponent(q)}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) return local.slice(0, limit);
    const json = await res.json();
    const pairs: DSPair[] = (json?.pairs ?? []).filter(
      (p: DSPair) => p.chainId === "solana" && p.baseToken?.address,
    );

    const seen = new Set<string>();
    const remote: SearchHit[] = [];
    for (const p of pairs) {
      const addr = p.baseToken!.address!;
      if (seen.has(addr)) continue;
      seen.add(addr);
      remote.push({
        symbol: (p.baseToken!.symbol ?? "—").toUpperCase(),
        address: addr,
        name: p.baseToken!.name ?? p.baseToken!.symbol ?? "—",
        priceUsd: Number(p.priceUsd ?? 0),
        liquidityUsd: Number(p.liquidity?.usd ?? 0),
        volume24h: Number(p.volume?.h24 ?? 0),
        change24h: Number(p.priceChange?.h24 ?? 0),
        pairAddress: p.pairAddress ?? "",
        dex: p.dexId ?? "—",
        source: "dexscreener" as const,
      });
    }
    remote.sort((a, b) => b.liquidityUsd - a.liquidityUsd);

    const merged: SearchHit[] = [];
    const usedAddresses = new Set<string>();
    for (const hit of local) {
      const matched = remote.find((r) => r.address === hit.address);
      if (matched) {
        merged.push({ ...matched, source: "watchlist" });
        usedAddresses.add(matched.address);
      } else {
        merged.push(hit);
      }
    }
    for (const r of remote) {
      if (!usedAddresses.has(r.address)) merged.push(r);
    }
    return merged.slice(0, limit);
  } catch {
    return local.slice(0, limit);
  }
}

export async function resolveToken(query: string): Promise<{
  symbol: string;
  address: string;
  name: string;
} | null> {
  const q = query.trim();
  if (!q) return null;
  const lower = q.toLowerCase();
  const local = WATCHED_TOKENS.find(
    (t) => t.symbol.toLowerCase() === lower || t.address.toLowerCase() === lower,
  );
  if (local) return { symbol: local.symbol, address: local.address, name: local.name };

  const hits = await searchTokens(q, 5);
  if (hits.length === 0) return null;
  const top = hits[0];
  return { symbol: top.symbol, address: top.address, name: top.name };
}
