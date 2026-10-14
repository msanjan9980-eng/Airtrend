"use client";
import { useEffect, useState } from "react";
import { Keyboard } from "lucide-react";

export default function KeyboardHint() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2000);
    const h = setTimeout(() => setVisible(false), 8000);
    return () => { clearTimeout(t); clearTimeout(h); };
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-card text-xs text-muted shadow-lg">
        <Keyboard className="w-3.5 h-3.5" />
        <span>Press</span>
        <kbd className="px-1.5 py-0.5 rounded bg-bg-hover font-mono text-[10px] border border-border">⌘K</kbd>
        <span>for commands</span>
      </div>
    </div>
  );
}
