// src/app/alerts/page.tsx
const alerts = [
    {
      symbol: "SOL",
      condition: "RSI above 60 on 4H and EMA9 > EMA21",
      status: "Triggered",
      updated: "2 min ago",
    },
    {
      symbol: "PYTH",
      condition: "Bullish crossover on 1D",
      status: "Watching",
      updated: "6 min ago",
    },
    {
      symbol: "WIF",
      condition: "RSI below 35 on 1H",
      status: "Watching",
      updated: "10 min ago",
    },
    {
      symbol: "RENDER",
      condition: "Score above 80",
      status: "Triggered",
      updated: "15 min ago",
    },
  ];
  
  export default function AlertsPage() {
    return (
      <div className="space-y-6">
        <section className="border border-green-900/70 bg-[#0a0a0a] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Alert center</p>
          <h1 className="mt-2 text-3xl font-semibold text-green-400">Alerts & Watchlist</h1>
          <p className="mt-3 max-w-3xl text-sm text-zinc-300">
            Manage signal triggers for RSI, EMA crossover, and score-based opportunities across your tracked Solana tokens.
          </p>
        </section>
  
        <section className="grid gap-4 md:grid-cols-3">
          <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Triggered</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">4</h3>
          </div>
          <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Watching</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">8</h3>
          </div>
          <div className="border border-green-900/70 bg-[#0a0a0a] p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Priority symbol</p>
            <h3 className="mt-3 text-3xl font-semibold text-green-400">SOL</h3>
          </div>
        </section>
  
        <section className="border border-green-900/70 bg-[#0a0a0a] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Signal monitor</p>
              <h3 className="text-xl font-semibold text-white">Active alerts</h3>
            </div>
            <button className="border border-green-800 px-4 py-2 text-sm text-white hover:border-green-500 hover:text-green-400">
              New Alert
            </button>
          </div>
  
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={`${alert.symbol}-${alert.condition}`}
                className="flex flex-col gap-4 border border-green-900/60 bg-black p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h4 className="text-lg font-semibold text-green-400">{alert.symbol}</h4>
                  <p className="mt-1 text-sm text-zinc-300">{alert.condition}</p>
                </div>
  
                <div className="flex items-center gap-4 text-sm">
                  <span
                    className={`border px-3 py-2 ${
                      alert.status === "Triggered"
                        ? "border-green-700 text-green-400"
                        : "border-zinc-700 text-zinc-300"
                    }`}
                  >
                    {alert.status}
                  </span>
                  <span className="text-zinc-500">{alert.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }