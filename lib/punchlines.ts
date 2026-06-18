// Le "constat qui pique" de l'onboarding (l'aha des 60 s).
// 100 % par RÈGLES, aucune IA. Punchlines ORIGINALES uniquement
// (garde-fou : zéro fausse citation). Toujours un recadrage vers la POSITION
// (« à peine commencé »), jamais vers l'ÊTRE (« nul »). Jamais de honte.

import type { Profile, Tone } from "./types";
import { axisScore, MINDSET_FLOOR } from "./scoring";

export interface Constat {
  headline: string;
  body: string;
}

type Situation = "mindset_socle" | "gap_action" | "momentum" | "start";

const COPY: Record<Situation, Record<Tone, Constat>> = {
  mindset_socle: {
    bienveillant: {
      headline: "Commence par dedans.",
      body: "Tu vises haut, et c'est juste. Mais ton mental n'est pas encore à la hauteur de ce que tu construis — et c'est lui qui porte tout le reste. On le remet d'aplomb d'abord, le reste suivra.",
    },
    pragmatique: {
      headline: "Le socle d'abord.",
      body: "Tes ambitions tiennent debout sur ton mental. Là, il flanche. Inutile de pousser le business si la base bouge. On stabilise la tête, ensuite on accélère.",
    },
    brutal: {
      headline: "Ta tête lâche avant le reste.",
      body: "Tu veux le résultat mais ton mental est au sol. On ne bâtit rien sur des fondations qui tremblent. Répare le socle — pas demain, maintenant. Et non, t'es pas foutu : t'as juste à peine commencé.",
    },
  },
  gap_action: {
    bienveillant: {
      headline: "Tu visualises. Maintenant, exécute.",
      body: "Ta cible est claire, l'intention est là — mais l'action ne suit pas encore. Ce n'est pas un défaut de valeur, c'est un début qui attend son premier pas. Pose-le.",
    },
    pragmatique: {
      headline: "L'écart est dans l'action.",
      body: "Tu sais où tu vas, tu ne bouges juste pas encore assez. La distance entre toi et ta cible, c'est des gestes posés — pas des pensées de plus. On commence par un.",
    },
    brutal: {
      headline: "Tu rêves fort, t'agis mou.",
      body: "La vision est nickel, l'exécution est absente. Visualiser sans bouger, c'est se mentir confortablement. Tu n'es pas nul — tu n'as simplement encore rien fait. Change ça aujourd'hui.",
    },
  },
  momentum: {
    bienveillant: {
      headline: "Tu es déjà en route.",
      body: "État et action pointent dans le même sens — c'est exactement comme ça que ça marche. Garde ce cap, sans relâcher la vigilance sur le socle.",
    },
    pragmatique: {
      headline: "Bon alignement. Tiens-le.",
      body: "Tu es cohérent : ce que tu vises et ce que tu fais visent le même endroit. Le risque, maintenant, c'est le relâchement. Reste joueur, reste régulier.",
    },
    brutal: {
      headline: "Aligné. Prouve-le dans la durée.",
      body: "Le départ est solide. Beaucoup démarrent fort puis s'effondrent. La vraie question : tu tiens encore dans 3 mois ? Zéro complaisance.",
    },
  },
  start: {
    bienveillant: {
      headline: "Voilà ton point de départ.",
      body: "Aucun jugement ici, juste une photo honnête de là où tu es. C'est de cette base que tout se construit — calmement, étape par étape.",
    },
    pragmatique: {
      headline: "Photo de départ, sans filtre.",
      body: "Voilà où tu en es vraiment. Pas un constat d'échec : une ligne de base. Maintenant on sait quoi viser et par où commencer.",
    },
    brutal: {
      headline: "C'est ça, ton vrai niveau.",
      body: "Pas d'enrobage : voilà où tu es. Ce n'est pas une condamnation, c'est un point de départ. Ce que tu en fais à partir de maintenant ne dépend que de toi.",
    },
  },
};

/** Détermine la situation à partir des captures Business + Mindset. */
function pickSituation(p: Profile): Situation {
  const business = p.captures["business"];
  const mindset = p.captures["mindset"];
  const b = axisScore(business);
  const m = axisScore(mindset);

  if (m !== null && m < MINDSET_FLOOR) return "mindset_socle";

  const hasCible = [business, mindset].some(
    (c) => c?.completed && c.identiteCible.trim().length > 0,
  );
  const businessAction = business?.completed ? business.action : 10;
  if (hasCible && businessAction <= 4) return "gap_action";

  if (b !== null && m !== null && b >= 65 && m >= 65) return "momentum";

  return "start";
}

export function revealConstat(p: Profile): Constat {
  return COPY[pickSituation(p)][p.tone];
}
