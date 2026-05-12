export const WATCHED_TOKENS: { symbol: string; address: string }[] = [
  { symbol: "SOL", address: "So11111111111111111111111111111111111111112" },
  { symbol: "JTO", address: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL" },
  { symbol: "JUP", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  { symbol: "PYTH", address: "HZ1JovNiVvGrGNiiYvQwVdxQwQZo6X6n7f4D8nZr7M7" },
  { symbol: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { symbol: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { symbol: "RAY", address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { symbol: "RENDER", address: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof" },
];

export function findToken(symbol: string) {
  const s = symbol.toUpperCase();
  return WATCHED_TOKENS.find((t) => t.symbol === s);
}
