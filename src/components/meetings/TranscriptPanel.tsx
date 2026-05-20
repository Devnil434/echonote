"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check } from "lucide-react";

interface Props {
  transcript: string | null;
}

export function TranscriptPanel({ transcript }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!transcript) return;
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!transcript) {
    return (
      <div className="text-center py-12 text-slate-400">
        <FileText className="h-8 w-8 mx-auto mb-3" />
        <p className="text-sm">No transcript available for this meeting</p>
      </div>
    );
  }

  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.ceil(wordCount / 200);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">
          {wordCount.toLocaleString()} words · ~{readingMinutes} min read
        </p>
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Copy</>
          )}
        </Button>
      </div>

      {/* Transcript */}
      <Card>
        <CardContent className="p-5">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed
                          max-h-[600px] overflow-y-auto">
            {transcript}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
