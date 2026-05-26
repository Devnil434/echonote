import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";

// Load Next.js environment variables from .env.local
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log("Connecting to Supabase...");

  // 1. Get a completed meeting to associate the action item with
  const { data: meetings, error: meetingError } = await supabase
    .from("meetings")
    .select("id, user_id, title")
    .limit(1);

  if (meetingError) {
    console.error("Error fetching meetings:", meetingError);
    return;
  }

  if (!meetings || meetings.length === 0) {
    console.error("Error: No meetings found in the database. Please create a meeting in the app first.");
    return;
  }

  const testMeeting = meetings[0];
  console.log(`Associated with meeting: "${testMeeting.title}" (ID: ${testMeeting.id})`);

  // 2. Insert test action item due 2 hours in the past
  const twoHoursAgo = new Date();
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  const testItem = {
    meeting_id: testMeeting.id,
    user_id: testMeeting.user_id,
    task: "Test reminder task — please ignore",
    owner: "Test User",
    deadline: twoHoursAgo.toISOString(),
    deadline_raw: "yesterday",
    priority: "high",
    is_completed: false,
    reminder_sent: false
  };

  const { data: insertedItems, error: insertError } = await supabase
    .from("action_items")
    .insert(testItem)
    .select();

  if (insertError) {
    console.error("Error inserting test action item:", insertError);
    return;
  }

  console.log("\n✅ Test Action Item successfully created!");
  console.log(insertedItems[0]);
  console.log("\nNext Steps:");
  console.log("1. Trigger the cron locally: curl http://localhost:3000/api/cron/test");
  console.log("2. Verify that an email was sent and the database row has 'reminder_sent = true'.");
  console.log("3. Run 'npx tsx scratch/e2e_cleanup.ts' to clean up test data.");
}

run();
