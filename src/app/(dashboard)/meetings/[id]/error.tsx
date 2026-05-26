"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function MeetingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
      <h2 className="text-lg font-semibold text-slate-800 mb-1">
        Failed to load meeting
      </h2>
      <p className="text-slate-500 text-sm mb-6 max-w-sm">
        {error.message ?? "An unexpected error occurred while loading this meeting."}
      </p>
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={reset}>
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
