import Link from "next/link";
import { getUpcomingReminders } from "@/actions/reminder.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, CalendarDays, User, ExternalLink } from "lucide-react";
import { SnoozeButton } from "@/components/meetings/SnoozeButton";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const reminders = await getUpcomingReminders();

  const pendingReminders = reminders.filter((r) => !r.reminder_sent);
  const sentReminders    = reminders.filter((r) => r.reminder_sent);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your reminders and account preferences
        </p>
      </div>

      {/* ── Reminder section ─────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          Upcoming Reminders
        </h2>

        {reminders.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-slate-400">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No action items due in the next 7 days</p>
            </CardContent>
          </Card>
        )}

        {/* Pending reminders */}
        {pendingReminders.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Will be emailed ({pendingReminders.length})
            </p>
            <div className="space-y-3">
              {pendingReminders.map((item) => (
                <ReminderRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Already sent */}
        {sentReminders.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Already reminded ({sentReminders.length})
            </p>
            <div className="space-y-3 opacity-60">
              {sentReminders.map((item) => (
                <ReminderRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Email settings info ──────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Email Notifications
        </h2>
        <Card>
          <CardContent className="p-5 text-sm text-slate-600 space-y-2">
            <p>📬 Reminders are sent to your account email address.</p>
            <p>⏰ The reminder cron runs daily at <strong>08:00 UTC</strong>.</p>
            <p>🔁 Each action item is reminded <strong>once</strong>. Use the "Remind again" button to re-enable a reminder.</p>
            <p>✅ Completed items are never reminded.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// ── Reminder row sub-component ────────────────────────────────────────
function ReminderRow({
  item,
}: {
  item: Awaited<ReturnType<typeof getUpcomingReminders>>[number];
}) {
  const deadline = new Date(item.deadline);
  const now = new Date();
  const isOverdue = deadline < now;
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const deadlineLabel = isOverdue
    ? `${Math.abs(diffDays)}d overdue`
    : diffDays === 0
    ? "Due today"
    : diffDays === 1
    ? "Tomorrow"
    : `In ${diffDays} days`;

  return (
    <Card className={cn(
      "border",
      isOverdue && !item.reminder_sent && "border-red-200 bg-red-50/30"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Task */}
            <p className="text-sm font-medium text-slate-800 leading-snug">
              {item.task}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {item.owner && item.owner !== "Unassigned" && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <User className="h-3 w-3" />{item.owner}
                </span>
              )}
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isOverdue ? "text-red-600" : diffDays <= 1 ? "text-amber-600" : "text-slate-500"
              )}>
                <CalendarDays className="h-3 w-3" />
                {deadlineLabel}
                {item.deadline_raw && ` (${item.deadline_raw})`}
              </span>
              <Link
                href={`/meetings/${item.meeting_id}`}
                className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {item.meeting_title}
              </Link>
            </div>
          </div>

          {/* Status + action */}
          <div className="flex items-center gap-2 shrink-0">
            {item.reminder_sent ? (
              <>
                <Badge variant="outline" className="text-xs text-slate-400 gap-1">
                  <BellOff className="h-3 w-3" /> Sent
                </Badge>
                <SnoozeButton actionItemId={item.id} />
              </>
            ) : (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 gap-1">
                <Bell className="h-3 w-3" /> Scheduled
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
