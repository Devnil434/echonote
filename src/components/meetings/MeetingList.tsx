import Link from "next/link";
import { MeetingCard } from "./MeetingCard";
import { Button } from "@/components/ui/button";
import { Mic, SearchX, Sparkles } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        {/* Illustrated icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Mic className="h-10 w-10 text-primary/60" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full
                          flex items-center justify-center shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
        </div>

        <h3 className="heading-md mb-2">Your meetings will appear here</h3>
        <p className="body-md max-w-sm mb-6">
          Upload an audio recording or paste a transcript to get an AI-generated
          summary, action items, and reminders — in seconds.
        </p>

        {/* Quick tips */}
        <div className="flex flex-col sm:flex-row gap-2 text-left mb-8 max-w-md">
          {[
            { icon: "🎙️", text: "MP3, WAV, M4A up to 25MB" },
            { icon: "📋", text: "Or paste a raw transcript" },
            { icon: "⚡", text: "Results in under 30 seconds" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-xs text-muted-foreground
                         bg-muted/50 rounded-lg px-3 py-2 border border-border"
            >
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>

        <Button asChild size="lg" className="gap-2">
          <Link href="/meetings/new">
            <Mic className="h-4 w-4" /> Upload your first meeting
          </Link>
        </Button>
      </div>
    );
  }

  // ── Empty: search returned nothing ────────────────────────
  if (meetings.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4">
          <SearchX className="h-7 w-7 text-muted-foreground/40" />
        </div>
        <h3 className="heading-sm mb-1">No results for &ldquo;{searchQuery}&rdquo;</h3>
        <p className="body-sm max-w-xs">Try a different search term or clear the search.</p>
      </div>
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
