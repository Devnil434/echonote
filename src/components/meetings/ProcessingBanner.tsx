"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const STATUS_MESSAGES: Record<string, string> = {
  pending:     "Queued for processing…",
  processing:  "Transcribing audio with Groq Whisper…",
  transcribed: "Generating AI summary with Gemini Flash…",
};

interface Props {
  meetingId: string;
  currentStatus: string;
}

export function ProcessingBanner({ meetingId, currentStatus }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    // Only poll while still processing
    if (status === "done" || status === "error") return;

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("meetings")
        .select("status")
        .eq("id", meetingId)
        .single();

      if (!data) return;

      setStatus(data.status);

      if (data.status === "done" || data.status === "error") {
        clearInterval(interval);
        // Refresh the server component to load summary + action items
        router.refresh();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, meetingId, router, supabase]);

  if (status === "done" || status === "error") return null;

  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
        <div>
          <p className="text-blue-700 font-medium text-sm">
            {STATUS_MESSAGES[status] ?? "Processing…"}
          </p>
          <p className="text-blue-500 text-xs mt-0.5">
            This page will refresh automatically when ready.
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-3 flex gap-2">
        {["pending", "processing", "transcribed"].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              ["pending", "processing", "transcribed"].indexOf(status) >=
              ["pending", "processing", "transcribed"].indexOf(s)
                ? "bg-blue-400"
                : "bg-blue-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

