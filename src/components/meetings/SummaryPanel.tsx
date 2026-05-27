import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Lightbulb, MessageSquare } from "lucide-react";

interface Summary {
  id: string;
  content: string;
  key_points: string[] | null;
  decisions: string[] | null;
  model_used: string | null;
  created_at: string;
}

interface Props {
  summary: Summary | null;
}

export function SummaryPanel({ summary }: Props) {
  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-muted-foreground/40" />
        </div>
        <h4 className="heading-sm mb-1">No summary available</h4>
        <p className="body-sm max-w-xs">
          Summary generation may have failed silently. Try re-processing this meeting.
        </p>
      </div>
    );
  }

  const keyPoints = Array.isArray(summary.key_points) ? summary.key_points : [];
  const decisions = Array.isArray(summary.decisions)  ? summary.decisions  : [];

  return (
    <div className="space-y-6">
      {/* ── AI Summary ────────────────────────────────────── */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Meeting Summary</h3>
            {summary.model_used && (
              <Badge variant="outline" className="ml-auto text-xs text-muted-foreground">
                {summary.model_used}
              </Badge>
            )}
          </div>
          <p className="text-foreground/80 text-sm leading-relaxed">{summary.content}</p>
        </CardContent>
      </Card>

      {/* ── Key Points ────────────────────────────────────── */}
      {keyPoints.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-foreground">Key Points</h3>
              <span className="ml-auto text-xs text-muted-foreground">{keyPoints.length}</span>
            </div>
            <ul className="space-y-2">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ── Decisions ─────────────────────────────────────── */}
      {decisions.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h3 className="font-semibold text-foreground">Decisions Made</h3>
              <span className="ml-auto text-xs text-muted-foreground">{decisions.length}</span>
            </div>
            <ul className="space-y-2">
              {decisions.map((decision, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {decision}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ── No content fallback ───────────────────────────── */}
      {keyPoints.length === 0 && decisions.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          No key points or decisions were extracted from this meeting.
        </p>
      )}
    </div>
  );
}
