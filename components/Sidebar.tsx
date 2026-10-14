"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Settings, Info, AlertCircle, Radio } from "lucide-react";
import { useSettings } from "@/lib/store";

const NAV = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/events", label: "Events", icon: AlertCircle },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: Info },
];

export default function Sidebar() {
  const path = usePathname();
  const { settings } = useSettings();
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-30 border-r border-border bg-bg-panel/80 backdrop-blur-md">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio className="w-6 h-6 text-accent-cyan" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-green rounded-full pulse-dot" />
          </div>
          <div>
            <p className="font-bold leading-tight">AirTrend</p>
            <p className="text-[10px] text-muted">Sensor Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? "active text-accent-cyan" : "text-muted hover:text-accent-cyan hover:bg-bg-hover"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border text-[10px] text-muted">
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <span className="font-mono uppercase">{settings.theme}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span>Refresh</span>
          <span className="font-mono">{settings.refreshMs / 1000}s</span>
        </div>
      </div>
    </aside>
  );
}
