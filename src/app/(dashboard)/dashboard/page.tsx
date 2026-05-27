import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MeetingList } from "@/components/meetings/MeetingList";
import { MeetingCardSkeleton, StatsBarSkeleton } from "@/components/shared/LoadingSkeleton";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { cn } from "@/lib/utils";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  return (
    <PageTransition>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <PageHeader
          title="My Meetings"
          description="Manage and search your meeting notes"
          action={
            <Button asChild>
              <Link href="/meetings/new">
                <Plus className="h-4 w-4" /> New Meeting
              </Link>
            </Button>
          }
        />

        <SearchBar className="mb-6 max-w-md" />

        <Suspense
          fallback={
            <div>
              <StatsBarSkeleton />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <MeetingCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          <DashboardContent searchParams={searchParams} />
        </Suspense>
      </div>
    </PageTransition>
  );
}

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery    = resolvedParams.q?.trim() ?? "";
  const statusFilter   = resolvedParams.status?.trim() ?? "";

  const supabase = await createClient();

  // ── Fetch all meetings (search-filtered for display + stats) ──
  let query = supabase
    .from("meetings")
    .select(`
      id,
      title,
      status,
      meeting_date,
      created_at,
      error_message,
      summaries ( content ),
      action_items ( count )
    `)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data: allMeetings, error } = await query;

  // ── Fetch open action items count ──────────────────────────
  const { count: openActionsCount } = await supabase
    .from("action_items")
    .select("*", { count: "exact", head: true })
    .eq("is_completed", false);

  const meetings = allMeetings ?? [];

  // ── Compute stats from fetched meetings ────────────────────
  const stats = {
    total:       meetings.length,
    done:        meetings.filter((m) => m.status === "done").length,
    processing:  meetings.filter((m) => ["pending", "processing", "transcribed"].includes(m.status)).length,
    openActions: openActionsCount ?? 0,
  };

  // ── Apply status filter for display ───────────────────────
  const displayMeetings = statusFilter
    ? statusFilter === "processing"
      ? meetings.filter((m) => ["pending", "processing", "transcribed"].includes(m.status))
      : meetings.filter((m) => m.status === statusFilter)
    : meetings;

  const STATUS_TABS = [
    { label: "All",        value: ""           },
    { label: "Done",       value: "done"       },
    { label: "Processing", value: "processing" },
    { label: "Error",      value: "error"      },
  ];

  return (
    <div className="space-y-4">
      {/* ── Stats bar ─────────────────────────────────────── */}
      <StatsBar stats={stats} />

      {/* ── Status filter tabs ────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(({ label, value }) => {
          const isActive = statusFilter === value;
          const href     = value
            ? searchQuery ? `?q=${encodeURIComponent(searchQuery)}&status=${value}` : `?status=${value}`
            : searchQuery ? `?q=${encodeURIComponent(searchQuery)}`                 : "/dashboard";

          return (
            <Link
              key={value}
              href={href}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                isActive
                  ? "bg-foreground text-background border-foreground dark:bg-foreground dark:text-background"
                  : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* ── Search/count subtitle ─────────────────────────── */}
      <p className="text-sm text-muted-foreground -mt-2">
        {searchQuery
          ? `${displayMeetings.length} result${displayMeetings.length !== 1 ? "s" : ""} for "${searchQuery}"`
          : `${displayMeetings.length} total meeting${displayMeetings.length !== 1 ? "s" : ""}`
        }
      </p>

      {/* ── Error state ───────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
          Failed to load meetings: {error.message}
        </div>
      )}

      {/* ── Meeting list ──────────────────────────────────── */}
      <MeetingList meetings={displayMeetings} searchQuery={searchQuery} />
    </div>
  );
}
