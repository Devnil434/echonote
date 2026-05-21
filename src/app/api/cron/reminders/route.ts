import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendActionItemReminder } from "@/lib/emailTemplates";

// ── Use SERVICE ROLE client ───────────────────────────────────────────
// Cron runs without a user session — we need service role to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  // ── 1. Authenticate the cron call ────────────────────────────────
  // Vercel passes the CRON_SECRET automatically when using vercel.json crons.
  // For manual testing, send: Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("[cron/reminders] Unauthorized call — bad or missing secret");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  console.log("[cron/reminders] Starting reminder scan...");

  // ── 2. Calculate time window ──────────────────────────────────────
  const now = new Date();
  const windowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24 hours

  // ── 3. Query action items due within the window ───────────────────
  const { data: items, error: queryError } = await supabase
    .from("action_items")
    .select(
      `
      id,
      task,
      owner,
      deadline,
      deadline_raw,
      priority,
      meeting_id,
      user_id,
      meetings (
        id,
        title
      ),
      profiles (
        email,
        full_name
      )
    `
    )
    .lte("deadline", windowEnd.toISOString())   // deadline <= now + 24h
    .eq("is_completed", false)                  // not already done
    .eq("reminder_sent", false)                 // not already reminded
    .not("deadline", "is", null);               // must have a deadline

  if (queryError) {
    console.error("[cron/reminders] Query failed:", queryError.message);
    return NextResponse.json(
      { error: "Failed to query action items" },
      { status: 500 }
    );
  }

  if (!items || items.length === 0) {
    console.log("[cron/reminders] No reminders due. Done.");
    return NextResponse.json({
      reminders_sent: 0,
      errors: 0,
      duration_ms: Date.now() - startTime,
    });
  }

  console.log(`[cron/reminders] Found ${items.length} item(s) to remind`);

  // ── 4. Send emails + log to reminders table ───────────────────────
  let sent = 0;
  let errors = 0;
  const results: Array<{ itemId: string; status: "sent" | "error"; error?: string }> = [];

  for (const item of items) {
    const meeting = (item.meetings as any);
    const profile = (item.profiles as any);

    if (!profile?.email) {
      console.warn(`[cron/reminders] No email for user ${item.user_id} — skipping`);
      errors++;
      continue;
    }

    try {
      // Send the email
      const { messageId } = await sendActionItemReminder({
        to:            profile.email,
        recipientName: profile.full_name ?? profile.email.split("@")[0],
        task:          item.task,
        owner:         item.owner ?? "Unassigned",
        deadline:      new Date(item.deadline),
        deadlineRaw:   item.deadline_raw,
        priority:      item.priority as "high" | "medium" | "low",
        meetingTitle:  meeting?.title ?? "your meeting",
        meetingId:     item.meeting_id,
      });

      // Mark action item as reminded
      await supabase
        .from("action_items")
        .update({
          reminder_sent: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id);

      // Log to reminders audit table
      await supabase.from("reminders").insert({
        action_item_id: item.id,
        user_id:        item.user_id,
        email:          profile.email,
        scheduled_at:   now.toISOString(),
        sent_at:        new Date().toISOString(),
        is_sent:        true,
      });

      console.log(`[cron/reminders] ✅ Sent to ${profile.email} for task: ${item.task.slice(0, 50)}`);
      results.push({ itemId: item.id, status: "sent" });
      sent++;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`[cron/reminders] ❌ Failed for item ${item.id}:`, errorMessage);
      results.push({ itemId: item.id, status: "error", error: errorMessage });
      errors++;

      // Log failed attempt to reminders table for audit trail
      try {
        await supabase.from("reminders").insert({
          action_item_id: item.id,
          user_id:        item.user_id,
          email:          profile.email ?? "unknown",
          scheduled_at:   now.toISOString(),
          sent_at:        null,
          is_sent:        false,
        });
      } catch (insertErr) {
        console.error("[cron/reminders] Failed to log failure to reminders table:", insertErr);
      }
    }
  }

  const duration = Date.now() - startTime;
  console.log(`[cron/reminders] Done. Sent: ${sent}, Errors: ${errors}, Duration: ${duration}ms`);

  return NextResponse.json({
    reminders_sent: sent,
    errors,
    total_processed: items.length,
    duration_ms: duration,
    results,
  });
}
