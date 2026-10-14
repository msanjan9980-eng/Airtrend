"use client";
import { AlertTriangle } from "lucide-react";
import { statusColor } from "@/lib/utils";

export default function AlertBanner({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s !== "ANOMALY" && s !== "WATCH") return null;
  const color = statusColor(s);
  return (
    <div className="rounded-xl border p-3 px-4 flex items-center gap-3 animate-slide-up"
         style={{ background: `${color}15`, borderColor: color }}>
      <AlertTriangle className="w-5 h-5" style={{ color }} />
      <p className="text-sm" style={{ color }}>
        <span className="font-semibold">{s}</span> - elevated signal detected. Monitor closely.
      </p>
    </div>
  );
}
