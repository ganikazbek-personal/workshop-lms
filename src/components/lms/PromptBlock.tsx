"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function PromptBlock({
  text,
  filename = "prompt.txt",
}: {
  text: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-xl overflow-hidden my-5" style={{ border: "1px solid var(--ws-border)" }}>
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: "var(--ws-surface2)",
          borderBottom: "1px solid var(--ws-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <span className="text-xs ml-2" style={{ color: "var(--ws-muted)" }}>
            {filename}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{
            background: copied ? "var(--ws-accent-soft)" : "var(--ws-surface)",
            border: "1px solid var(--ws-border)",
            color: copied ? "var(--ws-accent)" : "var(--ws-muted)",
            fontFamily: "inherit",
            transition: "all 0.15s ease",
          }}
        >
          {copied ? (
            <>
              <Check size={12} />
              Скопировано
            </>
          ) : (
            <>
              <Copy size={12} />
              Копировать
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre
        className="p-6 text-sm leading-relaxed overflow-x-auto m-0 whitespace-pre-wrap"
        style={{
          background: "var(--ws-code)",
          color: "var(--ws-text)",
          fontFamily: "inherit",
        }}
      >
        {text}
      </pre>
    </div>
  );
}
