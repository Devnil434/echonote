"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileAudio, Type, Loader2 } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "transcribing" | "summarizing" | "done" | "error";

const STATUS_LABELS: Record<UploadStatus, string> = {
  idle: "",
  uploading: "Uploading audio...",
  transcribing: "Transcribing with Whisper...",
  summarizing: "Generating AI summary...",
  done: "Done!",
  error: "Something went wrong",
};

export function UploadForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [transcript, setTranscript] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handle file selection ──────────────────────────────────
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/ogg"];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|ogg)$/i)) {
      setError("Please upload an MP3, WAV, or M4A file");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File must be under 25MB");
      return;
    }

    setError("");
    setSelectedFile(file);
  }

  // ── Handle audio upload flow ───────────────────────────────
  async function handleAudioSubmit() {
    if (!title.trim()) { setError("Add a meeting title"); return; }
    if (!selectedFile) { setError("Select an audio file"); return; }

    setStatus("uploading");
    setError("");

    try {
      // Step 1: Upload file
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title);
      if (meetingDate) formData.append("meeting_date", meetingDate);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error);

      const { meetingId, audioUrl } = uploadData;

      // Step 2: Transcribe
      setStatus("transcribing");
      const transcribeRes = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, audioUrl }),
      });
      if (!transcribeRes.ok) throw new Error("Transcription failed");

      // Step 3: Summarize
      setStatus("summarizing");
      const summarizeRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      if (!summarizeRes.ok) throw new Error("Summarization failed");

      // Done
      setStatus("done");
      router.push(`/meetings/${meetingId}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  }

  // ── Handle transcript paste flow ──────────────────────────
  async function handleTranscriptSubmit() {
    if (!title.trim()) { setError("Add a meeting title"); return; }
    if (!transcript.trim() || transcript.trim().length < 20) {
      setError("Transcript must be at least 20 characters");
      return;
    }

    setStatus("uploading");
    setError("");

    try {
      // Step 1: Save transcript
      const formData = new FormData();
      formData.append("title", title);
      formData.append("transcript", transcript);
      if (meetingDate) formData.append("meeting_date", meetingDate);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error);

      const { meetingId } = uploadData;

      // Step 2: Summarize directly (no transcription needed)
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">New Meeting</h1>
        <p className="text-slate-600 mt-1">Upload audio or paste your transcript</p>
      </div>

      {/* Common fields */}
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="title">Meeting Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Product Sync — June 10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="date">Meeting Date (optional)</Label>
          <Input
            id="date"
            type="datetime-local"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="audio">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="audio" className="flex-1 gap-2">
            <FileAudio className="h-4 w-4" /> Upload Audio
          </TabsTrigger>
          <TabsTrigger value="transcript" className="flex-1 gap-2">
            <Type className="h-4 w-4" /> Paste Transcript
          </TabsTrigger>
        </TabsList>

        {/* Audio Tab */}
        <TabsContent value="audio">
          <Card
            className="border-2 border-dashed cursor-pointer hover:border-slate-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-10 gap-3">
              <Upload className="h-10 w-10 text-slate-400" />
              {selectedFile ? (
                <div className="text-center">
                  <p className="font-medium text-slate-700">{selectedFile.name}</p>
                  <p className="text-sm text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-slate-700 font-medium">Drop audio file here</p>
                  <p className="text-sm text-slate-500">MP3, WAV, M4A · Max 25MB</p>
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
            className="w-full mt-4"
            onClick={handleAudioSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {STATUS_LABELS[status]}
              </>
            ) : (
              "Process Meeting"
            )}
          </Button>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript">
          <textarea
            className="w-full min-h-[200px] p-3 border rounded-md text-sm font-mono resize-y
                       focus:outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="Paste your raw meeting transcript here...

Example:
Alice: Let's kick off. What's the status on the API migration?
Bob: We're 70% done. Should be complete by Friday.
Alice: Great. Nilanjan, can you draft the spec by Monday?"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <Button
            className="w-full mt-4"
            onClick={handleTranscriptSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {STATUS_LABELS[status]}
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {/* Status + Error */}
      {isProcessing && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{STATUS_LABELS[status]}</span>
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
