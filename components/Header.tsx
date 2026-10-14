"use client";
import { Command, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ConnectionStatus from "./ConnectionStatus";

export default function Header() {
  const [, setTick] = useState(0);
  const [lastPing] = useState(() => new Date().toISOString());
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const secondsAgo = Math.floor((Date.now() - new Date(lastPing).getTime()) / 1000);

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
          <ConnectionStatus secondsAgo={secondsAgo} />
          <button
            onClick={() => {
              const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, metaKey: true, bubbles: true });
              window.dispatchEvent(e);
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-card text-xs text-muted hover:border-border-accent hover:text-accent-cyan transition-all"
            title="Open command palette"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Commands</span>
            <kbd className="px-1.5 py-0.5 rounded bg-bg-hover font-mono text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
