"use client";

import { useEffect, useState } from "react";

/**
 * Animation d'entrée "calibrage de fréquence" : des ondes concentriques pulsent
 * (la fréquence/vibration) pendant que le nom se forme, puis l'écran s'efface
 * pour révéler l'onboarding. ~1,6 s, skippable au toucher, respecte
 * prefers-reduced-motion.
 */
export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);

  function dismiss(delay: number) {
    setLeaving(true);
    window.setTimeout(onDone, delay);
  }

  useEffect(() => {
    const t = window.setTimeout(() => dismiss(450), 1550);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={() => dismiss(350)}
      className={`fixed inset-0 z-50 grid place-items-center bg-bg intro ${
        leaving ? "intro-out" : ""
      }`}
    >
      <div className="relative grid h-48 w-48 place-items-center">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="intro-ring"
            style={{
              animationDelay: `${i * 0.32}s`,
              borderColor: "var(--d-mindset)",
            }}
          />
        ))}
        <div className="intro-word relative z-10 text-center">
          <div className="text-2xl font-bold tracking-tight">Ma Vie</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            calibrage
          </div>
        </div>
      </div>
    </div>
  );
}
