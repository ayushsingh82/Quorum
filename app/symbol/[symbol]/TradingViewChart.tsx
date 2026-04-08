"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  symbol: string;
};

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => unknown;
    };
  }
}

const TV_SYMBOL_MAP: Record<string, string> = {
  SOL: "BINANCE:SOLUSDT",
  PYTH: "CRYPTO:PYTHUSD",
  RENDER: "CRYPTO:RNDRUSD",
  RAY: "CRYPTO:RAYUSD",
  WIF: "CRYPTO:WIFUSD",
  JTO: "CRYPTO:JTOUSD",
};

export default function TradingViewChart({ symbol }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerId = useMemo(
    () => `tradingview_${symbol.toLowerCase()}_${Math.random().toString(36).slice(2, 10)}`,
    [symbol]
  );
  const tvSymbol = TV_SYMBOL_MAP[symbol] ?? "BINANCE:SOLUSDT";

  useEffect(() => {
    const mountWidget = () => {
      if (!window.TradingView || !containerRef.current) return;
      containerRef.current.innerHTML = "";

      // Lightweight embed via TradingView widget script.
      // Fallback symbol is SOLUSDT for assets not available on TradingView feeds.
      new window.TradingView.widget({
        autosize: true,
        symbol: tvSymbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        studies: ["Volume@tv-basicstudies"],
        container_id: containerId,
      });
    };

    if (window.TradingView) {
      mountWidget();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = mountWidget;
    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [containerId, tvSymbol]);

  return (
    <div className="h-full w-full">
      <div id={containerId} ref={containerRef} className="h-full w-full" />
    </div>
  );
}

