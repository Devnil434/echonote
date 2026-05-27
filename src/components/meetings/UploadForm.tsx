"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileAudio, Type, Loader2, AlertCircle } from "lucide-react";
import { UploadProgress } from "./UploadProgress";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { cn } from "@/lib/utils";

type UploadStatus = "idle" | "uploading" | "transcribing" | "summarizing" | "done" | "error";

export function UploadForm() {
  const router = useRouter();

  const [title, setTitle]               = useState("");
  const [titleError, setTitleError]     = useState("");
  const [meetingDate, setMeetingDate]   = useState("");
  const [transcript, setTranscript]     = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus]             = useState<UploadStatus>("idle");
  const [error, setError]               = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Inline title validation ────────────────────────────────
  function handleTitleChange(value: string) {
    setTitle(value);
    if (value.trim().length === 0)      setTitleError("Title is required");
    else if (value.trim().length < 3)   setTitleError("Title must be at least 3 characters");
    else                                setTitleError("");
  }

  // ── Handle file selection ──────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/ogg"];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg)$/i)) {
      setError("Invalid file type");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File too large");
      return;
    }

    setError("");
    setSelectedFile(file);
  }

  function handleRetry() {
    setError("");
    setStatus("idle");
  }

  // ── Handle audio upload flow ───────────────────────────────
  async function handleAudioSubmit() {
    handleTitleChange(title);
    if (!title.trim() || title.trim().length < 3) {
      setTitleError(title.trim().length === 0 ? "Title is required" : "Title must be at least 3 characters");
      return;
    }
    if (!selectedFile) { setError("Select an audio file"); return; }

    setStatus("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title);
      if (meetingDate) formData.append("meeting_date", meetingDate);

      const uploadRes  = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      const { meetingId, audioUrl } = uploadData;

      setStatus("transcribing");
      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, audioUrl }),
      });
      if (!transcribeRes.ok) throw new Error("Transcription failed");

      setStatus("summarizing");
      const summarizeRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      if (!summarizeRes.ok) throw new Error("Summarization failed");

      setStatus("done");
      router.push(`/meetings/${meetingId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  // ── Handle transcript paste flow ──────────────────────────
  async function handleTranscriptSubmit() {
    handleTitleChange(title);
    if (!title.trim() || title.trim().length < 3) {
      setTitleError(title.trim().length === 0 ? "Title is required" : "Title must be at least 3 characters");
      return;
    }
    if (!transcript.trim() || transcript.trim().length < 20) {
      setError("Transcript must be at least 20 characters");
      return;
    }

    setStatus("uploading");
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("transcript", transcript);
      if (meetingDate) formData.append("meeting_date", meetingDate);

      const uploadRes  = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      const { meetingId } = uploadData;

      setStatus("summarizing");
      const summarizeRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      if (!summarizeRes.ok) throw new Error("Summarization failed");

      setStatus("done");
      router.push(`/meetings/${meetingId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
      setStatus("error");
    }
  }

  const isProcessing = status !== "idle" && status !== "error" && status !== "done";

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="heading-xl">New Meeting</h1>
        <p className="body-md mt-0.5">Upload audio or paste your transcript</p>
      </div>

      {/* Common fields */}
      <div className="space-y-4 mb-6">
        {/* Title with inline validation */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Product Sync — June 10"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={cn(titleError && "border-red-400 focus-visible:ring-red-400/20")}
            disabled={isProcessing}
          />
          {titleError && (
            <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {titleError}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date">Meeting Date (optional)</Label>
          <Input
            id="date"
            type="datetime-local"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            disabled={isProcessing}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="audio">
        <TabsList className="w-full mb-4 h-auto">
          <TabsTrigger value="audio" className="flex-1 gap-2 py-2.5 text-xs sm:text-sm">
            <FileAudio className="h-4 w-4 shrink-0" /> Upload Audio
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1 gap-2 py-2.5 text-xs sm:text-sm">
            <Type className="h-4 w-4 shrink-0" /> Paste Transcript
          </TabsTrigger>
        </TabsList>

        {/* Audio Tab */}
        <TabsContent value="audio">
          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors",
              isProcessing ? "opacity-60 pointer-events-none" : "hover:border-primary/50"
            )}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3 px-4 text-center">
              <Upload className="h-10 w-10 text-muted-foreground/40" />
              {selectedFile ? (
                <div className="text-center">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-foreground/80 font-medium">Drop audio file here</p>
                  <p className="text-sm text-muted-foreground">MP3, WAV, M4A · Max 25MB</p>
                </div>
              )}
            </CardContent>
          </Card>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            className="w-full mt-4 gap-2 min-h-[44px] sm:min-h-[36px]"
            onClick={handleAudioSubmit}
            disabled={isProcessing}
          >
            {isProcessing
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
              : "Process Meeting"
            }
          </Button>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript">
          <textarea
            className={cn(
              "w-full min-h-[200px] p-3 rounded-md text-sm font-mono resize-y",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "border border-input",
              "focus:outline-none focus:ring-2 focus:ring-ring/40",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
            placeholder={"Paste your raw meeting transcript here...\n\nExample:\nAlice: Let's kick off. What's the status on the API migration?\nBob: We're 70% done. Should be complete by Friday.\nAlice: Great. Can you draft the spec by Monday?"}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isProcessing}
          />
          <Button
            className="w-full mt-4 gap-2 min-h-[44px] sm:min-h-[36px]"
            onClick={handleTranscriptSubmit}
            disabled={isProcessing}
          >
            {isProcessing
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
              : "Generate Summary"
            }
          </Button>
        </TabsContent>
      </Tabs>

      {/* Multi-step progress */}
      <UploadProgress currentStep={status} />

      {/* Error alert */}
      {error && status === "error" && (
        <div className="mt-4">
          <ErrorAlert error={error} onRetry={handleRetry} />
        </div>
      )}
    </div>
  );
}
