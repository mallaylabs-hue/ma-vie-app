// Score d'alignement — Phase 0, SANS IA.
// Honnête par construction : il vient des curseurs déclarés par l'utilisateur,
// pas d'une fausse formule.
//
// Règle "Mindset révélateur" (choix validé) : le score global est une moyenne
// SIMPLE des domaines remplis. Si le Mindset est bas, on lève une alerte socle
// — sans jamais baisser artificiellement le chiffre (garde-fou : pas de
// multiplicateur qui efface les progrès réels).

import type { AxisCapture, Profile } from "./types";
import { DOMAINS, DOMAIN_MAP, axisIdsForDomain } from "./domains";

/** Seuil en-dessous duquel le Mindset déclenche l'alerte socle. */
export const MINDSET_FLOOR = 45;

/**
 * Score d'un axe sur 100.
 * - Mindset : piloté par la FRÉQUENCE (cause racine) quand elle est définie.
 * - Autres : moyenne des 2 curseurs (état, action).
 */
export function axisScore(c: AxisCapture | undefined): number | null {
  if (!c || !c.completed) return null;
  if (c.frequence != null) return Math.round(c.frequence * 10);
  return Math.round(((c.etat + c.action) / 2) * 10);
}

export interface DomainScore {
  /** null si aucun axe rempli. */
  score: number | null;
  done: number;
  total: number;
  /** true si TOUS les axes du domaine sont remplis. */
  complete: boolean;
  /** true si au moins un axe est rempli. */
  started: boolean;
}

export function domainScore(p: Profile, domainId: string): DomainScore {
  const dom = DOMAIN_MAP[domainId as keyof typeof DOMAIN_MAP];
  if (!dom) return { score: null, done: 0, total: 0, complete: false, started: false };

  const axisIds = axisIdsForDomain(dom);
  const scores: number[] = [];
  for (const id of axisIds) {
    const s = axisScore(p.captures[id]);
    if (s !== null) scores.push(s);
  }
  const done = scores.length;
  const total = axisIds.length;
  return {
    score: done ? Math.round(scores.reduce((a, b) => a + b, 0) / done) : null,
    done,
    total,
    complete: done === total && total > 0,
    started: done > 0,
  };
}

/** Moyenne simple des domaines ayant au moins un axe rempli. */
export function globalScore(p: Profile): number | null {
  const vals: number[] = [];
  for (const d of DOMAINS) {
    const s = domainScore(p, d.id).score;
    if (s !== null) vals.push(s);
  }
  return vals.length
    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    : null;
}

/** Alerte socle : Mindset rempli ET en-dessous du plancher. */
export function mindsetAlert(p: Profile): boolean {
  const s = domainScore(p, "mindset").score;
  return s !== null && s < MINDSET_FLOOR;
}

/** Couleur d'un score (rouge → ambre → vert). */
export function scoreColor(score: number | null): string {
  if (score === null) return "var(--ink-faint)";
  if (score < 34) return "#e8590c";
  if (score < 67) return "#d9a40a";
  return "#2f9e44";
}

/** Mot-titre lisible d'un score. */
export function scoreLabel(score: number | null): string {
  if (score === null) return "À découvrir";
  if (score < 34) return "Désaligné";
  if (score < 50) return "À reconstruire";
  if (score < 67) return "En chemin";
  if (score < 84) return "Aligné";
  return "Pleinement aligné";
}
