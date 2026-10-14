export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-mono">Loading AirTrend...</p>
      </div>
    </div>
  );
}
