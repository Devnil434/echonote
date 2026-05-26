# EchoNote 🎙️

> AI-powered meeting intelligence — with a stunning dark/light UI.  
> Upload meetings → get transcripts, summaries, action items, and autonomous reminders.

🔗 **Live Demo**: [echonote-three.vercel.app](https://echonote-three.vercel.app)  
💻 **GitHub**: [github.com/Devnil434/echonote](https://github.com/Devnil434/echonote)

---

## 🚀 Overview

EchoNote is a production-ready AI SaaS platform that transforms raw meeting recordings into structured, actionable intelligence.

Upload an audio recording or paste a transcript, and EchoNote automatically:

- 🎧 Transcribes meetings using **Groq Whisper** (200× realtime speed)
- 🤖 Generates AI summaries using **Gemini Flash**
- ✅ Extracts action items, owners, and deadlines
- 🔍 Stores searchable meeting history in **Supabase PostgreSQL**
- 📧 Sends autonomous reminder emails via **Gmail SMTP + Nodemailer**
- 🌙 Ships with a premium **dark/light mode** toggle powered by `next-themes`

Built with a modern full-stack AI architecture using **Next.js 16**, **TypeScript**, **Supabase**, and **Vercel**.

---

## ✨ Features

### 🎧 Audio Upload & Processing

- Upload MP3 / WAV / M4A recordings (up to 25 MB)
- Secure cloud storage with Supabase Storage
- Real-time processing pipeline

### 🤖 AI Meeting Intelligence

- Ultra-fast transcription using Groq Whisper
- AI-generated executive summaries
- Key decision and topic extraction
- Automatic action-item detection with deadlines and owner attribution

### 📌 Task & Reminder System

AI extracts per action item:
- Task owner, deadline, priority

Autonomous reminder agent:
- Daily cron scans upcoming deadlines
- Email reminders before anything is missed
- Overdue notifications via custom Gmail SMTP

### 📊 Dashboard Experience

- Searchable meeting history
- Meeting detail pages with transcript viewer
- Status tracking (pending → transcribed → summarized)
- Responsive, accessible SaaS UI

### 🔒 Authentication & Security

- Supabase Auth with email confirmation (PKCE flow)
- Dedicated `/auth/callback` route for secure token exchange
- Row Level Security (RLS) on all tables
- Protected dashboard routes via Next.js middleware

### 🌙 Modernized Dark / Light Theme

- Dynamic dark/light/system mode via `next-themes`
- Premium **midnight-indigo oklch** color palette in dark mode
- Glowing cyber-purple primary accent
- Silky smooth 300ms CSS transitions between themes
- Theme toggle button with animated ☀️↔🌙 swap

---

## 🧠 AI Workflow

```text
Audio Upload / Transcript Paste
           ↓
  Groq Whisper Transcription
           ↓
  Gemini Flash Summarization
           ↓
  Structured JSON Extraction
           ↓
  Action Items + Deadlines stored in Supabase
           ↓
  Dashboard + Autonomous Reminder Agent (daily cron)
```

---

## 🏗️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, next-themes |
| Backend | Next.js API Routes, Server Actions |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth (PKCE email confirmation) |
| Storage | Supabase Storage |
| AI Transcription | Groq Whisper |
| AI Summarization | Gemini Flash |
| Validation | Zod |
| Email | Nodemailer + Gmail SMTP |
| Deployment | Vercel |

---

## 📂 Architecture

```text
Frontend (Next.js 16)
        │
        ▼
Middleware (Auth Guard)
        │
API Routes / Server Actions
        │
 ┌──────────────────────┬───────────────────┐
 ▼                      ▼                   ▼
Supabase           Groq Whisper         Gemini Flash
(DB/Auth/Storage)  (Transcription)      (AI Analysis)
        │
        ▼
 Autonomous Reminder Agent (Vercel Cron)
        │
        ▼
 Gmail SMTP → User Reminder Emails
```

---

## 🔐 Environment Variables

Create `.env.local` at the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI APIs
GROQ_API_KEY=
GEMINI_API_KEY=

# Email (Gmail SMTP)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# App
CRON_SECRET=
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

> **Important**: In your Supabase Dashboard → Authentication → URL Configuration, set:
> - **Site URL**: `https://your-app.vercel.app`
> - **Redirect URLs**: `https://your-app.vercel.app/**` and `http://localhost:3000/**`

---

## 🛠️ Local Development

### 1. Clone & Install

```bash
git clone https://github.com/Devnil434/echonote.git
cd echonote
npm install
```

### 2. Set Up Environment Variables

Copy the example and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Database Setup

1. Create a project in [Supabase](https://supabase.com)
2. Create a **public** storage bucket named `audio`
3. Run the SQL schema in the Supabase SQL Editor
4. Configure your Supabase Auth redirect URLs (see Environment Variables above)

---

## 🚀 Deployment

Deploy to Vercel in one step:

```bash
git push origin main
```

Vercel automatically builds and deploys the latest version. Make sure all environment variables from `.env.local` are added to your Vercel project settings.

---

## 🧩 Future Roadmap

- [ ] Semantic search with pgvector
- [ ] AI chat with past meetings (RAG)
- [ ] Zoom / Google Meet integrations
- [ ] Team workspaces & collaboration
- [ ] Slack integration
- [ ] Real-time transcription
- [ ] Meeting analytics dashboard

---

## 👨‍💻 Author

**Nilanjan Saha** — AI/ML & Full-Stack Developer

- GitHub: [github.com/Devnil434](https://github.com/Devnil434)
- LinkedIn: *(add your LinkedIn URL here)*

---

## ⭐ Why EchoNote?

Meetings generate valuable context, but most teams lose it immediately after the call ends.

EchoNote transforms conversations into searchable organizational memory using AI — automatically, without any manual note-taking.

---

## 📄 License

MIT License

---

> Built with Next.js 16, Supabase, Groq Whisper, Gemini Flash, next-themes, and modern AI SaaS architecture.
