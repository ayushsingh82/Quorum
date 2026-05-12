export type WatchedToken = {
  symbol: string;
  address: string;
  name: string;
  sector: "L1" | "DeFi" | "Liquid Staking" | "Oracle" | "Meme" | "Infra" | "AI" | "Gaming";
};

export const WATCHED_TOKENS: WatchedToken[] = [
  { symbol: "SOL", address: "So11111111111111111111111111111111111111112", name: "Solana", sector: "L1" },
  { symbol: "JTO", address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL", name: "Jito", sector: "Liquid Staking" },
  { symbol: "JUP", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN", name: "Jupiter", sector: "DeFi" },
  { symbol: "PYTH", address: "HZ1JovNiVvGrGNiiYvQwVdxQwQZo6X6n7f4D8nZr7M7", name: "Pyth Network", sector: "Oracle" },
  { symbol: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm", name: "dogwifhat", sector: "Meme" },
  { symbol: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", name: "Bonk", sector: "Meme" },
  { symbol: "RAY", address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", name: "Raydium", sector: "DeFi" },
  { symbol: "RENDER", address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof", name: "Render", sector: "AI" },
  { symbol: "ORCA", address: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE", name: "Orca", sector: "DeFi" },
  { symbol: "MNGO", address: "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac", name: "Mango", sector: "DeFi" },
  { symbol: "DRIFT", address: "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7", name: "Drift", sector: "DeFi" },
  { symbol: "HNT", address: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux", name: "Helium", sector: "Infra" },
  { symbol: "MPLX", address: "METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m", name: "Metaplex", sector: "Infra" },
  { symbol: "TNSR", address: "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6", name: "Tensor", sector: "Infra" },
  { symbol: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr", name: "Popcat", sector: "Meme" },
  { symbol: "JLP", address: "27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4", name: "Jupiter LP", sector: "DeFi" },
  { symbol: "GRASS", address: "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs", name: "Grass", sector: "AI" },
  { symbol: "IO", address: "BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K", name: "io.net", sector: "AI" },
  { symbol: "MEW", address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", name: "cat in a dogs world", sector: "Meme" },
  { symbol: "GOAT", address: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump", name: "Goatseus Maximus", sector: "Meme" },
];

export const SECTORS = ["L1", "DeFi", "Liquid Staking", "Oracle", "Meme", "Infra", "AI", "Gaming"] as const;

export function findToken(query: string): WatchedToken | undefined {
  if (!query) return undefined;
  const q = query.trim();
  if (q.length >= 32) {
    return WATCHED_TOKENS.find((t) => t.address === q);
  }
  const upper = q.toUpperCase();
  return WATCHED_TOKENS.find((t) => t.symbol === upper);
}
