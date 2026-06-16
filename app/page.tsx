"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/profile";

export default function Home() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(profile?.onboardedAt ? "/dashboard" : "/onboarding");
  }, [loading, profile, router]);

  return (
    <main className="grid min-h-dvh place-items-center">
      <div className="flex flex-col items-center gap-4 text-ink-faint">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-ink" />
        <span className="text-sm">Ouverture de ta fiche…</span>
      </div>
    </main>
  );
}
