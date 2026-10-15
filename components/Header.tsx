"use client";

import { Command, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ConnectionStatus from "./ConnectionStatus";

type SensorStatus = {
  timestamp: string | null;
  error: string | null;
};

export default function Header() {
  const [sensor, setSensor] = useState<SensorStatus>({
    timestamp: null,
    error: null,
  });
  const [, setTick] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchLatest = async () => {
      try {
        const response = await fetch("/api/data", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const rows = Array.isArray(data.rows) ? data.rows : [];

        const newest = rows.reduce(
          (latest: string | null, row: { timestamp?: string }) => {
            if (!row.timestamp) return latest;
            if (!latest) return row.timestamp;

            return new Date(row.timestamp).getTime() >
              new Date(latest).getTime()
              ? row.timestamp
              : latest;
          },
          null
        );

        if (active) {
          setSensor({ timestamp: newest, error: null });
        }
      } catch (err) {
        if (active) {
          setSensor({
            timestamp: null,
            error: err instanceof Error ? err.message : "Connection failed",
          });
        }
      }
    };

    void fetchLatest();

    const pollId = window.setInterval(() => {
      void fetchLatest();
    }, 3000);

    const tickId = window.setInterval(() => {
      setTick((tick) => tick + 1);
    }, 1000);

    return () => {
      active = false;
      window.clearInterval(pollId);
      window.clearInterval(tickId);
    };
  }, []);

  const timestamp = sensor.timestamp
    ? new Date(sensor.timestamp).getTime()
    : NaN;

  const secondsAgo = Number.isFinite(timestamp)
    ? Math.max(0, Math.floor((Date.now() - timestamp) / 1000))
    : null;

  return (
    <header className="border-b border-border bg-bg-panel/60 backdrop-blur-md sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="relative">
            <Radio className="w-6 h-6 text-accent-cyan" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-green rounded-full pulse-dot" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">AirTrend</h1>
        </div>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-muted">Overview Dashboard</p>
        </div>

        <div className="flex items-center gap-2">
          <ConnectionStatus secondsAgo={secondsAgo} error={sensor.error} />

          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "k",
                  ctrlKey: true,
                  metaKey: true,
                  bubbles: true,
                })
              );
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-card text-xs text-muted hover:border-border-accent hover:text-accent-cyan transition-all"
            title="Open command palette"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Commands</span>
            <kbd className="px-1.5 py-0.5 rounded bg-bg-hover font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
