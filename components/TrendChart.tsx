"use client";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { useSettings } from "@/lib/store";

export default function TrendChart({ data }: { data: SensorReading[] }) {
  const { settings } = useSettings();
  const [fullscreen, setFullscreen] = useState(false);

  const chartData = useMemo(() => data.map((r) => ({
    time: formatTime(r.timestamp),
    trend: r.trend_per_sample,
  })), [data]);

  const gridStroke = settings.showGrid ? "var(--at-border)" : "transparent";

  return (
    <div className={`rounded-2xl border border-border bg-bg-card p-6 animate-slide-up ${fullscreen ? "chart-fullscreen" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Rate of Change</h3>
          <p className="text-xs text-muted mt-0.5">Per-sample trend · orange = rising</p>
        </div>
        <button
          onClick={() => setFullscreen((v) => !v)}
          className="text-xs px-2.5 py-1 rounded-lg border border-border text-muted hover:text-accent-cyan hover:border-border-accent transition-all"
        >
          {fullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>
      <div style={{ height: fullscreen ? "calc(100vh - 200px)" : "16rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={40} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "var(--at-bg-panel)", border: "1px solid var(--at-border-accent)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "var(--at-text-muted)" }} />
            <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
            <Bar dataKey="trend" name="Trend">
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.trend > 0 ? "#f59e0b" : "#64748b"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
