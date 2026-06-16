# Projet — App de vie gamifiée + coaching IA

Spec complète et source de vérité : `cahier-des-charges-app-vie.md`. S'y référer pour tout détail.

## En une phrase
Une "fiche perso" de vie façon RPG / Sims : un dashboard de bilan global + des coachs IA conversationnels par domaine. Ce n'est **pas** une to-do quotidienne.

## Principe fondateur
Une seule mécanique, répétée sur 5 domaines (Business *(priorité)*, Alimentation, Sport, Relations, Mindset) :

> **Identité actuelle → Identité cible → Objectifs → Étapes → Actions.**

Le **Mindset est le socle** : il module les autres domaines et révèle les corrélations.

## Stack visé
- PWA installable, mobile-first.
- Backend léger (clé API Claude, stockage de l'état, notifications push) — phases ultérieures.
- Coachs = appels `claude-sonnet` avec contrat de sortie structurée (JSON) — phases ultérieures.

## Discipline de build
- Avancer **par phases** (voir §13 du cahier). Ne jamais tout construire d'un coup.
- **Phase courante : Phase 0** — onboarding + fiche perso statique (identity statements, jauges, score d'alignement). Aucune IA, aucun backend.
- Toujours **proposer un plan + poser les questions manquantes AVANT de coder** une nouvelle phase.

## Garde-fous non négociables
- **Voix dure, mécanique douce** : jamais punir une absence, pas de streak qui casse, jamais de honte.
- **Local-first**, données chiffrées sur l'appareil (contenu psychologique intime).
- Identité cible définie **en positif**, jamais par le mépris.
- Le Mindset est un **compagnon de réflexion, pas un thérapeute**. Les cibles santé (calories, macros, IMC) se posent avec un pro — l'app assure la redevabilité, pas la prescription.
- **Pas de fausses citations** attribuées à de vraies personnes ; punchlines originales uniquement.
