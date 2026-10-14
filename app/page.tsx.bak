"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, Droplets, Gauge, TrendingUp, Waves, Zap } from "lucide-react";

import Header from "@/components/Header";
import StatusBanner from "@/components/StatusBanner";
import MetricCard from "@/components/MetricCard";
import SignalChart from "@/components/SignalChart";
import TrendChart from "@/components/TrendChart";
import ReadingsTable from "@/components/ReadingsTable";
import EventHistory from "@/components/EventHistory";
import AlertBanner from "@/components/AlertBanner";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Sparkline from "@/components/Sparkline";

import type { SensorReading, DashboardStats } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface ApiResponse {
  rows: SensorReading[];
  stats: DashboardStats;
  generatedAt: string;
}

export default function HomePage() {
  const [rows, setRows] = useState<SensorReading[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      setRows(data.rows);
      setStats(data.stats);
      setLastUpdated(data.generatedAt);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 3000);
    return () => clearInterval(id);
  }, [fetchData]);

  if (loading) return <Loading />;

  const current = stats?.current ?? null;
  const recentReadings = rows.slice(-30).map((r) => r.reading);

  return (
    <div className="min-h-screen flex flex-col">
      <Header lastUpdated={lastUpdated} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="rounded-xl border border-accent-red bg-accent-red/10 p-4 text-sm text-accent-red">
            Failed to load data: {error}
          </div>
        )}

        <AlertBanner status={current?.status ?? ""} />
        <StatusBanner reading={current} />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="MQ-2 Reading" value={current?.reading ?? "-"} icon={Droplets}
                      color="#38bdf8" hint="Raw analog signal (0-1023)" />
          <MetricCard label="Rolling Average"
                      value={current ? formatNumber(current.rolling_mean) : "-"}
                      icon={Activity} color="#a78bfa" hint="15-sample moving mean" />
          <MetricCard label="Signal Variability"
                      value={current ? formatNumber(current.rolling_std) : "-"}
                      icon={Waves} color="#f59e0b" hint="Standard deviation" />
          <MetricCard label="Trend / Sample"
                      value={current ? `${current.trend_per_sample > 0 ? "+" : ""}${formatNumber(current.trend_per_sample, 2)}` : "-"}
                      icon={TrendingUp}
                      color={(current?.trend_per_sample ?? 0) > 0 ? "#ef4444" : "#22c55e"}
                      trend={current?.trend_per_sample}
                      hint="Change per sample" />
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStat icon={<Gauge className="w-4 h-4" />} label="Avg Reading"
                    value={formatNumber(stats?.avgReading ?? 0)} sparkline={recentReadings} />
          <MiniStat icon={<Zap className="w-4 h-4" />} label="Total Samples"
                    value={stats?.totalReadings ?? 0} />
          <MiniStat icon={<Activity className="w-4 h-4" />} label="Watch Events"
                    value={stats?.watchCount ?? 0} accent="#f59e0b" />
          <MiniStat icon={<Activity className="w-4 h-4" />} label="Uptime"
                    value={stats?.uptime ?? "0s"} />
        </section>

        <SignalChart data={rows} />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart data={rows} />
          <ReadingsTable data={rows} />
        </section>

        <EventHistory data={rows} />
      </main>
      <Footer />
    </div>
  );
}

function MiniStat({ icon, label, value, sparkline, accent = "#eef2ff" }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sparkline?: number[];
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 transition-all hover:border-border-accent animate-slide-up">
      <div className="flex items-center justify-between text-slate-500 mb-2">
        <span className="text-xs uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="text-xl font-bold font-mono tabular-nums" style={{ color: accent }}>{value}</p>
      {sparkline && sparkline.length > 1 && (
        <div className="mt-2 -mx-1"><Sparkline data={sparkline} /></div>
      )}
    </div>
  );
}
