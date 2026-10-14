"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Settings, AlertCircle } from "lucide-react";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/events", label: "Events", icon: AlertCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const path = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-bg-panel/95 backdrop-blur-md safe-bottom">
      <div className="grid grid-cols-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                active ? "text-accent-cyan" : "text-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
