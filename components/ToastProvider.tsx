"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface Toast {
  id: number;
  title: string;
  message?: string;
  variant: "info" | "success" | "warning" | "error";
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toasts: [],
  push: () => {},
  dismiss: () => {},
});

export const useToast = () => useContext(ToastContext);

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { ...t, id }]);
    const duration = t.duration ?? 4000;
    if (duration > 0) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const colors: Record<Toast["variant"], string> = {
    info: "#38bdf8",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  };
  const color = colors[toast.variant];
  return (
    <div
      onClick={onDismiss}
      className={`pointer-events-auto cursor-pointer rounded-xl border p-4 transition-all duration-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{
        background: "var(--at-bg-card)",
        borderColor: color,
        boxShadow: `0 8px 32px ${color}30`,
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-start gap-3">
        <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color }}>{toast.title}</p>
          {toast.message && <p className="text-xs text-muted mt-0.5">{toast.message}</p>}
        </div>
      </div>
    </div>
  );
}
