# Quorum — Solana Agent Council

> A multi-agent council that debates and votes on Solana tokens. Five specialist agents read live market state, cast independent votes, and let a coordinator pick between **debate** and **vote** based on how much they disagree. Every claim cites a number. Every dissent goes on the transcript.

**Built for the [AgentSwarm hack](https://luma.com/6229drs5) (Canteen, Apr 6 – May 11, 2026).**

```
DexScreener pair + liquidity + volume     ┐
GeckoTerminal OHLCV (1H / 4H / 1D)        ┼──▶ Five Specialist Agents ──▶ Coordinator ──▶ Verdict
Watchlist + free-text symbol resolver     ┘    (chart · liquidity ·         (mechanism      (BUY / HOLD /
                                                momentum · risk · flow)      selector)        AVOID + transcript)
                                                                                       │
                                                                                       ▼
                                                                       Reputation log · Reasoning ledger
```

---

## 1. The pitch

The retail crypto experience is single-signal. One chart, one indicator, one influencer call. Real desks don't work like that — they have a quant, a flows person, a macro person, a risk person, and a head trader who arbitrates between them. The signal is in the *disagreement*, not the consensus.

**Quorum** rebuilds that desk as a swarm of small, named, reputation-bearing agents on top of live Solana data:

- **Five specialist agents** each read a different slice of a Solana token's state and emit `BUY | HOLD | AVOID` with a confidence score and a cited reason.
- **A mechanism selector**, inspired by *Li et al., 2025* (UW-Madison's *Debate or Vote?*), picks between a reputation-weighted **vote** and a **debate** synthesis. Low variance across agents → vote. High variance → debate, and the coordinator synthesises a rationale via Qwen.
- **A reputation layer** keeps each agent honest. Calls accumulate a rolling track record; the next verdict weights them accordingly.
- **A full transcript** is produced every convening — speaker, line, in order — so any verdict is auditable end-to-end.

**Target users:**
- **Solana traders** who currently glue together five tabs (DexScreener, GeckoTerminal, X, Solscan, Birdeye) to understand a single move.
- **Agent runtime providers** (Eliza, LangGraph, CrewAI) who want a drop-in arbitration layer instead of building their own.
- **DAO / treasury research teams** that need an auditable second-opinion engine before any execution decision.
- **Hackers** who want to see a swarm coordination primitive working end-to-end without a smart contract.

**The user value loop:**

| Step | Input | Output | Where the user sees it |
| --- | --- | --- | --- |
| Convene | Solana symbol or mint address | DexScreener pair + GeckoTerminal candles | Council Floor token search |
| Vote | Pair + candles | Five independent agent votes with cited signals | Agent Votes panel |
| Select mechanism | Vote variance | `debate` if variance > 0.55, else `vote` | Verdict card · mechanism tag |
| Synthesise | Votes + mechanism | Rationale via Qwen (with deterministic fallback) | Verdict rationale + transcript |
| Score | Verdict + future price | Reputation update for each agent | Agents page |

---

## 2. Live demo

**Zero setup. No API keys needed.** Quorum reads from public DexScreener + GeckoTerminal endpoints. The Qwen coordinator is optional — when it's unreachable, the council falls back to a deterministic rationale built from the highest-confidence agreeing agent.

```bash
git clone <this repo>
cd my-app
npm install
npm run dev
# open http://localhost:3000
```

Six pages, all live-data driven via polling:

| Route | Purpose |
| --- | --- |
| `/` | Landing — Dither shader hero, council pillars, the four-step loop |
| `/dashboard` | **Council Floor** — convene on any Solana token, see live verdict + per-agent votes + transcript + reputation |
| `/reasoning` | **Reasoning Log** — every verdict this session, confidence/variance bar chart, mechanism split, vote distribution pie |
| `/agents` | **Agents** — per-agent reputation cards, weight bar chart, multi-axis radar (weight × accuracy × pnl × activity) |
| `/tokens` | **Tokens** — full Solana watchlist by sector, sort + filter, "Convene" button per card |
| `/symbol/[symbol]` | **Token Detail** — TradingView chart, DexScreener pool data, multi-timeframe RSI/EMA breakdown |
| `/alerts` | **Alerts** — council-driven trip-wires (verdict flips, debate triggers, dissents) |

**Hero moment to demo:** Open `/dashboard`, type `BONK` (or paste any Solana mint address) into the search bar. Watch all five agents vote in parallel, the mechanism selector pick `debate` or `vote`, the coordinator synthesise the rationale, and the transcript stream in beneath. That's the product in 10 seconds: receipt-bearing collective intelligence on any Solana token, no smart contract required.

---

## 3. The council

| Agent | Reads | Outputs |
| --- | --- | --- |
| **Chart Agent** | 1H candles via GeckoTerminal | EMA9 / EMA21 + RSI14 confluence → BUY / HOLD / AVOID |
| **Liquidity Agent** | DexScreener pair | Pool depth + volume / liquidity turnover sanity |
| **Momentum Agent** | 1H + 24H price deltas | Trend continuation vs exhaustion |
| **Risk Agent** | Closes → realized vol + drawdown | Regime: calm / moderate / stressed |
| **Flow Agent** | Volume / FDV turnover | Fresh demand vs distribution |
| **Coordinator (agent 00)** | All of the above | Picks mechanism, aggregates by reputation, narrates verdict via Qwen |

Each agent's vote contains the **vote**, **confidence (0–100)**, the **reason in one sentence citing concrete numbers**, and the **raw signal labels** it used (`RSI14 = 61.2`, `vol/liq = 2.4`, `ann.vol = 92%`). That last part is the audit trail — you can disagree with the agent, but you can't claim it didn't show its work.

---

## 4. API

All routes return `{ ok, data, source, generatedAt }` JSON envelopes.

| Route | Method | Purpose | Code path |
| --- | --- | --- | --- |
| `/api/quorum/council?symbol=SOL` | `GET` / `POST` | Convene the council on a token (symbol **or** mint address). Returns full verdict + per-agent votes + transcript. | `lib/quorum/council.ts::runCouncil()` |
| `/api/quorum/search?q=bonk` | `GET` | Resolve any Solana token by symbol / name / mint via DexScreener search. Watchlist matches are flagged. | `lib/quorum/search.ts::searchTokens()` |
| `/api/quorum/tokens` | `GET` | Watchlist with live DexScreener price, 24h delta, volume, liquidity. | `app/api/quorum/tokens/route.ts` |
| `/api/quorum/agents` | `GET` | Reputation leaderboard with weight, rolling PnL, accuracy. | `lib/quorum/reputation.ts` |
| `/api/quorum/history` | `GET` | Recent verdicts in this session (ring buffer of 24). | `lib/quorum/history.ts` |

### Example

```bash
curl 'http://localhost:3000/api/quorum/council?symbol=JUP' | jq
```

```json
{
  "ok": true,
  "source": "live",
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

## 5. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js 16 (App Router, route groups) + React 19 | Server components for SEO landing, client components for live polling |
| Styling | Tailwind v4 | Dark, monospace-heavy, AutoFund-lineage design language |
| Hero shader | `three` + `@react-three/fiber` + `@react-three/postprocessing` | The Dither effect you see in the landing hero and dashboard header |
| Charts | `recharts` | Reasoning bar/pie + Agents bar/radar |
| Market data | DexScreener (pair / liquidity / volume) + GeckoTerminal (OHLCV) | Public, free, no key required |
| LLM (coordinator) | Qwen3-VL-8B via RunPod (configurable, optional) | Free endpoint via AutoFund AI's deployment; deterministic fallback if it goes away |
| Agent runtime | Self-contained TypeScript in `lib/quorum/` | Drop-in to Eliza or any agent host |
| Deployment | Docker → Nosana | Solana-aligned decentralized GPU compute |

---

## 6. Why this fits AgentSwarm

The hack asks for agentic swarms on Solana across **identity, reputation, transaction, coordination**. Quorum addresses four of those without a smart-contract dependency:

| Theme | How Quorum addresses it |
| --- | --- |
| **Coordination** | Mechanism selector that routes between *vote* and *debate* based on variance — directly inspired by Li et al.'s *Debate or Vote?* (UW-Madison, 2025). |
| **Reputation** | Every agent carries a rolling reputation. Calls are scored against actual price action; weight per agent adjusts each epoch. |
| **Identity** | Each agent is a named persona with a public track record — portable across runtimes (Eliza, LangGraph, raw fetch). |
| **Transaction-adjacent** | The council advises on Solana spot trades. Read-only by design — no wallet, no on-chain writes, only API reads. |

Quorum is a **drop-in arbitration layer**. Today it ships as a Next.js app; the moment you want to anchor a daily leaderboard hash on Solana via a memo transaction, the rest of the system doesn't change.

---

## 7. Repository map

```
my-app/
├── app/
│   ├── page.tsx                          Landing (Dither hero, pillars, loop diagram)
│   ├── layout.tsx                        Root layout (html · body · metadata)
│   ├── (app)/                            Route group — sidebar + header shared
│   │   ├── layout.tsx                    Wraps every inner page in QuorumShell
│   │   ├── dashboard/page.tsx            Council Floor
│   │   ├── reasoning/page.tsx            Verdict ledger + charts
│   │   ├── agents/page.tsx               Reputation + radar profile
│   │   ├── tokens/page.tsx               Solana token board by sector
│   │   ├── alerts/page.tsx               Council-driven alerts
│   │   └── symbol/[symbol]/page.tsx      Token detail + TradingView
│   ├── components/
│   │   ├── Dither.tsx                    Three.js shader hero
│   │   ├── QuorumShell.tsx               Sidebar + animated header
│   │   ├── CouncilCard.tsx               Verdict / Votes / Transcript panels
│   │   └── TokenSearch.tsx               Free-text Solana token resolver
│   └── api/quorum/
│       ├── council/route.ts              Run the council (symbol or address)
│       ├── search/route.ts               Resolve any Solana token via DexScreener
│       ├── tokens/route.ts               Watchlist snapshot
│       ├── agents/route.ts               Reputation leaderboard
│       └── history/route.ts              Session verdict ring buffer
├── lib/quorum/
│   ├── agents.ts                         Five specialist agent rules
│   ├── council.ts                        Orchestrator + mechanism selector
│   ├── ai.ts                             Qwen client + coordinator prompt
│   ├── market.ts                         DexScreener + GeckoTerminal + indicators
│   ├── reputation.ts                     Seeded in-memory rep store
│   ├── tokens.ts                         Solana watchlist (20+ tokens, 8 sectors)
│   ├── search.ts                         DexScreener search + resolver
│   ├── history.ts                        Session verdict ring buffer
│   ├── types.ts                          Domain types
│   └── useLiveData.ts                    Polling hook for client components
└── src/                                  ElizaOS plugin entry (legacy SolScreener)
```

---

## 8. Configuration

| Env var | Default | Purpose |
| --- | --- | --- |
| `QUORUM_AI_BASE_URL` | RunPod Qwen endpoint | Override to point at any OpenAI-compatible host |
| `QUORUM_AI_MODEL` | `Qwen/Qwen3-VL-8B-Instruct` | Model id |
| `QUORUM_AI_TIMEOUT_MS` | `8000` | Coordinator falls back to heuristic narration if AI exceeds this |

Everything else is hard-wired to public endpoints. No keys, no wallets, no chain writes.

---

## 9. Roadmap

- **Onchain anchoring.** Hash daily leaderboard + verdict log; commit via Solana memo tx for a free, optional audit trail.
- **Persistent reputation.** Swap the in-memory store for SQLite / Turso so reputation survives restarts.
- **Eliza plugin.** Expose `CONVENE_QUORUM` as an Eliza action so any agent host can invoke the council.
- **Multi-turn debate.** Real revision rounds — agents see each other's first vote and update. Current implementation is a single-pass mechanism selector.
- **Agent backtests.** Continuous evaluation against forward price to keep reputation honest.
- **More agents.** Sentiment Agent (X / Farcaster), Holder Agent (Helius), Macro Agent (CPI / FOMC windows).

---

## Credits

- Mechanism selector inspired by *Debate or Vote? Multi-Agent Mechanisms for Collective LLM Decisions* (Li et al., UW-Madison, 2025).
- Hero shader, design language, and route-group pattern adapted from AutoFund AI.
- README structure and intelligence-engine framing adapted from MarketMind.
- Built for **AgentSwarm** by Canteen.
