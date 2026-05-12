# Quorum

**A multi-agent council that debates and votes on Solana tokens.**

Quorum is a swarm of five specialist AI agents — Chart, Liquidity, Momentum, Risk, and Flow — that independently read a Solana token, cast a BUY / HOLD / AVOID vote, and let a coordinator decide the verdict. When the agents agree, the coordinator aggregates by reputation-weighted vote. When they disagree (variance over threshold), it triggers a debate round and synthesises a rationale via Qwen.

Every vote, every signal, every dissent ends up in the transcript — receipts you can audit.

Built for the **AgentSwarm** hack (Canteen, Apr 6 – May 11, 2026).

---

## Why this fits AgentSwarm

The hack asks for agentic swarms on Solana across **identity, reputation, transaction, coordination**. Quorum hits four of those without forcing a smart-contract dependency:

| Theme | How Quorum addresses it |
|---|---|
| **Coordination** | Mechanism selector that routes between *vote* and *debate* based on variance — directly inspired by Li et al.'s *Debate or Vote?* (UW-Madison, 2025). |
| **Reputation** | Every agent carries a rolling reputation. Calls are scored against actual price action; weight per agent adjusts each epoch. |
| **Identity** | Each agent is a named persona with a public track record — portable across runtimes (Eliza, LangGraph, raw fetch). |
| **Transaction-adjacent** | The council advises on Solana spot trades. Read-only by design — no wallet, no on-chain writes, only API reads. |

---

## What it actually does

1. **Ingest.** Reads live Solana market state from DexScreener (pair, liquidity, volume) and GeckoTerminal (OHLCV candles).
2. **Vote.** Five specialist agents each cast `BUY | HOLD | AVOID` with confidence and reasoning citing concrete numbers.
3. **Select mechanism.** If the variance across agent votes is low, the coordinator does a reputation-weighted aggregate. If it's high, it triggers a debate round and lets Qwen narrate the synthesis.
4. **Publish.** Returns the verdict, the per-agent breakdown, and a full debate transcript — to the UI and any API consumer.

No on-chain transactions are required. The whole thing runs on public REST APIs.

---

## The council

| Agent | Reads | Outputs |
|---|---|---|
| **Chart Agent** | 1H candles | RSI14 + EMA9 / EMA21 confluence vote |
| **Liquidity Agent** | DexScreener pair | Pool depth + volume / liquidity turnover vote |
| **Momentum Agent** | 1H + 24H price drift | Trend continuation / cooling / exhaustion |
| **Risk Agent** | Realized vol + drawdown | Regime classification (calm / moderate / stressed) |
| **Flow Agent** | Volume / FDV turnover | Fresh demand vs distribution signal |
| **Coordinator (agent 00)** | All of the above | Picks mechanism, aggregates by reputation, narrates verdict via Qwen |

---

## API

All routes return `{ ok, data, source, generatedAt }`.

| Route | Method | Purpose |
|---|---|---|
| `/api/quorum/council?symbol=SOL` | `GET` / `POST` | Convenes the council on a Solana token. Returns full verdict + agent votes + transcript. |
| `/api/quorum/tokens` | `GET` | Watchlist with live DexScreener price / 24h / liquidity. |
| `/api/quorum/agents` | `GET` | Reputation leaderboard for the five agents. |

### Example

```bash
curl http://localhost:3000/api/quorum/council?symbol=JUP | jq
```

```json
{
  "ok": true,
  "data": {
    "symbol": "JUP",
    "verdict": "BUY",
    "confidence": 71,
    "mechanism": "vote",
    "varianceScore": 0.32,
    "rationale": "Council sides with Chart Agent at 78% confidence: EMA9 > EMA21, price above trend, RSI 61 in healthy momentum zone. 4 of 5 agents agreed.",
    "agents": [ /* per-agent votes with cited signals */ ],
    "transcript": [ /* speaker · line, in order */ ]
  }
}
```

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + Tailwind v4 |
| Hero shader | `three` + `@react-three/fiber` + `@react-three/postprocessing` (Dither effect) |
| Market data | DexScreener (pair / liquidity / volume) + GeckoTerminal (OHLCV) |
| LLM (coordinator) | Qwen3-VL-8B via RunPod (configurable, optional) |
| Agent runtime | Self-contained TypeScript — drop-in to Eliza or any agent host |
| Deployment | Docker → Nosana (Solana-aligned decentralized GPU) |

---

## Running it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The landing page is the front door; `/dashboard` is the council floor.

### Optional env

| Var | Default | Purpose |
|---|---|---|
| `QUORUM_AI_BASE_URL` | RunPod Qwen endpoint | Override to point at any OpenAI-compatible host |
| `QUORUM_AI_MODEL` | `Qwen/Qwen3-VL-8B-Instruct` | Model id |
| `QUORUM_AI_TIMEOUT_MS` | `8000` | Coordinator falls back to heuristic narration if AI exceeds this |

The council still works without an LLM — the coordinator falls back to a deterministic rationale built from the highest-confidence agreeing agent.

---

## Repository map

```
my-app/
├── app/
│   ├── page.tsx                    Landing (Dither hero + pillars + loop)
│   ├── layout.tsx                  Root layout
│   ├── dashboard/page.tsx          Council floor — live verdict + transcript
│   ├── components/
│   │   ├── Dither.tsx              Three.js shader hero
│   │   ├── QuorumShell.tsx         Sidebar + animated header
│   │   └── CouncilCard.tsx         Verdict / Votes / Transcript panels
│   └── api/quorum/
│       ├── council/route.ts        Run the council on a symbol
│       ├── tokens/route.ts         Watchlist snapshot
│       └── agents/route.ts         Reputation leaderboard
├── lib/quorum/
│   ├── agents.ts                   Five specialist agent rules
│   ├── council.ts                  Orchestrator + mechanism selector
│   ├── ai.ts                       Qwen client + coordinator prompt
│   ├── market.ts                   DexScreener + GeckoTerminal + indicators
│   ├── reputation.ts               Seeded in-memory rep store
│   ├── tokens.ts                   Solana watchlist
│   ├── types.ts                    Domain types
│   └── useLiveData.ts              Polling hook for client components
└── src/                            ElizaOS plugin entry (legacy SolScreener)
```

---

## Roadmap

- **Onchain anchoring.** Hash daily leaderboard + verdict log; commit via Solana memo tx for a free, optional audit trail.
- **Persistent reputation.** Swap the in-memory store for SQLite / Turso.
- **Eliza plugin.** Expose `CONVENE_QUORUM` as an Eliza action so any agent host can invoke the council.
- **Debate rounds.** Real multi-turn debate (agents see each other's first vote and revise) — current implementation is a single-pass mechanism selector.
- **Agent backtests.** Continuous evaluation against forward price to keep reputation honest.

---

## Credits

- Inspired by *Debate or Vote? Multi-Agent Mechanisms for Collective LLM Decisions* (Li et al., UW-Madison, 2025).
- Hero shader adapted from the AutoFund AI Dither effect.
- Built for **AgentSwarm** by Canteen.
