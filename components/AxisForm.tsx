"use client";

export interface AxisDraft {
  identiteActuelle: string;
  identiteCible: string;
  etat: number;
  action: number;
  frequence?: number; // Mindset uniquement
}

export const EMPTY_DRAFT: AxisDraft = {
  identiteActuelle: "",
  identiteCible: "",
  etat: 5,
  action: 5,
};

function Slider({
  label,
  hint,
  value,
  color,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-ink">{label}</span>
        <span className="text-lg font-semibold tabular-nums" style={{ color }}>
          {value}
          <span className="text-sm text-ink-faint">/10</span>
        </span>
      </div>
      <p className="mb-2 mt-0.5 text-xs leading-snug text-ink-faint">{hint}</p>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--thumb" as string]: color }}
      />
    </div>
  );
}

export function AxisForm({
  value,
  onChange,
  prompts,
  color,
  variant = "standard",
  frequence,
}: {
  value: AxisDraft;
  onChange: (v: AxisDraft) => void;
  prompts: { actuelle: string; cible: string; cibleGuard?: string };
  color: string;
  variant?: "standard" | "frequence";
  frequence?: { label: string; hint: string; leviers: string[] };
}) {
  const set = (patch: Partial<AxisDraft>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-ink">
          Identité actuelle
        </label>
        <p className="mb-2 mt-0.5 text-xs leading-snug text-ink-faint">
          {prompts.actuelle}
        </p>
        <textarea
          value={value.identiteActuelle}
          onChange={(e) => set({ identiteActuelle: e.target.value })}
          rows={2}
          placeholder="Écris-le franchement…"
          className="w-full resize-none rounded-2xl border border-line bg-surface-2 p-3 text-[15px] leading-snug outline-none placeholder:text-ink-faint focus:border-ink-soft"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Identité cible</label>
        <p className="mb-2 mt-0.5 text-xs leading-snug text-ink-faint">
          {prompts.cible}
          {prompts.cibleGuard ? (
            <span className="mt-1 block italic" style={{ color }}>
              → {prompts.cibleGuard}
            </span>
          ) : null}
        </p>
        <textarea
          value={value.identiteCible}
          onChange={(e) => set({ identiteCible: e.target.value })}
          rows={3}
          placeholder="Visualise le toi que tu deviens…"
          className="w-full resize-none rounded-2xl border border-line bg-surface-2 p-3 text-[15px] leading-snug outline-none placeholder:text-ink-faint focus:border-ink-soft"
        />
      </div>

      {variant === "frequence" && frequence ? (
        <div className="space-y-4 rounded-2xl border border-line bg-surface-2 p-4">
          <Slider
            label={frequence.label}
            hint={frequence.hint}
            value={value.frequence ?? 5}
            color={color}
            onChange={(f) => set({ frequence: f })}
          />
          <div className="border-t border-line pt-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
              Ce qui recalibre ta fréquence
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {frequence.leviers.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-line bg-surface-2 p-4">
          <Slider
            label="Mon état"
            hint="À quel point ton état va déjà dans le sens de ta cible ?"
            value={value.etat}
            color={color}
            onChange={(etat) => set({ etat })}
          />
          <Slider
            label="Mes actions"
            hint="À quel point tes actions concrètes y vont, là, maintenant ?"
            value={value.action}
            color={color}
            onChange={(action) => set({ action })}
          />
        </div>
      )}
    </div>
  );
}
