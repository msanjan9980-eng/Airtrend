"use client";
import { useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import ChartControls, { useEscapeToExit } from "./ChartControls";
import { useSettings } from "@/lib/store";

type Range = "1m" | "5m" | "15m" | "all";
type ChartKind = "area" | "line";

interface Props {
  data: SensorReading[];
}

export default function SignalChart({ data }: Props) {
  const [range, setRange] = useState<Range>("5m");
  const [kind, setKind] = useState<ChartKind>("area");
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  useEscapeToExit(fullscreen, () => setFullscreen(false));

  const filtered = useMemo(() => {
    const ordered = [...data].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    );

    if (range === "all" || ordered.length === 0) return ordered;

    const seconds = range === "1m" ? 60 : range === "5m" ? 300 : 900;
    const latest = new Date(
      ordered[ordered.length - 1].timestamp
    ).getTime();

    return ordered.filter((r) => {
      const timestamp = new Date(r.timestamp).getTime();
      return Number.isFinite(timestamp) &&
        latest - timestamp >= 0 &&
        latest - timestamp <= seconds * 1000;
    });
  }, [data, range]);

  const chartData = useMemo(() => filtered.map((r) => ({
    time: formatTime(r.timestamp),
    reading: r.reading,
    mean: r.rolling_mean,
  })), [filtered]);

  const thresholds = useMemo(() => {
    if (!settings.showThresholds || !data.length) return null;
    const baseline = data[data.length - 1].arduino_baseline;
    return { watch: baseline + 50, anomaly: baseline + 100 };
  }, [data, settings.showThresholds]);

  const gridStroke = settings.showGrid ? "var(--at-border)" : "transparent";

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-border bg-bg-card p-6 animate-slide-up ${fullscreen ? "chart-fullscreen" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold">Live Sensor Signal</h3>
          <p className="text-xs text-muted mt-0.5">Raw MQ-2 readings vs. rolling average</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <RangeSelector value={range} onChange={setRange} />
          <KindSelector value={kind} onChange={setKind} />
          <ChartControls fullscreen={fullscreen} onToggleFullscreen={() => setFullscreen((v) => !v)} chartRef={containerRef} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs mb-4">
        <Legend color="#38bdf8" label="MQ-2 Signal" />
        <Legend color="#a78bfa" label="Rolling Avg" />
        {thresholds && <Legend color="#f59e0b" label="WATCH" dashed />}
        {thresholds && <Legend color="#ef4444" label="ANOMALY" dashed />}
      </div>

      <div style={{ height: fullscreen ? "calc(100vh - 260px)" : "22rem" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="readingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={40} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{ background: "var(--at-bg-panel)", border: "1px solid var(--at-border-accent)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "var(--at-text-muted)" }}
              cursor={{ stroke: "#38bdf8", strokeDasharray: "3 3" }}
            />
            {thresholds && (
              <>
                <ReferenceLine y={thresholds.watch} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: "WATCH", fill: "#f59e0b", fontSize: 10, position: "right" }} />
                <ReferenceLine y={thresholds.anomaly} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "ANOMALY", fill: "#ef4444", fontSize: 10, position: "right" }} />
              </>
            )}
            {kind === "area" ? (
              <Area type="monotone" dataKey="reading" stroke="#38bdf8" strokeWidth={2}
                    fill="url(#readingGradient)" name="MQ-2 Signal" isAnimationActive={false} />
            ) : (
              <Line type="monotone" dataKey="reading" stroke="#38bdf8" strokeWidth={2}
                    dot={false} name="MQ-2 Signal" isAnimationActive={false} />
            )}
            <Line type="monotone" dataKey="mean" stroke="#a78bfa" strokeWidth={2}
                  dot={false} name="Rolling Avg" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RangeSelector({ value, onChange }: { value: Range; onChange: (v: Range) => void }) {
  const options: Range[] = ["1m", "5m", "15m", "all"];
  return (
    <div className="flex items-center rounded-lg border border-border bg-bg-panel overflow-hidden text-xs">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-2.5 py-1.5 transition-colors ${value === o ? "bg-accent-cyan/15 text-accent-cyan" : "text-muted hover:bg-bg-hover"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function KindSelector({ value, onChange }: { value: ChartKind; onChange: (v: ChartKind) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-bg-panel overflow-hidden text-xs">
      {(["area", "line"] as ChartKind[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`px-2.5 py-1.5 capitalize transition-colors ${value === k ? "bg-accent-cyan/15 text-accent-cyan" : "text-muted hover:bg-bg-hover"}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {dashed ? (
        <span className="w-4 h-0.5" style={{ background: `repeating-linear-gradient(to right, ${color} 0 3px, transparent 3px 6px)` }} />
      ) : (
        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
      )}
      <span className="text-muted">{label}</span>
    </div>
  );
}
