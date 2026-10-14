export default function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <p>Prototype monitoring only. Statuses are heuristic, not certified safety warnings.</p>
        <p className="font-mono">AirTrend v1.0 - MQ-2 - Arduino Uno - Next.js</p>
      </div>
    </footer>
  );
}
