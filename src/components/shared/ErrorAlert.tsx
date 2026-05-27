import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFriendlyError } from "@/utils/errors";

interface Props {
  error: string;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: Props) {
  const { title, action } = getFriendlyError(error);

  return (
    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20
                    border border-red-200 dark:border-red-900/50
                    rounded-xl p-4">
      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">{title}</p>
        <p className="text-xs text-red-600 dark:text-red-500 mt-0.5">{action}</p>
      </div>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          className="shrink-0 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 gap-1.5 text-xs h-7"
        >
          <RefreshCw className="h-3 w-3" /> Retry
        </Button>
      )}
    </div>
  );
}
