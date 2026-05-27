"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-4">
          <FileText className="h-7 w-7 text-muted-foreground/40" />
        </div>
        <h4 className="heading-sm mb-1">No transcript available</h4>
        <p className="body-sm max-w-xs">No transcript was saved for this meeting.</p>
      </div>
    );
  }

  const wordCount      = transcript.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.ceil(wordCount / 200);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">
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
          <pre className={cn(
            "text-sm whitespace-pre-wrap font-sans leading-relaxed",
            "max-h-[600px] overflow-y-auto",
            "text-foreground/80",
            "bg-muted/30 -m-5 p-5 rounded-lg"
          )}>
            {transcript}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
