import type { DomainId, Tone } from "./types";

export interface SubDomainDef {
  id: string;
  label: string;
  hint: string;
}

export interface DomainDef {
  id: DomainId;
  label: string;
  tagline: string;
  color: string; // hex, utilisé en style inline (Tailwind ne peut pas générer du dynamique)
  priority?: boolean; // Business
  socle?: boolean; // Mindset
  prompts: {
    actuelle: string;
    cible: string;
    /** Garde-fou affiché sous le champ "identité cible" (définir en positif). */
    cibleGuard?: string;
  };
  /** Si présent, ce domaine est noté via une jauge unique (la Fréquence du Mindset). */
  frequence?: {
    label: string;
    hint: string;
    /** Leviers qui recalibrent la fréquence (affichage informatif). */
    leviers: string[];
  };
  subDomains?: SubDomainDef[];
}

export const TONES: { id: Tone; label: string; desc: string }[] = [
  {
    id: "bienveillant",
    label: "Bienveillant",
    desc: "Doux et encourageant. Exigeant sur l'action, jamais sur ta valeur.",
  },
  {
    id: "pragmatique",
    label: "Pragmatique",
    desc: "Cash et juste. Droit au but, sans détour ni complaisance.",
  },
  {
    id: "brutal",
    label: "Brutal",
    desc: "Sans filtre. Te secoue fort — mais jamais de mépris, jamais de honte.",
  },
];

export const DOMAINS: DomainDef[] = [
  {
    id: "business",
    label: "Business",
    tagline: "Le jeu",
    color: "#bf8a12",
    priority: true,
    prompts: {
      actuelle: "Où en est ton business, vraiment, aujourd'hui ?",
      cible:
        "Le toi qui a réussi : quel niveau, quel mode de vie, quelle posture ?",
      cibleGuard: "Décris-le en joueur serein, pas en grind anxieux.",
    },
  },
  {
    id: "mindset",
    label: "Mindset",
    tagline: "Le socle",
    color: "#3b5bdb",
    socle: true,
    prompts: {
      actuelle: "Dans quel état d'esprit tu te réveilles en ce moment ?",
      cible: "L'homme que tu deviens : serein, détaché, déjà dans l'état ?",
      cibleGuard:
        "« Affamé et digne », jamais « minable ». La position, pas l'être.",
    },
    frequence: {
      label: "Fréquence",
      hint: "Ta haute fréquence : détachement, unité, connexion. Quand tu y es, la baraka opère — tu relies ce qui arrive au destin, et c'est juste.",
      leviers: [
        "5 prières",
        "Respiration sur l'adhan",
        "Sens des sourates",
        "Visualisation",
        "Relecture des objectifs",
      ],
    },
  },
  {
    id: "alimentation",
    label: "Alimentation",
    tagline: "Le carburant",
    color: "#2f9e44",
    prompts: {
      actuelle: "Comment tu manges, honnêtement, ces dernières semaines ?",
      cible: "Ta cible : apport, protéines, rapport à la bouffe que tu veux.",
      cibleGuard: "Les chiffres exacts se posent avec un pro — pas ici.",
    },
  },
  {
    id: "sport",
    label: "Sport",
    tagline: "Le corps",
    color: "#e8590c",
    prompts: {
      actuelle: "Ton rythme de séances et ton corps, là, maintenant ?",
      cible: "La transformation visée : recomposition, perfs, allure.",
    },
  },
  {
    id: "relations",
    label: "Relations",
    tagline: "Les 5 personnes",
    color: "#c2255c",
    prompts: {
      actuelle: "Qui t'entoure aujourd'hui ?",
      cible: "Les gens dont tu veux t'entourer.",
    },
    subDomains: [
      {
        id: "reseau",
        label: "Réseau & amis",
        hint: "Le type de gens à côtoyer : échelles plus hautes, plus de dalle.",
      },
      {
        id: "amour",
        label: "Amour",
        hint: "Définie en positif : ce que tu admires, jamais le mépris du reste.",
      },
      {
        id: "famille",
        label: "Famille proche",
        hint: "Les liens de longue date que tu veux nourrir.",
      },
      {
        id: "mentor",
        label: "Mentors & role models",
        hint: "Ceux dont tu apprends, ceux que tu veux égaler.",
      },
    ],
  },
];

export const DOMAIN_MAP: Record<DomainId, DomainDef> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, DomainDef>;

/** Domaines capturés en premier dans l'onboarding express. */
export const EXPRESS_DOMAIN_IDS: DomainId[] = ["business", "mindset"];

/** Les axisId d'un domaine (sous-domaines pour Relations, sinon le domaine). */
export function axisIdsForDomain(d: DomainDef): string[] {
  return d.subDomains
    ? d.subDomains.map((s) => `${d.id}.${s.id}`)
    : [d.id];
}

export function allAxisIds(): string[] {
  return DOMAINS.flatMap(axisIdsForDomain);
}

/** Libellé lisible d'un axe. */
export function axisLabel(axisId: string): string {
  const [domId, subId] = axisId.split(".");
  const dom = DOMAIN_MAP[domId as DomainId];
  if (!dom) return axisId;
  if (!subId) return dom.label;
  const sub = dom.subDomains?.find((s) => s.id === subId);
  return sub ? sub.label : dom.label;
}
