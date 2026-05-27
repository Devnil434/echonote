import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummaryPanel } from "@/components/meetings/SummaryPanel";
import { ActionItemList } from "@/components/meetings/ActionItemList";
import { TranscriptPanel } from "@/components/meetings/TranscriptPanel";
import { ProcessingBanner } from "@/components/meetings/ProcessingBanner";
import { PageTransition } from "@/components/shared/PageTransition";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { CalendarDays, Clock } from "lucide-react";

export const unstable_instant = false;

type Status = "pending" | "processing" | "transcribed" | "done" | "error";

const STATUS_BADGE: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending:     { label: "Queued",     variant: "secondary"  },
  processing:  { label: "Processing", variant: "secondary"  },
  transcribed: { label: "Analysing",  variant: "secondary"  },
  done:        { label: "Done",       variant: "default"    },
  error:       { label: "Failed",     variant: "destructive"},
};

interface Summary {
  id: string;
  content: string;
  key_points: string[] | null;
  decisions: string[] | null;
  model_used: string | null;
  created_at: string;
}

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

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: meeting, error } = await supabase
    .from("meetings")
    .select(`
      id, title, status, meeting_date, created_at,
      duration_sec, transcript, error_message,
      summaries ( id, content, key_points, decisions, model_used, created_at ),
      action_items ( id, task, owner, deadline, deadline_raw, priority, is_completed, created_at )
    `)
    .eq("id", id)
    .single();

  if (error || !meeting) {
    notFound();
  }

  const summaries    = meeting.summaries as unknown as Summary[] | null;
  const actionItems  = (meeting.action_items as unknown as ActionItem[]) ?? [];
  const summary      = summaries?.[0] ?? null;
  const statusConfig = STATUS_BADGE[meeting.status as Status] ?? STATUS_BADGE.done;
  const isProcessing = ["pending", "processing", "transcribed"].includes(meeting.status);

  const displayDate    = meeting.meeting_date ?? meeting.created_at;
  const formattedDate  = new Date(displayDate).toLocaleDateString("en-US", {
    weekday: "short", month: "long", day: "numeric", year: "numeric",
  });

  const formattedDuration = meeting.duration_sec
    ? `${Math.floor(meeting.duration_sec / 60)}m ${meeting.duration_sec % 60}s`
    : null;

  const openActionCount = actionItems.filter((a) => !a.is_completed).length;

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="heading-xl leading-tight">{meeting.title}</h1>
            <Badge variant={statusConfig.variant} className="shrink-0 mt-1">
              {statusConfig.label}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formattedDate}
            </span>
            {formattedDuration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formattedDuration}
              </span>
            )}
            {openActionCount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {openActionCount} open action{openActionCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ── Processing banner ──────────────────────────────── */}
        {isProcessing && (
          <ProcessingBanner meetingId={meeting.id} currentStatus={meeting.status} />
        )}

        {/* ── Error banner ───────────────────────────────────── */}
        {meeting.status === "error" && (
          <div className="mb-6">
            <ErrorAlert
              error={meeting.error_message ?? "Processing failed"}
            />
          </div>
        )}

        {/* ── Tabs ───────────────────────────────────────────── */}
        {!isProcessing && meeting.status !== "error" && (
          <Tabs defaultValue="summary">
            <TabsList className="mb-6 w-full sm:w-auto overflow-x-auto flex-nowrap">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="actions">
                Action Items
                {openActionCount > 0 && (
                  <span className="ml-1.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs rounded-full px-1.5 py-0.5">
                    {openActionCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="animate-fade-in">
              <SummaryPanel summary={summary} />
            </TabsContent>

            <TabsContent value="actions" className="animate-fade-in">
              <ActionItemList items={actionItems} meetingId={meeting.id} />
            </TabsContent>

            <TabsContent value="transcript" className="animate-fade-in">
              <TranscriptPanel transcript={meeting.transcript} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageTransition>
  );
}
