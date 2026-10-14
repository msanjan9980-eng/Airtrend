"use client";
import { useEffect, useMemo, useState } from "react";
import { Activity, Droplets, Gauge, TrendingUp, Waves, Zap } from "lucide-react";

import BrandHeader from "@/components/BrandHeader";
import StatusBanner from "@/components/StatusBanner";
import MetricCard from "@/components/MetricCard";
import SignalChart from "@/components/SignalChart";
import TrendChart from "@/components/TrendChart";
import ReadingsTable from "@/components/ReadingsTable";
import EventHistory from "@/components/EventHistory";
import AlertBanner from "@/components/AlertBanner";
import Footer from "@/components/Footer";
import SkeletonCard from "@/components/SkeletonCard";
import Sparkline from "@/components/Sparkline";
import AnimatedNumber from "@/components/AnimatedNumber";
import { useToast } from "@/components/ToastProvider";
import { useSettings } from "@/lib/store";
import { useBeep, useInterval } from "@/lib/hooks";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [lastStatus, setLastStatus] = useState<string>("");
  const { settings } = useSettings();
  const { push } = useToast();
  const beep = useBeep(880, 150);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      setRows(data.rows);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useInterval(fetchData, settings.refreshMs);

  useEffect(() => {
    const cur = stats?.current?.status?.toUpperCase() ?? "";
    if (!cur || cur === lastStatus) return;
    if ((cur === "WATCH" || cur === "ANOMALY") && settings.soundAlerts) beep();
    if (cur === "ANOMALY" && lastStatus !== "ANOMALY") {
      push({ title: "Anomaly detected", message: `Reading ${stats?.current?.reading}`, variant: "error" });
    } else if (cur === "WATCH" && lastStatus === "NORMAL") {
      push({ title: "Signal watch", message: `Trend ${stats?.current?.trend_per_sample.toFixed(2)}`, variant: "warning" });
    } else if (cur === "NORMAL" && (lastStatus === "WATCH" || lastStatus === "ANOMALY")) {
      push({ title: "Signal recovered", message: "Back to normal range", variant: "success" });
    }
    setLastStatus(cur);
    setDismissedAlert(false);
  }, [stats, lastStatus, settings.soundAlerts, beep, push]);

  const current = stats?.current ?? null;
  const recentReadings = useMemo(() => rows.slice(-30).map((r) => r.reading), [rows]);
  const miniStats = useMemo(() => ({
    avg: stats?.avgReading ?? 0,
    total: stats?.totalReadings ?? 0,
    watch: stats?.watchCount ?? 0,
    uptime: stats?.uptime ?? "0s",
  }), [stats]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <SkeletonCard lines={1} />
        <SkeletonCard lines={3} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} lines={1} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <BrandHeader subtitle="Predictive Gas-Signal Monitoring · Live Hardware Telemetry" />

      {error && (
        <div className="rounded-xl border p-4 text-sm"
             style={{ borderColor: "#ef4444", background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          Failed to load data: {error}
        </div>
      )}

      {!dismissedAlert && (
        <AlertBanner status={current?.status ?? ""} onDismiss={() => setDismissedAlert(true)} />
      )}

      <StatusBanner reading={current} />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="MQ-2 Reading" value={<AnimatedNumber value={current?.reading ?? 0} />}
                    icon={Droplets} color="#38bdf8" hint="Raw analog signal (0-1023)" />
        <MetricCard label="Rolling Average"
                    value={<AnimatedNumber value={current?.rolling_mean ?? 0} decimals={1} />}
                    icon={Activity} color="#a78bfa" hint="15-sample moving mean" />
        <MetricCard label="Signal Variability"
                    value={<AnimatedNumber value={current?.rolling_std ?? 0} decimals={1} />}
                    icon={Waves} color="#f59e0b" hint="Standard deviation" />
        <MetricCard label="Trend / Sample"
                    value={`${(current?.trend_per_sample ?? 0) > 0 ? "+" : ""}${formatNumber(current?.trend_per_sample ?? 0, 2)}`}
                    icon={TrendingUp}
                    color={(current?.trend_per_sample ?? 0) > 0 ? "#ef4444" : "#22c55e"}
                    trend={current?.trend_per_sample}
                    hint="Change per sample" />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat icon={<Gauge className="w-4 h-4" />} label="Avg Reading"
                  value={<AnimatedNumber value={miniStats.avg} decimals={1} />}
                  sparkline={recentReadings} />
        <MiniStat icon={<Zap className="w-4 h-4" />} label="Total Samples"
                  value={<AnimatedNumber value={miniStats.total} />} />
        <MiniStat icon={<Activity className="w-4 h-4" />} label="Watch Events"
                  value={<AnimatedNumber value={miniStats.watch} />} accent="#f59e0b" />
        <MiniStat icon={<Activity className="w-4 h-4" />} label="Uptime"
                  value={miniStats.uptime} />
      </section>

      <SignalChart data={rows} />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={rows} />
        <ReadingsTable data={rows} />
      </section>

      <EventHistory data={rows} />

      <Footer />
    </div>
  );
}

function MiniStat({ icon, label, value, sparkline, accent = "var(--at-text)" }: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sparkline?: number[];
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 transition-all hover:border-border-accent animate-slide-up">
      <div className="flex items-center justify-between text-muted mb-2">
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
