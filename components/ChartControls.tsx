"use client";
import { useEffect, useRef } from "react";
import { Maximize2, Minimize2, Download } from "lucide-react";
import { exportSvg } from "@/lib/export";

interface Props {
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  chartRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChartControls({ fullscreen, onToggleFullscreen, chartRef }: Props) {
  const handleExportSvg = () => {
    const svg = chartRef.current?.querySelector("svg") as SVGSVGElement | null;
    exportSvg(svg, "airtrend-chart.svg");
  };
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleExportSvg}
        className="p-2 rounded-lg text-muted hover:text-accent-cyan hover:bg-bg-hover transition-all"
        title="Export as SVG"
      >
        <Download className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-lg text-muted hover:text-accent-cyan hover:bg-bg-hover transition-all"
        title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
}

export function useEscapeToExit(active: boolean, onExit: () => void) {
  const ref = useRef(onExit);
  useEffect(() => { ref.current = onExit; }, [onExit]);
  useEffect(() => {
    if (!active) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") ref.current(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [active]);
}
