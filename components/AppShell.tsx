"use client";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import CommandPalette from "./CommandPalette";
import KeyboardHint from "./KeyboardHint";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="lg:pl-60 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
      <CommandPalette />
      <KeyboardHint />
    </>
  );
}
