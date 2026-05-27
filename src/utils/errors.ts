const ERROR_MESSAGES: Record<string, { title: string; action: string }> = {
  "file too large":         { title: "File too large",       action: "Please upload a file under 25MB." },
  "invalid file type":      { title: "Wrong file type",      action: "Upload an MP3, WAV, or M4A file." },
  "transcription failed":   { title: "Transcription failed", action: "Try again — Groq may be temporarily busy." },
  "summarization failed":   { title: "AI summary failed",    action: "Try again — Gemini may be temporarily busy." },
  "unauthorized":           { title: "Session expired",      action: "Please sign in again." },
  "network request failed": { title: "Connection issue",     action: "Check your internet and try again." },
  "upload failed":          { title: "Upload failed",        action: "Please check your file and try again." },
  "processing failed":      { title: "Processing failed",    action: "Please try again." },
};

export function getFriendlyError(rawError: string): { title: string; action: string } {
  const lower = rawError.toLowerCase();
  const match = Object.entries(ERROR_MESSAGES).find(([key]) =>
    lower.includes(key)
  );
  return match?.[1] ?? {
    title: "Something went wrong",
    action: "Please try again. If the issue persists, refresh the page.",
  };
}
