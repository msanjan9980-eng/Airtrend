"use client";
import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Percent } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading } from "@/lib/types";
import BrandHeader from "@/components/BrandHeader";
import SkeletonCard from "@/components/SkeletonCard";
import AnimatedNumber from "@/components/AnimatedNumber";
import { histogram, hourlyBuckets, computePercentiles, movingAverage } from "@/lib/analytics";

interface ApiResponse { rows: SensorReading[] }

export default function AnalyticsPage() {
  const [rows, setRows] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/data", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: ApiResponse) => { setRows(d.rows); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <SkeletonCard lines={1} />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      </div>
    );
  }

  const readings = rows.map((r) => r.reading);
  const pcts = computePercentiles(readings);
  const hist = histogram(readings, 12);
  const buckets = hourlyBuckets(rows);
  const ma = movingAverage(readings, 20).slice(-100);
  const maData = ma.map((v, i) => ({ i, v }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <BrandHeader subtitle="Deep statistics · distributions · percentiles · trends" />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Samples" value={<AnimatedNumber value={rows.length} />} icon={<BarChart3 className="w-4 h-4" />} />
        <StatCard label="p50" value={<AnimatedNumber value={pcts.p50} decimals={1} />} icon={<Percent className="w-4 h-4" />} />
        <StatCard label="p90" value={<AnimatedNumber value={pcts.p90} decimals={1} />} color="#f59e0b" icon={<Percent className="w-4 h-4" />} />
        <StatCard label="p99" value={<AnimatedNumber value={pcts.p99} decimals={1} />} color="#ef4444" icon={<TrendingUp className="w-4 h-4" />} />
      </section>

      <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-1">Reading Distribution</h3>
        <p className="text-xs text-muted mb-4">Histogram of {readings.length} samples across 12 bins</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hist}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--at-border)" />
              <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--at-bg-panel)", border: "1px solid var(--at-border-accent)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]}>
                {hist.map((_, i) => (
                  <Cell key={i} fill={i < 3 ? "#22c55e" : i < hist.length - 3 ? "#38bdf8" : "#f59e0b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-1">Hourly Averages</h3>
        <p className="text-xs text-muted mb-4">Mean reading per hour bucket</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={buckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--at-border)" />
              <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--at-bg-panel)", border: "1px solid var(--at-border-accent)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="avg" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-1">Moving Average (20)</h3>
        <p className="text-xs text-muted mb-4">Last 100 samples smoothed</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={maData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--at-border)" />
              <XAxis dataKey="i" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "var(--at-bg-panel)", border: "1px solid var(--at-border-accent)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "var(--at-text)" }: { label: string; value: React.ReactNode; icon: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 animate-slide-up">
      <div className="flex items-center justify-between text-muted mb-2">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold font-mono tabular-nums" style={{ color }}>{value}</p>
    </div>
  );
}
