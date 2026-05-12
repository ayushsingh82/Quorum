import type { AgentId, AgentVote, Candle, CouncilVote } from "./types";
import { ema, rsi, realizedVolatility, type DexPair } from "./market";
import { getReputation, bumpActivity } from "./reputation";

type Context = {
  pair: DexPair | null;
  candles: Candle[];
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function vote(
  id: AgentId,
  v: CouncilVote,
  confidence: number,
  reason: string,
  signals: { label: string; value: string }[],
): AgentVote {
  const rep = getReputation(id);
  bumpActivity(id);
  return {
    agent: id,
    name: rep.name,
    vote: v,
    confidence: clamp(Math.round(confidence), 30, 96),
    weight: rep.weight,
    reason,
    signals,
  };
}

export function chartAgent(ctx: Context): AgentVote {
  const closes = ctx.candles.map((c) => c.c);
  if (closes.length < 25) {
    return vote("chart", "HOLD", 45, "Not enough candle history to read structure confidently.", [
      { label: "candles", value: String(closes.length) },
    ]);
  }
  const ema9 = ema(closes, 9).at(-1)!;
  const ema21 = ema(closes, 21).at(-1)!;
  const r = rsi(closes, 14);
  const last = closes.at(-1)!;
  const signals = [
    { label: "RSI14", value: r.toFixed(1) },
    { label: "EMA9", value: ema9.toFixed(4) },
    { label: "EMA21", value: ema21.toFixed(4) },
  ];
  if (ema9 > ema21 && last > ema21 && r >= 50 && r <= 68) {
    return vote("chart", "BUY", 70 + (r > 58 ? 8 : 0),
      `EMA9 > EMA21, price above trend, RSI ${r.toFixed(0)} in healthy momentum zone.`, signals);
  }
  if (ema9 > ema21 && r > 72) {
    return vote("chart", "HOLD", 60, `Uptrend intact but RSI ${r.toFixed(0)} is overheated — wait for cooldown.`, signals);
  }
  if (ema9 < ema21 && last < ema21 && r < 45) {
    return vote("chart", "AVOID", 72, `EMA9 < EMA21, price below trend, RSI ${r.toFixed(0)} weakening.`, signals);
  }
  return vote("chart", "HOLD", 50, "Indicators mixed — no clear EMA/RSI confluence.", signals);
}

export function liquidityAgent(ctx: Context): AgentVote {
  if (!ctx.pair) {
    return vote("liquidity", "HOLD", 40, "No DexScreener pair returned — cannot assess depth.", [
      { label: "source", value: "missing" },
    ]);
  }
  const { liquidityUsd, volume24h, fdv } = ctx.pair;
  const volToLiq = liquidityUsd > 0 ? volume24h / liquidityUsd : 0;
  const fdvToVol = volume24h > 0 ? fdv / volume24h : 0;
  const signals = [
    { label: "liquidity", value: `$${Math.round(liquidityUsd).toLocaleString()}` },
    { label: "vol24h", value: `$${Math.round(volume24h).toLocaleString()}` },
    { label: "vol/liq", value: volToLiq.toFixed(2) },
  ];
  if (liquidityUsd > 1_500_000 && volToLiq > 0.6 && volToLiq < 8) {
    return vote("liquidity", "BUY", 74,
      `Deep liquidity ($${(liquidityUsd / 1e6).toFixed(1)}M) with healthy turnover ${volToLiq.toFixed(1)}x.`, signals);
  }
  if (liquidityUsd < 200_000) {
    return vote("liquidity", "AVOID", 78,
      `Thin pool ($${Math.round(liquidityUsd / 1000)}k) — execution slippage will dominate.`, signals);
  }
  if (volToLiq > 12) {
    return vote("liquidity", "AVOID", 68,
      `Volume/liq ratio ${volToLiq.toFixed(1)}x suggests churn or wash activity.`, signals);
  }
  if (fdvToVol > 0 && fdvToVol > 2000) {
    return vote("liquidity", "HOLD", 55,
      `FDV $${(fdv / 1e9).toFixed(2)}B vs vol $${(volume24h / 1e6).toFixed(1)}M — illiquid for its size.`, signals);
  }
  return vote("liquidity", "HOLD", 55, "Liquidity adequate but no edge in turnover.", signals);
}

export function momentumAgent(ctx: Context): AgentVote {
  if (!ctx.pair) {
    return vote("momentum", "HOLD", 40, "No price feed — momentum unknown.", [
      { label: "source", value: "missing" },
    ]);
  }
  const { change1h, change24h } = ctx.pair;
  const signals = [
    { label: "1h", value: `${change1h.toFixed(2)}%` },
    { label: "24h", value: `${change24h.toFixed(2)}%` },
  ];
  if (change24h > 6 && change1h > 0) {
    return vote("momentum", "BUY", 72,
      `Up ${change24h.toFixed(1)}% on the day with the 1h still positive — trend is alive.`, signals);
  }
  if (change24h > 12 && change1h < -2) {
    return vote("momentum", "HOLD", 58,
      `+${change24h.toFixed(0)}% day but cooling on the 1h — wait for re-test.`, signals);
  }
  if (change24h < -8) {
    return vote("momentum", "AVOID", 70,
      `Down ${Math.abs(change24h).toFixed(1)}% — momentum is negative.`, signals);
  }
  if (change24h > 2 && change24h <= 6) {
    return vote("momentum", "BUY", 60,
      `Quiet uptrend (+${change24h.toFixed(1)}%) — early-stage continuation.`, signals);
  }
  return vote("momentum", "HOLD", 52, "Momentum is flat — no edge in either direction.", signals);
}

export function riskAgent(ctx: Context): AgentVote {
  const closes = ctx.candles.map((c) => c.c);
  if (closes.length < 12) {
    return vote("risk", "HOLD", 42, "Not enough history to estimate volatility.", [
      { label: "candles", value: String(closes.length) },
    ]);
  }
  const vol = realizedVolatility(closes);
  const peak = Math.max(...closes);
  const drawdown = peak > 0 ? ((closes.at(-1)! - peak) / peak) * 100 : 0;
  const signals = [
    { label: "ann.vol", value: `${vol.toFixed(0)}%` },
    { label: "drawdown", value: `${drawdown.toFixed(1)}%` },
  ];
  if (vol > 220 || drawdown < -22) {
    return vote("risk", "AVOID", 78,
      `Volatility ${vol.toFixed(0)}% / drawdown ${drawdown.toFixed(0)}% — risk regime is stressed.`, signals);
  }
  if (vol < 90 && drawdown > -6) {
    return vote("risk", "BUY", 64,
      `Volatility tame (${vol.toFixed(0)}%) and drawdown shallow — favorable risk regime.`, signals);
  }
  return vote("risk", "HOLD", 55,
    `Volatility ${vol.toFixed(0)}% — moderate regime, size accordingly.`, signals);
}

export function flowAgent(ctx: Context): AgentVote {
  if (!ctx.pair) {
    return vote("flow", "HOLD", 40, "No pair data — cannot infer holder behavior.", [
      { label: "source", value: "missing" },
    ]);
  }
  const { liquidityUsd, volume24h, fdv, change24h } = ctx.pair;
  const turnover = fdv > 0 ? volume24h / fdv : 0;
  const signals = [
    { label: "turnover", value: turnover.toFixed(3) },
    { label: "FDV", value: `$${(fdv / 1e6).toFixed(1)}M` },
    { label: "liq", value: `$${(liquidityUsd / 1e6).toFixed(2)}M` },
  ];
  if (turnover > 0.08 && change24h > 0) {
    return vote("flow", "BUY", 68,
      `Turnover ${(turnover * 100).toFixed(1)}% of FDV with green tape — active inflows.`, signals);
  }
  if (turnover > 0.2) {
    return vote("flow", "HOLD", 58,
      `Turnover ${(turnover * 100).toFixed(0)}% of FDV is unusually high — rotation risk.`, signals);
  }
  if (turnover < 0.015) {
    return vote("flow", "HOLD", 52,
      `Quiet flow (${(turnover * 100).toFixed(2)}% of FDV) — no fresh demand signal.`, signals);
  }
  return vote("flow", "HOLD", 50, "Flow is normal — neither catalyst nor distribution.", signals);
}

export function runAllAgents(ctx: Context): AgentVote[] {
  return [
    chartAgent(ctx),
    liquidityAgent(ctx),
    momentumAgent(ctx),
    riskAgent(ctx),
    flowAgent(ctx),
  ];
}
