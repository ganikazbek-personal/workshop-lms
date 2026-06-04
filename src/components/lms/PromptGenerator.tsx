"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react";

type Fields = {
  task: string;
  audience: string;
  design: string;
  extra: string;
};

function buildPrompt(f: Fields): string {
  const lines: string[] = [
    "Ты Senior Frontend Developer и UX Designer.",
    "",
    "## Задача",
    f.task.trim(),
    "",
  ];

  if (f.audience.trim()) {
    lines.push("## Для кого и как используется");
    lines.push(f.audience.trim());
    lines.push("");
  }

  if (f.design.trim()) {
    lines.push("## Стиль и дизайн");
    lines.push(f.design.trim());
    lines.push("");
  }

  if (f.extra.trim()) {
    lines.push("## Дополнительные требования");
    lines.push(f.extra.trim());
    lines.push("");
  }

  lines.push("## Технические требования");
  lines.push("- Один HTML файл с встроенным CSS и JavaScript");
  lines.push("- Без backend, авторизации и баз данных");
  lines.push("- Адаптивная верстка — хорошо выглядит на телефоне и компьютере");
  lines.push("- Все стили и скрипты встроены в один файл");
  lines.push("- Никаких внешних зависимостей и CDN");

  return lines.join("\n");
}

const EMPTY: Fields = { task: "", audience: "", design: "", extra: "" };

export function PromptGenerator() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const generate = () => {
    if (!fields.task.trim()) return;
    setPrompt(buildPrompt(fields));
    setCopied(false);
    setTimeout(() => {
      document.getElementById("pg-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt); }
    catch { const ta = document.createElement("textarea"); ta.value = prompt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => { setFields(EMPTY); setPrompt(""); setCopied(false); };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 110,
    background: "var(--ws-surface2)",
    border: "1px solid var(--ws-border)",
    borderRadius: 8,
    padding: "12px 14px",
    color: "var(--ws-text)",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    lineHeight: 1.6,
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 700,
    fontSize: "0.9375rem",
    color: "var(--ws-text)",
    marginBottom: 4,
  };

  const hintStyle: React.CSSProperties = {
    fontSize: "0.8125rem",
    color: "var(--ws-muted)",
    marginBottom: 10,
  };

  return (
    <div style={{ maxWidth: 780 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: "var(--ws-muted)", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
          Опишите идею простыми словами. Получите готовый промпт,
          который можно сразу вставить в Claude Code.
        </p>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* 1 — Required */}
        <div
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <label style={labelStyle}>
            1. Что нужно сделать?{" "}
            <span style={{ color: "var(--ws-accent)", fontWeight: 400 }}>*</span>
          </label>
          <p style={hintStyle}>Опишите идею проекта простыми словами.</p>
          <textarea
            value={fields.task}
            onChange={set("task")}
            placeholder="Например: нужно сделать лендинг для AI Innovation Challenge 2026. На сайте сотрудники должны понять суть программы и отправить свою идею по внедрению ИИ."
            style={{
              ...fieldStyle,
              borderColor: !fields.task.trim() && prompt ? "var(--ws-accent)" : undefined,
            }}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>

        {/* 2 — Optional */}
        <div
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <label style={labelStyle}>2. Для кого делаем и как будут использовать?</label>
          <p style={hintStyle}>Опишите аудиторию и сценарий использования.</p>
          <textarea
            value={fields.audience}
            onChange={set("audience")}
            placeholder="Например: сайт для сотрудников группы компаний. Они зайдут на страницу, прочитают описание программы, поймут какие идеи принимаются и заполнят короткую форму."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>

        {/* 3 — Optional */}
        <div
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <label style={labelStyle}>3. Какой стиль дизайна нужен?</label>
          <p style={hintStyle}>Опишите визуальный стиль, настроение и референсы.</p>
          <textarea
            value={fields.design}
            onChange={set("design")}
            placeholder="Например: современный корпоративный стиль. Белый фон, синие акценты, аккуратные карточки, крупные заголовки. Должно выглядеть дорого, но без сложных анимаций."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>

        {/* 4 — Optional */}
        <div
          style={{
            background: "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            borderRadius: 12,
            padding: "20px 24px",
          }}
        >
          <label style={labelStyle}>4. Дополнительные пожелания</label>
          <p style={hintStyle}>Добавьте ограничения, функции, технологии или важные детали.</p>
          <textarea
            value={fields.extra}
            onChange={set("extra")}
            placeholder="Например: сделать адаптивную верстку для телефона. Добавить форму подачи идеи. Использовать HTML, CSS и JavaScript. Без backend и авторизации."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>
      </div>

      {/* Generate button */}
      <div style={{ marginTop: 28 }}>
        <button
          onClick={generate}
          disabled={!fields.task.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: fields.task.trim() ? "var(--ws-accent)" : "var(--ws-border)",
            color: fields.task.trim() ? "#000" : "var(--ws-muted)",
            border: "none",
            borderRadius: 10,
            padding: "13px 28px",
            fontSize: "0.9375rem",
            fontWeight: 800,
            cursor: fields.task.trim() ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { if (fields.task.trim()) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          <Sparkles size={16} />
          Сгенерировать промпт
        </button>
      </div>

      {/* Result */}
      {prompt && (
        <div id="pg-result" style={{ marginTop: 40 }}>
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid var(--ws-border)",
            }}
          >
            {/* Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                background: "var(--ws-surface2)",
                borderBottom: "1px solid var(--ws-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                </div>
                <span style={{ fontSize: "0.8125rem", color: "var(--ws-muted)" }}>prompt.txt</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={reset}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "var(--ws-surface)", border: "1px solid var(--ws-border)",
                    color: "var(--ws-muted)", borderRadius: 8, padding: "6px 12px",
                    fontSize: "0.8125rem", fontFamily: "inherit", cursor: "pointer",
                  }}
                >
                  <RotateCcw size={12} />
                  Сбросить
                </button>
                <button
                  onClick={copy}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: copied ? "var(--ws-accent-soft)" : "var(--ws-surface)",
                    border: "1px solid var(--ws-border)",
                    color: copied ? "var(--ws-accent)" : "var(--ws-muted)",
                    borderRadius: 8, padding: "6px 12px",
                    fontSize: "0.8125rem", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Скопировано" : "Копировать"}
                </button>
              </div>
            </div>

            {/* Prompt text */}
            <pre
              style={{
                margin: 0,
                padding: "24px",
                background: "var(--ws-code)",
                color: "var(--ws-text)",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {prompt}
            </pre>
          </div>

          <p style={{ marginTop: 14, fontSize: "0.8125rem", color: "var(--ws-muted)" }}>
            Скопируйте промпт и вставьте в Claude Code — он сразу поймёт задачу и начнёт работать.
          </p>
        </div>
      )}
    </div>
  );
}
