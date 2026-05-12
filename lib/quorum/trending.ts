import { fetchDexPair } from "./market";

const BOOSTS_TOP = "https://api.dexscreener.com/token-boosts/top/v1";
const BOOSTS_LATEST = "https://api.dexscreener.com/token-boosts/latest/v1";

type Boost = {
  chainId?: string;
  tokenAddress?: string;
  description?: string;
  amount?: number;
  totalAmount?: number;
  icon?: string;
};

export type TrendingHit = {
  symbol: string;
  name: string;
  address: string;
  priceUsd: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  boost: number;
};

async function fetchBoosts(url: string): Promise<Boost[]> {
  try {
    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
    if (!res.ok) return [];
    const json = (await res.json()) as Boost[] | { boosts?: Boost[] };
    if (Array.isArray(json)) return json;
    return json?.boosts ?? [];
  } catch {
    return [];
  }
}

export async function fetchTrending(limit = 12): Promise<TrendingHit[]> {
  const [top, latest] = await Promise.all([
    fetchBoosts(BOOSTS_TOP),
    fetchBoosts(BOOSTS_LATEST),
  ]);
  const seen = new Set<string>();
  const merged: Boost[] = [];
  for (const b of [...top, ...latest]) {
    if (b.chainId !== "solana" || !b.tokenAddress) continue;
    if (seen.has(b.tokenAddress)) continue;
    seen.add(b.tokenAddress);
    merged.push(b);
    if (merged.length >= limit + 4) break;
  }

  const hydrated = await Promise.all(
    merged.slice(0, limit).map(async (b): Promise<TrendingHit | null> => {
      const pair = await fetchDexPair(b.tokenAddress!);
      if (!pair) return null;
      const symbol = await guessSymbol(b.tokenAddress!);
      return {
        symbol: symbol.symbol,
        name: symbol.name || symbol.symbol,
        address: b.tokenAddress!,
        priceUsd: pair.priceUsd,
        change24h: pair.change24h,
        volume24h: pair.volume24h,
        liquidity: pair.liquidityUsd,
        boost: Number(b.totalAmount ?? b.amount ?? 0),
      };
    }),
  );

  return hydrated.filter((h): h is TrendingHit => h !== null);
}

async function guessSymbol(
  address: string,
): Promise<{ symbol: string; name: string }> {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { cache: "no-store", next: { revalidate: 0 } },
    );
    if (!res.ok) return { symbol: address.slice(0, 4), name: address.slice(0, 8) };
    const json = await res.json();
    const pair = (json?.pairs ?? []).find(
      (p: { chainId?: string }) => p.chainId === "solana",
    );
    const sym = pair?.baseToken?.symbol ?? address.slice(0, 4);
    const nm = pair?.baseToken?.name ?? sym;
    return { symbol: String(sym).toUpperCase(), name: String(nm) };
  } catch {
    return { symbol: address.slice(0, 4), name: address.slice(0, 8) };
  }
}
