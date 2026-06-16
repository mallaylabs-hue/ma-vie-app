"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Ring } from "@/components/Ring";
import { DomainCard } from "@/components/DomainCard";
import { DOMAINS } from "@/lib/domains";
import { useProfile } from "@/lib/profile";
import {
  domainScore,
  globalScore,
  mindsetAlert,
  scoreLabel,
} from "@/lib/scoring";

export default function Dashboard() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile?.onboardedAt) router.replace("/onboarding");
  }, [loading, profile, router]);

  if (loading || !profile?.onboardedAt) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-ink" />
      </main>
    );
  }

  const global = globalScore(profile);
  const alert = mindsetAlert(profile);

  return (
    <main className="min-h-dvh">
      <div className="shell pt-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Ma fiche
            </p>
            <h1 className="mt-0.5 text-2xl font-bold tracking-tight">
              Ton personnage
            </h1>
          </div>
          <Link
            href="/reglages"
            aria-label="Réglages"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-soft"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M19.4 13.5a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1v.2a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.1-2.7H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H10a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V10a1.6 1.6 0 001.5 1h.2a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </Link>
        </header>

        {/* Hero : score d'alignement global */}
        <section className="mt-6 flex flex-col items-center rise">
          <Ring value={global}>
            <div>
              <div className="text-5xl font-bold tabular-nums leading-none">
                {global ?? "—"}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Alignement
              </div>
            </div>
          </Ring>
          <p className="mt-3 text-sm font-medium text-ink-soft">
            {scoreLabel(global)}
          </p>
        </section>

        {/* Alerte socle (Mindset révélateur) */}
        {alert && (
          <Link
            href="/domaine/mindset"
            className="mt-5 block rounded-2xl border p-4"
            style={{
              borderColor: "color-mix(in srgb, var(--d-mindset) 35%, var(--line))",
              background:
                "color-mix(in srgb, var(--d-mindset) 7%, var(--surface))",
            }}
          >
            <p
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--d-mindset)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 3 2 20h20L12 3z"
                  fill="currentColor"
                  fillOpacity="0.16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10v4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="16.6" r="1" fill="currentColor" />
              </svg>
              Ton socle est bas.
            </p>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">
              Le Mindset porte tout le reste. Tant qu&apos;il flanche, les autres
              domaines stagneront. C&apos;est là qu&apos;on agit d&apos;abord.
            </p>
          </Link>
        )}

        {/* Cartes domaines */}
        <section className="mt-6 space-y-3 pb-4">
          {DOMAINS.map((d) => {
            const s = domainScore(profile, d.id);
            return (
              <DomainCard
                key={d.id}
                href={`/domaine/${d.id}`}
                label={d.label}
                tagline={d.tagline}
                color={d.color}
                score={s.score}
                done={s.done}
                total={s.total}
                badge={d.priority ? "priority" : d.socle ? "socle" : undefined}
              />
            );
          })}
        </section>

        <p className="pt-2 text-center text-[11px] text-ink-faint">
          Phase 0 — fiche statique. Les coachs IA arrivent ensuite.
        </p>
      </div>
    </main>
  );
}
