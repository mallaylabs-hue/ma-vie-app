// Modèle de données — Phase 0 (squelette).
// Calqué sur le §8 du cahier des charges. Les champs "prêts pour plus tard"
// sont présents mais inutilisés en Phase 0 (objectifs/étapes/actions = Phase 2,
// coffre à preuves/saisons = Phase 4). On les pose maintenant pour éviter toute
// migration douloureuse.

export type Tone = "bienveillant" | "pragmatique" | "brutal";

export type DomainId =
  | "business"
  | "mindset"
  | "alimentation"
  | "sport"
  | "relations";

/**
 * Une unité de capture de la mécanique-socle :
 * identité actuelle → identité cible → (état, action).
 * Pour la plupart des domaines il y a un seul axe (= le domaine lui-même).
 * Les Relations en ont 4 (réseau, amour, famille, mentor).
 */
/** Un signe / synchronicité / baraka logué — preuve que la fréquence était haute. */
export interface Preuve {
  id: string;
  date: number;
  note: string;
}

export interface AxisCapture {
  identiteActuelle: string;
  identiteCible: string;
  etat: number; // curseur 0–10 : mon état va-t-il dans le sens de ma cible ?
  action: number; // curseur 0–10 : mes actions vont-elles dans ce sens ?
  /**
   * Spécifique au Mindset : la jauge-titre = la FRÉQUENCE (haute fréquence /
   * vibration / détachement / connexion). C'est la cause racine ; connexion et
   * baraka en découlent. Quand défini, il pilote le score du Mindset à la place
   * de (etat, action).
   */
  frequence?: number; // curseur 0–10
  completed: boolean;
  updatedAt: number;

  // Prêts pour les phases suivantes — vides en Phase 0.
  objectifs: unknown[];
  etapes: unknown[];
  actions: unknown[];
  historiqueBilans: unknown[];
  /** Journal de signes / baraka. Utilisé dès la Phase 0.1 pour le Mindset. */
  coffreAPreuves: Preuve[];
}

export interface Profile {
  id: "me";
  tone: Tone;
  createdAt: number;
  onboardedAt: number | null; // moment de la "révélation" express

  /** Captures indexées par axisId (ex. "business", "relations.amour"). */
  captures: Record<string, AxisCapture>;

  // Prêt pour la Phase 4.
  saisonCourante: { index: number; startedAt: number } | null;
}

export function emptyCapture(now: number): AxisCapture {
  return {
    identiteActuelle: "",
    identiteCible: "",
    etat: 5,
    action: 5,
    completed: false,
    updatedAt: now,
    objectifs: [],
    etapes: [],
    actions: [],
    historiqueBilans: [],
    coffreAPreuves: [],
  };
}
