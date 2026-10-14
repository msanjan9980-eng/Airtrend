"use client";
import { ArrowDown } from "lucide-react";
import type { SensorReading } from "@/lib/types";
import { formatTime, statusColor } from "@/lib/utils";

export default function ReadingsTable({ data }: { data: SensorReading[] }) {
  const rows = [...data].slice(-12).reverse();
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Recent Readings</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last {rows.length} samples, newest first</p>
        </div>
        <ArrowDown className="w-4 h-4 text-slate-500" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-border">
              <th className="text-left py-2 font-medium">TIME</th>
              <th className="text-right py-2 font-medium">READING</th>
              <th className="text-right py-2 font-medium">MEAN</th>
              <th className="text-right py-2 font-medium">TREND</th>
              <th className="text-right py-2 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.timestamp}-${i}`} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                <td className="py-2 text-slate-300">{formatTime(r.timestamp)}</td>
                <td className="py-2 text-right tabular-nums">{r.reading}</td>
                <td className="py-2 text-right tabular-nums text-slate-400">{r.rolling_mean?.toFixed(2) ?? "-"}</td>
                <td className="py-2 text-right tabular-nums"
                    style={{ color: r.trend_per_sample > 0 ? "#f59e0b" : r.trend_per_sample < 0 ? "#94a3b8" : "#64748b" }}>
                  {r.trend_per_sample > 0 ? "+" : ""}{r.trend_per_sample?.toFixed(2) ?? "0.00"}
                </td>
                <td className="py-2 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ color: statusColor(r.status), background: `${statusColor(r.status)}20` }}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
