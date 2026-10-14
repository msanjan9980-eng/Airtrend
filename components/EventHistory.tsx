"use client";
import { AlertCircle, Inbox } from "lucide-react";
import type { SensorReading } from "@/lib/types";
import { formatDate, formatTime, statusColor } from "@/lib/utils";

export default function EventHistory({ data }: { data: SensorReading[] }) {
  const events = data.filter((r) => r.status === "WATCH" || r.status === "ANOMALY").slice(-10).reverse();

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-accent-amber" />
        <h3 className="text-lg font-semibold">Event History</h3>
        <span className="ml-auto text-xs text-slate-400">
          {events.length} event{events.length === 1 ? "" : "s"}
        </span>
      </div>
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Inbox className="w-10 h-10 mb-3 opacity-50" />
          <p className="text-sm">No WATCH or ANOMALY events</p>
          <p className="text-xs mt-1">Signal has been within normal range</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {events.map((e, i) => (
            <li key={`${e.timestamp}-${i}`}
                className="flex items-center justify-between p-3 rounded-lg bg-bg-hover/50 border border-border/50">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full" style={{ background: statusColor(e.status) }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: statusColor(e.status) }}>{e.status}</p>
                  <p className="text-xs text-slate-500 font-mono">
                    {formatDate(e.timestamp)} - {formatTime(e.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <p className="text-slate-300">Reading: {e.reading}</p>
                <p className="text-slate-500">
                  Trend: {e.trend_per_sample > 0 ? "+" : ""}{e.trend_per_sample?.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
