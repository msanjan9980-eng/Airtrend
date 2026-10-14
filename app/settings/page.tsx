"use client";
import { RotateCcw, Volume2, Grid3x3, Eye, Zap } from "lucide-react";
import BrandHeader from "@/components/BrandHeader";
import { useSettings } from "@/lib/store";
import type { Settings } from "@/lib/store";

export default function SettingsPage() {
  const { settings, update, reset } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <BrandHeader subtitle="Personalize your dashboard. Settings persist locally." />

      <Section title="Appearance">
        <Row label="Theme" description="Dark (midnight) or Light (slate) color scheme">
          <SegmentedControl<Settings["theme"]>
            value={settings.theme}
            options={[
              { value: "dark", label: "Dark" },
              { value: "light", label: "Light" },
            ]}
            onChange={(v) => update("theme", v)}
          />
        </Row>
        <Row label="Compact mode" description="Reduce padding across cards">
          <Toggle value={settings.compactMode} onChange={(v) => update("compactMode", v)} />
        </Row>
      </Section>

      <Section title="Data & Refresh">
        <Row label="Refresh interval" description="How often the dashboard polls for new data">
          <SegmentedControl<number>
            value={settings.refreshMs}
            options={[
              { value: 1000, label: "1s" },
              { value: 3000, label: "3s" },
              { value: 5000, label: "5s" },
              { value: 10000, label: "10s" },
            ]}
            onChange={(v) => update("refreshMs", v)}
          />
        </Row>
        <Row label="Default time range" description="Initial range for the signal chart">
          <SegmentedControl<Settings["defaultRange"]>
            value={settings.defaultRange}
            options={[
              { value: "1m", label: "1m" },
              { value: "5m", label: "5m" },
              { value: "15m", label: "15m" },
              { value: "all", label: "All" },
            ]}
            onChange={(v) => update("defaultRange", v)}
          />
        </Row>
      </Section>

      <Section title="Chart Display">
        <Row label="Show grid" description="Display background grid on charts">
          <Toggle value={settings.showGrid} onChange={(v) => update("showGrid", v)} />
        </Row>
        <Row label="Show thresholds" description="Reference lines for WATCH and ANOMALY levels">
          <Toggle value={settings.showThresholds} onChange={(v) => update("showThresholds", v)} />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row label="Sound alerts" description="Play a beep when an anomaly is detected">
          <Toggle value={settings.soundAlerts} onChange={(v) => update("soundAlerts", v)} />
        </Row>
      </Section>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-bg-card p-5">
        <div>
          <p className="text-sm font-medium">Reset to defaults</p>
          <p className="text-xs text-muted mt-0.5">Restore every setting to factory values</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted hover:text-accent-red hover:border-accent-red transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card p-5 flex items-center gap-3">
        <Zap className="w-5 h-5 text-accent-amber" />
        <p className="text-xs text-muted">
          Settings are stored in your browser's localStorage. They persist across visits and never leave your device.
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card overflow-hidden animate-slide-up">
      <div className="px-5 py-3 border-b border-border bg-bg-hover/30">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="p-5 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-accent-cyan" : "bg-border"}`}
      aria-pressed={value}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function SegmentedControl<T extends string | number>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-bg-panel overflow-hidden text-xs">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 transition-colors ${value === o.value ? "bg-accent-cyan/15 text-accent-cyan" : "text-muted hover:bg-bg-hover"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
