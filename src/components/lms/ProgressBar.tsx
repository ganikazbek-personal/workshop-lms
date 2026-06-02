type Props = { value: number };

export function ProgressBar({ value }: Props) {
  return (
    <div
      className="rounded-xl p-4 my-6"
      style={{
        border: "1px solid var(--ws-border)",
        background: "var(--ws-surface)",
      }}
    >
      <div
        className="flex justify-between items-center mb-3 text-sm"
        style={{ color: "var(--ws-muted)" }}
      >
        <span>Прогресс прохождения</span>
        <span className="font-bold" style={{ color: "var(--ws-accent)" }}>
          {value}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "var(--ws-border)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: "var(--ws-accent)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
