"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, RotateCcw, Loader } from "lucide-react";

type Fields = {
  task: string;
  audience: string;
  design: string;
  extra: string;
};

const EMPTY: Fields = { task: "", audience: "", design: "", extra: "" };

export function PromptGenerator() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const generate = async () => {
    if (!fields.task.trim() || loading) return;
    setLoading(true);
    setPrompt("");
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка при генерации.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Scroll to result area as soon as streaming starts
      setTimeout(() => {
        document.getElementById("pg-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setPrompt((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt); }
    catch { const ta = document.createElement("textarea"); ta.value = prompt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => { setFields(EMPTY); setPrompt(""); setError(""); setCopied(false); };

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

  const cardStyle: React.CSSProperties = {
    background: "var(--ws-surface)",
    border: "1px solid var(--ws-border)",
    borderRadius: 12,
    padding: "20px 24px",
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: "var(--ws-muted)", fontSize: "0.9375rem", lineHeight: 1.6, margin: 0 }}>
          Опишите идею простыми словами. ИИ достроит контекст, структурирует
          требования и сгенерирует готовый промпт для Claude Code.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* 1 — Required */}
        <div style={cardStyle}>
          <label style={labelStyle}>
            1. Что нужно сделать?{" "}
            <span style={{ color: "var(--ws-accent)", fontWeight: 400 }}>*</span>
          </label>
          <p style={hintStyle}>Опишите идею проекта простыми словами.</p>
          <textarea
            value={fields.task}
            onChange={set("task")}
            disabled={loading}
            placeholder="Например: нужно сделать лендинг для AI Innovation Challenge 2026. На сайте сотрудники должны понять суть программы и отправить свою идею по внедрению ИИ."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>

        {/* 2 — Optional */}
        <div style={cardStyle}>
          <label style={labelStyle}>2. Для кого делаем и как будут использовать?</label>
          <p style={hintStyle}>Опишите аудиторию и сценарий использования.</p>
          <textarea
            value={fields.audience}
            onChange={set("audience")}
            disabled={loading}
            placeholder="Например: сайт для сотрудников группы компаний. Они зайдут на страницу, прочитают описание программы, поймут какие идеи принимаются и заполнят короткую форму."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>

        {/* 3 — Optional */}
        <div style={cardStyle}>
          <label style={labelStyle}>3. Какой стиль дизайна нужен?</label>
          <p style={hintStyle}>Опишите визуальный стиль, настроение и референсы.</p>
          <textarea
            value={fields.design}
            onChange={set("design")}
            disabled={loading}
            placeholder="Например: современный корпоративный стиль. Белый фон, синие акценты, аккуратные карточки, крупные заголовки. Должно выглядеть дорого, но без сложных анимаций."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>

        {/* 4 — Optional */}
        <div style={cardStyle}>
          <label style={labelStyle}>4. Дополнительные пожелания</label>
          <p style={hintStyle}>Добавьте ограничения, функции, технологии или важные детали.</p>
          <textarea
            value={fields.extra}
            onChange={set("extra")}
            disabled={loading}
            placeholder="Например: сделать адаптивную верстку для телефона. Добавить форму подачи идеи. Использовать HTML, CSS и JavaScript. Без backend и авторизации."
            style={fieldStyle}
            onFocus={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-accent)"; }}
            onBlur={(e) => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--ws-border)"; }}
          />
        </div>
      </div>

      {/* Generate button */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={generate}
          disabled={!fields.task.trim() || loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: fields.task.trim() && !loading ? "var(--ws-accent)" : "var(--ws-border)",
            color: fields.task.trim() && !loading ? "#000" : "var(--ws-muted)",
            border: "none",
            borderRadius: 10,
            padding: "13px 28px",
            fontSize: "0.9375rem",
            fontWeight: 800,
            cursor: fields.task.trim() && !loading ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { if (fields.task.trim() && !loading) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
        >
          {loading ? (
            <>
              <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
              Генерирую промпт...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Сгенерировать промпт
            </>
          )}
        </button>
      </div>

      {/* Spin keyframes */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            color: "#f87171",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Result */}
      {(prompt || loading) && (
        <div id="pg-result" style={{ marginTop: 36 }}>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--ws-border)" }}>
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
                <span style={{ fontSize: "0.8125rem", color: "var(--ws-muted)" }}>
                  {loading ? "генерирую..." : "prompt.txt"}
                </span>
              </div>
              {!loading && prompt && (
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
              )}
            </div>

            {/* Content */}
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
                minHeight: 60,
              }}
            >
              {prompt}
              {loading && (
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: "1em",
                    background: "var(--ws-accent)",
                    verticalAlign: "text-bottom",
                    marginLeft: 2,
                    animation: "blink 0.8s step-end infinite",
                  }}
                />
              )}
            </pre>
          </div>

          {!loading && prompt && (
            <p style={{ marginTop: 14, fontSize: "0.8125rem", color: "var(--ws-muted)" }}>
              Скопируйте промпт и вставьте в Claude Code — он сразу поймёт задачу и начнёт работать.
            </p>
          )}
        </div>
      )}

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}
