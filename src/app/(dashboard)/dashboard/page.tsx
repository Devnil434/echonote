import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MeetingList } from "@/components/meetings/MeetingList";
import { MeetingCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

// Server Component — runs on the server, data fetched at request time
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Meetings</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and search your meeting notes
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/new">
            <Plus className="h-4 w-4 mr-2" /> New Meeting
          </Link>
        </Button>
      </div>

      <SearchBar className="mb-6 max-w-md" />

      {/* ── Meeting List with Suspense ──────────────────────── */}
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <MeetingCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MeetingsListFetcher searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function MeetingsListFetcher({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.trim() ?? "";
  const supabase = await createClient();

  // Build query — add ilike filter if search query exists
  let query = supabase
    .from("meetings")
    .select(
      `
      id,
      title,
      status,
      meeting_date,
      created_at,
      error_message,
      summaries ( content ),
      action_items ( count )
    `
    )
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data: meetings, error } = await query;

  return (
    <div className="space-y-4">
      {/* ── Search Status Subtitle ─────────────────────────── */}
      {searchQuery ? (
        <p className="text-sm text-slate-500 -mt-2">
          {meetings?.length ?? 0} result{meetings?.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
        </p>
      ) : (
        <p className="text-sm text-slate-500 -mt-2">
          {meetings?.length ?? 0} total meeting{meetings?.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Error State ────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          Failed to load meetings: {error.message}
        </div>
      )}

      {/* ── Meeting List component ─────────────────────────── */}
      <MeetingList
        meetings={meetings ?? []}
        searchQuery={searchQuery}
      />
    </div>
  );
}
