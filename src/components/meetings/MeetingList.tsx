import { MeetingCard } from "./MeetingCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Inbox, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Meeting {
  id: string;
  title: string;
  status: string;
  meeting_date: string | null;
  created_at: string;
  error_message: string | null;
  summaries: { content: string }[] | null;
  action_items: { count: number }[] | null;
}

interface Props {
  meetings: Meeting[];
  searchQuery?: string;
}

export function MeetingList({ meetings, searchQuery }: Props) {
  // ── Empty: no meetings at all ──────────────────────────────
  if (meetings.length === 0 && !searchQuery) {
    return (
      <EmptyState
        icon={<Inbox className="h-12 w-12 text-slate-300" />}
        title="No meetings yet"
        description="Upload your first meeting recording or paste a transcript to get started."
        action={
          <Button asChild>
            <Link href="/meetings/new">Upload a Meeting</Link>
          </Button>
        }
      />
    );
  }

  // ── Empty: search returned nothing ────────────────────────
  if (meetings.length === 0 && searchQuery) {
    return (
      <EmptyState
        icon={<SearchX className="h-12 w-12 text-slate-300" />}
        title={`No meetings matching "${searchQuery}"`}
        description="Try a different search term or clear the search."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
