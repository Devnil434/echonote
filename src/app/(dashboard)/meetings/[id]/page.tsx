import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
      *,
      summaries (*),
      action_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !meeting) notFound();

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{meeting.title}</h1>
        <Badge>{meeting.status}</Badge>
      </div>

      {meeting.status === "processing" || meeting.status === "transcribed" ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
          ⏳ AI is processing this meeting. This page will update automatically.
        </div>
      ) : null}

      {meeting.transcript && (
        <div className="mt-6">
          <h2 className="font-semibold text-slate-700 mb-2">Transcript</h2>
          <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-600
                          max-h-64 overflow-y-auto whitespace-pre-wrap font-mono">
            {meeting.transcript}
          </div>
        </div>
      )}

      {/* Summaries and action items rendered in Phase 4 */}
    </div>
  );
}
