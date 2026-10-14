"use client";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading } from "@/lib/types";
import { formatTime } from "@/lib/utils";

export default function SignalChart({ data }: { data: SensorReading[] }) {
  const chartData = data.map((r) => ({
    time: formatTime(r.timestamp),
    reading: r.reading,
    mean: r.rolling_mean,
  }));

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Live Sensor Signal</h3>
          <p className="text-xs text-slate-400 mt-0.5">Raw MQ-2 readings vs. rolling average</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-cyan" />
            <span className="text-slate-400">MQ-2 Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-accent-purple" />
            <span className="text-slate-400">Rolling Avg</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="readingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={40} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #26334d", borderRadius: 8, fontSize: 12 }}
                     labelStyle={{ color: "#94a3b8" }} />
            <Area type="monotone" dataKey="reading" stroke="#38bdf8" strokeWidth={2}
                  fill="url(#readingGradient)" name="MQ-2 Signal" isAnimationActive={false} />
            <Line type="monotone" dataKey="mean" stroke="#a78bfa" strokeWidth={2}
                  dot={false} name="Rolling Avg" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
