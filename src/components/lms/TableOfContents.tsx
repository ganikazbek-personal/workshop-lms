"use client";

import { useEffect, useState } from "react";

export type TocHeading = { id: string; label: string };

const STRUCTURED_HEADINGS: TocHeading[] = [
  { id: "overview", label: "Обзор" },
  { id: "goal", label: "Цель" },
  { id: "practice", label: "Практика" },
  { id: "prompt", label: "Промпт" },
  { id: "result", label: "Ожидаемый результат" },
  { id: "checklist", label: "Чек-лист" },
];

type Props = {
  headings?: TocHeading[];
};

export function TableOfContents({ headings }: Props) {
  const sections = headings ?? STRUCTURED_HEADINGS;
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;
    setActive(sections[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings]);

  if (sections.length === 0) return null;

  return (
    <nav className="py-8 px-6">
      <p
        className="text-sm font-black mb-4 tracking-tight"
        style={{ color: "var(--ws-text)", letterSpacing: "-0.02em" }}
      >
        На этой странице
      </p>
      {sections.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            className="block py-1.5 text-sm"
            style={{
              color: isActive ? "var(--ws-accent)" : "var(--ws-muted)",
              fontWeight: isActive ? "700" : "400",
              transition: "color 0.15s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color = "var(--ws-text)";
            }}
            onMouseLeave={(e) => {
              if (!isActive)
                (e.currentTarget as HTMLElement).style.color = "var(--ws-muted)";
            }}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}
