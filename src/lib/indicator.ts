// src/lib/indicators.ts
export function ema(values: number[], period: number): number[] {
    if (values.length < period) return [];
    const k = 2 / (period + 1);
    const out: number[] = [];
    let prev = values[0];
  
    for (let i = 0; i < values.length; i++) {
      const current = i === 0 ? values[i] : values[i] * k + prev * (1 - k);
      out.push(current);
      prev = current;
    }
  
    return out;
  }
  
  export function rsi(values: number[], period = 14): number[] {
    if (values.length < period + 1) return [];
    const out: number[] = new Array(values.length).fill(NaN);
  
    let gains = 0;
    let losses = 0;
  
    for (let i = 1; i <= period; i++) {
      const diff = values[i] - values[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
  
    let avgGain = gains / period;
    let avgLoss = losses / period;
    out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  
    for (let i = period + 1; i < values.length; i++) {
      const diff = values[i] - values[i - 1];
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;
  
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
  
      out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
  
    return out;
  }
  
  export function pctChange(current: number, previous: number) {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  }
  
  export function analyzeTimeframe(closes: number[], volumes: number[]) {
    const ema9 = ema(closes, 9);
    const ema21 = ema(closes, 21);
    const rsi14 = rsi(closes, 14);
  
    const lastPrice = closes.at(-1)!;
    const lastEma9 = ema9.at(-1)!;
    const lastEma21 = ema21.at(-1)!;
    const lastRsi = rsi14.at(-1)!;
  
    const lastVolume = volumes.at(-1)!;
    const avgVolume20 =
      volumes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, volumes.length);
  
    const priceAboveSlow = lastPrice > lastEma21;
    const emaBullish = lastEma9 > lastEma21;
    const emaBearish = lastEma9 < lastEma21;
    const volumeBoost = lastVolume > avgVolume20 * 1.15;
  
    let trend = "neutral";
    let momentum = "mixed";
    let score = 50;
  
    if (emaBullish && priceAboveSlow && lastRsi >= 50 && lastRsi <= 68) {
      trend = "bullish";
      momentum = volumeBoost ? "strong" : "moderate";
      score = 70 + Math.min(20, (lastRsi - 50) * 1.2) + (volumeBoost ? 8 : 0);
    } else if (emaBearish && !priceAboveSlow && lastRsi >= 32 && lastRsi < 50) {
      trend = "bearish";
      momentum = volumeBoost ? "strong" : "moderate";
      score = 70 + Math.min(20, (50 - lastRsi) * 1.2) + (volumeBoost ? 8 : 0);
    } else if (emaBullish && lastRsi > 68) {
      trend = "bullish";
      momentum = "overbought-watch";
      score = 62;
    } else if (emaBearish && lastRsi < 32) {
      trend = "bearish";
      momentum = "oversold-watch";
      score = 62;
    } else {
      trend = "neutral";
      momentum = "weak";
      score = 45;
    }
  
    score = Math.max(0, Math.min(100, Math.round(score)));
  
    return {
      price: Number(lastPrice.toFixed(6)),
      ema9: Number(lastEma9.toFixed(6)),
      ema21: Number(lastEma21.toFixed(6)),
      rsi14: Number(lastRsi.toFixed(2)),
      trend,
      momentum,
      volumeBoost,
      score,
    };
  }
  
  export function explainAnalysis(symbol: string, tf: string, a: ReturnType<typeof analyzeTimeframe>) {
    if (a.trend === "bullish") {
      return `${symbol} on ${tf} is bullish because EMA9 is above EMA21, price is holding above the trend line, and RSI is ${a.rsi14}.`;
    }
    if (a.trend === "bearish") {
      return `${symbol} on ${tf} is bearish because EMA9 is below EMA21, price is under the trend line, and RSI is ${a.rsi14}.`;
    }
    return `${symbol} on ${tf} is mixed because EMA and RSI are not aligned strongly enough yet.`;
  }

  