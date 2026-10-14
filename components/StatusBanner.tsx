"use client";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { statusBg, statusColor, formatDate, formatTime } from "@/lib/utils";
import type { SensorReading } from "@/lib/types";

export default function StatusBanner({ reading }: { reading: SensorReading | null }) {
  if (!reading) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card p-6 animate-pulse">
        <div className="h-4 w-40 bg-slate-700 rounded mb-3" />
        <div className="h-8 w-32 bg-slate-700 rounded" />
      </div>
    );
  }
  const status = reading.status?.toUpperCase() || "UNKNOWN";
  const color = statusColor(status);
  const bg = statusBg(status);
  const Icon = status === "NORMAL" ? CheckCircle2 : status === "WATCH" ? AlertTriangle : status === "ANOMALY" ? ShieldAlert : CheckCircle2;
  const glow = status === "NORMAL" ? "glow-green" : status === "WATCH" ? "glow-amber" : "glow-red";

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-500 ${glow} animate-slide-up`}
         style={{ background: bg, borderColor: color }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
            <Icon className="w-7 h-7" style={{ color }} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
            <p className="text-3xl font-bold" style={{ color }}>{status}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Latest Sample</p>
          <p className="text-sm font-mono text-slate-200">
            {formatDate(reading.timestamp)} - {formatTime(reading.timestamp)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Difference:{" "}
            <span className="font-mono" style={{ color: reading.difference > 0 ? "#ef4444" : "#22c55e" }}>
              {reading.difference > 0 ? "+" : ""}{reading.difference}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
