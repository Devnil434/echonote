import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  high:   { label: "High",   className: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50" },
  medium: { label: "Medium", className: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50" },
  low:    { label: "Low",    className: "bg-muted text-muted-foreground border-border" },
};

interface Props {
  item: {
    id: string;
    task: string;
    owner: string | null;
    deadline: string | null;
    deadline_raw: string | null;
    priority: "high" | "medium" | "low";
    is_completed: boolean;
  };
  onToggle: () => void;
}

function getDeadlineStatus(deadline: string | null): {
  label: string;
  isOverdue: boolean;
  isDueSoon: boolean;
} {
  if (!deadline) return { label: "No deadline", isOverdue: false, isDueSoon: false };

  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0)   return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true,  isDueSoon: false };
  if (diffDays === 0) return { label: "Due today",                       isOverdue: false, isDueSoon: true  };
  if (diffDays === 1) return { label: "Due tomorrow",                    isOverdue: false, isDueSoon: true  };
  if (diffDays <= 3)  return { label: `Due in ${diffDays}d`,             isOverdue: false, isDueSoon: true  };

  return {
    label: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isOverdue: false,
    isDueSoon: false,
  };
}

export function ActionItemCard({ item, onToggle }: Props) {
  const priorityConfig = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.medium;
  const deadlineInfo   = getDeadlineStatus(item.deadline);

  return (
    <Card className={cn(
      "border transition-colors duration-200",
      item.is_completed && "bg-muted/30",
      deadlineInfo.isOverdue && !item.is_completed && "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <Checkbox
            checked={item.is_completed}
            onCheckedChange={onToggle}
            className="mt-0.5 shrink-0"
          />

          <div className={cn("flex-1 min-w-0 transition-all duration-300", item.is_completed && "opacity-60")}>
            {/* Task */}
            <p className={cn(
              "text-sm font-medium leading-snug transition-all duration-200",
              item.is_completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            )}>
              {item.task}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {/* Owner */}
              {item.owner && item.owner !== "Unassigned" && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {item.owner}
                </span>
              )}

              {/* Deadline */}
              <span className={cn(
                "flex items-center gap-1 text-xs",
                deadlineInfo.isOverdue ? "text-red-600 dark:text-red-400 font-medium" :
                deadlineInfo.isDueSoon ? "text-amber-600 dark:text-amber-400 font-medium" :
                "text-muted-foreground"
              )}>
                {deadlineInfo.isOverdue && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                {item.deadline_raw ? `${item.deadline_raw} (${deadlineInfo.label})` : deadlineInfo.label}
              </span>

              {/* Priority */}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded border font-medium",
                priorityConfig.className
              )}>
                {priorityConfig.label}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
