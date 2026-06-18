"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AxisForm, EMPTY_DRAFT, type AxisDraft } from "@/components/AxisForm";
import { Gauge } from "@/components/Gauge";
import { DOMAIN_MAP, axisIdsForDomain } from "@/lib/domains";
import { useProfile, withCapture } from "@/lib/profile";
import { domainScore, scoreLabel } from "@/lib/scoring";
import type { AxisCapture, DomainId, Preuve } from "@/lib/types";

export default function DomainePage() {
  const params = useParams();
  const id = String(params.id) as DomainId;
  const dom = DOMAIN_MAP[id];
  const router = useRouter();
  const { profile, loading, save } = useProfile();

  const isFreq = !!dom?.frequence;
  const axisIds = useMemo(() => (dom ? axisIdsForDomain(dom) : []), [dom]);
  const [drafts, setDrafts] = useState<Record<string, AxisDraft> | null>(null);
  const [signes, setSignes] = useState<Preuve[]>([]);
  const [nouveauSigne, setNouveauSigne] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !profile?.onboardedAt) router.replace("/onboarding");
  }, [loading, profile, router]);

  useEffect(() => {
    if (profile && dom && drafts === null) {
      const init: Record<string, AxisDraft> = {};
      for (const aid of axisIds) {
        const c = profile.captures[aid];
        init[aid] = c
          ? {
              identiteActuelle: c.identiteActuelle,
              identiteCible: c.identiteCible,
              etat: c.etat,
              action: c.action,
              frequence: c.frequence ?? (isFreq ? 5 : undefined),
            }
          : { ...EMPTY_DRAFT, frequence: isFreq ? 5 : undefined };
      }
      setDrafts(init);
      if (isFreq) setSignes(profile.captures[axisIds[0]]?.coffreAPreuves ?? []);
    }
  }, [profile, dom, axisIds, drafts, isFreq]);

  if (!dom) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <div className="text-center">
          <p className="text-ink-soft">Domaine introuvable.</p>
          <Link href="/dashboard" className="mt-3 inline-block font-semibold">
            ← Retour
          </Link>
        </div>
      </main>
    );
  }

  if (loading || !profile || !drafts) {
    return (
      <main className="grid min-h-dvh place-items-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-ink" />
      </main>
    );
  }

  const s = domainScore(profile, dom.id);

  function promptsFor(aid: string) {
    const subId = aid.split(".")[1];
    if (!subId) return dom.prompts;
    const sub = dom.subDomains!.find((x) => x.id === subId)!;
    return {
      actuelle: "Où en est ce lien aujourd'hui ?",
      cible: sub.hint,
      cibleGuard:
        sub.id === "amour"
          ? "Par ce que tu admires, jamais par le mépris du reste."
          : undefined,
    };
  }

  function addSigne() {
    const note = nouveauSigne.trim();
    if (!note) return;
    setSignes((prev) => [
      { id: crypto.randomUUID(), date: Date.now(), note },
      ...prev,
    ]);
    setNouveauSigne("");
  }

  async function handleSave() {
    if (!profile || !drafts) return;
    setSaving(true);
    const now = Date.now();
    let p = profile;
    for (const aid of axisIds) {
      const d = drafts[aid];
      const completed =
        d.identiteActuelle.trim().length > 0 &&
        d.identiteCible.trim().length > 0;
      const patch: Partial<AxisCapture> = { ...d, completed };
      if (isFreq) patch.coffreAPreuves = signes;
      p = withCapture(p, aid, patch, now);
    }
    await save(p);
    router.push("/dashboard");
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

        <div className="mt-4 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
            style={{ background: dom.color }}
          >
            {dom.priority ? "Priorité" : dom.socle ? "Socle" : dom.tagline}
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{dom.label}</h1>

        <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-medium text-ink-soft">
              {isFreq ? "Fréquence" : "Score d'alignement"}
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                color: s.score === null ? "var(--ink-faint)" : dom.color,
              }}
            >
              {s.score === null
                ? "À compléter"
                : `${s.score} · ${scoreLabel(s.score)}`}
            </span>
          </div>
          <Gauge value={s.score} color={dom.color} />
        </div>

        {/* Capture(s) */}
        <div className="mt-7 space-y-9">
          {axisIds.map((aid) => {
            const subId = aid.split(".")[1];
            const sub = subId
              ? dom.subDomains!.find((x) => x.id === subId)
              : null;
            return (
              <section key={aid}>
                {sub && (
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      className="h-5 w-1 rounded-full"
                      style={{ background: dom.color }}
                    />
                    <h2 className="text-lg font-semibold">{sub.label}</h2>
                  </div>
                )}
                <AxisForm
                  value={drafts[aid]}
                  onChange={(v) =>
                    setDrafts((prev) => ({ ...prev!, [aid]: v }))
                  }
                  prompts={promptsFor(aid)}
                  color={dom.color}
                  variant={isFreq ? "frequence" : "standard"}
                  frequence={dom.frequence}
                />
              </section>
            );
          })}
        </div>

        {/* Journal de signes (Mindset uniquement) */}
        {isFreq && (
          <section className="mt-9">
            <h2 className="text-lg font-semibold">Journal de signes</h2>
            <p className="mt-1 text-[13px] leading-snug text-ink-soft">
              Les synchronicités, la baraka — ce qui confirme que ta fréquence
              était haute. Note-les ici, ils nourrissent ton coffre à preuves.
            </p>

            <div className="mt-3 flex gap-2">
              <input
                value={nouveauSigne}
                onChange={(e) => setNouveauSigne(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addSigne();
                }}
                placeholder="Un signe que tu as ressenti…"
                className="flex-1 rounded-2xl border border-line bg-surface-2 px-3 py-3 text-[15px] outline-none placeholder:text-ink-faint focus:border-ink-soft"
              />
              <button
                onClick={addSigne}
                className="rounded-2xl px-4 py-3 font-semibold text-white"
                style={{ background: dom.color }}
              >
                +
              </button>
            </div>

            {signes.length > 0 && (
              <ul className="mt-3 space-y-2">
                {signes.map((sg) => (
                  <li
                    key={sg.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-3"
                  >
                    <div>
                      <p className="text-[14px] leading-snug">{sg.note}</p>
                      <p className="mt-0.5 text-[11px] text-ink-faint">
                        {new Date(sg.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setSignes((prev) => prev.filter((x) => x.id !== sg.id))
                      }
                      aria-label="Supprimer"
                      className="shrink-0 text-lg leading-none text-ink-faint"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Téléguidage Phase 2 */}
        <div className="mt-9 rounded-2xl border border-dashed border-line p-4 text-center">
          <p className="text-sm font-medium text-ink-faint">
            Objectifs · Étapes · Actions
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            À venir — le coach IA les construira avec toi (Phase 2).
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-7 w-full rounded-2xl bg-ink py-4 font-semibold text-white disabled:opacity-40"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </main>
  );
}
