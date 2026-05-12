import type { CouncilVerdict } from "./types";

const MAX_HISTORY = 24;
const history: CouncilVerdict[] = [];

export function recordVerdict(v: CouncilVerdict) {
  history.unshift(v);
  if (history.length > MAX_HISTORY) history.pop();
}

export function recentVerdicts(limit = MAX_HISTORY): CouncilVerdict[] {
  return history.slice(0, limit);
}

export function clearHistory() {
  history.length = 0;
}
