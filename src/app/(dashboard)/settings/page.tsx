import Link from "next/link";
import { getUpcomingReminders } from "@/actions/reminder.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, CalendarDays, User, ExternalLink } from "lucide-react";
import { SnoozeButton } from "@/components/meetings/SnoozeButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/shared/PageTransition";
import { cn } from "@/lib/utils";

export default async function SettingsPage() {
  const reminders = await getUpcomingReminders();

  const pendingReminders = reminders.filter((r) => !r.reminder_sent);
  const sentReminders    = reminders.filter((r) =>  r.reminder_sent);

  return (
    <PageTransition>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <PageHeader
          title="Settings"
          description="Manage your reminders and account preferences"
        />

        {/* ── Reminder section ─────────────────────────────── */}
        <section className="mb-8">
          <h2 className="heading-md mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            Upcoming Reminders
          </h2>

          {reminders.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <Bell className="h-8 w-8 mx-auto mb-3 text-muted-foreground/30" />
                <p className="body-sm">No action items due in the next 7 days</p>
              </CardContent>
            </Card>
          )}

          {/* Pending reminders */}
          {pendingReminders.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
              <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-3">
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
          <h2 className="heading-md mb-4">Email Notifications</h2>
          <Card>
            <CardContent className="p-5 text-sm text-muted-foreground space-y-2">
              <p>📬 Reminders are sent to your account email address.</p>
              <p>⏰ The reminder cron runs daily at <strong className="text-foreground">08:00 UTC</strong>.</p>
              <p>🔁 Each action item is reminded <strong className="text-foreground">once</strong>. Use the &ldquo;Remind again&rdquo; button to re-enable a reminder.</p>
              <p>✅ Completed items are never reminded.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageTransition>
  );
}

// ── Reminder row sub-component ────────────────────────────────────────
function ReminderRow({
  item,
}: {
  item: Awaited<ReturnType<typeof getUpcomingReminders>>[number];
}) {
  const deadline = new Date(item.deadline);
  const now      = new Date();
  const isOverdue = deadline < now;
  const diffDays  = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const deadlineLabel = isOverdue
    ? `${Math.abs(diffDays)}d overdue`
    : diffDays === 0 ? "Due today"
    : diffDays === 1 ? "Tomorrow"
    : `In ${diffDays} days`;

  return (
    <Card className={cn(
      "border transition-colors",
      isOverdue && !item.reminder_sent && "border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Task */}
            <p className="text-sm font-medium text-foreground leading-snug">
              {item.task}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {item.owner && item.owner !== "Unassigned" && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />{item.owner}
                </span>
              )}
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isOverdue ? "text-red-600 dark:text-red-400" : diffDays <= 1 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
              )}>
                <CalendarDays className="h-3 w-3" />
                {deadlineLabel}
                {item.deadline_raw && ` (${item.deadline_raw})`}
              </span>
              <Link
                href={`/meetings/${item.meeting_id}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
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
                <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                  <BellOff className="h-3 w-3" /> Sent
                </Badge>
                <SnoozeButton actionItemId={item.id} />
              </>
            ) : (
              <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 gap-1">
                <Bell className="h-3 w-3" /> Scheduled
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
