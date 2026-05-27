"use client";

import { useState, useTransition } from "react";
import { ActionItemCard } from "./ActionItemCard";
import { CheckSquare2 } from "lucide-react";
import { toggleActionItemComplete } from "@/actions/meeting.actions";
import { toast } from "sonner";

interface ActionItem {
  id: string;
  task: string;
  owner: string | null;
  deadline: string | null;
  deadline_raw: string | null;
  priority: "high" | "medium" | "low";
  is_completed: boolean;
  created_at: string;
}

interface Props {
  items: ActionItem[];
  meetingId: string;
}

export function ActionItemList({ items }: Props) {
  const [optimisticItems, setOptimisticItems] = useState(items);
  const [, startTransition] = useTransition();

  function handleToggle(itemId: string) {
    const item = optimisticItems.find((i) => i.id === itemId);
    if (!item) return;

    setOptimisticItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, is_completed: !i.is_completed } : i
      )
    );

    startTransition(async () => {
      try {
        await toggleActionItemComplete(itemId);
        toast.success(item.is_completed ? "Marked as open" : "Marked as complete");
      } catch {
        setOptimisticItems(items);
        toast.error("Failed to update — please try again");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4">
          <CheckSquare2 className="h-7 w-7 text-muted-foreground/40" />
        </div>
        <h4 className="heading-sm mb-1">No action items found</h4>
        <p className="body-sm max-w-xs">
          The AI didn&apos;t detect any tasks, owners, or deadlines in this transcript.
          Meetings with clear assignments (&ldquo;X will do Y by Z&rdquo;) generate the best results.
        </p>
      </div>
    );
  }

  const open      = optimisticItems.filter((i) => !i.is_completed);
  const completed = optimisticItems.filter((i) =>  i.is_completed);

  return (
    <div className="space-y-6">
      {/* ── Open items ────────────────────────────────────── */}
      {open.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground/70 mb-3 flex items-center gap-2">
            <CheckSquare2 className="h-4 w-4 text-emerald-500" />
            Open ({open.length})
          </h3>
          <div className="space-y-3">
            {open.map((item) => (
              <ActionItemCard
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Completed items ───────────────────────────────── */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <CheckSquare2 className="h-4 w-4 text-muted-foreground/50" />
            Completed ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map((item) => (
              <ActionItemCard
                key={item.id}
                item={item}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
