import { createContext, useContext } from "react";

export type Theme = "dark" | "light";

export interface Settings {
  theme: Theme;
  refreshMs: number;
  soundAlerts: boolean;
  showThresholds: boolean;
  showGrid: boolean;
  defaultRange: "1m" | "5m" | "15m" | "all";
  compactMode: boolean;
}

export const defaultSettings: Settings = {
  theme: "dark",
  refreshMs: 3000,
  soundAlerts: true,
  showThresholds: true,
  showGrid: true,
  defaultRange: "5m",
  compactMode: false,
};

export interface SettingsContextValue {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
}

export const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  update: () => {},
  reset: () => {},
});

export const useSettings = () => useContext(SettingsContext);
