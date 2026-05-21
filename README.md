# 🎙️ EchoNote

EchoNote is a modern AI-powered meeting assistant built with Next.js and Supabase. It transcribes meeting recordings, generates summaries, extracts key highlights, and automatically tracks action items with an integrated email reminder system.

---

## 🚀 Key Features

- **AI Transcription & Summarization**: Automatically process meeting audio to extract transcripts and high-level summaries.
- **Action Item Extraction**: Turn meeting discussions into structured, assignable action items with defined priorities and deadlines.
- **Email Reminder Engine**: Daily automated email reminders for upcoming deadlines using a connection-optimized Nodemailer transporter.
- **Snooze & Re-enable Reminders**: Interactive settings dashboard allowing users to track upcoming notifications and re-trigger/snooze sent reminders.
- **Vercel Cron Integration**: Secure daily automated scanning of action items using authorization token verification.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Email Delivery**: Nodemailer
- **Icons**: Lucide React

---

## 📧 Email Reminder System

The reminder engine triggers daily to notify owners about their upcoming action items due within 24 hours.

### 1. Connection-Optimized SMTP Transporter
All outbound reminder emails utilize a **Singleton connection pool** located at `src/lib/mailer.ts`. This ensures we reuse the same TCP connection pool across multiple emails triggered during a single cron tick, preventing socket exhaustion.

### 2. Beautiful HTML Templates
The builder at `src/lib/emailTemplates.ts` formats clean, responsive HTML emails compatible with major clients (Gmail, Apple Mail, Outlook). It features:
- **Priority banners** colored dynamically by priority level (High: `Red`, Medium: `Amber`, Low: `Slate`).
- **Overdue warning indicators** if deadlines have already passed.
- **Direct call-to-action buttons** linking back to the origin meeting in EchoNote.

---

## ⏰ Cron & Dev Endpoints

### Vercel Cron Scheduling
EchoNote relies on a daily scheduler configured in `vercel.json`:
- **Path**: `/api/cron/reminders`
- **Schedule**: `0 8 * * *` (08:00 UTC / 13:30 IST)

#### Security & Authentication
Vercel automatically signs daily cron requests with a header:
`Authorization: Bearer <CRON_SECRET>`

The reminders API verifies this against your environment variables to block external/unauthorized execution.

### Manual Test Route (Dev-Only)
For testing during development, you can invoke the cron loop manually without providing authorization headers or waiting for the schedule:
```bash
curl http://localhost:3000/api/cron/test
```
*Note: This route is disabled in production environments (`NODE_ENV === "production"`) for safety.*

---

## ⚙️ Environment Variables

Add the following keys to your `.env.local` configuration:

```bash
# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Server (Gmail App Password)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# App and Cron Settings
CRON_SECRET=your-secret-cron-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💻 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```

3. **Open local application**:
   Visit [http://localhost:3000](http://localhost:3000) to view your dashboard.
