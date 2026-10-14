"use client";
import { Moon, Sun } from "lucide-react";
import { useSettings } from "@/lib/store";

export default function ThemeToggle() {
  const { settings, update } = useSettings();
  const isDark = settings.theme === "dark";
  return (
    <button
      onClick={() => update("theme", isDark ? "light" : "dark")}
      className="p-2 rounded-lg text-muted hover:text-accent-cyan hover:bg-bg-hover transition-all"
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
