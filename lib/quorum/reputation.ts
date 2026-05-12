import type { AgentId, AgentReputation } from "./types";

const SEED: AgentReputation[] = [
  { agent: "chart", name: "Chart Agent", totalCalls: 184, correctCalls: 119, rollingPnl: 12.4, weight: 1.18, lastActive: 0 },
  { agent: "liquidity", name: "Liquidity Agent", totalCalls: 162, correctCalls: 101, rollingPnl: 8.2, weight: 1.06, lastActive: 0 },
  { agent: "momentum", name: "Momentum Agent", totalCalls: 201, correctCalls: 116, rollingPnl: 6.7, weight: 1.02, lastActive: 0 },
  { agent: "risk", name: "Risk Agent", totalCalls: 178, correctCalls: 121, rollingPnl: 4.1, weight: 1.11, lastActive: 0 },
  { agent: "flow", name: "Flow Agent", totalCalls: 156, correctCalls: 88, rollingPnl: -1.3, weight: 0.93, lastActive: 0 },
];

const store = new Map<AgentId, AgentReputation>();
for (const r of SEED) store.set(r.agent, { ...r });

export function getReputation(id: AgentId): AgentReputation {
  return store.get(id) ?? SEED[0];
}

export function allReputations(): AgentReputation[] {
  return Array.from(store.values()).sort((a, b) => b.weight - a.weight);
}

export function bumpActivity(id: AgentId) {
  const r = store.get(id);
  if (r) r.lastActive = Date.now();
}
