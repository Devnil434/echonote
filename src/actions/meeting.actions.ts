"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleActionItemComplete(itemId: string): Promise<void> {
  const supabase = await createClient();

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch current state — verify ownership
  const { data: item, error: fetchError } = await supabase
    .from("action_items")
    .select("id, is_completed, meeting_id, user_id")
    .eq("id", itemId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !item) throw new Error("Action item not found");

  // Toggle
  const { error: updateError } = await supabase
    .from("action_items")
    .update({
      is_completed: !item.is_completed,
      completed_at: !item.is_completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .eq("user_id", user.id);

  if (updateError) throw new Error(updateError.message);

  // Revalidate the meeting detail page so the server component re-fetches
  revalidatePath(`/meetings/${item.meeting_id}`);
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("meetings")
    .delete()
    .eq("id", meetingId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

