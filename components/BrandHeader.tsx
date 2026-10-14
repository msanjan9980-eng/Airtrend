"use client";
import { Radio } from "lucide-react";

export default function BrandHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Radio className="w-6 h-6 text-accent-cyan" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-green rounded-full pulse-dot" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">AirTrend</h1>
      </div>
      <p className="text-sm text-muted mt-1">{subtitle}</p>
    </div>
  );
}
