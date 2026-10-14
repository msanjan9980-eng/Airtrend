"use client";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Download, Filter, Inbox } from "lucide-react";
import type { SensorReading, Status } from "@/lib/types";
import BrandHeader from "@/components/BrandHeader";
import SkeletonCard from "@/components/SkeletonCard";
import { formatDate, formatTime, statusColor } from "@/lib/utils";
import { exportCsv } from "@/lib/export";

type Filter = "all" | "WATCH" | "ANOMALY";

export default function EventsPage() {
  const [rows, setRows] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/data", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { rows: SensorReading[] }) => { setRows(d.rows); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const events = useMemo(() => {
    const all = rows.filter((r) => r.status === "WATCH" || r.status === "ANOMALY");
    const filtered = filter === "all" ? all : all.filter((r) => r.status === filter);
    return [...filtered].reverse();
  }, [rows, filter]);

  const counts = useMemo(() => ({
    watch: rows.filter((r) => r.status === "WATCH").length,
    anomaly: rows.filter((r) => r.status === "ANOMALY").length,
  }), [rows]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <SkeletonCard lines={3} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <BrandHeader subtitle="Every WATCH and ANOMALY status in your dataset" />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CountCard label="Total Events" value={events.length} color="#38bdf8" />
        <CountCard label="Watch Events" value={counts.watch} color="#f59e0b" />
        <CountCard label="Anomaly Events" value={counts.anomaly} color="#ef4444" />
      </section>

      <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <span className="text-sm text-muted">Filter:</span>
            {(["all", "WATCH", "ANOMALY"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                  filter === f
                    ? "border-accent-cyan text-accent-cyan bg-accent-cyan/10"
                    : "border-border text-muted hover:border-border-accent"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <button
            onClick={() => exportCsv(events, "airtrend-events.csv")}
            disabled={!events.length}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-accent-cyan hover:border-border-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Inbox className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm">No events match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted border-b border-border">
                  <th className="text-left py-2.5 font-medium">STATUS</th>
                  <th className="text-left py-2.5 font-medium">TIMESTAMP</th>
                  <th className="text-right py-2.5 font-medium">READING</th>
                  <th className="text-right py-2.5 font-medium">MEAN</th>
                  <th className="text-right py-2.5 font-medium">TREND</th>
                  <th className="text-right py-2.5 font-medium">DIFF</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {events.map((e, i) => (
                  <tr key={`${e.timestamp}-${i}`} className="border-b border-border/50 hover:bg-bg-hover transition-colors">
                    <td className="py-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
                        style={{ color: statusColor(e.status), background: `${statusColor(e.status)}20` }}
                      >
                        <AlertCircle className="w-3 h-3" />
                        {e.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted text-xs">{formatDate(e.timestamp)} · {formatTime(e.timestamp)}</td>
                    <td className="py-2.5 text-right tabular-nums">{e.reading}</td>
                    <td className="py-2.5 text-right tabular-nums text-muted">{e.rolling_mean.toFixed(2)}</td>
                    <td className="py-2.5 text-right tabular-nums" style={{ color: e.trend_per_sample > 0 ? "#f59e0b" : "#64748b" }}>
                      {e.trend_per_sample > 0 ? "+" : ""}{e.trend_per_sample.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right tabular-nums" style={{ color: e.difference > 0 ? "#ef4444" : "#22c55e" }}>
                      {e.difference > 0 ? "+" : ""}{e.difference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CountCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5 animate-slide-up">
      <p className="text-xs uppercase tracking-wider text-muted mb-2">{label}</p>
      <p className="text-3xl font-bold font-mono tabular-nums" style={{ color }}>{value}</p>
    </div>
  );
}
