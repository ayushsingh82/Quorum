"use client";

import { useEffect, useRef, useState } from "react";

export type LiveData<T> = {
  data: T | null;
  status: "idle" | "loading" | "ready" | "error";
  source: string | null;
  updatedAt: number | null;
  error: string | null;
  refresh: () => void;
};

export function useLiveData<T>(url: string, intervalMs = 8000): LiveData<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<LiveData<T>["status"]>("idle");
  const [source, setSource] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  async function load() {
    setStatus((s) => (s === "ready" ? "ready" : "loading"));
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (!mounted.current) return;
      if (json?.ok) {
        setData(json.data as T);
        setSource(json.source ?? null);
        setUpdatedAt(json.generatedAt ?? Date.now());
        setStatus("ready");
        setError(null);
      } else {
        setError(json?.error ?? "request failed");
        setStatus("error");
      }
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e.message : "network error");
      setStatus("error");
    }
  }

  useEffect(() => {
    mounted.current = true;
    void load();
    const id = setInterval(load, intervalMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, intervalMs]);

  return { data, status, source, updatedAt, error, refresh: load };
}

export function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toExponential(2)}`;
}

export function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}
