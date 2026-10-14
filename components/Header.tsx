"use client";
import { Activity, Github, Radio } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header({ lastUpdated }: { lastUpdated: string | null }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const secondsAgo = lastUpdated
    ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / 1000)
    : null;

  return (
    <header className="border-b border-border bg-bg-panel/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="w-7 h-7 text-accent-cyan" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-green rounded-full pulse-dot" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AirTrend</h1>
            <p className="text-xs text-slate-400">Predictive Gas-Signal Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <Activity className="w-4 h-4 text-accent-green" />
            <span className="text-slate-400">
              {secondsAgo === null ? "Awaiting data" : secondsAgo < 5 ? "LIVE" : `${secondsAgo}s ago`}
            </span>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
             className="text-slate-400 hover:text-accent-cyan transition-colors" aria-label="GitHub">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
