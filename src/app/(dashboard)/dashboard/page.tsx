import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <p className="text-slate-600">
          Welcome back, <span className="font-semibold text-slate-900">{user?.user_metadata?.full_name || user?.email}</span>!
        </p>
        <p className="mt-4 text-slate-500">
          This is your dashboard. Here you will see your recent meeting notes and summaries.
        </p>
      </div>
    </div>
  );
}
