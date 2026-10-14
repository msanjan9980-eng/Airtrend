"use client";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export default function TrendChart({ data }: { data: SensorReading[] }) {
  const chartData = data.map((r) => ({
    time: formatTime(r.timestamp),
    trend: r.trend_per_sample,
  }));

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Rate of Change</h3>
        <p className="text-xs text-slate-400 mt-0.5">Per-sample trend - positive = rising gas signal</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={40} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #26334d", borderRadius: 8, fontSize: 12 }}
                     labelStyle={{ color: "#94a3b8" }} />
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
