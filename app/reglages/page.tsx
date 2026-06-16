"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TONES } from "@/lib/domains";
import { useProfile } from "@/lib/profile";
import type { Tone } from "@/lib/types";

export default function Reglages() {
  const { profile, loading, save, reset } = useProfile();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  if (loading || !profile) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-ink" />
      </main>
    );
  }

  async function setTone(tone: Tone) {
    if (!profile) return;
    await save({ ...profile, tone });
  }

  async function doReset() {
    await reset();
    router.push("/onboarding");
  }

  return (
    <main className="min-h-dvh">
      <div className="shell pt-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft"
        >
          ← Ma fiche
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Réglages</h1>

        <section className="mt-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Ton du coach
          </h2>
          <div className="mt-3 space-y-3">
            {TONES.map((t) => {
              const active = profile.tone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className="w-full rounded-2xl border p-4 text-left transition-colors"
                  style={{
                    borderColor: active ? "var(--ink)" : "var(--line)",
                    background: active ? "var(--surface)" : "var(--surface-2)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{t.label}</span>
                    {active && (
                      <span className="text-xs font-semibold text-accent">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Données
          </h2>
          <p className="mt-2 text-[13px] leading-snug text-ink-soft">
            Tout est stocké sur cet appareil uniquement. Rien n&apos;est envoyé
            ailleurs.
          </p>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="mt-4 w-full rounded-2xl border border-line py-3.5 font-semibold text-ink-soft"
            >
              Réinitialiser ma fiche
            </button>
          ) : (
            <div className="mt-4 rounded-2xl border border-line p-4">
              <p className="text-sm font-medium">
                Effacer toutes tes données et recommencer l&apos;onboarding ?
              </p>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-xl border border-line py-3 font-semibold text-ink-soft"
                >
                  Annuler
                </button>
                <button
                  onClick={doReset}
                  className="flex-1 rounded-xl py-3 font-semibold text-white"
                  style={{ background: "#e8590c" }}
                >
                  Effacer
                </button>
              </div>
            </div>
          )}
        </section>

        <p className="mt-10 text-center text-[11px] text-ink-faint">
          Ma Vie · Phase 0
        </p>
      </div>
    </main>
  );
}
