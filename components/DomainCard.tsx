import Link from "next/link";
import { Gauge } from "./Gauge";

export function DomainCard({
  href,
  label,
  tagline,
  color,
  score,
  done,
  total,
  badge,
}: {
  href: string;
  label: string;
  tagline: string;
  color: string;
  score: number | null;
  done: number;
  total: number;
  badge?: "priority" | "socle";
}) {
  const started = done > 0;
  return (
    <Link
      href={href}
      className="block rounded-3xl border border-line bg-surface p-4 transition-[transform,box-shadow] active:scale-[0.985]"
      style={{ boxShadow: "0 1px 2px rgba(20,20,30,.04)" }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-9 w-1.5 rounded-full"
            style={{ background: color }}
            aria-hidden
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[17px] font-semibold leading-none text-ink">
                {label}
              </h3>
              {badge === "priority" && (
                <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Priorité
                </span>
              )}
              {badge === "socle" && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                  style={{ background: color }}
                >
                  Socle
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-faint">{tagline}</p>
          </div>
        </div>
        <div className="text-right">
          {started ? (
            <div
              className="text-2xl font-bold tabular-nums leading-none"
              style={{ color }}
            >
              {score}
            </div>
          ) : (
            <span className="text-xs font-medium text-ink-faint">
              À compléter →
            </span>
          )}
        </div>
      </div>

      <Gauge value={started ? score : null} color={color} />

      {total > 1 && (
        <p className="mt-2 text-[11px] text-ink-faint">
          {done}/{total} sous-domaines
        </p>
      )}
    </Link>
  );
}
