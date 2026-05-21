import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Singleton pattern — one transporter for the lifetime of the process
let _transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (_transporter) return _transporter;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables"
    );
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  return _transporter;
}

// ── Verify connection on startup (call this once in the cron route) ───
export async function verifyMailer(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return true;
  } catch (err) {
    console.error("[mailer] SMTP verification failed:", err);
    return false;
  }
}

// ── Core send function ────────────────────────────────────────────────
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ messageId: string }> {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: `"EchoNote" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, ""), // plain-text fallback
  });

  return { messageId: info.messageId };
}
