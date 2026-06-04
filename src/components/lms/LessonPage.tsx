"use client";

import { Lesson, lessonOrder, navigation } from "@/data/lessons";
import { ProgressBar } from "./ProgressBar";
import { PromptBlock } from "./PromptBlock";
import { Checklist } from "./Checklist";
import { MarkdownContent } from "./MarkdownContent";
import { PromptGenerator } from "./PromptGenerator";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COMPONENTS: Record<string, React.ComponentType> = {
  "prompt-generator": PromptGenerator,
};

type Props = {
  lesson: Lesson;
  onNavigate: (id: string) => void;
};

function getLabelById(id: string) {
  for (const s of navigation) {
    for (const item of s.items) {
      if (item.id === id) return item.label;
    }
  }
  return id;
}

export function LessonPage({ lesson, onNavigate }: Props) {
  const idx = lessonOrder.indexOf(lesson.id);
  const prevId = idx > 0 ? lessonOrder[idx - 1] : null;
  const nextId = idx < lessonOrder.length - 1 ? lessonOrder[idx + 1] : null;

  return (
    <article className="max-w-[850px] w-full py-10 px-10 pb-24 xl:px-14">
      {/* Breadcrumb */}
      <p className="text-xs mb-5" style={{ color: "var(--ws-muted)" }}>
        {lesson.breadcrumb}
      </p>

      {/* Hero */}
      <section className="mb-8">
        <span
          className="inline-block text-xs font-extrabold mb-4 px-2 py-1 rounded"
          style={{
            color: "var(--ws-accent)",
            background: "var(--ws-accent-soft)",
          }}
        >
          {lesson.badge}
        </span>
        <h1
          className="text-4xl font-black leading-tight mb-0"
          style={{ color: "var(--ws-text)", letterSpacing: "-0.05em" }}
        >
          {lesson.title}
        </h1>
      </section>

      {lesson.progress > 0 && <ProgressBar value={lesson.progress} />}

      {/* ── Interactive component mode ────────────────────────────────── */}
      {lesson.componentId && COMPONENTS[lesson.componentId] && (() => {
        const Component = COMPONENTS[lesson.componentId!];
        return <Component />;
      })()}

      {/* ── Markdown mode ─────────────────────────────────────────────── */}
      {lesson.markdownContent && (
        <MarkdownContent content={lesson.markdownContent} />
      )}

      {/* ── Structured mode (legacy lessons only — not components) ──── */}
      {!lesson.markdownContent && !lesson.componentId && (
        <>
          <SectionHeading id="overview">Обзор</SectionHeading>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--ws-text)" }}>
            {lesson.overview}
          </p>

          <SectionHeading id="goal">Цель</SectionHeading>
          <div
            className="rounded-lg p-4 text-[15px]"
            style={{
              border: "1px solid var(--ws-border)",
              borderLeft: "3px solid var(--ws-accent)",
              background: "var(--ws-surface)",
              color: "var(--ws-text)",
            }}
          >
            {lesson.goal}
          </div>

          <SectionHeading id="practice">Практическое задание</SectionHeading>
          <ol className="space-y-2 pl-5 text-[15px] leading-relaxed" style={{ color: "var(--ws-text)" }}>
            {lesson.steps?.map((step, i) => (
              <li key={i} className="pl-1">{step}</li>
            ))}
          </ol>

          <SectionHeading id="prompt">Промпт</SectionHeading>
          <PromptBlock text={lesson.prompt ?? ""} />

          <SectionHeading id="result">Ожидаемый результат</SectionHeading>
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--ws-text)" }}>
            {lesson.result}
          </p>

          <SectionHeading id="checklist">Чек-лист</SectionHeading>
          <Checklist items={lesson.checklist ?? []} />
        </>
      )}

      {/* Prev / Next */}
      <div className="grid grid-cols-2 gap-3 mt-14">
        {prevId ? (
          <button
            onClick={() => onNavigate(prevId)}
            className="rounded-xl p-4 text-left group"
            style={{
              border: "1px solid var(--ws-border)",
              background: "var(--ws-surface)",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--ws-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--ws-border)";
            }}
          >
            <div
              className="flex items-center gap-1 text-xs mb-1"
              style={{ color: "var(--ws-muted)" }}
            >
              <ChevronLeft size={12} />
              Предыдущий урок
            </div>
            <strong
              className="text-sm block"
              style={{ color: "var(--ws-text)" }}
            >
              {getLabelById(prevId)}
            </strong>
          </button>
        ) : (
          <div />
        )}

        {nextId ? (
          <button
            onClick={() => onNavigate(nextId)}
            className="rounded-xl p-4 text-right group"
            style={{
              border: "1px solid var(--ws-border)",
              background: "var(--ws-surface)",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--ws-accent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--ws-border)";
            }}
          >
            <div
              className="flex items-center justify-end gap-1 text-xs mb-1"
              style={{ color: "var(--ws-muted)" }}
            >
              Следующий урок
              <ChevronRight size={12} />
            </div>
            <strong
              className="text-sm block"
              style={{ color: "var(--ws-text)" }}
            >
              {getLabelById(nextId)}
            </strong>
          </button>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="text-2xl font-black mt-10 mb-4 pb-2.5"
      style={{
        color: "var(--ws-text)",
        borderBottom: "1px solid var(--ws-border)",
        letterSpacing: "-0.04em",
      }}
    >
      {children}
    </h2>
  );
}
