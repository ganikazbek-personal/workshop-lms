"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { PromptBlock } from "./PromptBlock";
import { Download } from "lucide-react";
import type { Components } from "react-markdown";

type Props = { content: string };

const headingStyle = (level: 2 | 3) => ({
  color: "var(--ws-text)",
  letterSpacing: level === 2 ? "-0.04em" : "-0.02em",
  fontWeight: 900,
  marginBottom: "1rem",
  marginTop: level === 2 ? "2.5rem" : "1.75rem",
  ...(level === 2 && {
    fontSize: "1.5rem",
    paddingBottom: "0.625rem",
    borderBottom: "1px solid var(--ws-border)",
  }),
  ...(level === 3 && { fontSize: "1.125rem" }),
});

const inlineCodeStyle = {
  background: "var(--ws-surface2)",
  border: "1px solid var(--ws-border)",
  borderRadius: "4px",
  padding: "1px 6px",
  fontSize: "0.8125rem",
  color: "var(--ws-accent)",
  fontFamily: "inherit",
};

export function MarkdownContent({ content }: Props) {
  const components: Components = {
    h2: ({ children, id }) => (
      <h2 id={id} style={headingStyle(2)}>{children}</h2>
    ),
    h3: ({ children, id }) => (
      <h3 id={id} style={headingStyle(3)}>{children}</h3>
    ),
    p: ({ children }) => (
      <p style={{ color: "var(--ws-text)", fontSize: "0.9375rem", lineHeight: "1.75", margin: "0 0 1rem" }}>
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong style={{ color: "var(--ws-text)", fontWeight: 700 }}>{children}</strong>
    ),

    // Links — detect .json / .csv / .xlsx download links and render as download buttons
    a: ({ href, children }) => {
      const isDownload = href && /\.(json|csv|xlsx|pdf|zip)$/i.test(href);
      if (isDownload) {
        const filename = href.split("/").pop() ?? "file";
        return (
          <a
            href={href}
            download={filename}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--ws-accent-soft)",
              border: "1px solid var(--ws-accent)",
              color: "var(--ws-accent)",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none",
              margin: "4px 0 12px",
              fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            <Download size={14} />
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--ws-accent)",
            textDecoration: "none",
            borderBottom: "1px solid var(--ws-accent-soft)",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "var(--ws-accent)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "var(--ws-accent-soft)")}
        >
          {children}
        </a>
      );
    },

    ul: ({ children }) => (
      <ul style={{ paddingLeft: "1.5rem", color: "var(--ws-text)", fontSize: "0.9375rem", lineHeight: "1.75", margin: "0 0 1rem", listStyleType: "disc" }}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol style={{ paddingLeft: "1.5rem", color: "var(--ws-text)", fontSize: "0.9375rem", lineHeight: "1.75", margin: "0 0 1rem", listStyleType: "decimal" }}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li style={{ marginBottom: "0.375rem", color: "var(--ws-text)" }}>{children}</li>
    ),

    blockquote: ({ children }) => (
      <div style={{
        border: "1px solid var(--ws-border)",
        borderLeft: "3px solid var(--ws-accent)",
        background: "var(--ws-surface)",
        borderRadius: "8px",
        padding: "12px 16px",
        margin: "1rem 0",
        fontSize: "0.875rem",
        color: "var(--ws-muted)",
        lineHeight: "1.6",
      }}>
        {children}
      </div>
    ),

    hr: () => (
      <div style={{ height: "1px", background: "var(--ws-border)", margin: "2rem 0" }} />
    ),

    // Inline code — className is always absent for inline, present for block
    code: ({ className, children }) => {
      if (className) {
        // Block code — pre will handle the final render; just pass through
        return <code className={className}>{children}</code>;
      }
      // Inline code
      return <code style={inlineCodeStyle}>{children}</code>;
    },

    // pre always wraps a block code — extract text + language and render PromptBlock
    pre({ children }) {
      const codeEl = React.Children.toArray(children).find(React.isValidElement);
      if (React.isValidElement(codeEl)) {
        const { className = "", children: codeText } = codeEl.props as {
          className?: string;
          children?: React.ReactNode;
        };
        const lang = String(className).replace("language-", "") || "";
        const text = String(codeText ?? "").replace(/\n$/, "");
        return (
          <PromptBlock
            text={text}
            filename={!lang || lang === "bash" ? "terminal" : lang}
          />
        );
      }
      return <pre>{children}</pre>;
    },

    // Tables
    table: ({ children }) => (
      <div style={{ overflowX: "auto", margin: "1.25rem 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", color: "var(--ws-text)" }}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead style={{ background: "var(--ws-surface)", borderBottom: "1px solid var(--ws-border)" }}>
        {children}
      </thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr style={{ borderBottom: "1px solid var(--ws-border)" }}>{children}</tr>
    ),
    th: ({ children }) => (
      <th style={{ padding: "10px 16px", textAlign: "left", fontWeight: 700, color: "var(--ws-muted)", whiteSpace: "nowrap" }}>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td style={{ padding: "10px 16px", color: "var(--ws-text)", lineHeight: "1.6" }}>
        {children}
      </td>
    ),
  };

  return (
    <div>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

/** Extract H2 headings from markdown for the TOC */
export function extractHeadings(markdown: string): Array<{ id: string; label: string }> {
  return markdown
    .split("\n")
    .filter((line) => /^##\s/.test(line))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");
      return { id, label: text };
    });
}
