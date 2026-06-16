// Couche d'accès unique aux données locales (IndexedDB via Dexie).
// Local-first : la donnée vit sur l'appareil. Le jour où on branche le
// chiffrement (garde-fou cahier), on ne touche QUE ce fichier — aucune
// migration côté composants.
//
// Dexie n'est instancié que dans le navigateur : toutes les fonctions
// exportées sont appelées depuis des effets client, jamais pendant le SSR.

import Dexie, { type Table } from "dexie";
import type { Profile } from "./types";

class VieDB extends Dexie {
  profile!: Table<Profile, string>;

  constructor() {
    super("app-vie");
    this.version(1).stores({
      // Un seul enregistrement (id = "me") en Phase 0.
      profile: "id",
    });
  }
}

let _db: VieDB | null = null;

function db(): VieDB {
  if (typeof window === "undefined") {
    throw new Error("db() ne doit être appelé que côté client");
  }
  if (!_db) _db = new VieDB();
  return _db;
}

export const PROFILE_ID = "me" as const;

export async function loadProfile(): Promise<Profile | undefined> {
  return db().profile.get(PROFILE_ID);
}

export async function saveProfile(p: Profile): Promise<void> {
  await db().profile.put(p);
}

export async function clearAll(): Promise<void> {
  await db().profile.clear();
}
