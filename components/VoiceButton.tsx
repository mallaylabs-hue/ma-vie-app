"use client";

import { useRef, useState } from "react";

type State = "idle" | "recording" | "working" | "error";

const MIME_CANDIDATES = ["audio/webm", "audio/mp4", "audio/ogg"];

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const m of MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported?.(m)) return m;
  }
  return "";
}

function extFor(mime: string): string {
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

export function VoiceButton({
  onText,
  color,
  title = "Dicter",
}: {
  onText: (text: string) => void;
  color: string;
  title?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeRef = useRef<string>("");

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      mimeRef.current = mime;
      const rec = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        void transcribe();
      };
      recRef.current = rec;
      rec.start();
      setState("recording");
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 2500);
    }
  }

  function stop() {
    recRef.current?.stop();
    setState("working");
  }

  async function transcribe() {
    try {
      const mime = mimeRef.current || "audio/webm";
      const blob = new Blob(chunksRef.current, { type: mime });
      const form = new FormData();
      form.append("audio", blob, `audio.${extFor(mime)}`);
      const r = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = (await r.json()) as { text?: string; error?: string };
      if (!r.ok || !data.text) {
        setState("error");
        window.setTimeout(() => setState("idle"), 2500);
        return;
      }
      onText(data.text);
      setState("idle");
    } catch {
      setState("error");
      window.setTimeout(() => setState("idle"), 2500);
    }
  }

  const recording = state === "recording";
  const working = state === "working";
  const error = state === "error";

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      disabled={working}
      aria-label={recording ? "Arrêter la dictée" : title}
      title={title}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors"
      style={{
        borderColor: recording ? color : "var(--line)",
        background: recording ? color : "var(--surface)",
        color: recording ? "#fff" : error ? "#e8590c" : "var(--ink-soft)",
      }}
    >
      {working ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-ink" />
      ) : recording ? (
        <span className="h-3 w-3 rounded-[3px] bg-white" />
      ) : error ? (
        <span className="text-xs font-bold">!</span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect
            x="9"
            y="3"
            width="6"
            height="11"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M5 11a7 7 0 0014 0M12 18v3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
