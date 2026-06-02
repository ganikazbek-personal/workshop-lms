"use client";

import { navigation } from "@/data/lessons";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  activeLesson: string;
  onSelect: (id: string) => void;
};

export function Sidebar({ activeLesson, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <nav className="py-5 pb-16">
      {/* Top standalone links (no section title) */}
      {navigation.map((section) => {
        if (section.title) {
          const isCollapsed = collapsed[section.title];
          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between mt-5 mb-1 px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]"
                style={{ color: "var(--ws-muted)", fontFamily: "inherit" }}
              >
                <span>{section.title}</span>
                <ChevronDown
                  size={12}
                  style={{
                    transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              </button>

              {!isCollapsed &&
                section.items.map((item) => {
                  const isActive = activeLesson === item.id;
                  return (
                    <NavButton
                      key={item.id}
                      label={item.label}
                      isActive={isActive}
                      onClick={() => onSelect(item.id)}
                    />
                  );
                })}
            </div>
          );
        }

        return section.items.map((item) => {
          const isActive = activeLesson === item.id;
          return (
            <div key={item.id} className="px-3 mb-0.5">
              <NavButton
                label={item.label}
                isActive={isActive}
                onClick={() => onSelect(item.id)}
              />
            </div>
          );
        });
      })}

      <div
        className="mx-5 mt-8 pt-5"
        style={{ borderTop: "1px solid var(--ws-border)" }}
      >
        <span className="text-xs" style={{ color: "var(--ws-muted)" }}>
          Система
        </span>
      </div>
    </nav>
  );
}

function NavButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-2.5 py-2 px-5 text-sm"
      style={{
        background: isActive ? "var(--ws-accent-soft)" : "transparent",
        color: isActive ? "var(--ws-accent)" : "var(--ws-muted)",
        fontWeight: isActive ? "700" : "400",
        transition: "all 0.12s ease",
        fontFamily: "inherit",
        borderRadius: 0,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background =
            "var(--ws-surface2)";
          (e.currentTarget as HTMLElement).style.color = "var(--ws-text)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--ws-muted)";
        }
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r"
          style={{ background: "var(--ws-accent)" }}
        />
      )}
      {label}
    </button>
  );
}
