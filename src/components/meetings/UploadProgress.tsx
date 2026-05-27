import { Check, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "transcribing" | "summarizing" | "done" | "error";

const STEPS = [
  { id: "upload",     label: "Uploading file"     },
  { id: "transcribe", label: "Transcribing audio"  },
  { id: "summarize",  label: "Generating summary"  },
  { id: "done",       label: "Ready"               },
];

const STEP_INDEX: Record<string, number> = {
  uploading:    0,
  transcribing: 1,
  summarizing:  2,
  done:         3,
};

interface Props {
  currentStep: UploadStatus;
}

export function UploadProgress({ currentStep }: Props) {
  if (currentStep === "idle") return null;

  const currentIndex = STEP_INDEX[currentStep] ?? -1;

  return (
    <div className="mt-5 p-4 bg-muted/50 rounded-xl border border-border">
      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const isDone   = i < currentIndex || currentStep === "done";
          const isActive = i === currentIndex && currentStep !== "done";
          const isError  = currentStep === "error" && isActive;

          return (
            <div key={step.id} className="flex items-center gap-3">
              {/* Step icon */}
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200",
                isDone              ? "bg-emerald-500" :
                isActive && !isError ? "bg-primary" :
                isError              ? "bg-destructive" :
                "bg-muted-foreground/20"
              )}>
                {isDone              && <Check    className="h-3.5 w-3.5 text-white" />}
                {isActive && !isError && <Loader2  className="h-3.5 w-3.5 text-white animate-spin" />}
                {!isDone && !isActive  && <Circle   className="h-2.5 w-2.5 text-muted-foreground" />}
              </div>

              {/* Step label */}
              <span className={cn(
                "text-sm transition-colors duration-200",
                isDone              ? "text-emerald-600 dark:text-emerald-400 font-medium" :
                isActive && !isError ? "text-primary font-medium" :
                isError              ? "text-destructive font-medium" :
                "text-muted-foreground"
              )}>
                {step.label}
                {isActive && <span className="ml-1 animate-pulse">…</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
