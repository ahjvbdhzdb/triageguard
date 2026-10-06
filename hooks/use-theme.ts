import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyClass(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("tg-theme") as Theme) || "system";
    } catch {
      return "system";
    }
  });

  const resolved: "light" | "dark" =
    theme === "system" ? getSystemTheme() : theme;

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem("tg-theme", next);
    } catch {
      // storage unavailable
    }
    const r = next === "system" ? getSystemTheme() : next;
    applyClass(r);
  }, []);

  // Apply on mount and listen for OS changes when set to "system"
  useEffect(() => {
    applyClass(resolved);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        applyClass(getSystemTheme());
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme, resolved]);

  return { theme, resolved, setTheme };
}
