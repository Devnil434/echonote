"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Reset reminder_sent so the cron picks it up again on the next run
export async function snoozeReminder(actionItemId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("action_items")
    .update({
      reminder_sent: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", actionItemId)
    .eq("user_id", user.id); // RLS + explicit ownership check

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
}

// Fetch upcoming reminders for the settings page
export async function getUpcomingReminders(): Promise<
  Array<{
    id: string;
    task: string;
    owner: string | null;
    deadline: string;
    deadline_raw: string | null;
    priority: string;
    reminder_sent: boolean;
    meeting_title: string;
    meeting_id: string;
  }>
> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const sevenDaysOut = new Date();
  sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);

  const { data, error } = await supabase
    .from("action_items")
    .select(
      `
      id, task, owner, deadline, deadline_raw, priority, reminder_sent,
      meetings ( id, title )
    `
    )
    .eq("user_id", user.id)
    .eq("is_completed", false)
    .not("deadline", "is", null)
    .lte("deadline", sevenDaysOut.toISOString())
    .order("deadline", { ascending: true });

  if (error || !data) return [];

  return data.map((item) => ({
    id:            item.id,
    task:          item.task,
    owner:         item.owner,
    deadline:      item.deadline,
    deadline_raw:  item.deadline_raw,
    priority:      item.priority,
    reminder_sent: item.reminder_sent,
    meeting_title: (item.meetings as any)?.title ?? "Unknown meeting",
    meeting_id:    (item.meetings as any)?.id ?? "",
  }));
}
