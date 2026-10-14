"use client";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

export default function ConnectionStatus({ secondsAgo, error }: { secondsAgo: number | null; error?: string | null }) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
           style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
        <WifiOff className="w-3.5 h-3.5" />
        <span>Disconnected</span>
      </div>
    );
  }
  if (secondsAgo === null) {
    return (
      <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-bg-hover text-muted">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Connecting…</span>
      </div>
    );
  }
  if (secondsAgo < 5) {
    return (
      <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
           style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
        <Wifi className="w-3.5 h-3.5" />
        <span className="font-semibold">LIVE</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
         style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
      <Wifi className="w-3.5 h-3.5" />
      <span>{secondsAgo}s ago</span>
    </div>
  );
}
