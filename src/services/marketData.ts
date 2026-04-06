// src/services/marketData.ts

export interface Candle {
    unixTime: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
  }
  
  export interface TokenConfig {
    symbol: string;
    address: string;
    poolAddress?: string;
  }
  
  const GECKO_BASE = "https://api.geckoterminal.com/api/v2";
  const DEXSCREENER_BASE = "https://api.dexscreener.com/latest/dex";
  
  export async function resolvePoolFromDexScreener(tokenAddress: string) {
    const url = `${DEXSCREENER_BASE}/tokens/${tokenAddress}`;
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error(`DexScreener lookup failed: ${res.status}`);
    }
  
    const json = await res.json();
    const pairs = json?.pairs ?? [];
  
    if (!pairs.length) {
      throw new Error(`No pair found for token ${tokenAddress}`);
    }
  
    const solanaPairs = pairs
      .filter((p: any) => p.chainId === "solana")
      .sort((a: any, b: any) => (Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0)));
  
    if (!solanaPairs.length) {
      throw new Error(`No Solana pair found for token ${tokenAddress}`);
    }
  
    return {
      pairAddress: solanaPairs[0].pairAddress,
      dexId: solanaPairs[0].dexId,
      priceUsd: Number(solanaPairs[0].priceUsd ?? 0),
      liquidityUsd: Number(solanaPairs[0].liquidity?.usd ?? 0),
    };
  }
  
  function mapTimeframe(tf: "1h" | "4h" | "1d") {
    if (tf === "1h") return { timeframe: "minute", aggregate: 60 };
    if (tf === "4h") return { timeframe: "hour", aggregate: 4 };
    return { timeframe: "day", aggregate: 1 };
  }
  
  export async function fetchOHLCVFromGeckoTerminal(
    network: string,
    poolAddress: string,
    tf: "1h" | "4h" | "1d",
    limit = 120
  ): Promise<Candle[]> {
    const { timeframe, aggregate } = mapTimeframe(tf);
  
    const url =
      `${GECKO_BASE}/networks/${network}/pools/${poolAddress}/ohlcv/` +
      `${timeframe}?aggregate=${aggregate}&limit=${limit}&currency=usd&token=base`;
  
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error(`GeckoTerminal OHLCV failed: ${res.status}`);
    }
  
    const json = await res.json();
  
    const list =
      json?.data?.attributes?.ohlcv_list ??
      json?.data?.attributes?.ohlcvList ??
      [];
  
    if (!Array.isArray(list) || !list.length) {
      throw new Error(`No OHLCV data for pool ${poolAddress}`);
    }
  
    return list.map((row: any[]) => ({
      unixTime: Number(row[0]),
      o: Number(row[1]),
      h: Number(row[2]),
      l: Number(row[3]),
      c: Number(row[4]),
      v: Number(row[5] ?? 0),
    }));
  }
  
  export async function fetchLiveTokenData(
    tokenAddress: string,
    tf: "1h" | "4h" | "1d",
    existingPoolAddress?: string
  ) {
    const pool =
      existingPoolAddress
        ? { pairAddress: existingPoolAddress }
        : await resolvePoolFromDexScreener(tokenAddress);
  
    const candles = await fetchOHLCVFromGeckoTerminal(
      "solana",
      pool.pairAddress,
      tf,
      120
    );
  
    return {
      poolAddress: pool.pairAddress,
      candles,
    };
  }