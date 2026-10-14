"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, BarChart3, Settings, Info, AlertCircle, Download, Moon, Sun, Command } from "lucide-react";
import { useSettings } from "@/lib/store";

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  group: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const { settings, update } = useSettings();

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => { setQuery(""); setActive(0); }, [open]);

  const commands = useMemo<CommandItem[]>(() => [
    { id: "home", label: "Go to Overview", icon: Home, group: "Navigate", action: () => router.push("/") },
    { id: "analytics", label: "Go to Analytics", icon: BarChart3, group: "Navigate", action: () => router.push("/analytics") },
    { id: "events", label: "Go to Events", icon: AlertCircle, group: "Navigate", action: () => router.push("/events") },
    { id: "settings", label: "Go to Settings", icon: Settings, group: "Navigate", action: () => router.push("/settings") },
    { id: "about", label: "Go to About", icon: Info, group: "Navigate", action: () => router.push("/about") },
    {
      id: "theme",
      label: `Switch to ${settings.theme === "dark" ? "light" : "dark"} theme`,
      icon: settings.theme === "dark" ? Sun : Moon,
      group: "Appearance",
      action: () => update("theme", settings.theme === "dark" ? "light" : "dark"),
    },
    { id: "sounds", label: `${settings.soundAlerts ? "Disable" : "Enable"} sound alerts`, icon: Download, group: "Preferences", action: () => update("soundAlerts", !settings.soundAlerts) },
  ], [router, settings, update]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  const run = useCallback((item: CommandItem) => {
    item.action();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === "Enter" && filtered[active]) { e.preventDefault(); run(filtered[active]); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, filtered, active, run]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh] px-4 cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-bg-panel shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-bg-hover text-muted border border-border font-mono">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-sm text-muted text-center">No commands match.</p>
          )}
          {filtered.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => run(c)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left ${
                  i === active ? "bg-bg-hover text-accent-cyan" : "text-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{c.label}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-60">{c.group}</span>
              </button>
            );
          })}
        </div>
        <div className="px-4 py-2 border-t border-border text-[10px] text-muted flex items-center justify-between">
          <span className="flex items-center gap-1"><Command className="w-3 h-3" />K to open</span>
          <span>↑↓ navigate · ⏎ select</span>
        </div>
      </div>
    </div>
  );
}
