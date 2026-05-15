import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckSquare, Loader2, AlertCircle } from "lucide-react";

type MeetingStatus = "pending" | "processing" | "transcribed" | "done" | "error";

const STATUS_CONFIG: Record<MeetingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon?: React.ReactNode }> = {
  pending:     { label: "Queued",       variant: "secondary" },
  processing:  { label: "Processing",   variant: "secondary" },
  transcribed: { label: "Summarizing",  variant: "secondary" },
  done:        { label: "Done",         variant: "default" },
  error:       { label: "Error",        variant: "destructive" },
};

interface Props {
  meeting: {
    id: string;
    title: string;
    status: string;
    meeting_date: string | null;
    created_at: string;
    summaries: { content: string }[] | null;
    action_items: { count: number }[] | null;
  };
}

export function MeetingCard({ meeting }: Props) {
  const config = STATUS_CONFIG[meeting.status as MeetingStatus] ?? STATUS_CONFIG.done;
  const summaryPreview = meeting.summaries?.[0]?.content?.slice(0, 120);
  const actionCount = (meeting.action_items as any)?.[0]?.count ?? 0;

  const displayDate = meeting.meeting_date || meeting.created_at;
  const formattedDate = new Date(displayDate).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const isProcessing = meeting.status === "processing" || meeting.status === "transcribed";

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4 pb-3">
          {/* Status + title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">
              {meeting.title}
            </h3>
            <Badge variant={config.variant} className="shrink-0 text-xs">
              {isProcessing && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {config.label}
            </Badge>
          </div>

          {/* Summary preview */}
          {summaryPreview && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-2">
              {summaryPreview}
              {(meeting.summaries?.[0]?.content?.length ?? 0) > 120 ? "..." : ""}
            </p>
          )}

          {!summaryPreview && meeting.status !== "error" && (
            <p className="text-xs text-slate-400 italic mt-2">
              {isProcessing ? "AI is processing this meeting..." : "No summary yet"}
            </p>
          )}

          {meeting.status === "error" && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Processing failed
            </p>
          )}
        </CardContent>

        <CardFooter className="px-4 py-3 border-t bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <CalendarDays className="h-3 w-3" /> {formattedDate}
          </span>
          {actionCount > 0 && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CheckSquare className="h-3 w-3" /> {actionCount} item{actionCount !== 1 ? "s" : ""}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
