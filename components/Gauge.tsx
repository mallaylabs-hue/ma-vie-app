export function Gauge({
  value,
  color,
}: {
  value: number | null;
  color: string;
}) {
  const pct = value ?? 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: value === null ? "var(--line)" : color,
          transition: "width .9s cubic-bezier(.2,.7,.2,1)",
        }}
      />
    </div>
  );
}
