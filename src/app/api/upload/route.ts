import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // ── Auth check ─────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse form data ────────────────────────────────────────
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const title = formData.get("title") as string | null;
  const transcript = formData.get("transcript") as string | null;
  const meetingDate = formData.get("meeting_date") as string | null;

  // ── Validation ─────────────────────────────────────────────
  if (!title || title.trim().length === 0) {
    return NextResponse.json({ error: "Meeting title is required" }, { status: 400 });
  }

  if (!file && !transcript) {
    return NextResponse.json(
      { error: "Provide either an audio file or a transcript" },
      { status: 400 }
    );
  }

  let audioUrl: string | null = null;

  // ── Handle audio file upload ───────────────────────────────
  if (file) {
    // Validate file type
    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "Invalid file type. Upload MP3, WAV, or M4A." },
        { status: 400 }
      );
    }

    // Validate file size (25MB limit — Groq Whisper maximum)
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 25MB." },
        { status: 400 }
      );
    }

    // Build unique filename: userId/timestamp-originalname
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${user.id}/${Date.now()}-${sanitizedName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload audio file" },
        { status: 500 }
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("audio").getPublicUrl(fileName);

    audioUrl = publicUrl;
  }

  // ── Create meeting record ──────────────────────────────────
  const { data: meeting, error: dbError } = await supabase
    .from("meetings")
    .insert({
      user_id: user.id,
      title: title.trim(),
      audio_url: audioUrl,
      // If transcript was pasted directly, store it and skip transcription
      transcript: transcript || null,
      meeting_date: meetingDate || null,
      // Audio upload → needs transcription first
      // Transcript paste → skip to summarization
      status: file ? "pending" : "transcribed",
    })
    .select()
    .single();

  if (dbError) {
    console.error("DB insert error:", dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    meetingId: meeting.id,
    audioUrl,
    status: meeting.status,
  });
}
