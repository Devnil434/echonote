import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lightbulb, MessageSquare, Sparkles } from "lucide-react";

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
      <div className="text-center py-12 text-slate-400">
        <Sparkles className="h-8 w-8 mx-auto mb-3 animate-pulse text-blue-400" />
        <p className="text-sm">Summary not yet generated</p>
      </div>
    );
  }

  const keyPoints = Array.isArray(summary.key_points) ? summary.key_points : [];
  const decisions = Array.isArray(summary.decisions) ? summary.decisions : [];

  return (
    <div className="space-y-6">
      {/* ── AI Summary ────────────────────────────────────── */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-slate-800">Meeting Summary</h3>
            {summary.model_used && (
              <Badge variant="outline" className="ml-auto text-xs text-slate-400">
                {summary.model_used}
              </Badge>
            )}
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{summary.content}</p>
        </CardContent>
      </Card>

      {/* ── Key Points ────────────────────────────────────── */}
      {keyPoints.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-slate-800">Key Points</h3>
              <span className="ml-auto text-xs text-slate-400">{keyPoints.length}</span>
            </div>
            <ul className="space-y-2">
              {keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-amber-400 mt-0.5 shrink-0">•</span>
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
              <h3 className="font-semibold text-slate-800">Decisions Made</h3>
              <span className="ml-auto text-xs text-slate-400">{decisions.length}</span>
            </div>
            <ul className="space-y-2">
              {decisions.map((decision, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  {decision}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* ── No content fallback ───────────────────────────── */}
      {keyPoints.length === 0 && decisions.length === 0 && (
        <p className="text-xs text-slate-400 text-center">
          No key points or decisions were extracted from this meeting.
        </p>
      )}
    </div>
  );
}
