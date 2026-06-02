"use client";

import { Moon, Sun, Search, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

type Props = {
  onSearch?: (q: string) => void;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
};

export function Header({ onSearch, onMenuToggle, menuOpen }: Props) {
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6"
      style={{
        background: "var(--ws-bg)",
        borderBottom: "1px solid var(--ws-border)",
      }}
    >
      {/* Brand + mobile menu */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-1.5 rounded-md"
          style={{ color: "var(--ws-muted)" }}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span
          className="text-base font-black tracking-tight"
          style={{ color: "var(--ws-text)", letterSpacing: "-0.04em" }}
        >
          AI Builder Workshop
        </span>
      </div>

      {/* Search + theme */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--ws-muted)" }}
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            placeholder="Поиск по урокам..."
            className="w-56 h-9 pl-8 pr-3 text-sm outline-none rounded-lg"
            style={{
              background: "var(--ws-surface2)",
              border: "1px solid var(--ws-border)",
              color: "var(--ws-text)",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button
          onClick={toggle}
          className="h-9 px-3 rounded-lg text-sm font-bold flex items-center gap-2"
          style={{
            background: "var(--ws-surface2)",
            border: "1px solid var(--ws-border)",
            color: "var(--ws-text)",
            fontFamily: "inherit",
          }}
        >
          {theme === "dark" ? (
            <>
              <Sun size={14} />
              <span className="hidden sm:inline">Светлая</span>
            </>
          ) : (
            <>
              <Moon size={14} />
              <span className="hidden sm:inline">Тёмная</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
