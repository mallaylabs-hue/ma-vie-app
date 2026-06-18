// Route de transcription — premier morceau de backend.
// Reçoit un audio enregistré dans le navigateur, le transcrit via Groq
// (whisper-large-v3-turbo), renvoie le texte. La clé reste côté serveur
// (variable d'env GROQ_API_KEY sur Vercel) — jamais exposée au client.

export const runtime = "nodejs";
export const maxDuration = 30;

const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const MODEL = "whisper-large-v3-turbo";

export async function POST(req: Request) {
  // Tolère les deux casses (la variable Vercel peut être en minuscules).
  const key = process.env.GROQ_API_KEY ?? process.env.groq_api_key;
  if (!key) {
    return Response.json(
      { error: "La transcription n'est pas encore configurée." },
      { status: 503 },
    );
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("audio");
    if (f instanceof File) file = f;
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!file || file.size === 0) {
    return Response.json({ error: "Aucun audio reçu." }, { status: 400 });
  }

  const groqForm = new FormData();
  groqForm.append("file", file, file.name || "audio.webm");
  groqForm.append("model", MODEL);
  groqForm.append("language", "fr");
  groqForm.append("response_format", "json");
  groqForm.append("temperature", "0");

  try {
    const r = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: groqForm,
    });
    if (!r.ok) {
      const detail = (await r.text()).slice(0, 300);
      return Response.json(
        { error: "Transcription échouée.", detail },
        { status: 502 },
      );
    }
    const data = (await r.json()) as { text?: string };
    return Response.json({ text: (data.text ?? "").trim() });
  } catch {
    return Response.json(
      { error: "Service de transcription injoignable." },
      { status: 502 },
    );
  }
}
