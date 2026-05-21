import { buildReminderEmail } from "../src/lib/emailTemplates";
import * as fs from "fs";
import * as path from "path";

const testProps = {
  recipientName: "Alice Smith",
  task: "Review the quarterly marketing strategy and approve budget allocation",
  owner: "Alice Smith",
  deadline: new Date("2026-06-01T12:00:00Z"),
  deadlineRaw: "Next Monday",
  priority: "high" as const,
  meetingTitle: "Q3 Marketing Sync",
  meetingUrl: "http://localhost:3000/meetings/test-meeting-123",
  isOverdue: false,
};

const result = buildReminderEmail(testProps);

const outputPath = path.join(__dirname, "reminder_test.html");
fs.writeFileSync(outputPath, result.html);

console.log("Success! HTML email template written to:", outputPath);
