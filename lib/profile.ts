"use client";

import { useCallback, useEffect, useState } from "react";
import type { AxisCapture, Profile, Tone } from "./types";
import { emptyCapture } from "./types";
import { clearAll, loadProfile, saveProfile } from "./db";

// ---- Helpers purs (pas d'effet de bord) ----

export function createProfile(tone: Tone, now: number): Profile {
  return {
    id: "me",
    tone,
    createdAt: now,
    onboardedAt: null,
    captures: {},
    saisonCourante: null,
  };
}

/** Renvoie un nouveau profil avec la capture d'un axe mise à jour. */
export function withCapture(
  p: Profile,
  axisId: string,
  patch: Partial<AxisCapture>,
  now: number,
): Profile {
  const prev = p.captures[axisId] ?? emptyCapture(now);
  const next: AxisCapture = { ...prev, ...patch, updatedAt: now };
  return { ...p, captures: { ...p.captures, [axisId]: next } };
}

// ---- Hook client ----

export interface ProfileStore {
  profile: Profile | null;
  loading: boolean;
  /** Remplace le profil en mémoire et persiste sur l'appareil. */
  save: (next: Profile) => Promise<void>;
  /** Efface tout (réinitialisation). */
  reset: () => Promise<void>;
}

export function useProfile(): ProfileStore {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadProfile()
      .then((p) => {
        if (active) {
          setProfile(p ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback(async (next: Profile) => {
    setProfile(next);
    await saveProfile(next);
  }, []);

  const reset = useCallback(async () => {
    await clearAll();
    setProfile(null);
  }, []);

  return { profile, loading, save, reset };
}
