import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays, CheckSquare2, Loader2, AlertCircle
} from "lucide-react";

type Status = "pending" | "processing" | "transcribed" | "done" | "error";

const STATUS_CONFIG: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending:     { label: "Queued",      variant: "secondary" },
  processing:  { label: "Processing",  variant: "secondary" },
  transcribed: { label: "Analysing",   variant: "secondary" },
  done:        { label: "Done",        variant: "default"   },
  error:       { label: "Error",       variant: "destructive" },
};

interface Props {
  meeting: {
    id: string;
    title: string;
    status: string;
    meeting_date: string | null;
    created_at: string;
    error_message: string | null;
    summaries: { content: string }[] | null;
    action_items: { count: number }[] | null;
  };
}

export function MeetingCard({ meeting }: Props) {
  const config = STATUS_CONFIG[meeting.status as Status] ?? STATUS_CONFIG.done;
  const isProcessing = ["pending", "processing", "transcribed"].includes(meeting.status);

  const summaryText = meeting.summaries?.[0]?.content;
  const summaryPreview = summaryText
    ? summaryText.length > 130 ? summaryText.slice(0, 130) + "…" : summaryText
    : null;

  const actionCount = meeting.action_items?.[0]?.count ?? 0;

  const displayDate = meeting.meeting_date ?? meeting.created_at;
  const dateLabel = new Date(displayDate).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="h-full hover:shadow-md transition-all duration-150 cursor-pointer group">
        <CardContent className="p-4 pb-2">
          {/* Title + status badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
              {meeting.title}
            </h3>
            <Badge variant={config.variant} className="shrink-0 text-xs gap-1">
              {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
              {config.label}
            </Badge>
          </div>

          {/* Summary preview */}
          {summaryPreview && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {summaryPreview}
            </p>
          )}

          {!summaryPreview && isProcessing && (
            <p className="text-xs text-slate-400 italic">AI is analysing this meeting…</p>
          )}

          {!summaryPreview && meeting.status === "done" && (
            <p className="text-xs text-slate-400 italic">No summary available</p>
          )}

          {meeting.status === "error" && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="h-3 w-3" />
              Processing failed
            </p>
          )}
        </CardContent>

        <CardFooter className="px-4 py-2.5 border-t bg-slate-50 rounded-b-lg flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {dateLabel}
          </span>
          {actionCount > 0 && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CheckSquare2 className="h-3 w-3 text-emerald-500" />
              {actionCount} action{actionCount !== 1 ? "s" : ""}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
