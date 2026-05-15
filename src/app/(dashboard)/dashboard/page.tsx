import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Mic } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: meetings, error } = await supabase
    .from("meetings")
    .select(`
      id,
      title,
      status,
      meeting_date,
      created_at,
      summaries ( content ),
      action_items ( count )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-6 text-red-500">Failed to load meetings: {error.message}</p>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Meetings</h1>
          <p className="text-slate-600 text-sm mt-1">
            {meetings?.length ?? 0} meeting{meetings?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings/new">+ New Meeting</Link>
        </Button>
      </div>

      {/* List */}
      {!meetings || meetings.length === 0 ? (
        <EmptyState
          icon={<Mic className="h-12 w-12 text-slate-300" />}
          title="No meetings yet"
          description="Upload your first meeting recording to get started."
          action={
            <Button asChild>
              <Link href="/meetings/new">Upload Meeting</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}
