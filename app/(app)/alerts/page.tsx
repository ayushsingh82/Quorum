const alerts = [
  {
    symbol: "SOL",
    condition: "Council verdict flips to BUY with confidence ≥ 75",
    status: "Triggered",
    updated: "2 min ago",
  },
  {
    symbol: "JUP",
    condition: "Debate triggered (variance > 0.55)",
    status: "Watching",
    updated: "6 min ago",
  },
  {
    symbol: "WIF",
    condition: "Liquidity Agent dissents from majority",
    status: "Watching",
    updated: "10 min ago",
  },
  {
    symbol: "RENDER",
    condition: "Risk Agent flips to AVOID",
    status: "Triggered",
    updated: "15 min ago",
  },
];

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
          Alert Center
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Trip-wires on council behavior
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
          Alerts fire on verdict changes, mechanism flips (vote → debate),
          and per-agent dissents. Use them as audit signals — not trade triggers.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Triggered
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-emerald-300">2</h3>
          <p className="mt-2 text-xs text-zinc-400">last 15 minutes</p>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Watching
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-white">8</h3>
          <p className="mt-2 text-xs text-zinc-400">active rules</p>
        </div>
        <div className="border border-zinc-800 bg-[#0a0a0a] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Priority Symbol
          </p>
          <h3 className="mt-3 text-3xl font-semibold text-emerald-300">SOL</h3>
          <p className="mt-2 text-xs text-zinc-400">top of council attention</p>
        </div>
      </section>

      <section className="border border-zinc-800 bg-[#0a0a0a] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-400">
              Active rules
            </p>
            <h3 className="mt-1 text-base font-semibold text-white">
              {alerts.length} signals being monitored
            </h3>
          </div>
          <button className="border border-emerald-500/60 bg-black px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-500/10">
            New rule
          </button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={`${alert.symbol}-${alert.condition}`}
              className="flex flex-col gap-4 border border-zinc-900 bg-black p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h4 className="font-mono text-base font-bold text-emerald-300">{alert.symbol}</h4>
                <p className="mt-1 text-sm text-zinc-300">{alert.condition}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`border px-3 py-1.5 font-mono uppercase tracking-[0.18em] ${
                    alert.status === "Triggered"
                      ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
                      : "border-zinc-800 text-zinc-300"
                  }`}
                >
                  {alert.status}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  {alert.updated}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
