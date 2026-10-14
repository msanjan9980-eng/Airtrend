"use client";
import { AlertTriangle, X } from "lucide-react";
import { statusColor } from "@/lib/utils";

export default function AlertBanner({ status, onDismiss }: { status: string; onDismiss?: () => void }) {
  const s = status?.toUpperCase();
  if (s !== "ANOMALY" && s !== "WATCH") return null;
  const color = statusColor(s);
  return (
    <div className="rounded-xl border p-3 px-4 flex items-center gap-3 animate-slide-up relative overflow-hidden"
         style={{ background: `${color}15`, borderColor: color }}>
      <span className="absolute inset-0 rounded-xl pointer-events-none" style={{ background: `${color}10` }}>
        <span className="block absolute left-0 top-0 bottom-0 w-2 rounded-l-xl" style={{ background: color }} />
      </span>
      <AlertTriangle className="w-5 h-5 shrink-0 relative" style={{ color }} />
      <p className="text-sm flex-1 relative" style={{ color }}>
        <span className="font-semibold">{s}</span> — elevated signal detected. Monitor closely.
      </p>
      {onDismiss && (
        <button onClick={onDismiss} className="relative text-slate-500 hover:text-slate-300 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
