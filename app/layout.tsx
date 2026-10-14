import type { Metadata } from "next";
import "./globals.css";
import SettingsProvider from "@/components/SettingsProvider";
import { ToastProvider, ToastContainer } from "@/components/ToastProvider";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "AirTrend | Sensor Intelligence",
  description: "Real-time MQ-2 gas sensor monitoring with predictive anomaly detection.",
};

export const viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <SettingsProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
            <ToastContainer />
          </ToastProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
