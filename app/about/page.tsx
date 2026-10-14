import { Cpu, Waves, Rocket, Zap, Shield, Activity } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <BrandHeader subtitle="How AirTrend works · architecture · stack" />

      <section className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
        <h2 className="text-lg font-semibold mb-3">What it is</h2>
        <p className="text-sm text-muted leading-relaxed">
          AirTrend is a real-time gas-signal monitoring system built around an Arduino Uno and an MQ-2
          gas sensor. It continuously samples analog readings, computes rolling statistics, and classifies
          each sample as <span className="text-accent-green font-medium">NORMAL</span>,
          {" "}<span className="text-accent-amber font-medium">WATCH</span>, or
          {" "}<span className="text-accent-red font-medium">ANOMALY</span> using a heuristic rule set.
          The dashboard streams the last 300 samples with 3-second polling.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card icon={<Cpu />} title="Hardware" color="#38bdf8">
          <ul className="text-sm text-muted space-y-1.5">
            <li>· Arduino Uno R3</li>
            <li>· MQ-2 combustible gas sensor</li>
            <li>· USB serial at 9600 baud</li>
            <li>· Baseline auto-calibration on-board</li>
          </ul>
        </Card>

        <Card icon={<Waves />} title="Signal Processing" color="#a78bfa">
          <ul className="text-sm text-muted space-y-1.5">
            <li>· 15-sample rolling window</li>
            <li>· Mean · standard deviation</li>
            <li>· Trend per sample (mean diff)</li>
            <li>· Sustained-deviation counter (5 samples)</li>
          </ul>
        </Card>

        <Card icon={<Rocket />} title="Frontend" color="#f59e0b">
          <ul className="text-sm text-muted space-y-1.5">
            <li>· Next.js 16 · React 19</li>
            <li>· Tailwind CSS 4</li>
            <li>· Recharts 3</li>
            <li>· TypeScript · App Router</li>
          </ul>
        </Card>

        <Card icon={<Activity />} title="Data Flow" color="#22c55e">
          <ul className="text-sm text-muted space-y-1.5">
            <li>· Arduino → COM port (1 Hz)</li>
            <li>· Python logger → CSV</li>
            <li>· CSV → /api/data</li>
            <li>· API → browser (3 s poll)</li>
          </ul>
        </Card>
      </div>

      <section className="rounded-2xl border border-border bg-bg-card p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-accent-amber" />
          <h2 className="text-lg font-semibold">Heuristic rules</h2>
        </div>
        <div className="space-y-3 text-sm">
          <Rule color="#22c55e" label="NORMAL" body="Difference ≤ 50 and trend ≤ 5. Signal is within baseline band." />
          <Rule color="#f59e0b" label="WATCH" body="Difference > 50 or trend > 5. Signal is rising but not sustained." />
          <Rule color="#ef4444" label="ANOMALY" body="Difference > 100 for 5+ consecutive samples. Sustained upward deviation." />
        </div>
        <p className="text-xs text-muted mt-4">
          These are heuristic classifications for a prototype — not certified gas safety warnings.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-bg-card p-6 flex items-center justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-accent-cyan" />
          <div>
            <p className="text-sm font-medium">Source code</p>
            <p className="text-xs text-muted">Explore the full implementation on GitHub</p>
          </div>
        </div>
        <a
          href="https://github.com/msanjan9980-eng/Airtrend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-accent-cyan hover:border-accent-cyan transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          View repo
        </a>
      </section>
    </div>
  );
}

function Card({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-3" style={{ color }}>
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Rule({ color, label, body }: { color: string; label: string; body: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-hover/40">
      <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: color }} />
      <div>
        <p className="font-semibold text-xs" style={{ color }}>{label}</p>
        <p className="text-xs text-muted mt-0.5">{body}</p>
      </div>
    </div>
  );
}
