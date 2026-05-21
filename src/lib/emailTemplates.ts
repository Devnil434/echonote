interface ReminderEmailProps {
  recipientName: string;
  task: string;
  owner: string;
  deadline: Date;
  deadlineRaw: string | null;
  priority: "high" | "medium" | "low";
  meetingTitle: string;
  meetingUrl: string;
  isOverdue: boolean;
}

const PRIORITY_COLOR = {
  high:   "#ef4444",
  medium: "#f59e0b",
  low:    "#6b7280",
};

const PRIORITY_LABEL = {
  high:   "High Priority",
  medium: "Medium Priority",
  low:    "Low Priority",
};

export function buildReminderEmail(props: ReminderEmailProps): {
  subject: string;
  html: string;
  text: string;
} {
  const {
    recipientName,
    task,
    owner,
    deadline,
    deadlineRaw,
    priority,
    meetingTitle,
    meetingUrl,
    isOverdue,
  } = props;

  const formattedDeadline = deadline.toLocaleDateString("en-US", {
    weekday: "long",
    month:   "long",
    day:     "numeric",
    year:    "numeric",
  });

  const subject = isOverdue
    ? `🔴 Overdue: ${task}`
    : `⏰ Due Soon: ${task}`;

  const bannerColor = isOverdue ? "#fee2e2" : "#fef3c7";
  const bannerBorder = isOverdue ? "#fca5a5" : "#fcd34d";
  const bannerText  = isOverdue ? "#b91c1c" : "#92400e";
  const bannerLabel = isOverdue ? "⚠️ This task is overdue" : "⏰ This task is due soon";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:24px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
                🎙️ EchoNote
              </p>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">
                AI Meeting Notes · Action Item Reminder
              </p>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="background:${bannerColor};border-bottom:1px solid ${bannerBorder};padding:12px 32px;">
              <p style="margin:0;color:${bannerText};font-size:14px;font-weight:600;">
                ${bannerLabel}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <p style="margin:0 0 8px;color:#475569;font-size:14px;">
                Hi ${recipientName},
              </p>
              <p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">
                An action item from your meeting <strong>${meetingTitle}</strong> needs your attention.
              </p>

              <!-- Task card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">

                    <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#0f172a;line-height:1.4;">
                      ${task}
                    </p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:24px;padding-bottom:8px;">
                          <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Assigned to</p>
                          <p style="margin:2px 0 0;font-size:14px;color:#334155;font-weight:500;">${owner}</p>
                        </td>
                        <td style="padding-right:24px;padding-bottom:8px;">
                          <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Deadline</p>
                          <p style="margin:2px 0 0;font-size:14px;color:#334155;font-weight:500;">
                            ${deadlineRaw ? `${deadlineRaw} · ` : ""}${formattedDeadline}
                          </p>
                        </td>
                        <td style="padding-bottom:8px;">
                          <p style="margin:0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Priority</p>
                          <p style="margin:2px 0 0;font-size:14px;color:${PRIORITY_COLOR[priority]};font-weight:600;">
                            ${PRIORITY_LABEL[priority]}
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f172a;border-radius:8px;">
                    <a href="${meetingUrl}"
                       style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">
                      View Meeting in EchoNote →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                You're receiving this because you have an action item with an upcoming deadline.
                <br/>EchoNote sends reminders once per action item.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
EchoNote — Action Item Reminder
${isOverdue ? "⚠️ OVERDUE" : "⏰ DUE SOON"}

Task:      ${task}
Assigned:  ${owner}
Deadline:  ${formattedDeadline}${deadlineRaw ? ` (${deadlineRaw})` : ""}
Priority:  ${PRIORITY_LABEL[priority]}
Meeting:   ${meetingTitle}

View in EchoNote: ${meetingUrl}
  `.trim();

  return { subject, html, text };
}

// ── Convenience: single-action-item reminder ─────────────────────────
export async function sendActionItemReminder({
  to,
  recipientName,
  task,
  owner,
  deadline,
  deadlineRaw,
  priority,
  meetingTitle,
  meetingId,
}: {
  to: string;
  recipientName: string;
  task: string;
  owner: string;
  deadline: Date;
  deadlineRaw: string | null;
  priority: "high" | "medium" | "low";
  meetingTitle: string;
  meetingId: string;
}) {
  const { sendEmail } = await import("./mailer");

  const meetingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/meetings/${meetingId}`;
  const now = new Date();
  const isOverdue = deadline < now;

  const { subject, html, text } = buildReminderEmail({
    recipientName,
    task,
    owner,
    deadline,
    deadlineRaw,
    priority,
    meetingTitle,
    meetingUrl,
    isOverdue,
  });

  return sendEmail({ to, subject, html, text });
}
