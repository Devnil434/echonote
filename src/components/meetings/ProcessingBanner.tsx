"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ORDERED_STEPS = ["pending", "processing", "transcribed"] as const;
const STEP_LABELS: Record<string, string> = {
  pending:     "Queued",
  processing:  "Transcribing",
  transcribed: "Summarizing",
};

interface Props {
  meetingId: string;
  currentStatus: string;
}

export function ProcessingBanner({ meetingId, currentStatus }: Props) {
  const router   = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
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
        router.refresh();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [status, meetingId, router, supabase]);

  if (status === "done" || status === "error") return null;

  const currentIdx = ORDERED_STEPS.indexOf(status as (typeof ORDERED_STEPS)[number]);

  return (
    <div className="mb-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl p-4">
      <p className="text-blue-700 dark:text-blue-400 font-medium text-sm mb-3">
        Processing your meeting…
      </p>

      <div className="space-y-2.5">
        {ORDERED_STEPS.map((step, i) => {
          const isDone   = i < currentIdx;
          const isActive = i === currentIdx;

          return (
            <div key={step} className="flex items-center gap-2.5">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200",
                isDone   ? "bg-blue-400 dark:bg-blue-500" :
                isActive ? "bg-blue-500 dark:bg-blue-400" :
                "bg-blue-100 dark:bg-blue-900/50"
              )}>
                {isDone   && <Check   className="h-3 w-3 text-white" />}
                {isActive && <Loader2 className="h-3 w-3 text-white animate-spin" />}
              </div>
              <span className={cn(
                "text-xs transition-colors duration-200",
                isDone || isActive
                  ? "text-blue-700 dark:text-blue-400 font-medium"
                  : "text-blue-300 dark:text-blue-800"
              )}>
                {STEP_LABELS[step]}
                {isActive && <span className="ml-1 animate-pulse">…</span>}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-blue-500 dark:text-blue-500/70 text-xs mt-3">
        This page will refresh automatically when ready.
      </p>
    </div>
  );
}
