export default function SkeletonCard({ lines = 2, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-bg-card p-5 ${className}`}>
      <div className="skeleton h-3 w-24 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-6 w-full mb-2" style={{ width: `${70 - i * 15}%` }} />
      ))}
    </div>
  );
}
