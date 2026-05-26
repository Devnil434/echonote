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
  console.log("Cleaning up test action items...");
  
  const { data, error } = await supabase
    .from("action_items")
    .delete()
    .eq("task", "Test reminder task — please ignore")
    .select();

  if (error) {
    console.error("Error during cleanup:", error);
  } else {
    console.log(`✅ Successfully deleted ${data?.length ?? 0} test row(s) from 'action_items'.`);
  }
}

run();
