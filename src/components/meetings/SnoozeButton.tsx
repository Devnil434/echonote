"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { snoozeReminder } from "@/actions/reminder.actions";

export function SnoozeButton({ actionItemId }: { actionItemId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleSnooze() {
    startTransition(async () => {
      await snoozeReminder(actionItemId);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSnooze}
      disabled={isPending}
      className="h-7 px-2 text-xs text-slate-500 hover:text-slate-800"
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <><RefreshCw className="h-3 w-3 mr-1" /> Remind again</>
      )}
    </Button>
  );
}
