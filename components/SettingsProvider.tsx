"use client";

import { useCallback, useEffect, useState } from "react";
import { SettingsContext, defaultSettings, type Settings } from "@/lib/store";

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("airtrend-settings");
      if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme, hydrated]);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try { localStorage.setItem("airtrend-settings", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSettings(defaultSettings);
    try { localStorage.setItem("airtrend-settings", JSON.stringify(defaultSettings)); } catch {}
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update, reset }}>
      {children}
    </SettingsContext.Provider>
  );
}
