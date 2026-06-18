"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxisForm, EMPTY_DRAFT, type AxisDraft } from "@/components/AxisForm";
import { Gauge } from "@/components/Gauge";
import { IntroAnimation } from "@/components/IntroAnimation";
import { DOMAIN_MAP, TONES } from "@/lib/domains";
import type { Profile, Tone } from "@/lib/types";
import { createProfile, useProfile, withCapture } from "@/lib/profile";
import { revealConstat } from "@/lib/punchlines";
import { axisScore, scoreLabel } from "@/lib/scoring";

type Step = "tone" | "business" | "mindset" | "reveal";

function ProgressDots({ index }: { index: number }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: i === index ? 22 : 8,
            background: i <= index ? "var(--ink)" : "var(--line)",
          }}
        />
      ))}
    </div>
  );
}

const draftValid = (d: AxisDraft) =>
  d.identiteActuelle.trim().length > 0 && d.identiteCible.trim().length > 0;

export default function Onboarding() {
  const router = useRouter();
  const { save } = useProfile();

  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState<Step>("tone");
  const [tone, setTone] = useState<Tone | null>(null);
  const [business, setBusiness] = useState<AxisDraft>({ ...EMPTY_DRAFT });
  const [mindset, setMindset] = useState<AxisDraft>({
    ...EMPTY_DRAFT,
    frequence: 5,
  });
  const [built, setBuilt] = useState<Profile | null>(null);

  const stepIndex = { tone: 0, business: 1, mindset: 2, reveal: 3 }[step];

  async function finish(finalMindset: AxisDraft) {
    const now = Date.now();
    let p = createProfile(tone ?? "pragmatique", now);
    p = withCapture(p, "business", { ...business, completed: true }, now);
    p = withCapture(p, "mindset", { ...finalMindset, completed: true }, now);
    p = { ...p, onboardedAt: now };
    setBuilt(p);
    await save(p);
    setStep("reveal");
  }

  return (
    <main className="min-h-dvh">
      {showIntro && <IntroAnimation onDone={() => setShowIntro(false)} />}

      <div className="shell pt-8">
        {step !== "reveal" && (
          <div className="mb-7 flex items-center justify-between">
            <ProgressDots index={stepIndex} />
            <span className="text-xs text-ink-faint">{stepIndex + 1}/4</span>
          </div>
        )}

        {/* --- Étape TON --- */}
        {step === "tone" && (
          <div className="rise">
            <h1 className="text-3xl font-bold leading-tight tracking-tight">
              On va dresser ta fiche.
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              Pas une to-do. Une photo honnête de ton personnage, domaine par
              domaine. D&apos;abord : sur quel ton tu veux qu&apos;on te parle ?
            </p>

            <div className="mt-6 space-y-3">
              {TONES.map((t) => {
                const active = tone === t.id;
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
                      <span
                        className="grid h-5 w-5 place-items-center rounded-full border"
                        style={{
                          borderColor: active ? "var(--ink)" : "var(--line)",
                          background: active ? "var(--ink)" : "transparent",
                        }}
                      >
                        {active && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                      {t.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-ink-faint">
              Voix dure ou douce, jamais de honte ni de punition. Tu pourras le
              changer plus tard.
            </p>

            <button
              disabled={!tone}
              onClick={() => setStep("business")}
              className="mt-7 w-full rounded-2xl bg-ink py-4 font-semibold text-white disabled:opacity-30"
            >
              Commencer
            </button>
          </div>
        )}

        {/* --- Étapes CAPTURE --- */}
        {(step === "business" || step === "mindset") && (
          <CaptureStep
            key={step}
            domainId={step}
            draft={step === "business" ? business : mindset}
            onDraft={step === "business" ? setBusiness : setMindset}
            onBack={() => setStep(step === "business" ? "tone" : "business")}
            onNext={(d) => {
              if (step === "business") {
                setBusiness(d);
                setStep("mindset");
              } else {
                setMindset(d);
                finish(d);
              }
            }}
            isLast={step === "mindset"}
          />
        )}

        {/* --- Étape RÉVÉLATION --- */}
        {step === "reveal" && built && (
          <Reveal profile={built} onDone={() => router.push("/dashboard")} />
        )}
      </div>
    </main>
  );
}

function CaptureStep({
  domainId,
  draft,
  onDraft,
  onBack,
  onNext,
  isLast,
}: {
  domainId: "business" | "mindset";
  draft: AxisDraft;
  onDraft: (d: AxisDraft) => void;
  onBack: () => void;
  onNext: (d: AxisDraft) => void;
  isLast: boolean;
}) {
  const dom = DOMAIN_MAP[domainId];
  return (
    <div className="rise">
      <div className="mb-5 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
          style={{ background: dom.color }}
        >
          {dom.priority ? "Priorité" : dom.socle ? "Socle" : dom.tagline}
        </span>
        <span className="text-xs text-ink-faint">{dom.tagline}</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{dom.label}</h1>
      <p className="mt-2 text-[15px] text-ink-soft">
        {domainId === "mindset"
          ? "Le socle. Ta fréquence porte tout le reste."
          : "On commence par là — c'est ta priorité."}
      </p>
      <p className="mb-6 mt-2 rounded-xl bg-surface-2 px-3 py-2 text-[12.5px] leading-snug text-ink-faint">
        Quelques phrases honnêtes suffisent — pas un roman. Ton coach
        approfondira plus tard.
      </p>

      <AxisForm
        value={draft}
        onChange={onDraft}
        prompts={dom.prompts}
        color={dom.color}
        variant={dom.frequence ? "frequence" : "standard"}
        frequence={dom.frequence}
      />

      <div className="mt-7 flex gap-3">
        <button
          onClick={onBack}
          className="rounded-2xl border border-line px-5 py-4 font-semibold text-ink-soft"
        >
          ←
        </button>
        <button
          disabled={!draftValid(draft)}
          onClick={() => onNext(draft)}
          className="flex-1 rounded-2xl bg-ink py-4 font-semibold text-white disabled:opacity-30"
        >
          {isLast ? "Révéler ma fiche" : "Continuer"}
        </button>
      </div>
    </div>
  );
}

function Reveal({ profile, onDone }: { profile: Profile; onDone: () => void }) {
  const constat = revealConstat(profile);
  const rows = (["business", "mindset"] as const).map((id) => ({
    dom: DOMAIN_MAP[id],
    score: axisScore(profile.captures[id]),
  }));

  return (
    <div className="rise pt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
        Ton constat
      </p>
      <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight">
        {constat.headline}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        {constat.body}
      </p>

      <div className="mt-8 space-y-4">
        {rows.map(({ dom, score }) => (
          <div key={dom.id}>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm font-medium">{dom.label}</span>
              <span
                className="text-sm font-semibold"
                style={{ color: dom.color }}
              >
                {score} · {scoreLabel(score)}
              </span>
            </div>
            <Gauge value={score} color={dom.color} />
          </div>
        ))}
      </div>

      <p className="mt-8 text-[13px] leading-relaxed text-ink-faint">
        Il te reste l&apos;Alimentation, le Sport et les Relations à compléter —
        tranquillement, depuis ta fiche.
      </p>

      <button
        onClick={onDone}
        className="mt-6 w-full rounded-2xl bg-ink py-4 font-semibold text-white"
      >
        Voir ma fiche complète →
      </button>
    </div>
  );
}
