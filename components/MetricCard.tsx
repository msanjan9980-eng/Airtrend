"use client";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number | React.ReactNode;
  hint?: string;
  color?: string;
  icon?: LucideIcon;
  trend?: number;
}

export default function MetricCard({ label, value, hint, color = "var(--at-text)", icon: Icon, trend }: Props) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-bg-card p-5 transition-all duration-300",
      "hover:border-border-accent hover:bg-bg-hover hover:-translate-y-0.5 animate-slide-up"
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs uppercase tracking-wider text-muted font-medium">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-muted" />}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold font-mono tabular-nums" style={{ color }}>{value}</p>
        {typeof trend === "number" && Number.isFinite(trend) && (
          <span className={cn("text-xs font-mono mb-1",
            trend > 0 ? "text-accent-red" : trend < 0 ? "text-accent-green" : "text-muted")}>
            {trend > 0 ? "UP" : trend < 0 ? "DN" : "--"} {Math.abs(trend).toFixed(2)}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted mt-2">{hint}</p>}
    </div>
  );
}
