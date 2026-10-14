import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, decimals = 1): string {
  if (!Number.isFinite(n)) return "-";
  return n.toFixed(decimals);
}

export function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch { return iso; }
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return iso; }
}

export function statusColor(status: string): string {
  const s = status?.toUpperCase();
  if (s === "NORMAL") return "#22c55e";
  if (s === "WATCH") return "#f59e0b";
  if (s === "ANOMALY") return "#ef4444";
  return "#94a3b8";
}

export function statusBg(status: string): string {
  const s = status?.toUpperCase();
  if (s === "NORMAL") return "rgba(34,197,94,0.08)";
  if (s === "WATCH") return "rgba(245,158,11,0.08)";
  if (s === "ANOMALY") return "rgba(239,68,68,0.08)";
  return "rgba(148,163,184,0.08)";
}

import type { SensorReading, Status } from "./types";

export function generateDemoData(count = 300): SensorReading[] {
  const rows: SensorReading[] = [];
  const now = Date.now();
  const baseline = 415;
  const window: number[] = [];

  for (let i = count; i >= 0; i--) {
    const noise = (Math.random() - 0.5) * 20;
    const drift = Math.sin(i / 30) * 8;
    const reading = Math.round(baseline + noise + drift);
    window.push(reading);
    if (window.length > 15) window.shift();

    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const std = Math.sqrt(window.reduce((a, b) => a + (b - mean) ** 2, 0) / window.length);
    const trend = window.length >= 2
      ? window.slice(1).reduce((a, b, idx) => a + (b - window[idx]), 0) / (window.length - 1)
      : 0;
    const difference = reading - 478;

    let status: Status = "NORMAL";
    if (difference > 100) status = "ANOMALY";
    else if (difference > 50 || trend > 5) status = "WATCH";

    rows.push({
      timestamp: new Date(now - i * 1000).toISOString().slice(0, 19),
      reading, arduino_baseline: 478, difference,
      rolling_mean: Number(mean.toFixed(2)),
      rolling_std: Number(std.toFixed(2)),
      trend_per_sample: Number(trend.toFixed(2)),
      status,
    });
  }
  return rows;
}
