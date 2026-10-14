import type { SensorReading } from "./types";

export interface HistogramBin {
  range: string;
  count: number;
  min: number;
  max: number;
}

export function histogram(values: number[], bins = 12): HistogramBin[] {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / bins || 1;
  const out: HistogramBin[] = Array.from({ length: bins }, (_, i) => {
    const lo = min + i * width;
    const hi = lo + width;
    return { range: `${lo.toFixed(0)}-${hi.toFixed(0)}`, count: 0, min: lo, max: hi };
  });
  for (const v of values) {
    const idx = Math.min(bins - 1, Math.floor((v - min) / width));
    out[idx].count++;
  }
  return out;
}

export function hourlyBuckets(rows: SensorReading[]): { hour: string; avg: number; min: number; max: number; count: number }[] {
  const map = new Map<string, number[]>();
  for (const r of rows) {
    const h = r.timestamp.slice(11, 13);
    if (!map.has(h)) map.set(h, []);
    map.get(h)!.push(r.reading);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([h, vals]) => ({
      hour: `${h}:00`,
      avg: vals.reduce((a, b) => a + b, 0) / vals.length,
      min: Math.min(...vals),
      max: Math.max(...vals),
      count: vals.length,
    }));
}

export function detectAnomalies(rows: SensorReading[], threshold = 2): SensorReading[] {
  if (rows.length < 10) return [];
  const readings = rows.map((r) => r.reading);
  const mean = readings.reduce((a, b) => a + b, 0) / readings.length;
  const std = Math.sqrt(readings.reduce((a, b) => a + (b - mean) ** 2, 0) / readings.length);
  if (std === 0) return [];
  return rows.filter((r) => Math.abs(r.reading - mean) > threshold * std);
}

export function computePercentiles(values: number[]): { p50: number; p90: number; p95: number; p99: number } {
  if (!values.length) return { p50: 0, p90: 0, p95: 0, p99: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const at = (p: number) => sorted[Math.floor((p / 100) * (sorted.length - 1))];
  return { p50: at(50), p90: at(90), p95: at(95), p99: at(99) };
}

export function movingAverage(values: number[], window = 10): number[] {
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}
