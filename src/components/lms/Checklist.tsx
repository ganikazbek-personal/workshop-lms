"use client";

import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";

export function Checklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <ul className="space-y-2 my-1">
      {items.map((item, i) => (
        <li key={i}>
          <button
            onClick={() => toggle(i)}
            className="flex items-center gap-3 w-full text-left text-sm py-1 group"
            style={{ fontFamily: "inherit" }}
          >
            {checked[i] ? (
              <CheckSquare
                size={16}
                style={{ color: "var(--ws-accent)", flexShrink: 0 }}
              />
            ) : (
              <Square
                size={16}
                style={{ color: "var(--ws-border)", flexShrink: 0, transition: "color 0.15s" }}
                className="group-hover:!text-[var(--ws-muted)]"
              />
            )}
            <span
              style={{
                color: checked[i] ? "var(--ws-muted)" : "var(--ws-text)",
                textDecoration: checked[i] ? "line-through" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {item}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
