"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="h-8 w-16 rounded-full" style={{ backgroundColor: "var(--muted)" }} />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Passer en mode jour" : "Passer en mode nuit"}
      aria-label="Changer le thème"
      className="relative flex items-center h-8 w-16 rounded-full cursor-pointer transition-all duration-300 focus:outline-none"
      style={{
        backgroundColor: isDark ? "#238636" : "#1b4d3e",
        boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.3)",
      }}
    >
      {/* Icône soleil (gauche) */}
      <span
        className="absolute left-2 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: isDark ? 0.4 : 1 }}
      >
        <Sun className="h-3.5 w-3.5 text-amber-300" />
      </span>

      {/* Icône lune (droite) */}
      <span
        className="absolute right-2 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: isDark ? 1 : 0.4 }}
      >
        <Moon className="h-3.5 w-3.5 text-blue-200" />
      </span>

      {/* Bouton glissant */}
      <span
        className="absolute h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 4px rgb(0 0 0 / 0.25)",
          transform: isDark ? "translateX(36px)" : "translateX(4px)",
        }}
      >
        {isDark
          ? <Moon className="h-3 w-3 text-slate-700" />
          : <Sun className="h-3 w-3 text-amber-500" />
        }
      </span>
    </button>
  );
}
