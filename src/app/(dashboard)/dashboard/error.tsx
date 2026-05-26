"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev, send to Sentry/Datadog in production
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <AlertTriangle className="h-12 w-12 text-amber-400 mb-4" />
      <h2 className="text-lg font-semibold text-slate-800 mb-1">
        Something went wrong
      </h2>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">
        The dashboard failed to load. This is likely a temporary issue.
      </p>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
