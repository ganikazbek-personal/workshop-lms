"use client";

import { useState, useMemo, useRef } from "react";
import { lessons, navigation } from "@/data/lessons";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { LessonPage } from "./LessonPage";
import { TableOfContents } from "./TableOfContents";
import { extractHeadings } from "./MarkdownContent";
import type { TocHeading } from "./TableOfContents";

export function Workshop() {
  const [activeLesson, setActiveLesson] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    setActiveLesson(id);
    setMobileMenuOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const lesson = lessons[activeLesson] ?? lessons.home;

  // Compute TOC headings: extract from markdown, or use undefined for structured
  const tocHeadings = useMemo<TocHeading[] | undefined>(() => {
    if (!lesson.markdownContent) return undefined;
    return extractHeadings(lesson.markdownContent);
  }, [lesson]);

  // Filter nav by search
  const filteredNav = searchQuery
    ? navigation
        .map((s) => ({
          ...s,
          items: s.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((s) => s.items.length > 0)
    : navigation;

  void filteredNav; // used via Sidebar which reads navigation directly

  return (
    <div className="min-h-screen" style={{ background: "var(--ws-bg)" }}>
      <Header
        onSearch={setSearchQuery}
        onMenuToggle={() => setMobileMenuOpen((o) => !o)}
        menuOpen={mobileMenuOpen}
      />

      <div className="flex pt-16 max-w-[1600px] mx-auto" style={{ minHeight: "100vh" }}>
        {/* Left Sidebar */}
        <aside
          className="hidden lg:block w-[280px] shrink-0"
          style={{
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            borderRight: "1px solid var(--ws-border)",
          }}
        >
          <Sidebar activeLesson={activeLesson} onSelect={handleSelect} />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" style={{ paddingTop: 64 }}>
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside
              className="relative w-72 h-full overflow-y-auto z-10"
              style={{ background: "var(--ws-surface)" }}
            >
              <Sidebar activeLesson={activeLesson} onSelect={handleSelect} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main
          ref={contentRef}
          className="flex-1"
          style={{
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            position: "sticky",
            top: 64,
          }}
        >
          <LessonPage lesson={lesson} onNavigate={handleSelect} />
        </main>

        {/* Right TOC */}
        <aside
          className="hidden xl:block w-[260px] shrink-0"
          style={{
            position: "sticky",
            top: 64,
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            borderLeft: "1px solid var(--ws-border)",
          }}
        >
          <TableOfContents headings={tocHeadings} />
        </aside>
      </div>
    </div>
  );
}
