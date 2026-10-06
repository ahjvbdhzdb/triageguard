import React, { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  FileWarning,
  ClipboardList,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { useTheme } from "@/hooks/use-theme";

// ── Navigation items ─────────────────────────────────────────────────────────

const navItems = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "submit", label: "Report", icon: FileWarning },
  { page: "audit", label: "Audit Log", icon: ClipboardList },
] as const;

// ── Layout ───────────────────────────────────────────────────────────────────

export default function Layout({ children }: { children: React.ReactNode }) {
  const { page, navigate } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme, resolved } = useTheme();

  function handleNavigate(target: string) {
    navigate(target);
    setMobileMenuOpen(false);
  }

  function cycleTheme() {
    const order = ["light", "dark", "system"] as const;
    const idx = order.indexOf(theme as typeof order[number]);
    setTheme(order[(idx + 1) % order.length]);
  }

  const ThemeIcon = theme === "system" ? Monitor : resolved === "dark" ? Moon : Sun;
  const themeLabel = theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light";

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background md:flex-row">
      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b bg-slate-900 px-4 py-3 text-slate-100 md:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-6 text-emerald-400" />
          <span className="text-base font-semibold tracking-tight">
            TriageGuard
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={cycleTheme}
            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label={`Theme: ${themeLabel}`}
            title={`Theme: ${themeLabel}`}
          >
            <ThemeIcon className="size-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile slide-down menu ────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-[53px] z-50 border-b bg-slate-900 px-4 pb-4 pt-2 text-slate-100 shadow-lg md:hidden">
          <div className="flex items-center gap-3 py-3">
            <Avatar>
              <AvatarFallback className="bg-slate-700 text-slate-200">
                <User className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">Demo User</p>
              <p className="truncate text-xs text-slate-400">Logged in</p>
            </div>
          </div>
          <Separator className="mb-2 bg-slate-700/60" />
          <nav className="space-y-1">
            {navItems.map(({ page: target, label, icon: Icon }) => {
              const isActive = page === target;
              return (
                <button
                  key={target}
                  onClick={() => handleNavigate(target)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-slate-100 md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <ShieldCheck className="size-7 text-emerald-400" />
          <span className="text-lg font-semibold tracking-tight">TriageGuard</span>
        </div>

        <Separator className="bg-slate-700/60" />

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ page: target, label, icon: Icon }) => {
            const isActive = page === target;
            return (
              <button
                key={target}
                onClick={() => navigate(target)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <Separator className="bg-slate-700/60" />

        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className="mx-3 mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
          title={`Theme: ${themeLabel}`}
        >
          <ThemeIcon className="size-4 shrink-0" />
          {themeLabel} mode
        </button>

        <div className="flex items-center gap-3 px-5 py-4">
          <Avatar>
            <AvatarFallback className="bg-slate-700 text-slate-200">
              <User className="size-3.5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">Demo User</p>
            <p className="truncate text-xs text-slate-400">Logged in</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="relative flex-1 overflow-y-auto bg-background p-4 pb-20 md:p-6 md:pb-6">
        {children}
      </main>

      {/* ── Mobile bottom tab bar ─────────────────────────────────────── */}
      <nav className="flex shrink-0 items-center justify-around border-t bg-background px-2 py-1.5 md:hidden">
        {navItems.map(({ page: target, label, icon: Icon }) => {
          const isActive = page === target;
          return (
            <button
              key={target}
              onClick={() => handleNavigate(target)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md py-1.5 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`size-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
